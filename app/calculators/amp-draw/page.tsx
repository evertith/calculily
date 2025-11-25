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
import type { Metadata } from 'next';
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

interface Appliance {
  id: number;
  name: string;
  watts: number;
}

export default function AmpDrawCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: 1, name: '', watts: 0 }
  ]);
  const [voltage, setVoltage] = useState<string>('120');
  const [result, setResult] = useState<{
    totalWatts: number;
    totalAmps: number;
    breakerSize: number | string;
    wireGauge: string;
  } | null>(null);

  const commonAppliances = [
    { name: 'Select preset...', watts: 0 },
    { name: 'Refrigerator', watts: 800 },
    { name: 'Microwave', watts: 1200 },
    { name: 'Dishwasher', watts: 1800 },
    { name: 'Washing Machine', watts: 1200 },
    { name: 'Dryer (Electric)', watts: 5000 },
    { name: 'Window AC', watts: 1200 },
    { name: 'Central AC', watts: 3500 },
    { name: 'Electric Range', watts: 5000 },
    { name: 'Water Heater', watts: 4500 },
    { name: 'Hair Dryer', watts: 1500 },
    { name: 'Toaster', watts: 1200 },
    { name: 'Coffee Maker', watts: 1000 },
    { name: 'TV', watts: 200 },
    { name: 'Computer', watts: 300 },
    { name: 'LED Lights (per bulb)', watts: 10 },
    { name: 'Space Heater', watts: 1500 }
  ];

  const faqItems = [
    {
      question: "What is amp draw and why does it matter?",
      answer: "Amp draw is the amount of electrical current (measured in amperes) that your appliances and devices pull from a circuit. Understanding total amp draw is crucial for safety - if you exceed the circuit's capacity, it can trip breakers, overheat wires, and create fire hazards. The NEC (National Electrical Code) requires circuits to be sized properly to handle the load."
    },
    {
      question: "How do I calculate amps from watts?",
      answer: "The formula is simple: Amps = Watts ÷ Voltage. For most household circuits, you'll use 120V for standard outlets and 240V for large appliances like dryers, ranges, and central AC. This calculator does the conversion automatically based on your voltage selection."
    },
    {
      question: "What's the 80% rule for circuit breakers?",
      answer: "The NEC requires that continuous loads (running for 3+ hours) should not exceed 80% of the circuit's rated capacity. This is why the calculator applies a 125% safety factor when recommending breaker sizes. For example, if you have a 16-amp continuous load, you need at least a 20-amp breaker (16 × 1.25 = 20)."
    },
    {
      question: "Can I add up all my appliances on one circuit?",
      answer: "No, you should only add devices that will run simultaneously on the same circuit. Most circuits serve specific areas (kitchen, bathroom, bedroom) and you should calculate based on what could reasonably run at the same time. Critical appliances like refrigerators, microwaves, and dishwashers often require dedicated circuits."
    }
  ];

  const relatedCalculators = [
    {
      title: "Circuit Breaker Calculator",
      link: "/calculators/circuit-breaker",
      description: "Size circuit breakers correctly"
    },
    {
      title: "Wire Gauge Calculator",
      link: "/calculators/wire-gauge",
      description: "Calculate proper wire gauge for circuits"
    },
    {
      title: "Voltage Drop Calculator",
      link: "/calculators/voltage-drop",
      description: "Calculate voltage drop over distance"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate total amperage to ensure your circuits aren't overloaded:",
      steps: [
        "List all devices that will be on the circuit.",
        "For each device, enter either the wattage (from the label) or the amp rating.",
        "If entering wattage, select the circuit voltage (120V or 240V).",
        "Add all devices that could run simultaneously on this circuit.",
        "Click 'Calculate' to see total amp draw and whether it's within safe limits."
      ]
    },
    whyMatters: {
      description: "Every circuit has a maximum amperage capacity determined by the wire gauge and breaker size. Exceeding this capacity causes breakers to trip at best, and can start fires at worst. When adding new devices to a circuit - especially high-draw items like space heaters, air conditioners, or power tools - you need to know if the circuit can handle the additional load. This calculator helps you add up all the loads to ensure safe operation.",
      benefits: [
        "Prevent circuit overloads and breaker trips",
        "Determine if a circuit can handle additional loads",
        "Plan new circuits with adequate capacity",
        "Identify circuits that are close to maximum capacity",
        "Calculate loads for generator sizing"
      ]
    },
    examples: [
      {
        title: "Home Office Circuit",
        scenario: "One 15A circuit powering: computer (300W), two monitors (50W each), printer (500W peak), desk lamp (60W).",
        calculation: "960W ÷ 120V = 8A continuous, but printer peak could bring it to 12.5A",
        result: "Safe for a 15A circuit, but at 83% when printer runs. Don't add a space heater!"
      },
      {
        title: "Kitchen Counter Circuit",
        scenario: "Toaster (1,200W), coffee maker (900W), and microwave (1,500W) on same circuit.",
        calculation: "3,600W ÷ 120V = 30A if all running together",
        result: "Exceeds 20A circuit! Never run all three simultaneously, or use different circuits."
      },
      {
        title: "Workshop Planning",
        scenario: "Table saw (15A), dust collector (12A), shop vac (10A), lights (4A) - need to size subpanel.",
        calculation: "Max simultaneous: saw + dust collector + lights = 31A at 120V",
        result: "Need at least a 40A subpanel feed, or split between two 20A circuits."
      }
    ],
    commonMistakes: [
      "Forgetting that some devices have higher startup (inrush) current than running current - motors especially.",
      "Adding up nameplate ratings without considering actual simultaneous use - not everything runs at once.",
      "Ignoring the 80% rule - continuous loads should use only 80% of circuit capacity.",
      "Not accounting for 'hidden' loads on a circuit like bathroom exhaust fans or always-on devices.",
      "Using peak wattage instead of typical running wattage for calculations."
    ]
  };

  const addAppliance = () => {
    const newId = Math.max(...appliances.map(a => a.id), 0) + 1;
    setAppliances([...appliances, { id: newId, name: '', watts: 0 }]);
  };

  const removeAppliance = (id: number) => {
    if (appliances.length > 1) {
      setAppliances(appliances.filter(a => a.id !== id));
    }
  };

  const updateAppliance = (id: number, field: 'name' | 'watts', value: string | number) => {
    setAppliances(appliances.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const selectPreset = (id: number, presetName: string) => {
    const preset = commonAppliances.find(p => p.name === presetName);
    if (preset && preset.watts > 0) {
      updateAppliance(id, 'name', preset.name);
      updateAppliance(id, 'watts', preset.watts);
    }
  };

  const calculateAmpDraw = () => {
    const volts = parseFloat(voltage);
    const totalWatts = appliances.reduce((sum, app) => sum + (Number(app.watts) || 0), 0);
    const totalAmps = totalWatts / volts;

    // NEC requires 125% of continuous load
    const requiredAmps = totalAmps * 1.25;

    // Standard breaker sizes
    const breakerSizes = [15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];
    const breakerSize = breakerSizes.find(size => size >= requiredAmps) || '200+';

    // Wire gauge recommendation
    let wireGauge = '14 AWG';
    const amps = typeof breakerSize === 'number' ? breakerSize : 200;

    if (amps <= 15) wireGauge = '14 AWG';
    else if (amps <= 20) wireGauge = '12 AWG';
    else if (amps <= 30) wireGauge = '10 AWG';
    else if (amps <= 40) wireGauge = '8 AWG';
    else if (amps <= 55) wireGauge = '6 AWG';
    else if (amps <= 70) wireGauge = '4 AWG';
    else if (amps <= 85) wireGauge = '3 AWG';
    else if (amps <= 100) wireGauge = '2 AWG';
    else wireGauge = 'Consult electrician';

    setResult({ totalWatts, totalAmps, breakerSize, wireGauge });

    trackCalculatorUsage('Amp Draw Calculator', {
      voltage,
      totalWatts: totalWatts.toString(),
      totalAmps: totalAmps.toFixed(2),
      breakerSize: breakerSize.toString()
    });
  };

  return (
    <CalculatorLayout
      title="Amp Draw Calculator"
      description="Calculate total amperage for electrical circuits. Add up device loads to ensure your circuit can safely handle all connected equipment."
    >
      <CalculatorSchema
        name="Amp Draw Calculator"
        description="Free amp draw calculator to compute total circuit amperage. Add up device wattages to ensure circuits aren't overloaded and size circuits properly."
        url="/calculators/amp-draw"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateAmpDraw(); }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Voltage</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${voltage === '120' ? styles.buttonOptionActive : ''}`}
              onClick={() => setVoltage('120')}
            >
              120V (Standard)
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${voltage === '240' ? styles.buttonOptionActive : ''}`}
              onClick={() => setVoltage('240')}
            >
              240V (Heavy Duty)
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Appliances/Devices</label>

          {appliances.map((appliance, index) => (
            <div key={appliance.id} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Device {index + 1}</span>
                {appliances.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAppliance(appliance.id)}
                    style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <select
                className={styles.select}
                style={{ marginBottom: '0.5rem' }}
                onChange={(e) => selectPreset(appliance.id, e.target.value)}
                value=""
              >
                {commonAppliances.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className={styles.input}
                style={{ marginBottom: '0.5rem' }}
                placeholder="Device name (optional)"
                value={appliance.name}
                onChange={(e) => updateAppliance(appliance.id, 'name', e.target.value)}
              />

              <input
                type="number"
                className={styles.input}
                placeholder="Wattage"
                value={appliance.watts || ''}
                onChange={(e) => updateAppliance(appliance.id, 'watts', parseFloat(e.target.value) || 0)}
                step="1"
                min="0"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addAppliance}
            className={styles.button}
            style={{ backgroundColor: '#333', marginTop: '0.5rem' }}
          >
            + Add Another Device
          </button>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Amp Draw
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Watts</span>
            <span className={styles.resultValue}>{result.totalWatts.toFixed(0)} W</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Amp Draw</span>
            <span className={styles.resultValuePrimary}>{result.totalAmps.toFixed(2)} A</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Breaker Size</span>
            <span className={styles.resultValue}>{result.breakerSize} A</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Minimum Wire Gauge</span>
            <span className={styles.resultValue}>{result.wireGauge}</span>
          </div>

          <div className={styles.note}>
            <strong>NEC Compliance:</strong> This calculation applies a 125% safety factor for continuous loads as required by the National Electrical Code (NEC Article 210.20). The recommended breaker size and wire gauge meet NEC standards for safe operation.
          </div>

          {result.totalAmps > 80 && (
            <div className={styles.warning}>
              <strong>Safety Warning:</strong> This is a high-amperage load. Installation must be performed by a licensed electrician and inspected according to local codes.
            </div>
          )}

          {result.totalAmps < 5 && (
            <div className={styles.note}>
              <strong>Low Load:</strong> This is a very light load. A standard 15A circuit will easily handle this draw with significant capacity to spare.
            </div>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('electrical', 3)}
        calculatorName="Amp Draw Calculator"
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
