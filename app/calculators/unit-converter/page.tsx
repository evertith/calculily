'use client';

import { useState, useEffect } from 'react';
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
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

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

        // Track calculator usage
        trackCalculatorUsage('Unit Converter', {
          category: category,
          from_unit: fromUnit,
          to_unit: toUnit,
          from_value: value
        });
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

  const contentData = {
    howToUse: {
      intro: "Need to convert between metric and imperial units or any other measurement? Our universal converter handles all common conversions:",
      steps: [
        "Select the category of units you need to convert (length, weight, volume, temperature, or area).",
        "Choose the unit you're converting FROM in the first dropdown.",
        "Choose the unit you're converting TO in the second dropdown.",
        "Enter the value you want to convert.",
        "See your converted result instantly - no need to click a button."
      ]
    },
    whyMatters: {
      description: "In our global world, unit conversions come up constantly - whether you're following a recipe from another country, understanding product specifications, or working on international projects. The United States is one of only three countries that hasn't officially adopted the metric system, making conversions essential for travel, cooking, DIY projects, and professional work. Having a reliable converter saves time and prevents costly mistakes.",
      benefits: [
        "Convert between metric and imperial units accurately for recipes",
        "Understand international product specifications and dimensions",
        "Convert measurements for home improvement projects",
        "Verify calculations when working with international colleagues",
        "Convert temperatures for weather, cooking, and scientific applications"
      ]
    },
    examples: [
      {
        title: "Cooking Conversion",
        scenario: "A British recipe calls for 200 grams of flour. How many cups is that?",
        calculation: "200 grams ÷ ~125 grams per cup",
        result: "Approximately 1.6 cups of flour"
      },
      {
        title: "Travel Distances",
        scenario: "A road sign in Canada shows 150 km to Toronto. How many miles?",
        calculation: "150 km × 0.621371",
        result: "93.2 miles to Toronto"
      },
      {
        title: "Temperature Conversion",
        scenario: "The weather forecast shows 28°C. What's that in Fahrenheit?",
        calculation: "(28 × 9/5) + 32",
        result: "82.4°F - a warm day!"
      }
    ],
    commonMistakes: [
      "Confusing fluid ounces (volume) with ounces (weight) - they measure different things.",
      "Using cooking cup measurements interchangeably with metric - a US cup differs from UK/Australian cups.",
      "Forgetting that Celsius and Fahrenheit scales don't convert linearly - you can't just multiply by a single number.",
      "Mixing up miles and nautical miles - nautical miles are about 15% longer.",
      "Not accounting for the difference between short tons (US) and metric tonnes - they differ by about 10%."
    ]
  };

  const relatedCalculators = [
    {
      title: "Cooking Converter",
      link: "/calculators/cooking-converter",
      description: "Convert cooking measurements between cups, tablespoons, and more"
    },
    {
      title: "Time Zone Converter",
      link: "/calculators/time-zone-converter",
      description: "Convert times between any world time zones"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percent changes"
    }
  ];

  return (
    <CalculatorLayout
      title="Unit Converter"
      description="Convert between any units of length, weight, volume, temperature, and area. Supports metric, imperial, and many other measurement systems."
    >
      <CalculatorSchema
        name="Unit Converter"
        description="Free universal unit converter for length, weight, volume, temperature, and area. Convert between metric, imperial, and other measurement systems."
        url="/calculators/unit-converter"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

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

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Unit Converter"
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
