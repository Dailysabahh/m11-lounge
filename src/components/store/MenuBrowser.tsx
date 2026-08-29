"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  available: boolean;
  category: { slug: string; name: string };
};

export function MenuBrowser({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: { slug: string; name: string }[];
  initialCategory?: string;
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);

  const ceiling = useMemo(
    () => Math.max(...products.map((p) => p.price), 0),
    [products],
  );

  const filtered = products.filter((p) => {
    if (category !== "all" && p.category.slug !== category) return false;
    if (onlyAvailable && !p.available) return false;
    if (maxPrice > 0 && p.price > maxPrice) return false;
    if (q) {
      const hay = `${p.name} ${p.description} ${p.category.name}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 border border-gold/25 bg-ink-soft p-4 md:flex-row md:items-end">
        <label className="flex-1 text-xs uppercase tracking-[0.2em] text-gold">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ocean fire, egusi, classic pot…"
            className="mt-2 w-full px-3 py-2 text-sm tracking-normal"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-gold">
          Max price
          <select
            className="mt-2 block px-3 py-2 text-sm"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          >
            <option value={0}>Any</option>
            <option value={10000}>₦10,000</option>
            <option value={25000}>₦25,000</option>
            <option value={40000}>₦40,000</option>
            {ceiling > 40000 && <option value={ceiling}>{`Up to ₦${ceiling.toLocaleString()}`}</option>}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-cream">
          <input
            type="checkbox"
            className="accent-gold"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          In stock
        </label>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategory("all")}
          className={`whitespace-nowrap px-4 py-2 text-[11px] uppercase tracking-[0.18em] ${
            category === "all" ? "bg-gold text-ink" : "border border-gold/40 text-gold"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            className={`whitespace-nowrap px-4 py-2 text-[11px] uppercase tracking-[0.18em] ${
              category === c.slug ? "bg-gold text-ink" : "border border-gold/40 text-gold"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
