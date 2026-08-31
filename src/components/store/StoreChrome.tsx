"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import type { SiteData } from "@/lib/site";

export function StoreChrome({
  site,
  children,
}: {
  site: SiteData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/coming-soon" || pathname === "/landing") {
    return <>{children}</>;
  }

  return (
    <div className="noise flex min-h-screen flex-col">
      {site.bannerText && (
        <p className="border-b border-gold/20 bg-charcoal py-2 text-center text-[11px] uppercase tracking-[0.28em] text-gold-light">
          {site.bannerText}
        </p>
      )}
      <Header restaurantName={site.restaurantName} phone={site.phone} instagram={site.instagram} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </div>
  );
}
