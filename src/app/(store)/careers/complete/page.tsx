import Link from "next/link";

export const metadata = { title: "Application received" };

export default async function CompletePage({
  searchParams,
}: {
  searchParams: Promise<{
    score?: string;
    max?: string;
    g?: string;
    gm?: string;
    r?: string;
    rm?: string;
    role?: string;
  }>;
}) {
  const p = await searchParams;
  const score = p.score ?? "—";
  const max = p.max ?? "—";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Thank you</p>
      <h1 className="mt-3 font-display text-4xl text-gold-light">Application received</h1>
      <p className="mt-4 text-muted">
        {p.role ? `${p.role} · ` : ""}Your screening is complete. Individual answers are not shown.
      </p>
      <div className="card-lux mt-10 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Your score</p>
        <p className="mt-2 font-display text-5xl text-gold-light">
          {score}
          <span className="text-2xl text-muted"> / {max}</span>
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted">General</p>
            <p className="text-gold">
              {p.g ?? "—"} / {p.gm ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted">Role section</p>
            <p className="text-gold">
              {p.r ?? "—"} / {p.rm ?? "—"}
            </p>
          </div>
        </div>
      </div>
      <Link href="/careers" className="btn-ghost mt-10 inline-block px-8 py-3 text-xs">
        Other roles
      </Link>
    </div>
  );
}
