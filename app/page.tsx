import CalculatorCard from "@/components/CalculatorCard";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const categories = [
    {
      name: "Construction Calculators",
      calculators: [
        {
          title: "All Construction Calculators",
          description: "40+ calculators for concrete, roofing, decking, and more",
          link: "/construction",
        },
        {
          title: "Concrete Calculator",
          description: "Calculate cubic yards for slabs, footings, and more",
          link: "/calculators/concrete",
        },
        {
          title: "Roofing Calculator",
          description: "Calculate shingles, underlayment, and roofing materials",
          link: "/construction/roofing",
        },
        {
          title: "Deck Board Calculator",
          description: "Calculate deck boards with optimized layouts",
          link: "/construction/deck-boards",
        },
        {
          title: "Tile Calculator",
          description: "Calculate tiles, grout, and thinset needed",
          link: "/construction/tile",
        },
        {
          title: "Mulch Calculator",
          description: "Calculate cubic yards of mulch for landscaping",
          link: "/construction/mulch",
        },
        {
          title: "Stud Calculator",
          description: "Calculate wall studs, plates, and headers",
          link: "/construction/stud",
        },
        {
          title: "Gravel Calculator",
          description: "Calculate gravel for driveways and paths",
          link: "/construction/gravel",
        },
      ],
    },
    {
      name: "Electrical & Engineering",
      calculators: [
        {
          title: "Wire Gauge Calculator",
          description: "Calculate proper wire gauge for electrical runs",
          link: "/calculators/wire-gauge",
        },
        {
          title: "Voltage Drop Calculator",
          description: "Calculate voltage drop over distance",
          link: "/calculators/voltage-drop",
        },
        {
          title: "LED Power Calculator",
          description: "Calculate power requirements for LED strips",
          link: "/calculators/led-power",
        },
        {
          title: "Amp Draw Calculator",
          description: "Calculate total amperage for electrical circuits",
          link: "/calculators/amp-draw",
        },
        {
          title: "Circuit Breaker Sizing",
          description: "Determine correct circuit breaker size",
          link: "/calculators/circuit-breaker",
        },
        {
          title: "Battery Runtime Calculator",
          description: "Calculate how long a battery will last",
          link: "/calculators/battery-runtime",
        },
        {
          title: "Solar Panel Calculator",
          description: "Size solar array for your power needs",
          link: "/calculators/solar-panel",
        },
      ],
    },
    {
      name: "Math & Conversions",
      calculators: [
        {
          title: "Unit Converter",
          description: "Convert length, weight, volume, temperature, and area",
          link: "/calculators/unit-converter",
        },
        {
          title: "Percentage Calculator",
          description: "Calculate percentages, increases, and decreases",
          link: "/calculators/percentage",
        },
        {
          title: "Cooking Converter",
          description: "Convert cooking measurements and ingredients",
          link: "/calculators/cooking-converter",
        },
      ],
    },
    {
      name: "Etsy Seller Tools",
      calculators: [
        {
          title: "Complete Etsy Tools Hub",
          description: "All Etsy calculators: fees, shipping, and profit",
          link: "/etsy-tools",
        },
        {
          title: "Etsy Fee Calculator",
          description: "Calculate all Etsy fees including offsite ads",
          link: "/etsy-tools/fee-calculator",
        },
        {
          title: "Etsy Shipping Calculator",
          description: "Compare carrier rates and optimize shipping",
          link: "/etsy-tools/shipping-calculator",
        },
        {
          title: "Etsy Profit Calculator",
          description: "Calculate true profit after all costs",
          link: "/etsy-tools/profit-calculator",
        },
        {
          title: "Etsy Pricing Calculator",
          description: "Price your handmade products profitably",
          link: "/calculators/etsy-pricing",
        },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Calculily</h1>
        <p className={styles.tagline}>
          Free, fast, and accurate online calculators for all your needs
        </p>
      </section>

      {categories.map((category) => (
        <section key={category.name} className={styles.category}>
          <h2 className={styles.categoryTitle}>{category.name}</h2>
          <div className={styles.grid}>
            {category.calculators.map((calc) => (
              <CalculatorCard
                key={calc.link}
                title={calc.title}
                description={calc.description}
                link={calc.link}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
