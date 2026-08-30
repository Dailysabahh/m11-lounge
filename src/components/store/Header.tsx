"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "The Lounge" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  restaurantName,
  phone,
  instagram,
}: {
  restaurantName: string;
  phone: string;
  instagram?: string;
}) {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/brand/logo.png"
            alt="M11 logo"
            className="h-12 w-12 rounded-full object-cover ring-1 ring-gold/50 md:h-14 md:w-14"
          />
          <div className="leading-tight">
            <p className="font-display text-lg tracking-[0.2em] text-gold-light md:text-xl">
              M11
            </p>
            <p className="hidden text-[10px] uppercase tracking-[0.28em] text-muted sm:block">
              Snooker & Shisha
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs uppercase tracking-[0.22em] transition ${
                pathname === l.href ? "text-gold-light" : "text-muted hover:text-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {instagram && (
            <a
              href={`https://www.instagram.com/${instagram.replace(/^@/, "")}/`}
              target="_blank"
              rel="noreferrer"
              className="hidden text-xs tracking-[0.12em] text-gold hover:text-gold-light sm:block"
            >
              {instagram}
            </a>
          )}
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="hidden text-xs tracking-[0.12em] text-gold lg:block"
          >
            {phone}
          </a>
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold-light"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden text-gold-light"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-gold/20 px-4 py-4 md:hidden">
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted">
            {restaurantName}
          </p>
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-cream"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
