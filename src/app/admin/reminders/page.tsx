import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export default async function RemindersPage() {
  await requireAdmin();
  const reminders = await prisma.openingReminder.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-gold-light">Opening reminders</h1>
      <p className="mt-2 text-sm text-muted">{reminders.length} people asked to be notified.</p>
      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted">
          <tr>
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((r) => (
            <tr key={r.id} className="border-t border-gold/15">
              <td className="py-3">{r.name || "—"}</td>
              <td>{r.email}</td>
              <td>{r.phone || "—"}</td>
              <td className="text-muted">{r.createdAt.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
