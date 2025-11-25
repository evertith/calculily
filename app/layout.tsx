import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <html lang="en">
      <head>
        {/* Ezoic Privacy/Consent Scripts - must load first */}
        <script src="https://cmp.gatekeeperconsent.com/min.js" data-cfasync="false"></script>
        <script src="https://the.gatekeeperconsent.com/cmp.min.js" data-cfasync="false"></script>

        {/* Ezoic Header Script */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />

        {/* Analytics */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="jUJM8Zx+auuWSu8HGjT0kQ" async></script>

        {/* Google AdSense - running alongside Ezoic */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2899164454337185"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
