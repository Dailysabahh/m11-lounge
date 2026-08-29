import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/format";
import { deleteTestimonial, saveSettings, saveTestimonial } from "../actions";
import type { OpeningHour } from "@/lib/site";
import { requireAdmin } from "@/lib/admin-guard";
import { canManageContent } from "@/lib/site";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await requireAdmin();
  if (!canManageContent(user.role)) redirect("/admin");
  const site = await prisma.siteSetting.findUnique({ where: { id: "site" } });
  const hours = parseJson<OpeningHour[]>(site?.hoursJson ?? "[]", []);
  const weekday = hours[0]?.hours ?? "4:00 PM – 2:00 AM";
  const weekend = hours[1]?.hours ?? "2:00 PM – 3:00 AM";
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <form action={saveSettings} className="space-y-3">
        <h1 className="font-display text-3xl text-gold-light">Website</h1>
        <input name="restaurantName" defaultValue={site?.restaurantName} className="w-full px-3 py-2" />
        <input name="tagline" defaultValue={site?.tagline} className="w-full px-3 py-2" />
        <input name="phone" defaultValue={site?.phone} className="w-full px-3 py-2" />
        <input name="email" defaultValue={site?.email} className="w-full px-3 py-2" />
        <input name="address" defaultValue={site?.address} className="w-full px-3 py-2" />
        <input name="instagram" defaultValue={site?.instagram} className="w-full px-3 py-2" />
        <input name="tiktok" defaultValue={site?.tiktok} className="w-full px-3 py-2" />
        <input name="hoursWeekday" defaultValue={weekday} className="w-full px-3 py-2" />
        <input name="hoursWeekend" defaultValue={weekend} className="w-full px-3 py-2" />
        <input name="heroTitle" defaultValue={site?.heroTitle} className="w-full px-3 py-2" />
        <textarea name="heroSubtitle" defaultValue={site?.heroSubtitle} rows={3} className="w-full px-3 py-2" />
        <textarea name="aboutText" defaultValue={site?.aboutText} rows={5} className="w-full px-3 py-2" />
        <input name="bannerText" defaultValue={site?.bannerText ?? ""} className="w-full px-3 py-2" />
        <button className="btn-gold px-6 py-3 text-xs">Save website</button>
      </form>

      <div>
        <h2 className="font-display text-2xl text-gold-light">Testimonials</h2>
        <div className="mt-4 space-y-4">
          {testimonials.map((t) => (
            <form key={t.id} action={saveTestimonial} className="card-lux space-y-2 p-4">
              <input type="hidden" name="id" value={t.id} />
              <input name="name" defaultValue={t.name} className="w-full px-2 py-1 text-sm" />
              <textarea name="quote" defaultValue={t.quote} className="w-full px-2 py-1 text-sm" />
              <input name="rating" type="number" min={1} max={5} defaultValue={t.rating} className="w-full px-2 py-1 text-sm" />
              <label className="flex gap-2 text-xs">
                <input type="checkbox" name="published" defaultChecked={t.published} /> Published
              </label>
              <div className="flex gap-3">
                <button className="btn-ghost px-3 py-1 text-xs">Save</button>
                <button formAction={deleteTestimonial.bind(null, t.id)} className="text-xs text-muted">
                  Delete
                </button>
              </div>
            </form>
          ))}
          <form action={saveTestimonial} className="card-lux space-y-2 p-4">
            <p className="text-xs uppercase tracking-widest text-gold">New quote</p>
            <input name="name" placeholder="Name" required className="w-full px-2 py-1 text-sm" />
            <textarea name="quote" placeholder="Quote" required className="w-full px-2 py-1 text-sm" />
            <input name="rating" type="number" min={1} max={5} defaultValue={5} className="w-full px-2 py-1 text-sm" />
            <label className="flex gap-2 text-xs">
              <input type="checkbox" name="published" defaultChecked /> Published
            </label>
            <button className="btn-gold px-3 py-1 text-xs">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}
