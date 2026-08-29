import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira, parseJson } from "@/lib/format";
import { AddToCartForm } from "@/components/store/AddToCartForm";
import { ProductCard } from "@/components/store/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name ?? "Item" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) notFound();

  const extras = product.allowsExtras
    ? await prisma.extra.findMany({
        where: { available: true },
        orderBy: { sortOrder: "asc" },
      })
    : [];

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    take: 3,
  });

  const ingredients = parseJson<string[]>(product.ingredients, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="card-lux overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full object-cover" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
            {product.category.name}
          </p>
          <h1 className="mt-2 font-display text-4xl text-gold-light">{product.name}</h1>
          <p className="mt-4 text-2xl text-gold">{formatNaira(product.price)}</p>
          <p className="mt-6 leading-7 text-muted">{product.description}</p>
          {ingredients.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-cream">
              {ingredients.map((i) => (
                <li key={i} className="border-l border-gold/40 pl-3">
                  {i}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8">
            <AddToCartForm product={product} extras={extras} />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-gold-light">Also on the table</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
