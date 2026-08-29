import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/format";
import { requireAdmin } from "@/lib/admin-guard";

export default async function CustomersPage() {
  await requireAdmin();
  const customers = await prisma.customer.findMany({
    include: { orders: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-gold-light">Customers</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted">
          <tr>
            <th className="py-2">Name</th>
            <th>Contact</th>
            <th>Orders</th>
            <th>Spent</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const spent = c.orders
              .filter((o) => o.status !== "CANCELLED" && o.status !== "PENDING_PAYMENT")
              .reduce((s, o) => s + o.total, 0);
            return (
              <tr key={c.id} className="border-t border-gold/15">
                <td className="py-3">{c.name}</td>
                <td>
                  {c.phone}
                  <span className="block text-xs text-muted">{c.email}</span>
                </td>
                <td>{c.orders.length}</td>
                <td>{formatNaira(spent)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
