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

export default function VoltageDropCalculator() {
  const [wireGauge, setWireGauge] = useState<string>('12');
  const [distance, setDistance] = useState<string>('');
  const [amperage, setAmperage] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('120');
  const [result, setResult] = useState<{
    voltageDrop: number;
    voltageDropPercent: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const faqItems = [
    {
      question: "What is an acceptable voltage drop percentage?",
      answer: "The National Electrical Code (NEC) recommends keeping voltage drop under 3% for branch circuits and 5% total for the entire system. Exceeding these limits can cause lights to dim, motors to overheat, and appliances to underperform. For critical equipment or long runs, aim for even lower voltage drop (1-2%)."
    },
    {
      question: "Should I use the one-way or round-trip distance?",
      answer: "Use the one-way distance from your power source to the load. The calculator automatically accounts for the round-trip (both positive and negative wires) in its formula by multiplying the distance by 2. If you enter the round-trip distance, your voltage drop will be incorrectly doubled."
    },
    {
      question: "How do I reduce voltage drop in my circuit?",
      answer: "You can reduce voltage drop by: 1) Using a larger wire gauge (lower AWG number), 2) Shortening the wire run distance, 3) Reducing the current/amperage draw, or 4) Increasing the system voltage (e.g., using 240V instead of 120V). Upgrading to the next larger wire gauge is usually the most practical solution."
    },
    {
      question: "Does wire type (copper vs aluminum) affect voltage drop?",
      answer: "Yes, significantly. This calculator uses copper wire resistance values, which are standard for most residential and commercial applications. Aluminum wire has about 1.6 times the resistance of copper, so voltage drop will be higher. Always use copper resistance values for copper wire and aluminum values for aluminum wire."
    }
  ];

  const relatedCalculators = [
    {
      title: "Wire Gauge Calculator",
      link: "/calculators/wire-gauge",
      description: "Calculate proper wire gauge for amperage and distance"
    },
    {
      title: "Circuit Breaker Calculator",
      link: "/calculators/circuit-breaker",
      description: "Size circuit breakers correctly"
    },
    {
      title: "Amp Draw Calculator",
      link: "/calculators/amp-draw",
      description: "Calculate total circuit amperage"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate voltage drop to ensure your electrical runs deliver adequate power to loads:",
      steps: [
        "Enter the wire gauge (AWG) you're using or planning to use.",
        "Input the one-way distance from power source to load in feet.",
        "Enter the current (amps) the circuit will carry.",
        "Select the voltage of your system (120V, 240V, etc.).",
        "Click 'Calculate' to see voltage drop percentage and actual voltage at the load."
      ]
    },
    whyMatters: {
      description: "Voltage drop is the silent killer of electrical efficiency. As current flows through wire, some voltage is lost as heat due to resistance. The National Electrical Code recommends no more than 3% drop for feeders and 5% total for branch circuits. Excessive voltage drop causes lights to dim, motors to run hot and inefficiently, and electronics to malfunction. For long runs to outbuildings, pools, or outdoor lighting, voltage drop often requires larger wire than ampacity alone would suggest.",
      benefits: [
        "Ensure lights operate at full brightness without dimming",
        "Prevent motors from overheating due to low voltage",
        "Optimize energy efficiency by minimizing power lost in wiring",
        "Properly size wire for long runs to outbuildings and remote locations",
        "Meet NEC recommendations for voltage drop limits"
      ]
    },
    examples: [
      {
        title: "Long Run to Shed",
        scenario: "Running a 20A, 120V circuit 150 feet to a shed using #12 AWG wire.",
        calculation: "Voltage drop = ~7.8% with #12 AWG",
        result: "Exceeds 5% limit. Upgrade to #10 AWG for ~4.9% drop or #8 AWG for ~3.1%."
      },
      {
        title: "Landscape Lighting",
        scenario: "Low voltage (12V) landscape lights, 5A load, 100 feet of #14 wire.",
        calculation: "Voltage drop = ~8.2% (about 1V lost)",
        result: "Lights will be noticeably dim. Use #10 AWG or shorter runs for low voltage systems."
      },
      {
        title: "EV Charger Circuit",
        scenario: "50A, 240V circuit, 60 feet from panel to garage, using #6 AWG.",
        calculation: "Voltage drop = ~2.1%",
        result: "Well within limits. The charger will receive adequate voltage for full charging speed."
      }
    ],
    commonMistakes: [
      "Forgetting that voltage drop is a round-trip calculation - current flows out AND back, doubling the wire length.",
      "Using ampacity tables alone for long runs - you may need larger wire for voltage drop even if ampacity is okay.",
      "Not accounting for the much higher impact of voltage drop in low-voltage systems (12V, 24V).",
      "Ignoring NEC guidelines - while not always code requirements, 3%/5% limits are best practice.",
      "Using aluminum wire ampacity calculations for copper - voltage drop differs between materials."
    ]
  };

  // Resistance per 1000ft for each gauge (in ohms)
  const resistance: { [key: string]: number } = {
    '14': 2.525,
    '12': 1.588,
    '10': 0.999,
    '8': 0.628,
    '6': 0.395,
    '4': 0.249,
    '2': 0.156,
    '0': 0.098,
  };

  const calculateVoltageDrop = () => {
    const dist = parseFloat(distance);
    const amps = parseFloat(amperage);
    const volts = parseFloat(voltage);
    const gaugeResistance = resistance[wireGauge];

    if (!dist || !amps || !volts || !gaugeResistance) return;

    const voltageDrop = (2 * gaugeResistance * dist * amps) / 1000;
    const voltageDropPercent = (voltageDrop / volts) * 100;

    setResult({ voltageDrop, voltageDropPercent });

    // Track calculator usage
    trackCalculatorUsage('Voltage Drop Calculator', {
      wire_gauge: wireGauge,
      distance: dist,
      amperage: amps,
      voltage: volts,
      voltage_drop_percent: voltageDropPercent
    });
  };

  return (
    <CalculatorLayout
      title="Voltage Drop Calculator"
      description="Calculate voltage drop for electrical wiring runs. Enter wire gauge, distance, and amperage to ensure your circuits deliver adequate voltage to loads."
    >
      <CalculatorSchema
        name="Voltage Drop Calculator"
        description="Free voltage drop calculator for electrical wiring. Calculate voltage loss over distance for any wire gauge, amperage, and voltage to ensure proper circuit performance."
        url="/calculators/voltage-drop"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateVoltageDrop(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="wireGauge" className={styles.label}>
            Wire Gauge
          </label>
          <select
            id="wireGauge"
            className={styles.select}
            value={wireGauge}
            onChange={(e) => setWireGauge(e.target.value)}
          >
            <option value="14">14 AWG</option>
            <option value="12">12 AWG</option>
            <option value="10">10 AWG</option>
            <option value="8">8 AWG</option>
            <option value="6">6 AWG</option>
            <option value="4">4 AWG</option>
            <option value="2">2 AWG</option>
            <option value="0">0 AWG</option>
          </select>
        </div>

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
            placeholder="One-way distance"
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
            placeholder="Current draw"
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
            <option value="12">12V</option>
            <option value="24">24V</option>
            <option value="120">120V</option>
            <option value="240">240V</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Voltage Drop
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Voltage Drop</span>
            <span className={styles.resultValuePrimary}>{result.voltageDrop.toFixed(2)}V</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Percentage Drop</span>
            <span className={styles.resultValue}>{result.voltageDropPercent.toFixed(2)}%</span>
          </div>

          {result.voltageDropPercent > 3 ? (
            <div className={styles.warning}>
              <strong>Warning:</strong> Voltage drop exceeds 3%, which is generally considered excessive.
              This can lead to dimming lights, reduced appliance performance, and overheating.
              Consider using a larger wire gauge or reducing the distance.
            </div>
          ) : (
            <div className={styles.note}>
              <strong>Good:</strong> Voltage drop is within acceptable limits (under 3%).
              This wire gauge is appropriate for your application.
            </div>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('electrical', 3)}
        calculatorName="Voltage Drop Calculator"
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
