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
        Careers at M11
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
        Apply with your name and CV, then complete a screening questionnaire. You will see
        your overall score after submitting — individual answers are not revealed.
      </p>
      <div className="gold-hairline mx-auto mt-8 mb-10 max-w-xs" />
      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((r) => (
          <Link
            key={r.id}
            href={`/careers/${r.slug}`}
            className="card-lux p-6 transition hover:border-gold"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
              Section {r.sectionKey}
            </p>
            <h2 className="mt-2 font-display text-2xl text-gold-light">{r.name}</h2>
            {r.focus && <p className="mt-3 text-sm text-muted">{r.focus}</p>}
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">Apply →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
