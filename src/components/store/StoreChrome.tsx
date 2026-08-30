"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import type { SiteData } from "@/lib/site";

export function StoreChrome({
  site,
  preopening,
  children,
}: {
  site: SiteData;
  preopening: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const landingHome = pathname === "/landing" || (preopening && pathname === "/");

  if (landingHome) {
    return <>{children}</>;
  }

  return (
    <div className="noise flex min-h-screen flex-col">
      {site.bannerText && (
        <p className="border-b border-gold/20 bg-charcoal py-2 text-center text-[11px] uppercase tracking-[0.28em] text-gold-light">
          {preopening ? "Opening soon · Lagos" : site.bannerText}
        </p>
      )}
      <Header
        restaurantName={site.restaurantName}
        phone={site.phone}
        instagram={site.instagram}
        preopening={preopening}
      />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </div>
  );
}
