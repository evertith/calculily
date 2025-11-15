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
      <body>
        {/* Google Analytics - loaded early in head */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-70PPEJM0GG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-70PPEJM0GG');
          `}
        </Script>

        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
