import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira, parseJson, statusLabel } from "@/lib/format";

const steps = ["PAID", "PREPARING", "READY", "COMPLETED"];

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { OR: [{ orderNumber: id }, { id }] },
    include: { customer: true, items: true },
  });
  if (!order) notFound();

  const idx =
    order.status === "PENDING_PAYMENT"
      ? -1
      : order.status === "CANCELLED"
        ? -1
        : Math.max(0, steps.indexOf(order.status === "PAID" ? "PAID" : order.status));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Order status</p>
      <h1 className="mt-2 font-display text-4xl text-gold-light">{order.orderNumber}</h1>
      <p className="mt-2 text-sm text-muted">
        {order.customer.name} · {statusLabel(order.status)} · {order.fulfillment.replace("_", " ")}
      </p>

      <div className="mt-8 grid grid-cols-4 gap-2">
        {steps.map((s, i) => (
          <div key={s} className="text-center">
            <div
              className={`mx-auto h-1.5 w-full ${i <= idx ? "bg-gold" : "bg-gold/20"}`}
            />
            <p className="mt-2 text-[10px] uppercase tracking-widest text-muted">
              {statusLabel(s)}
            </p>
          </div>
        ))}
      </div>

      {order.status === "PENDING_PAYMENT" && (
        <p className="mt-6 border border-gold/40 px-4 py-3 text-sm text-gold">
          Waiting for payment confirmation. If you paid, refresh in a moment.
        </p>
      )}
      {order.status === "CANCELLED" && (
        <p className="mt-6 text-sm text-red-400">This order was cancelled.</p>
      )}

      <ul className="mt-10 space-y-3">
        {order.items.map((item) => {
          const extras = parseJson<{ name: string; price: number }[]>(item.extrasJson, []);
          return (
            <li key={item.id} className="flex justify-between border-b border-gold/15 py-3 text-sm">
              <span>
                {item.quantity} × {item.name}
                {extras.length > 0 && (
                  <span className="block text-xs text-muted">
                    {extras.map((e) => e.name).join(", ")}
                  </span>
                )}
              </span>
              <span className="text-gold">
                {formatNaira(item.unitPrice * item.quantity)}
              </span>
            </li>
          );
        })}
      </ul>
      {order.discount > 0 && (
        <p className="mt-3 flex justify-between text-sm text-gold">
          <span>Discount {order.promoCode ? `(${order.promoCode})` : ""}</span>
          <span>−{formatNaira(order.discount)}</span>
        </p>
      )}
      <p className="mt-4 flex justify-between font-display text-xl text-gold-light">
        <span>Total</span>
        <span>{formatNaira(order.total)}</span>
      </p>
    </div>
  );
}
