import Link from "next/link";
import { Briefcase, MapPin, Phone, Mail } from "lucide-react";
import type { SiteData } from "@/lib/site";
import { instagramHref, tiktokHref } from "@/lib/preopening";
import { RemindMeForm } from "@/components/store/RemindMeForm";

function IconWrap({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex text-gold">{children}</span>;
}

function InstagramIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.5 3c.4 2.4 1.8 4.2 4.2 4.7v2.6c-1.5 0-2.9-.5-4.1-1.3v6.7c0 3.6-2.9 6.4-6.6 6.4S1.5 19.3 1.5 15.7 4.3 9.3 8 9.3c.4 0 .8 0 1.2.1v2.8c-.4-.1-.8-.2-1.2-.2-2.1 0-3.8 1.7-3.8 3.7s1.7 3.7 3.8 3.7 3.8-1.7 3.8-3.7V3h2.7Z" />
    </svg>
  );
}

function PlateIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CrownIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 18h18l-1.5-10-4.5 4-3-7-3 7-4.5-4L3 18Z" />
      <path d="M5 18h14v2H5z" />
    </svg>
  );
}

export function LandingExperience({ site }: { site: SiteData }) {
  const ig = instagramHref(site.instagram);
  const tt = tiktokHref(site.tiktok);

  return (
    <div className="bg-ink text-cream">
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/menu/products/shisha-banner.jpg"
            alt=""
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.28),transparent_55%)]" />
        </div>

        <header className="relative z-10 flex items-center justify-between px-5 py-6 md:px-10">
          <Link href="/" className="font-display text-sm tracking-[0.35em] text-gold-light">
            M11
          </Link>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.28em] text-gold hover:text-gold-light"
          >
            Visit website
          </Link>
        </header>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
          <img
            src="/brand/logo.png"
            alt="M11 Snooker & Shisha Lounge"
            className="m11-rise h-40 w-40 rounded-full object-cover ring-1 ring-gold/60 shadow-[0_0_80px_rgba(201,162,39,0.35)] md:h-56 md:w-56"
          />
          <p className="m11-rise mt-8 inline-flex items-center gap-3 rounded-full border border-gold/45 bg-ink/60 px-5 py-2 text-[11px] uppercase tracking-[0.45em] text-gold-light">
            <span className="m11-pulse h-1.5 w-1.5 rounded-full bg-gold" />
            Opening soon
          </p>
          <h1 className="gold-text m11-rise mt-6 font-display text-5xl leading-none md:text-8xl">
            M11 LOUNGE
          </h1>
          <p className="mt-4 font-display text-sm tracking-[0.46em] text-gold md:text-lg">
            SNOOKER & SHISHA
          </p>
          <div className="gold-hairline mx-auto mt-8 w-44" />
          <p className="mt-8 max-w-2xl text-base leading-8 text-muted md:text-lg">
            A private-feeling house is being finished in Osogbo. Championship tables. Signature
            smoke. Royal platters. The doors are not open yet — the night is already being built.
          </p>
          <p className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-gold-light">
            <MapPin size={14} />
            {site.address}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#remind" className="btn-gold px-10 py-3.5 text-xs">
              Remind me at opening
            </a>
            <Link href="/" className="btn-ghost px-10 py-3.5 text-xs">
              Visit the website
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">The house</p>
        <h2 className="mt-3 font-display text-3xl text-gold-light md:text-5xl">
          Not another lounge.
          <br />A night you dress for.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted">
          M11 is black-and-gold on purpose. Low light. Slow smoke. Tables that ask for a
          better game. Food meant to be shared. If you have been waiting for a room that
          feels exclusive without trying too hard — this is the one.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 pb-8 sm:grid-cols-3 md:px-8">
        {[
          {
            src: "/menu/products/ocean-fire.jpg",
            title: "Play",
            copy: "Championship snooker. Quiet focus. A table that holds the room.",
          },
          {
            src: "/brand/shisha-menu.png",
            title: "Relax",
            copy: "Premium coals, quality flavors, water change. Smoke that lasts.",
          },
          {
            src: "/menu/products/royal-feast.jpg",
            title: "Enjoy",
            copy: "Royal platters, traditional bowls, and plates built for the table.",
          },
        ].map((item) => (
          <div key={item.title} className="group relative min-h-72 overflow-hidden">
            <img
              src={item.src}
              alt=""
              className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="font-display text-3xl text-gold-light">{item.title}</p>
              <p className="mt-2 max-w-xs text-sm text-muted">{item.copy}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 md:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.4em] text-gold">Explore</p>
        <h2 className="mt-3 text-center font-display text-3xl text-gold-light md:text-4xl">
          Peek behind the doors
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link href="/" className="card-lux p-7 transition hover:border-gold sm:col-span-2">
            <IconWrap>
              <CrownIcon />
            </IconWrap>
            <h3 className="mt-4 font-display text-2xl text-gold-light">Visit the website</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              See the full M11 homepage — featured plates, the lounge story, hours, and online
              ordering.
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">Go to m11lounge.com →</p>
          </Link>
          <Link href="/menu" className="card-lux p-7 transition hover:border-gold">
            <IconWrap>
              <PlateIcon />
            </IconWrap>
            <h3 className="mt-4 font-display text-2xl text-gold-light">Check the menu</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Seafood, meat, traditional bowls, sides, and the shisha list — taste the house
              before opening night.
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">View menu →</p>
          </Link>
          <Link href="/careers" className="card-lux p-7 transition hover:border-gold">
            <Briefcase className="text-gold" size={26} />
            <h3 className="mt-4 font-display text-2xl text-gold-light">Apply for a job</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              We are building the opening team. Bring your CV, take the screening, and join
              the house.
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">See roles →</p>
          </Link>
          <a href={ig} target="_blank" rel="noreferrer" className="card-lux p-7 transition hover:border-gold">
            <IconWrap>
              <InstagramIcon />
            </IconWrap>
            <h3 className="mt-4 font-display text-2xl text-gold-light">Instagram</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              First looks, tables, smoke, and the countdown live on {site.instagram}.
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">Follow →</p>
          </a>
          <a href={tt} target="_blank" rel="noreferrer" className="card-lux p-7 transition hover:border-gold">
            <IconWrap>
              <TikTokIcon />
            </IconWrap>
            <h3 className="mt-4 font-display text-2xl text-gold-light">TikTok</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Clips from the floor and the vibe we are finishing. {site.tiktok}
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">Watch →</p>
          </a>
          <Link href="/contact" className="card-lux p-7 transition hover:border-gold">
            <Phone className="text-gold" size={26} />
            <h3 className="mt-4 font-display text-2xl text-gold-light">Contact</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Reservations, partnerships, press. Call {site.phone} or write {site.email}.
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">Get in touch →</p>
          </Link>
          <Link href="/about" className="card-lux p-7 transition hover:border-gold">
            <IconWrap>
              <CrownIcon />
            </IconWrap>
            <h3 className="mt-4 font-display text-2xl text-gold-light">The lounge</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Play. Relax. Enjoy. Read the story of the house before you walk in.
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">Read more →</p>
          </Link>
        </div>
      </section>

      <section id="remind" className="border-y border-gold/20 bg-charcoal/60 px-5 py-20 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">First night list</p>
          <h2 className="mt-3 font-display text-3xl text-gold-light md:text-5xl">
            Remind me
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Leave your details. When M11 opens, you will be among the first to know — opening
            hours, first-night energy, and a seat at the table.
          </p>
          <div className="mt-10">
            <RemindMeForm />
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-center text-sm text-muted md:flex-row md:px-8 md:text-left">
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <Phone size={14} /> {site.phone}
          </span>
          <span className="inline-flex items-center gap-1">
            <Mail size={14} /> {site.email}
          </span>
        </p>
        <p className="font-display tracking-[0.2em] text-gold-light">Play · Relax · Enjoy</p>
      </footer>
    </div>
  );
}
