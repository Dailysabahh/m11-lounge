import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira, statusLabel } from "@/lib/format";
import { requireAdmin } from "@/lib/admin-guard";

export default async function AdminHome() {
  await requireAdmin();
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const [todayOrders, paidToday, allPaid, recent, pending, newApps] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: start } } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: start },
        status: { in: ["PAID", "PREPARING", "READY", "COMPLETED"] },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "PREPARING", "READY", "COMPLETED"] } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.order.count({
      where: { status: { in: ["PAID", "PREPARING", "PENDING_PAYMENT"] } },
    }),
    prisma.application.count({ where: { status: "SUBMITTED" } }),
  ]);

  const stats = [
    { label: "Orders today", value: String(todayOrders) },
    { label: "Revenue today", value: formatNaira(paidToday._sum.total ?? 0) },
    { label: "All-time revenue", value: formatNaira(allPaid._sum.total ?? 0) },
    { label: "Open tickets", value: String(pending) },
    { label: "New applications", value: String(newApps) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-gold-light">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-lux p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{s.label}</p>
            <p className="mt-2 font-display text-2xl text-gold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-gold-light">Recent orders</h2>
          <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-gold">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="py-2">Order</th>
                <th>Guest</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-t border-gold/15">
                  <td className="py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-gold">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td>{o.customer.name}</td>
                  <td>{statusLabel(o.status)}</td>
                  <td>{formatNaira(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
