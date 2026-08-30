import Link from "next/link";
import { Instagram, Briefcase, UtensilsCrossed, MapPin } from "lucide-react";
import type { SiteData } from "@/lib/site";
import { instagramHref, tiktokHref } from "@/lib/preopening";

export function PreopeningLanding({ site }: { site: SiteData }) {
  const ig = instagramHref(site.instagram);
  const tt = tiktokHref(site.tiktok);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/menu/products/shisha-banner.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.22),transparent_58%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-8 md:py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo.png"
              alt="M11 Lounge"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-gold/50 md:h-16 md:w-16"
            />
            <p className="font-display text-lg tracking-[0.28em] text-gold-light">M11</p>
          </div>
          <a
            href={ig}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold hover:text-gold-light"
          >
            <Instagram size={16} />
            <span className="hidden sm:inline">{site.instagram}</span>
          </a>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-12 text-center md:py-16">
          <p className="inline-flex items-center gap-3 rounded-full border border-gold/40 bg-charcoal/70 px-5 py-2 text-[11px] uppercase tracking-[0.42em] text-gold-light">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Opening soon
          </p>

          <h1 className="gold-text mt-8 font-display text-5xl leading-none md:text-8xl">
            M11 LOUNGE
          </h1>
          <p className="mt-4 font-display text-sm tracking-[0.42em] text-gold md:text-base">
            SNOOKER & SHISHA
          </p>
          <div className="gold-hairline mx-auto mt-8 w-40" />
          <p className="mt-8 max-w-xl text-base leading-8 text-muted md:text-lg">
            Lagos nightlife, done with intention. Championship tables, signature smoke,
            royal platters — a black-and-gold house for the night you remember.
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-gold-light">
            <MapPin size={14} />
            {site.address}
          </p>

          <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            <Link href="/menu" className="card-lux group px-6 py-7 transition hover:border-gold">
              <UtensilsCrossed className="mx-auto text-gold" size={26} />
              <p className="mt-4 font-display text-lg text-gold-light">Check our menu</p>
              <p className="mt-2 text-xs text-muted">Platters, bowls & shisha</p>
            </Link>
            <Link href="/careers" className="card-lux group px-6 py-7 transition hover:border-gold">
              <Briefcase className="mx-auto text-gold" size={26} />
              <p className="mt-4 font-display text-lg text-gold-light">Apply for a job</p>
              <p className="mt-2 text-xs text-muted">Join the opening team</p>
            </Link>
            <a
              href={ig}
              target="_blank"
              rel="noreferrer"
              className="card-lux group px-6 py-7 transition hover:border-gold"
            >
              <Instagram className="mx-auto text-gold" size={26} />
              <p className="mt-4 font-display text-lg text-gold-light">Instagram</p>
              <p className="mt-2 text-xs text-muted">{site.instagram}</p>
            </a>
          </div>
        </main>

        <section className="grid gap-3 pb-6 sm:grid-cols-3">
          {[
            { src: "/menu/products/ocean-fire.jpg", label: "Play" },
            { src: "/brand/shisha-menu.png", label: "Relax" },
            { src: "/menu/products/royal-feast.jpg", label: "Enjoy" },
          ].map((item) => (
            <div key={item.label} className="relative min-h-44 overflow-hidden">
              <img src={item.src} alt="" className="h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <p className="absolute bottom-4 left-4 font-display text-xl tracking-[0.2em] text-gold-light">
                {item.label}
              </p>
            </div>
          ))}
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-gold/20 py-8 text-center text-sm text-muted sm:flex-row sm:text-left">
          <p>
            {site.phone} · {site.email}
          </p>
          <div className="flex gap-6">
            <a href={ig} target="_blank" rel="noreferrer" className="text-gold hover:text-gold-light">
              Instagram
            </a>
            <a href={tt} target="_blank" rel="noreferrer" className="text-gold hover:text-gold-light">
              TikTok {site.tiktok}
            </a>
            <Link href="/contact" className="text-gold hover:text-gold-light">
              Contact
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
