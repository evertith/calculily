import CalculatorCard from "@/components/CalculatorCard";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const categories = [
    {
      name: "Electrical & Engineering",
      calculators: [
        {
          title: "Wire Gauge Calculator",
          description: "Calculate proper wire gauge for electrical runs",
          link: "/calculators/wire-gauge",
          icon: "⚡",
        },
        {
          title: "Voltage Drop Calculator",
          description: "Calculate voltage drop over distance",
          link: "/calculators/voltage-drop",
          icon: "🔌",
        },
        {
          title: "LED Power Calculator",
          description: "Calculate power requirements for LED strips",
          link: "/calculators/led-power",
          icon: "💡",
        },
      ],
    },
    {
      name: "Finance & Money",
      calculators: [
        {
          title: "Mortgage Calculator",
          description: "Calculate monthly payments and total interest",
          link: "/calculators/mortgage",
          icon: "🏠",
        },
        {
          title: "Loan Calculator",
          description: "Calculate loan payments and amortization",
          link: "/calculators/loan",
          icon: "💰",
        },
        {
          title: "Tip Calculator",
          description: "Calculate tips and split bills",
          link: "/calculators/tip",
          icon: "🧾",
        },
      ],
    },
    {
      name: "Business & Lifestyle",
      calculators: [
        {
          title: "Etsy Pricing Calculator",
          description: "Price your handmade products profitably",
          link: "/calculators/etsy-pricing",
          icon: "🏷️",
        },
        {
          title: "Fuel Cost Calculator",
          description: "Calculate trip fuel costs",
          link: "/calculators/fuel-cost",
          icon: "⛽",
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
                icon={calc.icon}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
