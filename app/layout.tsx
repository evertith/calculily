import type { Metadata } from "next";
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
