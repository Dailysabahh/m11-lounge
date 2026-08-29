import { prisma } from "@/lib/prisma";
import { MenuBrowser } from "@/components/store/MenuBrowser";

export const metadata = { title: "Menu" };

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <p className="text-center text-[11px] uppercase tracking-[0.35em] text-gold">
        Online store
      </p>
      <h1 className="mt-2 text-center font-display text-4xl text-gold-light md:text-5xl">
        The M11 Menu
      </h1>
      <div className="gold-hairline mx-auto mt-6 mb-10 max-w-xs" />
      <MenuBrowser
        products={products}
        categories={categories}
        initialCategory={category}
      />
    </div>
  );
}
