"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, removeItem, subtotal, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-gold-light">Your cart</h1>
        <p className="mt-4 text-muted">Nothing here yet — the kitchen is waiting.</p>
        <Link href="/menu" className="btn-gold mt-8 inline-block px-8 py-3 text-xs">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl text-gold-light">Your cart</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => {
          const extraTotal = item.extras.reduce((s, e) => s + e.price, 0);
          return (
            <div key={item.key} className="card-lux flex gap-4 p-4">
              <img src={item.image} alt="" className="h-24 w-24 object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-gold-light">{item.name}</p>
                    {item.extras.length > 0 && (
                      <p className="text-xs text-muted">
                        + {item.extras.map((e) => e.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <p className="text-gold">
                    {formatNaira((item.price + extraTotal) * item.quantity)}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-gold/30">
                    <button className="px-3 py-1" onClick={() => setQty(item.key, item.quantity - 1)}>
                      −
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button className="px-3 py-1" onClick={() => setQty(item.key, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <button
                    className="text-xs uppercase tracking-widest text-muted hover:text-gold"
                    onClick={() => removeItem(item.key)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex flex-col items-end gap-3">
        <p className="text-xl text-gold">Subtotal {formatNaira(subtotal)}</p>
        <div className="flex gap-3">
          <button onClick={clear} className="btn-ghost px-5 py-2 text-xs">
            Clear
          </button>
          <Link href="/checkout" className="btn-gold px-8 py-3 text-xs">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
