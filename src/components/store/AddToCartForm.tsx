"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartExtra } from "@/components/cart/CartProvider";

export function AddToCartForm({
  product,
  extras,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    available: boolean;
    allowsExtras: boolean;
  };
  extras: { id: string; name: string; price: number; available: boolean }[];
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  if (!product.available) {
    return (
      <p className="text-sm uppercase tracking-[0.2em] text-gold">
        Temporarily unavailable
      </p>
    );
  }

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function onAdd(goCart = false) {
    const extrasChosen: CartExtra[] = extras
      .filter((e) => selected.includes(e.id))
      .map((e) => ({ id: e.id, name: e.name, price: e.price }));
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      extras: extrasChosen,
    });
    if (goCart) router.push("/cart");
  }

  return (
    <div className="space-y-6">
      {product.allowsExtras && extras.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-[0.22em] text-gold">
            Add extras
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {extras
              .filter((e) => e.available)
              .map((e) => (
                <label
                  key={e.id}
                  className={`flex cursor-pointer items-center justify-between gap-2 border px-3 py-2 text-sm ${
                    selected.includes(e.id) ? "border-gold bg-gold/10" : "border-gold/25"
                  }`}
                >
                  <span>
                    <input
                      type="checkbox"
                      className="mr-2 accent-gold"
                      checked={selected.includes(e.id)}
                      onChange={() => toggle(e.id)}
                    />
                    {e.name}
                  </span>
                  <span className="text-gold">+₦{e.price.toLocaleString()}</span>
                </label>
              ))}
          </div>
        </fieldset>
      )}
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-gold">
          Quantity
        </label>
        <div className="flex w-36 items-center border border-gold/30">
          <button
            type="button"
            className="px-3 py-2 text-gold"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="flex-1 text-center">{qty}</span>
          <button
            type="button"
            className="px-3 py-2 text-gold"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-gold px-8 py-3 text-xs" onClick={() => onAdd(false)}>
          Add to cart
        </button>
        <button type="button" className="btn-ghost px-8 py-3 text-xs" onClick={() => onAdd(true)}>
          Order now
        </button>
      </div>
    </div>
  );
}
