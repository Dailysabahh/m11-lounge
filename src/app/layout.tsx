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
    default: "M11 Snooker & Shisha Lounge",
    template: "%s · M11 Lounge",
  },
  description:
    "Premium snooker and shisha lounge in Lagos. Royal platters, signature smoke, and black-and-gold nights. Play · Relax · Enjoy.",
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
    title: "M11 Snooker & Shisha Lounge",
    description:
      "Premium snooker and shisha lounge in Lagos. Royal platters, signature smoke, and black-and-gold nights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "M11 Snooker & Shisha Lounge",
    description:
      "Premium snooker and shisha lounge in Lagos. Royal platters, signature smoke, and black-and-gold nights.",
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
