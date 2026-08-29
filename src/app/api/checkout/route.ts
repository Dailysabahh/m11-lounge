import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/format";
import { initializePaystack, paystackEnabled } from "@/lib/paystack";

const extraSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  fulfillment: z.enum(["DINE_IN", "PICKUP"]).default("DINE_IN"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["PAYSTACK", "PAY_AT_LOUNGE"]),
  promoCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
        extras: z.array(extraSchema).default([]),
      }),
    )
    .min(1),
});

function discountFor(
  promo: { type: string; value: number; active: boolean; startsAt: Date | null; endsAt: Date | null } | null,
  subtotal: number,
) {
  if (!promo || !promo.active) return 0;
  const now = new Date();
  if (promo.startsAt && now < promo.startsAt) return 0;
  if (promo.endsAt && now > promo.endsAt) return 0;
  if (promo.type === "PERCENT") return Math.round((subtotal * promo.value) / 100);
  if (promo.type === "FIXED") {
    if (promo.value === 5000 && subtotal < 40000) return 0;
    return Math.min(promo.value, subtotal);
  }
  return 0;
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details." }, { status: 400 });
  }
  const data = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: data.items.map((i) => i.productId) } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const extrasDb = await prisma.extra.findMany();
  const extraMap = new Map(extrasDb.map((e) => [e.id, e]));

  let subtotal = 0;
  const orderItems: {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    extrasJson: string;
  }[] = [];
  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product || !product.available) {
      return NextResponse.json({ error: "An item is unavailable." }, { status: 400 });
    }
    const extras = item.extras
      .map((e) => extraMap.get(e.id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e && e.available))
      .map((e) => ({ id: e.id, name: e.name, price: e.price }));
    const extraTotal = extras.reduce((s, e) => s + e.price, 0);
    const unitPrice = product.price + extraTotal;
    subtotal += unitPrice * item.quantity;
    orderItems.push({
      productId: product.id,
      name: product.name,
      unitPrice,
      quantity: item.quantity,
      extrasJson: JSON.stringify(extras),
    });
  }

  let promo = null;
  if (data.promoCode) {
    promo = await prisma.promotion.findUnique({
      where: { code: data.promoCode.toUpperCase() },
    });
  }
  const discount = discountFor(promo, subtotal);
  const total = Math.max(0, subtotal - discount);

  const email = data.email.toLowerCase();
  const existing = await prisma.customer.findFirst({
    where: { OR: [{ email }, { phone: data.phone }] },
  });
  const customer = existing
    ? await prisma.customer.update({
        where: { id: existing.id },
        data: { name: data.name, email, phone: data.phone },
      })
    : await prisma.customer.create({
        data: { name: data.name, email, phone: data.phone },
      });

  const orderNumber = generateOrderNumber();
  const usePaystack = data.paymentMethod === "PAYSTACK" && paystackEnabled();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: customer.id,
      status: usePaystack ? "PENDING_PAYMENT" : "PREPARING",
      paymentMethod: usePaystack ? "PAYSTACK" : "PAY_AT_LOUNGE",
      paystackRef: usePaystack ? orderNumber : null,
      subtotal,
      discount,
      total,
      promoCode: promo?.code,
      notes: data.notes,
      fulfillment: data.fulfillment,
      items: { create: orderItems },
    },
  });

  if (usePaystack) {
    const origin = new URL(req.url).origin;
    try {
      const init = await initializePaystack({
        email: data.email,
        amountNgn: total,
        reference: orderNumber,
        callbackUrl: `${origin}/checkout/success?reference=${orderNumber}`,
      });
      return NextResponse.json({
        orderNumber: order.orderNumber,
        authorizationUrl: init.authorization_url,
      });
    } catch (err) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PREPARING", paymentMethod: "PAY_AT_LOUNGE" },
      });
      return NextResponse.json({
        orderNumber: order.orderNumber,
        warning:
          err instanceof Error
            ? err.message
            : "Paystack unavailable — order placed as pay at lounge.",
      });
    }
  }

  return NextResponse.json({ orderNumber: order.orderNumber });
}
