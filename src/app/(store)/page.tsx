import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site";
import { formatNaira } from "@/lib/format";
import { ProductCard } from "@/components/store/ProductCard";
import { isPreopening } from "@/lib/preopening";

export default async function HomePage() {
  if (isPreopening()) {
    redirect("/landing");
  }
  const site = await getSiteSettings();
  const [featured, promotions, testimonials, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, available: true },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.promotion.findMany({
      where: { featured: true, active: true },
      take: 3,
    }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.16),transparent_58%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <img
            src="/brand/logo.png"
            alt="M11 Snooker & Shisha Lounge"
            className="mb-8 h-44 w-44 rounded-full object-cover ring-1 ring-gold/50 md:h-56 md:w-56"
          />
          <p className="text-[11px] uppercase tracking-[0.45em] text-gold">
            {site.tagline}
          </p>
          <h1 className="gold-text mt-4 font-display text-5xl md:text-7xl">
            {site.heroTitle}
          </h1>
          <p className="mt-2 font-display text-sm tracking-[0.35em] text-gold-light md:text-base">
            SNOOKER & SHISHA LOUNGE
          </p>
          <p className="mt-6 max-w-xl text-base text-muted md:text-lg">
            {site.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/menu" className="btn-gold px-10 py-3 text-xs">
              View menu
            </Link>
            <Link href="/contact" className="btn-ghost px-10 py-3 text-xs">
              Reserve a table
            </Link>
          </div>
        </div>
      </section>

      {promotions.length > 0 && (
        <section className="border-y border-gold/20 bg-charcoal py-8">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-2">
            {promotions.map((p) => (
              <div key={p.id} className="gold-border px-6 py-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  Promotion · {p.code}
                </p>
                <p className="mt-2 font-display text-xl text-cream">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <p className="text-center text-[11px] uppercase tracking-[0.35em] text-gold">
          Featured
        </p>
        <h2 className="mt-2 text-center font-display text-3xl text-gold-light md:text-4xl">
          Signature plates & smoke
        </h2>
        <div className="gold-hairline mx-auto mt-6 max-w-xs" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/menu" className="btn-ghost inline-block px-8 py-3 text-xs">
            Full menu
          </Link>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">The lounge</p>
            <h2 className="mt-3 font-display text-3xl text-gold-light">
              Play. Relax. Enjoy.
            </h2>
            <p className="mt-4 leading-7 text-muted">{site.aboutText}</p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="gold-border p-4">
                <p className="font-display text-gold">Snooker</p>
                <p className="mt-1 text-muted">Championship tables, low lights, high stakes nights.</p>
              </div>
              <div className="gold-border p-4">
                <p className="font-display text-gold">Shisha</p>
                <p className="mt-1 text-muted">Premium coals, quality flavors, water change.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                href={`/menu?category=${c.slug}`}
                className="group relative min-h-40 overflow-hidden"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span className="absolute bottom-3 left-3 font-display text-gold-light">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-center font-display text-3xl text-gold-light">Guests of the house</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="card-lux p-6">
              <p className="text-sm leading-7 text-cream">“{t.quote}”</p>
              <footer className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">
                {t.name} · {"★".repeat(t.rating)}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-t border-gold/20 py-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Tonight</p>
        <p className="mt-3 font-display text-2xl text-cream md:text-3xl">
          From {formatNaira(15000)} shisha pots to royal platters
        </p>
        <Link href="/menu" className="btn-gold mt-8 inline-block px-10 py-3 text-xs">
          Order online
        </Link>
      </section>
    </div>
  );
}
