import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/format";

export type OpeningHour = { day: string; hours: string };

export type SiteData = {
  restaurantName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  tiktok: string;
  hours: OpeningHour[];
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  bannerText: string | null;
};

const fallback: SiteData = {
  restaurantName: "M11 Snooker & Shisha Lounge",
  tagline: "Play · Relax · Enjoy",
  phone: "0700 111 0011",
  email: "hello@m11lounge.com",
  address: "Lagos, Nigeria",
  instagram: "@M11_LOUNGE",
  tiktok: "@M11_LOUNGE",
  hours: [
    { day: "Monday – Thursday", hours: "4:00 PM – 2:00 AM" },
    { day: "Friday – Sunday", hours: "2:00 PM – 3:00 AM" },
  ],
  heroTitle: "M11 Lounge",
  heroSubtitle:
    "A premium snooker and shisha lounge serving royal platters, signature smoke, and unforgettable nights.",
  aboutText:
    "M11 is Lagos nightlife done with intention — gold-on-black luxury, championship tables, premium shisha, and a kitchen built for sharing.",
  bannerText: "Good music · Good vibes · Great memories",
};

export async function getSiteSettings(): Promise<SiteData> {
  const row = await prisma.siteSetting.findUnique({ where: { id: "site" } });
  if (!row) return fallback;
  return {
    restaurantName: row.restaurantName,
    tagline: row.tagline,
    phone: row.phone,
    email: row.email,
    address: row.address,
    instagram: row.instagram,
    tiktok: row.tiktok,
    hours: parseJson<OpeningHour[]>(row.hoursJson, fallback.hours),
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    aboutText: row.aboutText,
    bannerText: row.bannerText,
  };
}

export function canManageContent(role?: string) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canManageUsers(role?: string) {
  return role === "SUPER_ADMIN";
}
