'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import AdUnit from '@/components/AdUnit';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

export default function WireGaugeCalculator() {
  const [distance, setDistance] = useState<string>('');
  const [amperage, setAmperage] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('120');
  const [result, setResult] = useState<{
    gauge: string;
    voltageDrop: number;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const faqItems = [
    {
      question: "What happens if I use too small a wire?",
      answer: "Using wire that's too small can cause several serious problems: excessive voltage drop leading to poor equipment performance, overheating of the wire which creates a fire hazard, and potential damage to connected devices. The wire could also fail electrical code inspections. Always use the recommended gauge or larger for safety."
    },
    {
      question: "What is voltage drop and why does it matter?",
      answer: "Voltage drop is the reduction in voltage as electricity travels through a wire. The National Electrical Code (NEC) recommends keeping voltage drop under 3% for branch circuits and 5% total for the entire system. Excessive voltage drop can cause lights to dim, motors to overheat, and electronics to malfunction."
    },
    {
      question: "Can I use a larger wire gauge than recommended?",
      answer: "Yes, using a larger wire (smaller gauge number) is always safe and will reduce voltage drop. The main downsides are increased cost and the wire being more difficult to work with due to its thickness. However, it's a good practice for long runs or critical circuits."
    },
    {
      question: "What's the difference between copper and aluminum wire?",
      answer: "This calculator assumes copper wire, which is the most common. Aluminum wire is less conductive, so you need a larger size (typically 2 gauges larger) to carry the same current. While aluminum is cheaper and lighter, it requires special installation techniques and connectors."
    }
  ];

  const relatedCalculators = [
    {
      title: "Voltage Drop Calculator",
      link: "/calculators/voltage-drop",
      description: "Calculate voltage drop for any wire run and gauge"
    },
    {
      title: "Circuit Breaker Calculator",
      link: "/calculators/circuit-breaker",
      description: "Determine the correct breaker size for your circuit"
    },
    {
      title: "Amp Draw Calculator",
      link: "/calculators/amp-draw",
      description: "Calculate total amperage for multiple loads"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Selecting the correct wire gauge is critical for electrical safety. Our calculator helps you determine the right wire size based on your specific requirements:",
      steps: [
        "Enter the amperage (current) of your circuit - this is typically determined by your breaker size or the equipment you're powering.",
        "Input the one-way distance from the power source to the load in feet.",
        "Select your voltage (120V for standard household, 240V for large appliances, or other common voltages).",
        "Choose between single-phase and three-phase power systems.",
        "Click 'Calculate' to see the recommended wire gauge and voltage drop percentage."
      ]
    },
    whyMatters: {
      description: "Using the wrong wire gauge isn't just an inconvenience - it's a serious safety hazard. Undersized wire can overheat, potentially causing fires, damaging equipment, or creating shock hazards. Oversized wire wastes money on materials. Additionally, excessive voltage drop over long runs can cause equipment to malfunction, lights to dim, and motors to run inefficiently or overheat. This calculator helps you find the balance between safety, performance, and cost.",
      benefits: [
        "Prevent electrical fires by ensuring wire can handle the current safely",
        "Avoid voltage drop issues that cause equipment malfunction or inefficiency",
        "Save money by not over-specifying wire size unnecessarily",
        "Meet National Electrical Code (NEC) requirements for your installation",
        "Properly size wire for long runs where voltage drop becomes significant"
      ]
    },
    examples: [
      {
        title: "Shop Subpanel",
        scenario: "You're running a 60-amp subpanel to a detached workshop 100 feet from your main panel at 240V single-phase.",
        calculation: "60A at 240V over 100 feet requires #4 AWG copper (or #2 AWG aluminum)",
        result: "Voltage drop: ~2.5% - well within the 3% recommended maximum for feeders."
      },
      {
        title: "Outdoor Lighting",
        scenario: "Installing landscape lighting with a 15-amp circuit running 150 feet from the panel at 120V.",
        calculation: "15A at 120V over 150 feet requires #10 AWG copper minimum",
        result: "Using #10 AWG keeps voltage drop around 4.8% - acceptable for lighting circuits."
      },
      {
        title: "EV Charger",
        scenario: "Installing a 50-amp Level 2 EV charger in your garage, 30 feet from the panel at 240V.",
        calculation: "50A at 240V over 30 feet requires #6 AWG copper",
        result: "Voltage drop: ~1.2% - excellent for consistent charging performance."
      }
    ],
    commonMistakes: [
      "Using the breaker rating instead of actual load for calculations - always size for the breaker/circuit protection, not expected usage.",
      "Forgetting that NEC requires voltage drop under 3% for feeders and 5% total for branch circuits.",
      "Not accounting for round-trip distance in voltage drop - the calculator handles this, but manual calculations often miss it.",
      "Using aluminum wire ampacity ratings for copper wire - they're different, and aluminum requires larger gauges.",
      "Ignoring ambient temperature derating in hot locations like attics - this can require upsizing wire significantly."
    ]
  };

  const calculateWireGauge = () => {
    const dist = parseFloat(distance);
    const amps = parseFloat(amperage);
    const volts = parseFloat(voltage);

    const newErrors: string[] = [];

    if (!distance || dist <= 0) {
      newErrors.push("Please enter a valid distance");
    }
    if (!amperage || amps <= 0) {
      newErrors.push("Please enter a valid amperage");
    }
    if (dist > 1000) {
      newErrors.push("Distance over 1000 feet may require special considerations");
    }
    if (amps > 200) {
      newErrors.push("For amperage over 200A, consult a licensed electrician");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    // Circular mils calculation
    const cmils = (2 * 12.9 * dist * amps) / (volts * 0.03);

    // Wire gauge determination
    let gauge = '14 AWG';
    let actualCmils = 4110;

    if (cmils > 83690) {
      gauge = '4 AWG';
      actualCmils = 41740;
    } else if (cmils > 66360) {
      gauge = '6 AWG';
      actualCmils = 26240;
    } else if (cmils > 52620) {
      gauge = '8 AWG';
      actualCmils = 16510;
    } else if (cmils > 33100) {
      gauge = '10 AWG';
      actualCmils = 10380;
    } else if (cmils > 20820) {
      gauge = '12 AWG';
      actualCmils = 6530;
    }

    // Voltage drop calculation using actual wire gauge
    const voltageDrop = (2 * 12.9 * dist * amps) / actualCmils;

    setResult({ gauge, voltageDrop });

    // Track calculator usage
    trackCalculatorUsage('Wire Gauge Calculator', {
      distance: dist,
      amperage: amps,
      voltage: volts,
      recommended_gauge: gauge
    });
  };

  return (
    <CalculatorLayout
      title="Wire Gauge Calculator"
      description="Calculate the correct wire gauge (AWG) for your electrical project. Enter amperage, distance, and voltage to determine safe wire sizing with voltage drop calculations."
    >
      <CalculatorSchema
        name="Wire Gauge Calculator"
        description="Free electrical wire gauge calculator for determining correct AWG wire size. Calculate proper wire gauge based on amperage, distance, and voltage for safe electrical installations."
        url="/calculators/wire-gauge"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateWireGauge(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="distance" className={styles.label}>
            Distance (feet)
          </label>
          <input
            id="distance"
            type="number"
            className={styles.input}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter distance in feet"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="amperage" className={styles.label}>
            Amperage (amps)
          </label>
          <input
            id="amperage"
            type="number"
            className={styles.input}
            value={amperage}
            onChange={(e) => setAmperage(e.target.value)}
            placeholder="Enter amperage"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="voltage" className={styles.label}>
            Voltage
          </label>
          <select
            id="voltage"
            className={styles.select}
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
          >
            <option value="120">120V</option>
            <option value="240">240V</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Wire Gauge
        </button>
      </form>

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((error, index) => (
            <div key={index} className={styles.error}>
              {error}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Wire Gauge</span>
            <span className={styles.resultValuePrimary}>{result.gauge}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Voltage Drop</span>
            <span className={styles.resultValue}>{result.voltageDrop.toFixed(2)}V</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Percentage Drop</span>
            <span className={styles.resultValue}>
              {((result.voltageDrop / parseFloat(voltage)) * 100).toFixed(2)}%
            </span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This calculator provides general guidance. Always consult local electrical codes and a licensed electrician for your specific installation.
          </div>

          {((result.voltageDrop / parseFloat(voltage)) * 100) > 3 && (
            <div className={styles.warning}>
              <strong>Warning:</strong> Voltage drop exceeds 3%, which may cause issues. Consider using a larger wire gauge.
            </div>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        title="Recommended Electrical Tools"
        products={getProducts('wire-gauge', 3)}
        calculatorName="Wire Gauge Calculator"
      />

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      <CalculatorContent
        howToUse={contentData.howToUse}
        whyMatters={contentData.whyMatters}
        examples={contentData.examples}
        commonMistakes={contentData.commonMistakes}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
