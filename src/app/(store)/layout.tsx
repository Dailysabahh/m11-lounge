import { StoreChrome } from "@/components/store/StoreChrome";
import { getSiteSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteSettings();
  return <StoreChrome site={site}>{children}</StoreChrome>;
}
