'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import styles from '@/styles/Calculator.module.css';

type Category = 'length' | 'weight' | 'volume' | 'temperature' | 'area';

interface ConversionRates {
  [key: string]: { [key: string]: number };
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [fromValue, setFromValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('meters');
  const [toUnit, setToUnit] = useState<string>('feet');
  const [result, setResult] = useState<number | null>(null);

  const lengthToMeters: { [key: string]: number } = {
    'inches': 0.0254,
    'feet': 0.3048,
    'yards': 0.9144,
    'miles': 1609.344,
    'millimeters': 0.001,
    'centimeters': 0.01,
    'meters': 1,
    'kilometers': 1000
  };

  const weightToKg: { [key: string]: number } = {
    'ounces': 0.0283495,
    'pounds': 0.453592,
    'tons': 907.185,
    'grams': 0.001,
    'kilograms': 1,
    'metric tons': 1000
  };

  const volumeToLiters: { [key: string]: number } = {
    'teaspoons': 0.00492892,
    'tablespoons': 0.0147868,
    'cups': 0.236588,
    'pints': 0.473176,
    'quarts': 0.946353,
    'gallons': 3.78541,
    'milliliters': 0.001,
    'liters': 1
  };

  const areaToSqMeters: { [key: string]: number } = {
    'square feet': 0.092903,
    'square yards': 0.836127,
    'acres': 4046.86,
    'square meters': 1,
    'hectares': 10000
  };

  const units: { [key in Category]: string[] } = {
    length: Object.keys(lengthToMeters),
    weight: Object.keys(weightToKg),
    volume: Object.keys(volumeToLiters),
    temperature: ['Fahrenheit', 'Celsius', 'Kelvin'],
    area: Object.keys(areaToSqMeters)
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;
    if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9;
    else if (from === 'Celsius') celsius = value;
    else celsius = value - 273.15; // Kelvin

    if (to === 'Fahrenheit') return (celsius * 9 / 5) + 32;
    if (to === 'Celsius') return celsius;
    return celsius + 273.15; // Kelvin
  };

  const convert = (value: number, from: string, to: string): number => {
    if (category === 'temperature') {
      return convertTemperature(value, from, to);
    }

    let conversionRates: { [key: string]: number } = {};
    if (category === 'length') conversionRates = lengthToMeters;
    else if (category === 'weight') conversionRates = weightToKg;
    else if (category === 'volume') conversionRates = volumeToLiters;
    else if (category === 'area') conversionRates = areaToSqMeters;

    const baseValue = value * conversionRates[from];
    return baseValue / conversionRates[to];
  };

  useEffect(() => {
    if (fromValue) {
      const value = parseFloat(fromValue);
      if (!isNaN(value)) {
        const converted = convert(value, fromUnit, toUnit);
        setResult(converted);
      }
    } else {
      setResult(null);
    }
  }, [fromValue, fromUnit, toUnit, category]);

  useEffect(() => {
    setFromUnit(units[category][0]);
    setToUnit(units[category][1] || units[category][0]);
    setFromValue('');
    setResult(null);
  }, [category]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result !== null && fromValue) {
      setFromValue(result.toString());
    }
  };

  const faqItems = [
    {
      question: "How accurate are these unit conversions?",
      answer: "Our conversions use standard conversion factors recognized by international measurement standards. Results are calculated to high precision and rounded appropriately for display."
    },
    {
      question: "What's the difference between imperial and metric units?",
      answer: "Imperial units (feet, pounds, gallons) are primarily used in the United States, while metric units (meters, kilograms, liters) are used worldwide and in scientific contexts. Metric is based on powers of 10, making conversions easier."
    },
    {
      question: "How do I convert temperature between Fahrenheit and Celsius?",
      answer: "To convert Fahrenheit to Celsius: subtract 32, then multiply by 5/9. To convert Celsius to Fahrenheit: multiply by 9/5, then add 32. Our calculator does this automatically."
    },
    {
      question: "Can I convert between different types of measurements?",
      answer: "No, you can only convert within the same category (e.g., length to length, weight to weight). Different types of measurements represent fundamentally different physical quantities."
    }
  ];

  const relatedCalculators = [
    {
      title: "Cooking Converter",
      link: "/calculators/cooking-converter",
      description: "Convert cooking measurements and ingredients"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percentage changes"
    },
    {
      title: "Date Calculator",
      link: "/calculators/date-calculator",
      description: "Calculate days between dates and date math"
    }
  ];

  return (
    <CalculatorLayout
      title="Unit Converter"
      description="Convert between common units of measurement including length, weight, volume, temperature, and area."
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <select
            id="category"
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="length">Length</option>
            <option value="weight">Weight</option>
            <option value="volume">Volume</option>
            <option value="temperature">Temperature</option>
            <option value="area">Area</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fromValue" className={styles.label}>
            From
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="fromValue"
              type="number"
              className={styles.input}
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="Enter value"
              step="any"
              style={{ flex: 1 }}
            />
            <select
              className={styles.select}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              style={{ flex: 1 }}
            >
              {units[category].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
          <button
            type="button"
            onClick={handleSwap}
            className={styles.buttonOption}
            style={{ padding: '0.5rem 1rem' }}
          >
            ⇅ Swap
          </button>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="toUnit" className={styles.label}>
            To
          </label>
          <select
            id="toUnit"
            className={styles.select}
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {units[category].map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result !== null && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Result</span>
            <span className={styles.resultValuePrimary}>
              {result.toFixed(6).replace(/\.?0+$/, '')} {toUnit}
            </span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Conversion</span>
            <span className={styles.resultValue}>
              {fromValue} {fromUnit} = {result.toFixed(6).replace(/\.?0+$/, '')} {toUnit}
            </span>
          </div>
        </div>
      )}

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
