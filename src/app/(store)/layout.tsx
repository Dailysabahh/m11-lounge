import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { getSiteSettings } from "@/lib/site";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteSettings();
  return (
    <div className="noise flex min-h-screen flex-col">
      {site.bannerText && (
        <p className="border-b border-gold/20 bg-charcoal py-2 text-center text-[11px] uppercase tracking-[0.28em] text-gold-light">
          {site.bannerText}
        </p>
      )}
      <Header restaurantName={site.restaurantName} phone={site.phone} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </div>
  );
}
