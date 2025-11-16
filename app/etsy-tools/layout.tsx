import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Etsy Fee Calculator & Profit Tools - Calculate Real Margins | Calculily",
  description: "Free Etsy calculators for fees, shipping, and profit. Calculate what Etsy takes from each sale including offsite ads. Updated for 2025 policies. No signup required.",
  keywords: "etsy fee calculator, etsy profit calculator, etsy shipping calculator, etsy seller tools, calculate etsy fees, etsy offsite ads calculator, etsy pricing calculator"
};

export default function EtsyToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
