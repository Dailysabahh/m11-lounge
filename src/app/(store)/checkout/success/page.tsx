import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyPaystack } from "@/lib/paystack";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  if (!reference) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted">Missing payment reference.</p>
      </div>
    );
  }

  const order = await prisma.order.findFirst({
    where: { OR: [{ orderNumber: reference }, { paystackRef: reference }] },
  });

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted">We could not find that order.</p>
      </div>
    );
  }

  if (order.status === "PENDING_PAYMENT" && process.env.PAYSTACK_SECRET_KEY) {
    try {
      const data = await verifyPaystack(reference);
      if (data.status === "success") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID", paidAt: new Date(), paystackRef: reference },
        });
      }
    } catch {
      /* webhook may still complete it */
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-4xl text-gold-light">Payment received</h1>
      <p className="mt-4 text-muted">
        Thank you. Track order <span className="text-gold">{order.orderNumber}</span>.
      </p>
      <Link href={`/orders/${order.orderNumber}`} className="btn-gold mt-8 inline-block px-8 py-3 text-xs">
        Track order
      </Link>
    </div>
  );
}
