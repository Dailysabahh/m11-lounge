"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { formatNaira } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");

  const total = Math.max(0, subtotal - discount);

  async function applyPromo() {
    setPromoMsg("");
    const res = await fetch("/api/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promo, subtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDiscount(0);
      setPromoMsg(data.error || "Invalid code");
      return;
    }
    setDiscount(data.discount);
    setPromoMsg(data.description);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        fulfillment: form.get("fulfillment"),
        notes: form.get("notes"),
        paymentMethod: form.get("paymentMethod"),
        promoCode: promo || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          extras: i.extras,
        })),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Checkout failed");
      return;
    }
    clear();
    if (data.authorizationUrl) {
      window.location.href = data.authorizationUrl;
      return;
    }
    router.push(`/orders/${data.orderNumber}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-display text-4xl text-gold-light">Checkout</h1>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          Full name
          <input name="name" required className="mt-2 w-full px-3 py-2 text-sm" />
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          Phone
          <input name="phone" required className="mt-2 w-full px-3 py-2 text-sm" />
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          Email
          <input name="email" type="email" required className="mt-2 w-full px-3 py-2 text-sm" />
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          Fulfillment
          <select name="fulfillment" className="mt-2 w-full px-3 py-2 text-sm">
            <option value="DINE_IN">Dine in</option>
            <option value="PICKUP">Pickup</option>
          </select>
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          Notes
          <textarea name="notes" rows={3} className="mt-2 w-full px-3 py-2 text-sm" />
        </label>
        <fieldset className="space-y-2">
          <legend className="text-xs uppercase tracking-[0.2em] text-gold">Payment</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="paymentMethod" value="PAYSTACK" defaultChecked />
            Pay online (Paystack)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="paymentMethod" value="PAY_AT_LOUNGE" />
            Pay at the lounge
          </label>
        </fieldset>
        <div className="flex gap-2">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className="flex-1 px-3 py-2 text-sm"
          />
          <button type="button" onClick={applyPromo} className="btn-ghost px-4 py-2 text-xs">
            Apply
          </button>
        </div>
        {promoMsg && <p className="text-sm text-gold">{promoMsg}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="btn-gold w-full py-3 text-xs">
          {loading ? "Placing order…" : `Place order · ${formatNaira(total)}`}
        </button>
      </form>
      <aside className="card-lux h-fit p-6">
        <h2 className="font-display text-xl text-gold-light">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.key} className="flex justify-between gap-3">
              <span>
                {i.quantity} × {i.name}
                {i.extras.length > 0 && (
                  <span className="block text-xs text-muted">
                    {i.extras.map((e) => e.name).join(", ")}
                  </span>
                )}
              </span>
              <span className="text-gold">
                {formatNaira(
                  (i.price + i.extras.reduce((s, e) => s + e.price, 0)) * i.quantity,
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="gold-hairline my-4" />
        <p className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </p>
        {discount > 0 && (
          <p className="flex justify-between text-sm text-gold">
            <span>Discount</span>
            <span>−{formatNaira(discount)}</span>
          </p>
        )}
        <p className="mt-2 flex justify-between font-display text-lg text-gold-light">
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </p>
      </aside>
    </div>
  );
}
