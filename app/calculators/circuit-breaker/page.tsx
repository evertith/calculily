'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';
import type { Metadata } from 'next';

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
      title: "Amp Draw Calculator",
      link: "/calculators/amp-draw",
      description: "Calculate total amperage from multiple appliances"
    },
    {
      title: "Wire Gauge Calculator",
      link: "/calculators/wire-gauge",
      description: "Find the right wire size for distance and amperage"
    },
    {
      title: "Voltage Drop Calculator",
      link: "/calculators/voltage-drop",
      description: "Calculate voltage drop for your circuit"
    }
  ];

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
      description="Determine the correct circuit breaker size for your electrical load. NEC-compliant breaker sizing with wire gauge recommendations."
    >
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


      <ProductRecommendation
        products={getProducts('electrical', 3)}
        calculatorName="Circuit Breaker Calculator"
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
