import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira, parseJson, statusLabel } from "@/lib/format";
import { updateOrderStatus } from "../../actions";
import type { OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-guard";

const nextStatuses: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-gold-light">{order.orderNumber}</h1>
      <p className="mt-2 text-sm text-muted">
        {order.customer.name} · {order.customer.phone} · {order.customer.email} ·{" "}
        {order.fulfillment} · {order.paymentMethod.replace("_", " ")}
      </p>
      {order.notes && <p className="mt-2 text-sm">Notes: {order.notes}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {nextStatuses.map((s) => (
          <form key={s} action={updateOrderStatus.bind(null, order.id, s)}>
            <button
              className={`px-3 py-1 text-[10px] uppercase tracking-widest ${
                order.status === s ? "bg-gold text-ink" : "border border-gold/40 text-gold"
              }`}
            >
              {statusLabel(s)}
            </button>
          </form>
        ))}
      </div>

      <ul className="mt-8 space-y-3">
        {order.items.map((item) => {
          const extras = parseJson<{ name: string }[]>(item.extrasJson, []);
          return (
            <li key={item.id} className="flex justify-between border-b border-gold/15 py-2 text-sm">
              <span>
                {item.quantity} × {item.name}
                {extras.length > 0 && (
                  <span className="block text-xs text-muted">
                    {extras.map((e) => e.name).join(", ")}
                  </span>
                )}
              </span>
              <span>{formatNaira(item.unitPrice * item.quantity)}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-display text-xl text-gold">Total {formatNaira(order.total)}</p>
    </div>
  );
}
