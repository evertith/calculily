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

export default function CircuitBreakerCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [inputType, setInputType] = useState<'watts' | 'amps'>('watts');
  const [loadValue, setLoadValue] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('120');
  const [loadType, setLoadType] = useState<'continuous' | 'non-continuous'>('continuous');
  const [poles, setPoles] = useState<string>('1');
  const [result, setResult] = useState<{
    amps: number;
    breakerSize: number | string;
    wireGauge: string;
    maxLoad: number;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const faqItems = [
    {
      question: "What's the difference between continuous and non-continuous loads?",
      answer: "A continuous load operates for 3 hours or more continuously, such as HVAC systems, lighting, or servers. Non-continuous loads run for less than 3 hours, like power tools or appliances. The NEC requires breakers for continuous loads to be sized at 125% of the load, while non-continuous loads can use 100% sizing."
    },
    {
      question: "What are the standard circuit breaker sizes?",
      answer: "Standard residential breaker sizes are 15A, 20A, 30A, 40A, 50A, and 60A. Commercial applications also use 70A, 80A, 90A, 100A, and larger. Always size up to the next standard breaker size - you cannot use a breaker rated lower than what the calculation requires."
    },
    {
      question: "What's the difference between single-pole and double-pole breakers?",
      answer: "Single-pole breakers (120V) protect one hot wire and are used for standard outlets and lights. Double-pole breakers (240V) protect two hot wires and are required for high-power appliances like dryers, ranges, water heaters, and AC units. Double-pole breakers use two slots in your panel."
    },
    {
      question: "Why must wire gauge match the breaker size?",
      answer: "The wire must be able to safely carry the maximum current the breaker allows. Using wire that's too small creates a fire hazard - the breaker protects the wire, not the device. For example, 14 AWG wire is rated for 15A maximum, so it should never be used with a 20A breaker."
    }
  ];

  const relatedCalculators = [
    {
      title: "Wire Gauge Calculator",
      link: "/calculators/wire-gauge",
      description: "Calculate proper wire gauge for circuits"
    },
    {
      title: "Voltage Drop Calculator",
      link: "/calculators/voltage-drop",
      description: "Calculate voltage drop over distance"
    },
    {
      title: "Amp Draw Calculator",
      link: "/calculators/amp-draw",
      description: "Calculate total amperage for circuits"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Size your circuit breaker correctly for safety and code compliance:",
      steps: [
        "Determine the total wattage of devices that will be on this circuit.",
        "Enter the circuit voltage (120V for standard outlets, 240V for large appliances).",
        "Calculate or enter the expected amperage draw.",
        "Apply the 80% continuous load rule for circuits that run for 3+ hours.",
        "Click 'Calculate' to see the recommended breaker size."
      ]
    },
    whyMatters: {
      description: "Circuit breakers are your home's primary defense against electrical fires. An undersized breaker trips constantly, while an oversized breaker won't trip before wires overheat - a serious fire hazard. The NEC requires breakers to be sized correctly for the wire gauge used, and continuous loads (operating 3+ hours) must not exceed 80% of breaker capacity. Proper sizing ensures safety while avoiding nuisance trips.",
      benefits: [
        "Prevent electrical fires from overloaded circuits",
        "Avoid nuisance trips from undersized breakers",
        "Ensure code compliance for inspections and insurance",
        "Match breaker size to wire gauge for proper protection",
        "Account for continuous vs intermittent loads correctly"
      ]
    },
    examples: [
      {
        title: "Kitchen Small Appliance Circuit",
        scenario: "Two 20A kitchen countertop circuits required by code. Maximum expected load: 1,800W.",
        calculation: "1,800W ÷ 120V = 15A, but code requires 20A minimum for kitchen circuits",
        result: "Use 20A breaker with #12 AWG wire (code requirement for kitchen small appliance circuits)."
      },
      {
        title: "Electric Dryer",
        scenario: "Installing a 5,400W electric dryer on 240V.",
        calculation: "5,400W ÷ 240V = 22.5A | 22.5 × 125% (continuous) = 28.1A",
        result: "Use 30A breaker with #10 AWG wire (standard dryer circuit)."
      },
      {
        title: "Workshop Subpanel",
        scenario: "Planning loads: table saw (15A), dust collector (12A), lights (5A), outlets (10A).",
        calculation: "Max simultaneous: ~30A at 240V for subpanel feed",
        result: "60A subpanel provides headroom for expansion. Use 60A breaker with #6 AWG feeder."
      }
    ],
    commonMistakes: [
      "Oversizing breakers to stop tripping - this is extremely dangerous; find the actual problem instead.",
      "Forgetting the 80% rule for continuous loads - a 20A breaker should only carry 16A continuously.",
      "Not matching breaker size to wire gauge - the wire must be rated for the breaker, not the load.",
      "Using single-pole breakers for 240V circuits - large appliances need double-pole breakers.",
      "Ignoring NEC requirements for dedicated circuits - kitchens, bathrooms, and laundry have specific rules."
    ]
  };

  const calculateBreaker = () => {
    const volts = parseFloat(voltage);
    const load = parseFloat(loadValue);

    const newErrors: string[] = [];

    if (!loadValue || load <= 0) {
      newErrors.push("Please enter a valid load value");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    // Convert to amps if needed
    let amps = inputType === 'watts' ? load / volts : load;

    // Apply NEC safety factor
    const requiredAmps = loadType === 'continuous' ? amps * 1.25 : amps;

    // Standard breaker sizes
    const standardSizes = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];
    const breakerSize = standardSizes.find(size => size >= requiredAmps) || '200+';

    // Wire size based on breaker
    const wireGauges: { [key: number]: string } = {
      15: '14 AWG',
      20: '12 AWG',
      25: '10 AWG',
      30: '10 AWG',
      35: '8 AWG',
      40: '8 AWG',
      45: '6 AWG',
      50: '6 AWG',
      60: '6 AWG',
      70: '4 AWG',
      80: '4 AWG',
      90: '3 AWG',
      100: '3 AWG',
      110: '2 AWG',
      125: '1 AWG',
      150: '1/0 AWG',
      175: '2/0 AWG',
      200: '3/0 AWG'
    };

    const wireGauge = typeof breakerSize === 'number'
      ? (wireGauges[breakerSize] || 'Consult NEC Table 310.16')
      : 'Consult licensed electrician';

    // Maximum safe load for the breaker
    const maxLoad = typeof breakerSize === 'number'
      ? (loadType === 'continuous' ? breakerSize * 0.8 : breakerSize)
      : 200;

    setResult({ amps, breakerSize, wireGauge, maxLoad });

    trackCalculatorUsage('Circuit Breaker Calculator', {
      voltage,
      loadType,
      amps: amps.toFixed(2),
      breakerSize: breakerSize.toString()
    });
  };

  return (
    <CalculatorLayout
      title="Circuit Breaker Sizing Calculator"
      description="Calculate the correct circuit breaker size for your electrical load. Enter wattage or amperage to determine proper breaker sizing with NEC guidelines."
    >
      <CalculatorSchema
        name="Circuit Breaker Calculator"
        description="Free circuit breaker sizing calculator. Determine the correct breaker size based on load, voltage, and NEC requirements for safe electrical installations."
        url="/calculators/circuit-breaker"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateBreaker(); }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Input Type</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${inputType === 'watts' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputType('watts')}
            >
              Watts
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${inputType === 'amps' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputType('amps')}
            >
              Amps
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="loadValue" className={styles.label}>
            Load ({inputType === 'watts' ? 'Watts' : 'Amps'})
          </label>
          <input
            id="loadValue"
            type="number"
            className={styles.input}
            value={loadValue}
            onChange={(e) => setLoadValue(e.target.value)}
            placeholder={`Enter load in ${inputType === 'watts' ? 'watts' : 'amps'}`}
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
            <option value="120">120V (Standard outlets, lights)</option>
            <option value="240">240V (Large appliances, HVAC)</option>
            <option value="208">208V (Commercial 3-phase)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Load Type</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${loadType === 'continuous' ? styles.buttonOptionActive : ''}`}
              onClick={() => setLoadType('continuous')}
            >
              Continuous (3+ hrs)
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${loadType === 'non-continuous' ? styles.buttonOptionActive : ''}`}
              onClick={() => setLoadType('non-continuous')}
            >
              Non-Continuous
            </button>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
            Continuous loads require 125% safety factor per NEC 210.20
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="poles" className={styles.label}>
            Number of Poles
          </label>
          <select
            id="poles"
            className={styles.select}
            value={poles}
            onChange={(e) => setPoles(e.target.value)}
          >
            <option value="1">Single-pole (120V circuits)</option>
            <option value="2">Double-pole (240V circuits)</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Breaker Size
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
            <span className={styles.resultLabel}>Actual Load</span>
            <span className={styles.resultValue}>{result.amps.toFixed(2)} A</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Breaker Size</span>
            <span className={styles.resultValuePrimary}>{result.breakerSize} A</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Minimum Wire Gauge</span>
            <span className={styles.resultValue}>{result.wireGauge}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Maximum Safe Load</span>
            <span className={styles.resultValue}>{result.maxLoad.toFixed(1)} A</span>
          </div>

          <div className={styles.note}>
            <strong>NEC References:</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Article 210.20 - Breaker sizing for branch circuits</li>
              <li>Article 240.6 - Standard breaker ampere ratings</li>
              <li>Table 310.16 - Wire ampacity ratings</li>
              <li>Article 210.19(A) - Conductor sizing requirements</li>
            </ul>
          </div>

          {loadType === 'continuous' && (
            <div className={styles.note}>
              <strong>Continuous Load Note:</strong> This calculation includes the required 125% safety factor for continuous loads. The breaker must be rated to handle the increased amperage to prevent nuisance tripping and ensure safe operation.
            </div>
          )}

          {typeof result.breakerSize === 'number' && result.breakerSize >= 100 && (
            <div className={styles.warning}>
              <strong>High-Amperage Circuit:</strong> Circuits rated 100A and above require special installation considerations. This work must be performed by a licensed electrician and inspected by local authorities.
            </div>
          )}

          {poles === '2' && (
            <div className={styles.note}>
              <strong>Double-Pole Breaker:</strong> This requires a 240V double-pole breaker which occupies two slots in your electrical panel. Ensure both hot wires (typically black and red) are connected to the breaker.
            </div>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('electrical', 3)}
        calculatorName="Circuit Breaker Calculator"
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
