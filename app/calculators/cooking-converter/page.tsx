'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import styles from '@/styles/Calculator.module.css';

type ConversionType = 'volume' | 'weight' | 'temperature';

export default function CookingConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>('volume');
  const [amount, setAmount] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('cup');
  const [toUnit, setToUnit] = useState<string>('tablespoon');
  const [ingredient, setIngredient] = useState<string>('water');
  const [result, setResult] = useState<number | null>(null);

  const volumeToMl: { [key: string]: number } = {
    'teaspoon': 4.92892,
    'tablespoon': 14.7868,
    'fluid ounce': 29.5735,
    'cup': 236.588,
    'pint': 473.176,
    'quart': 946.353,
    'milliliter': 1,
    'liter': 1000
  };

  const weightToGrams: { [key: string]: number } = {
    'ounce': 28.3495,
    'pound': 453.592,
    'gram': 1,
    'kilogram': 1000
  };

  const ingredientDensities: { [key: string]: number } = {
    'all-purpose flour': 120,
    'sugar (granulated)': 200,
    'brown sugar (packed)': 220,
    'butter': 227,
    'water': 236,
    'milk': 244,
    'oil': 218,
    'honey': 340,
    'cocoa powder': 118,
    'powdered sugar': 120,
    'rice (uncooked)': 185,
    'salt': 292,
    'baking powder': 192,
    'baking soda': 220
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;
    if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9;
    else celsius = value;

    if (to === 'Fahrenheit') return (celsius * 9 / 5) + 32;
    return celsius;
  };

  const convertVolume = (value: number, from: string, to: string): number => {
    const ml = value * volumeToMl[from];
    return ml / volumeToMl[to];
  };

  const convertWeight = (value: number, from: string, to: string): number => {
    const grams = value * weightToGrams[from];
    return grams / weightToGrams[to];
  };

  useEffect(() => {
    if (conversionType === 'volume') {
      setFromUnit('cup');
      setToUnit('tablespoon');
    } else if (conversionType === 'weight') {
      setFromUnit('ounce');
      setToUnit('gram');
    } else if (conversionType === 'temperature') {
      setFromUnit('Fahrenheit');
      setToUnit('Celsius');
    }
    setAmount('');
    setResult(null);
  }, [conversionType]);

  useEffect(() => {
    if (amount) {
      const value = parseFloat(amount);
      if (!isNaN(value)) {
        let converted: number;
        if (conversionType === 'volume') {
          converted = convertVolume(value, fromUnit, toUnit);
        } else if (conversionType === 'weight') {
          converted = convertWeight(value, fromUnit, toUnit);
        } else {
          converted = convertTemperature(value, fromUnit, toUnit);
        }
        setResult(converted);
      }
    } else {
      setResult(null);
    }
  }, [amount, fromUnit, toUnit, conversionType]);

  const getCommonEquivalents = (): string[] => {
    if (conversionType === 'volume') {
      return [
        '1 cup = 16 tablespoons',
        '1 tablespoon = 3 teaspoons',
        '1 cup = 8 fluid ounces',
        '4 cups = 1 quart',
        '2 cups = 1 pint'
      ];
    } else if (conversionType === 'weight') {
      return [
        '1 pound = 16 ounces',
        '1 kilogram = 1000 grams',
        '1 ounce ≈ 28.35 grams',
        '1 pound ≈ 453.6 grams'
      ];
    } else {
      return [
        'Water boils: 212°F = 100°C',
        'Water freezes: 32°F = 0°C',
        'Room temperature: 68°F ≈ 20°C',
        'Baking: 350°F ≈ 177°C'
      ];
    }
  };

  const faqItems = [
    {
      question: "How do I convert between cups and grams?",
      answer: "The conversion between volume (cups) and weight (grams) depends on the ingredient's density. For example, 1 cup of all-purpose flour is about 120g, while 1 cup of sugar is about 200g. Our calculator includes common ingredient densities for accurate conversions."
    },
    {
      question: "Are US cups the same as metric cups?",
      answer: "No, they differ slightly. A US cup is 236.588ml, while a metric cup (used in Australia and New Zealand) is 250ml. Most recipes specify which measurement system they use. This calculator uses US measurements unless noted otherwise."
    },
    {
      question: "What's the difference between a fluid ounce and an ounce?",
      answer: "A fluid ounce measures volume (how much space something takes up), while an ounce measures weight (how heavy something is). 8 fluid ounces of water weighs approximately 8 ounces, but this isn't true for all ingredients due to different densities."
    },
    {
      question: "How do I convert oven temperatures between Fahrenheit and Celsius?",
      answer: "Use the formula: °C = (°F - 32) × 5/9, or °F = (°C × 9/5) + 32. Common baking temperatures: 350°F = 177°C, 375°F = 191°C, 400°F = 204°C. Our temperature converter handles this automatically."
    }
  ];

  const relatedCalculators = [
    {
      title: "Unit Converter",
      link: "/calculators/unit-converter",
      description: "Convert between various units of measurement"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percentage changes"
    },
    {
      title: "Discount Calculator",
      link: "/calculators/discount",
      description: "Calculate sale prices and savings"
    }
  ];

  return (
    <CalculatorLayout
      title="Cooking Measurement Converter"
      description="Convert cooking measurements easily. Convert between cups, tablespoons, grams, ounces, and temperature scales for perfect recipes."
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Conversion Type</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${conversionType === 'volume' ? styles.buttonOptionActive : ''}`}
              onClick={() => setConversionType('volume')}
            >
              Volume
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${conversionType === 'weight' ? styles.buttonOptionActive : ''}`}
              onClick={() => setConversionType('weight')}
            >
              Weight
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${conversionType === 'temperature' ? styles.buttonOptionActive : ''}`}
              onClick={() => setConversionType('temperature')}
            >
              Temperature
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="amount" className={styles.label}>
            Amount
          </label>
          <input
            id="amount"
            type="number"
            className={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            step="any"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fromUnit" className={styles.label}>
            From
          </label>
          <select
            id="fromUnit"
            className={styles.select}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {conversionType === 'volume' && Object.keys(volumeToMl).map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
            {conversionType === 'weight' && Object.keys(weightToGrams).map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
            {conversionType === 'temperature' && (
              <>
                <option value="Fahrenheit">Fahrenheit</option>
                <option value="Celsius">Celsius</option>
              </>
            )}
          </select>
        </div>

        <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
          <button
            type="button"
            onClick={() => {
              const temp = fromUnit;
              setFromUnit(toUnit);
              setToUnit(temp);
            }}
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
            {conversionType === 'volume' && Object.keys(volumeToMl).map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
            {conversionType === 'weight' && Object.keys(weightToGrams).map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
            {conversionType === 'temperature' && (
              <>
                <option value="Fahrenheit">Fahrenheit</option>
                <option value="Celsius">Celsius</option>
              </>
            )}
          </select>
        </div>
      </div>

      {result !== null && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Result</span>
            <span className={styles.resultValuePrimary}>
              {result.toFixed(2)} {toUnit}
            </span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Conversion</span>
            <span className={styles.resultValue}>
              {amount} {fromUnit} = {result.toFixed(2)} {toUnit}
            </span>
          </div>
        </div>
      )}

      <div className={styles.note}>
        <strong>Common Equivalents:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          {getCommonEquivalents().map((equiv, index) => (
            <li key={index} style={{ marginBottom: '0.25rem' }}>{equiv}</li>
          ))}
        </ul>
      </div>


      <ProductRecommendation
        products={getProducts('general-tools', 3)}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
