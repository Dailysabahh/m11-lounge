import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira, statusLabel } from "@/lib/format";
import { requireAdmin } from "@/lib/admin-guard";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });
  const filters = [
    "ALL",
    "PENDING_PAYMENT",
    "PAID",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-gold-light">Orders</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "ALL" ? "/admin/orders" : `/admin/orders?status=${f}`}
            className="border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-widest text-gold"
          >
            {f === "ALL" ? "All" : statusLabel(f)}
          </Link>
        ))}
      </div>
      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted">
          <tr>
            <th className="py-2">Order</th>
            <th>Guest</th>
            <th>When</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-gold/15">
              <td className="py-3">
                <Link href={`/admin/orders/${o.id}`} className="text-gold">
                  {o.orderNumber}
                </Link>
              </td>
              <td>
                {o.customer.name}
                <span className="block text-xs text-muted">{o.customer.phone}</span>
              </td>
              <td>{o.createdAt.toLocaleString()}</td>
              <td>{statusLabel(o.status)}</td>
              <td>{formatNaira(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
