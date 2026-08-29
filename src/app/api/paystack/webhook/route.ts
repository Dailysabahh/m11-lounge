import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const raw = await req.text();
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (secret) {
    const signature = req.headers.get("x-paystack-signature") || "";
    const hash = createHmac("sha512", secret).update(raw).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const event = JSON.parse(raw) as {
    event?: string;
    data?: { status?: string; reference?: string };
  };

  if (event.event === "charge.success" && event.data?.reference) {
    const reference = event.data.reference;
    const order = await prisma.order.findFirst({
      where: { OR: [{ orderNumber: reference }, { paystackRef: reference }] },
    });
    if (order && order.status === "PENDING_PAYMENT") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", paidAt: new Date(), paystackRef: reference },
      });
    }
  }

  return NextResponse.json({ received: true });
}
