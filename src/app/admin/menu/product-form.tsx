import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/format";
import { saveProduct } from "../actions";
import { ImageField } from "@/components/admin/ImageField";
import { notFound } from "next/navigation";

export async function ProductForm({ id }: { id?: string }) {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const product = id ? await prisma.product.findUnique({ where: { id } }) : null;
  if (id && !product) notFound();
  const ingredients = product
    ? parseJson<string[]>(product.ingredients, []).join("\n")
    : "";

  return (
    <form action={saveProduct} className="mx-auto max-w-2xl space-y-4">
      {product && <input type="hidden" name="id" value={product.id} />}
      <h1 className="font-display text-3xl text-gold-light">
        {product ? `Edit ${product.name}` : "New menu item"}
      </h1>
      <input name="name" required defaultValue={product?.name} placeholder="Name" className="w-full px-3 py-2" />
      <input name="slug" required defaultValue={product?.slug} placeholder="slug" className="w-full px-3 py-2" />
      <select name="categoryId" defaultValue={product?.categoryId} className="w-full px-3 py-2">
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <textarea
        name="description"
        required
        defaultValue={product?.description}
        rows={4}
        className="w-full px-3 py-2"
      />
      <label className="block text-xs uppercase tracking-widest text-gold">
        Ingredients (one per line)
        <textarea
          name="ingredients"
          defaultValue={ingredients}
          rows={6}
          className="mt-2 w-full px-3 py-2"
        />
      </label>
      <input
        name="price"
        type="number"
        required
        defaultValue={product?.price ?? 0}
        className="w-full px-3 py-2"
      />
      <ImageField name="image" defaultValue={product?.image} />
      <input
        name="sortOrder"
        type="number"
        defaultValue={product?.sortOrder ?? 0}
        className="w-full px-3 py-2"
      />
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="available" defaultChecked={product?.available ?? true} />
        Available
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
        Featured on homepage
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="allowsExtras" defaultChecked={product?.allowsExtras ?? true} />
        Allow extras / sides
      </label>
      <button className="btn-gold px-8 py-3 text-xs">Save item</button>
    </form>
  );
}
