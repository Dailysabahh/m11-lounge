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
  title: {
    default: "M11 Lounge — Opening Soon",
    template: "%s · M11 Lounge",
  },
  description:
    "M11 Snooker & Shisha Lounge is opening soon in Lagos. Preview the menu, follow Instagram, and apply to join the team.",
  icons: { icon: "/brand/logo.png" },
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
