import Link from "next/link";
import type { SiteData } from "@/lib/site";

export function Footer({ site }: { site: SiteData }) {
  return (
    <footer className="mt-auto border-t border-gold/25 bg-ink">
      <div className="gold-hairline" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <img src="/brand/logo.png" alt="" className="mb-4 h-20 w-20 rounded-full object-cover ring-1 ring-gold/40" />
          <p className="font-display text-xl tracking-[0.18em] text-gold-light">M11</p>
          <p className="mt-2 text-sm text-muted">{site.tagline}</p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">Visit</p>
          <p className="text-sm text-cream">{site.address}</p>
          <p className="mt-2 text-sm text-cream">{site.phone}</p>
          <p className="text-sm text-muted">{site.email}</p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">Hours</p>
          {site.hours.map((h) => (
            <p key={h.day} className="text-sm text-cream">
              <span className="text-muted">{h.day}: </span>
              {h.hours}
            </p>
          ))}
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">Explore</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/landing" className="text-cream hover:text-gold">
              Opening soon
            </Link>
            <Link href="/careers" className="text-cream hover:text-gold">
              Apply for a job
            </Link>
            <Link href="/about" className="text-cream hover:text-gold">
              The lounge
            </Link>
            <Link href="/contact" className="text-cream hover:text-gold">
              Contact
            </Link>
            <a
              href={`https://www.instagram.com/${site.instagram.replace(/^@/, "")}/`}
              target="_blank"
              rel="noreferrer"
              className="text-cream hover:text-gold"
            >
              {site.instagram}
            </a>
          </div>
        </div>
      </div>
      <p className="border-t border-gold/15 py-4 text-center text-[11px] uppercase tracking-[0.25em] text-muted">
        © {new Date().getFullYear()} M11 Lounge · Good music · Good vibes · Great memories
      </p>
    </footer>
  );
}
