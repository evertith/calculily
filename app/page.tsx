import CalculatorCard from "@/components/CalculatorCard";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const categories = [
    {
      name: "Home & Property",
      calculators: [
        {
          title: "Concrete Calculator",
          description: "Calculate cubic yards for slabs, footings, and more",
          link: "/calculators/concrete",
        },
        {
          title: "Lumber Calculator",
          description: "Calculate board feet and framing materials",
          link: "/calculators/lumber",
        },
        {
          title: "Paint Calculator",
          description: "Calculate gallons of paint needed for walls and ceilings",
          link: "/calculators/paint",
        },
        {
          title: "Fence Calculator",
          description: "Calculate fence materials and concrete for posts",
          link: "/calculators/fence",
        },
        {
          title: "Insulation Calculator",
          description: "Calculate R-value and insulation materials needed",
          link: "/calculators/insulation",
        },
        {
          title: "Drywall Calculator",
          description: "Calculate drywall sheets, mud, and materials",
          link: "/calculators/drywall",
        },
        {
          title: "Deck Calculator",
          description: "Calculate deck materials, joists, and railings",
          link: "/calculators/deck",
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
      name: "Automotive",
      calculators: [
        {
          title: "Gas Mileage Tracker",
          description: "Track and calculate your MPG",
          link: "/calculators/gas-mileage",
        },
        {
          title: "Tire Size Calculator",
          description: "Compare tire sizes and speedometer error",
          link: "/calculators/tire-size",
        },
        {
          title: "Car Payment Calculator",
          description: "Calculate car loan payments with trade-in",
          link: "/calculators/car-payment",
        },
        {
          title: "Car Depreciation Calculator",
          description: "Calculate vehicle depreciation over time",
          link: "/calculators/car-depreciation",
        },
        {
          title: "Fuel Cost Calculator",
          description: "Calculate trip fuel costs",
          link: "/calculators/fuel-cost",
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
      name: "Date & Time",
      calculators: [
        {
          title: "Date Calculator",
          description: "Calculate days between dates and date math",
          link: "/calculators/date-calculator",
        },
        {
          title: "Age Calculator",
          description: "Calculate your exact age and next birthday",
          link: "/calculators/age-calculator",
        },
        {
          title: "Time Zone Converter",
          description: "Convert time between time zones worldwide",
          link: "/calculators/time-zone-converter",
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
        },
        {
          title: "Loan Calculator",
          description: "Calculate loan payments and amortization",
          link: "/calculators/loan",
        },
        {
          title: "Simple Interest Calculator",
          description: "Calculate simple interest on loans and savings",
          link: "/calculators/simple-interest",
        },
        {
          title: "Sales Tax Calculator",
          description: "Calculate sales tax by state or custom rate",
          link: "/calculators/sales-tax",
        },
        {
          title: "Discount Calculator",
          description: "Calculate sale prices and savings",
          link: "/calculators/discount",
        },
        {
          title: "Tip Calculator",
          description: "Calculate tips and split bills",
          link: "/calculators/tip",
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
        },
      ],
    },
    {
      name: "Education",
      calculators: [
        {
          title: "GPA Calculator",
          description: "Calculate your grade point average",
          link: "/calculators/gpa-calculator",
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
