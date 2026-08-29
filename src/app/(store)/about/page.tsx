import { getSiteSettings } from "@/lib/site";

export const metadata = { title: "The Lounge" };

export default async function AboutPage() {
  const site = await getSiteSettings();
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <p className="text-center text-[11px] uppercase tracking-[0.35em] text-gold">
        {site.tagline}
      </p>
      <h1 className="mt-3 text-center font-display text-4xl text-gold-light md:text-5xl">
        The Lounge
      </h1>
      <div className="gold-hairline mx-auto mt-6 mb-10 max-w-xs" />
      <div className="grid gap-8 md:grid-cols-2">
        <img
          src="/brand/logo.png"
          alt="M11 logo"
          className="mx-auto h-64 w-64 rounded-full object-cover ring-1 ring-gold/40"
        />
        <div>
          <p className="leading-8 text-muted">{site.aboutText}</p>
          <p className="mt-6 leading-8 text-muted">
            Tables for snooker. Pipes for the night. A kitchen that plates seafood, meat, and
            traditional bowls the way a lounge should — generous, beautiful, and meant to be
            shared. Follow {site.instagram} and tag your table.
          </p>
        </div>
      </div>
      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {["Premium coals", "Quality flavors", "Best equipment"].map((t) => (
          <div key={t} className="gold-border p-6 text-center font-display text-gold-light">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
