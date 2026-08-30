import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.m11lounge.com"),
  title: {
    default: "M11 Lounge — Opening Soon",
    template: "%s · M11 Lounge",
  },
  description:
    "M11 Snooker & Shisha Lounge is opening soon in Lagos. Preview the menu, follow Instagram, and apply to join the team.",
  applicationName: "M11 Lounge",
  icons: {
    icon: [
      { url: "/brand/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
    shortcut: "/brand/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://www.m11lounge.com",
    siteName: "M11 Lounge",
    title: "M11 Lounge — Opening Soon",
    description:
      "Snooker, shisha, and black-and-gold nights in Lagos. Preview the menu and apply to join the opening team.",
  },
  twitter: {
    card: "summary_large_image",
    title: "M11 Lounge — Opening Soon",
    description:
      "Snooker, shisha, and black-and-gold nights in Lagos. Preview the menu and apply to join the opening team.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-ink font-sans text-cream antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
