import { getSiteSettings } from "@/lib/site";
import { LandingExperience } from "@/components/store/LandingExperience";

export const metadata = {
  title: "Coming Soon",
  description:
    "M11 Snooker & Shisha Lounge is opening soon in Osogbo. Preview the menu, follow us, apply to join the team, and get reminded on opening night.",
};

export default async function ComingSoonPage() {
  const site = await getSiteSettings();
  return <LandingExperience site={site} />;
}
