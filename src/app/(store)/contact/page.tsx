import { getSiteSettings } from "@/lib/site";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const site = await getSiteSettings();
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="text-center font-display text-4xl text-gold-light">Reservations & contact</h1>
      <div className="gold-hairline mx-auto mt-6 mb-12 max-w-xs" />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-sm">
          <p>
            <span className="text-gold">Phone</span>
            <br />
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-xl text-cream">
              {site.phone}
            </a>
          </p>
          <p>
            <span className="text-gold">Email</span>
            <br />
            {site.email}
          </p>
          <p>
            <span className="text-gold">Address</span>
            <br />
            {site.address}
          </p>
          <p>
            <span className="text-gold">Social</span>
            <br />
            {site.instagram} · {site.tiktok}
          </p>
          <div>
            <span className="text-gold">Hours</span>
            {site.hours.map((h) => (
              <p key={h.day} className="text-cream">
                {h.day}: {h.hours}
              </p>
            ))}
          </div>
        </div>
        <form
          className="card-lux space-y-4 p-6"
          action={`mailto:${site.email}`}
          method="GET"
        >
          <p className="font-display text-xl text-gold-light">Send a note</p>
          <input name="subject" placeholder="Subject" className="w-full px-3 py-2 text-sm" />
          <textarea
            name="body"
            rows={5}
            placeholder="Table size, date, time…"
            className="w-full px-3 py-2 text-sm"
          />
          <button className="btn-gold w-full py-3 text-xs">Open email</button>
          <p className="text-xs text-muted">
            For fastest service call {site.phone}. Online orders go through the menu.
          </p>
        </form>
      </div>
    </div>
  );
}
