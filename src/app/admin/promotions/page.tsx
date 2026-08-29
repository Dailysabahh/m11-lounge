import { prisma } from "@/lib/prisma";
import { deletePromotion, savePromotion } from "../actions";
import { requireAdmin } from "@/lib/admin-guard";
import { canManageContent } from "@/lib/site";
import { redirect } from "next/navigation";

export default async function PromotionsPage() {
  const user = await requireAdmin();
  if (!canManageContent(user.role)) redirect("/admin");
  const promos = await prisma.promotion.findMany({ orderBy: { code: "asc" } });
  return (
    <div>
      <h1 className="font-display text-3xl text-gold-light">Promotions</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {promos.map((p) => (
          <form key={p.id} action={savePromotion} className="card-lux space-y-2 p-4">
            <input type="hidden" name="id" value={p.id} />
            <input name="code" defaultValue={p.code} className="w-full px-2 py-1" />
            <input name="description" defaultValue={p.description} className="w-full px-2 py-1" />
            <select name="type" defaultValue={p.type} className="w-full px-2 py-1">
              <option value="PERCENT">Percent</option>
              <option value="FIXED">Fixed ₦</option>
            </select>
            <input name="value" type="number" defaultValue={p.value} className="w-full px-2 py-1" />
            <label className="flex gap-2 text-xs">
              <input type="checkbox" name="active" defaultChecked={p.active} /> Active
            </label>
            <label className="flex gap-2 text-xs">
              <input type="checkbox" name="featured" defaultChecked={p.featured} /> Show on homepage
            </label>
            <div className="flex gap-3">
              <button className="btn-gold px-3 py-1 text-xs">Save</button>
              <button formAction={deletePromotion.bind(null, p.id)} className="text-xs text-muted">
                Delete
              </button>
            </div>
          </form>
        ))}
        <form action={savePromotion} className="card-lux space-y-2 p-4">
          <p className="text-xs uppercase tracking-widest text-gold">New promo</p>
          <input name="code" placeholder="CODE" required className="w-full px-2 py-1" />
          <input name="description" placeholder="Description" required className="w-full px-2 py-1" />
          <select name="type" className="w-full px-2 py-1">
            <option value="PERCENT">Percent</option>
            <option value="FIXED">Fixed ₦</option>
          </select>
          <input name="value" type="number" required className="w-full px-2 py-1" />
          <label className="flex gap-2 text-xs">
            <input type="checkbox" name="active" defaultChecked /> Active
          </label>
          <label className="flex gap-2 text-xs">
            <input type="checkbox" name="featured" /> Show on homepage
          </label>
          <button className="btn-gold px-3 py-1 text-xs">Add</button>
        </form>
      </div>
    </div>
  );
}
