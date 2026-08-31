import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string }>;
}) {
  await requireAdmin();
  const { role, status } = await searchParams;
  const applications = await prisma.application.findMany({
    where: {
      ...(role ? { jobRole: { slug: role } } : {}),
      ...(status ? { status: status as never } : {}),
    },
    include: { jobRole: true },
    orderBy: { createdAt: "desc" },
  });
  const roles = await prisma.jobRole.findMany({
    where: { isGeneral: false },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-gold-light">Applications</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/admin/applications" className="border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
          All
        </Link>
        {roles.map((r) => (
          <Link
            key={r.id}
            href={`/admin/applications?role=${r.slug}`}
            className="border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-widest text-gold"
          >
            {r.name}
          </Link>
        ))}
      </div>
      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted">
          <tr>
            <th className="py-2">Applicant</th>
            <th>Role</th>
            <th>Score</th>
            <th>Status</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id} className="border-t border-gold/15">
              <td className="py-3">
                <Link href={`/admin/applications/${a.id}`} className="text-gold">
                  {a.name}
                </Link>
                <span className="block text-xs text-muted">{a.email}</span>
              </td>
              <td>{a.jobRole.name}</td>
              <td>
                {a.status === "DRAFT" ? "—" : `${a.totalScore} / ${a.totalMax}`}
              </td>
              <td>{a.status}</td>
              <td>{(a.submittedAt ?? a.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length === 0 && (
        <p className="mt-6 text-sm text-muted">No applications yet.</p>
      )}
    </div>
  );
}
