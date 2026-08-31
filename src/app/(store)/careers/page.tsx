import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Careers" };

export default async function CareersPage() {
  const roles = await prisma.jobRole.findMany({
    where: { isGeneral: false, isOpen: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <p className="text-center text-[11px] uppercase tracking-[0.35em] text-gold">
        Join the house
      </p>
      <h1 className="mt-3 text-center font-display text-4xl text-gold-light md:text-5xl">
        Work at M11
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center leading-7 text-muted">
        Choose a role, send your CV, and complete a short screening. Applications go
        straight to the M11 team. You will see your overall score after submitting.
      </p>
      <ol className="mx-auto mt-8 grid max-w-2xl gap-3 text-left text-sm text-muted sm:grid-cols-3">
        <li className="gold-border p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">1</p>
          <p className="mt-1 text-cream">Pick a role</p>
        </li>
        <li className="gold-border p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">2</p>
          <p className="mt-1 text-cream">Name, phone & CV</p>
        </li>
        <li className="gold-border p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">3</p>
          <p className="mt-1 text-cream">Answer & submit</p>
        </li>
      </ol>
      <div className="gold-hairline mx-auto mt-10 mb-10 max-w-xs" />
      {roles.length === 0 ? (
        <p className="text-center text-muted">
          Roles will appear here when hiring is open. Check back soon, or write{" "}
          <a href="mailto:hello@m11lounge.com" className="text-gold">
            hello@m11lounge.com
          </a>
          .
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((r) => (
            <Link
              key={r.id}
              href={`/careers/${r.slug}`}
              className="card-lux p-6 transition hover:border-gold"
            >
              <h2 className="font-display text-2xl text-gold-light">{r.name}</h2>
              {r.focus && <p className="mt-3 text-sm text-muted">{r.focus}</p>}
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">Apply now →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
