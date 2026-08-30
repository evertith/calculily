import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";

// Display face for The House Year promo banner only (self-hosted via next/font).
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-house-year",
});

export const metadata: Metadata = {
  title: "Calculily - Free Online Calculators",
  description: "Free online calculators for wire gauge, mortgage, LED power, loans, tips, and more. Fast, accurate, and easy to use.",
  keywords: "calculator, online calculator, wire gauge, mortgage calculator, loan calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fraunces.variable}>
      <head>
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="jUJM8Zx+auuWSu8HGjT0kQ" async></script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2899164454337185"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Header />
        <PromoBanner />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
