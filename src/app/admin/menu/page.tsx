import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/format";
import { deleteProduct, saveCategory, saveExtra } from "../actions";
import { ImageField } from "@/components/admin/ImageField";
import { requireAdmin } from "@/lib/admin-guard";
import { canManageContent } from "@/lib/site";
import { redirect } from "next/navigation";

export default async function AdminMenuPage() {
  const user = await requireAdmin();
  if (!canManageContent(user.role)) redirect("/admin");
  const [products, categories, extras] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.extra.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-gold-light">Menu</h1>
        <Link href="/admin/menu/new" className="btn-gold px-4 py-2 text-xs">
          Add item
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="py-2">Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gold/15">
                <td className="py-3">{p.name}</td>
                <td className="text-muted">{p.category.name}</td>
                <td>{formatNaira(p.price)}</td>
                <td>{p.available ? "On" : "Off"}{p.featured ? " · Featured" : ""}</td>
                <td className="space-x-3">
                  <Link href={`/admin/menu/${p.id}`} className="text-gold">
                    Edit
                  </Link>
                  <form action={deleteProduct.bind(null, p.id)} className="inline">
                    <button className="text-muted hover:text-red-400">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section>
        <h2 className="font-display text-xl text-gold-light">Categories</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {categories.map((c) => (
            <form key={c.id} action={saveCategory} className="card-lux space-y-2 p-4">
              <input type="hidden" name="id" value={c.id} />
              <input name="name" defaultValue={c.name} className="w-full px-2 py-1 text-sm" />
              <input name="slug" defaultValue={c.slug} className="w-full px-2 py-1 text-sm" />
              <textarea
                name="description"
                defaultValue={c.description ?? ""}
                className="w-full px-2 py-1 text-sm"
              />
              <input type="hidden" name="image" value={c.image ?? ""} />
              <input
                name="sortOrder"
                type="number"
                defaultValue={c.sortOrder}
                className="w-full px-2 py-1 text-sm"
              />
              <button className="btn-ghost px-3 py-1 text-xs">Save</button>
            </form>
          ))}
          <form action={saveCategory} className="card-lux space-y-2 p-4">
            <p className="text-xs uppercase tracking-widest text-gold">New category</p>
            <input name="name" placeholder="Name" required className="w-full px-2 py-1 text-sm" />
            <input name="slug" placeholder="slug" required className="w-full px-2 py-1 text-sm" />
            <textarea name="description" placeholder="Description" className="w-full px-2 py-1 text-sm" />
            <input name="image" placeholder="/menu/products/..." className="w-full px-2 py-1 text-sm" />
            <input name="sortOrder" type="number" defaultValue={10} className="w-full px-2 py-1 text-sm" />
            <button className="btn-gold px-3 py-1 text-xs">Add</button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-light">Extras</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map((e) => (
            <form key={e.id} action={saveExtra} className="gold-border space-y-2 p-3">
              <input type="hidden" name="id" value={e.id} />
              <input name="name" defaultValue={e.name} className="w-full px-2 py-1 text-sm" />
              <input name="price" type="number" defaultValue={e.price} className="w-full px-2 py-1 text-sm" />
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" name="available" defaultChecked={e.available} />
                Available
              </label>
              <button className="btn-ghost px-3 py-1 text-xs">Save</button>
            </form>
          ))}
          <form action={saveExtra} className="gold-border space-y-2 p-3">
            <p className="text-xs text-gold">New extra</p>
            <input name="name" placeholder="Name" required className="w-full px-2 py-1 text-sm" />
            <input name="price" type="number" required className="w-full px-2 py-1 text-sm" />
            <ImageField name="image" />
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="available" defaultChecked />
              Available
            </label>
            <button className="btn-gold px-3 py-1 text-xs">Add</button>
          </form>
        </div>
      </section>
    </div>
  );
}
