import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Construction Calculators - Material Estimators for Builders | Calculily",
  description: "Free construction calculators for contractors and DIYers. Calculate concrete, roofing, decking, lumber, paint, and more. Accurate material estimates with waste factors.",
  keywords: "construction calculator, concrete calculator, roofing calculator, deck calculator, lumber calculator, material estimator, building calculator, contractor tools"
};

export default function ConstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
