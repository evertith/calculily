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

type CalculationType = 'percentOf' | 'whatPercent' | 'percentIncrease' | 'percentDecrease';

export default function PercentageCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('percentOf');
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const percentOf = (percent: number, number: number): number => {
    return (percent / 100) * number;
  };

  const whatPercent = (part: number, whole: number): number => {
    return (part / whole) * 100;
  };

  const percentIncrease = (original: number, newValue: number): number => {
    return ((newValue - original) / original) * 100;
  };

  const percentDecrease = (original: number, newValue: number): number => {
    return ((original - newValue) / original) * 100;
  };

  useEffect(() => {
    if (input1 && input2) {
      const val1 = parseFloat(input1);
      const val2 = parseFloat(input2);

      if (!isNaN(val1) && !isNaN(val2)) {
        let calculated: number;
        switch (calculationType) {
          case 'percentOf':
            calculated = percentOf(val1, val2);
            break;
          case 'whatPercent':
            calculated = whatPercent(val1, val2);
            break;
          case 'percentIncrease':
            calculated = percentIncrease(val1, val2);
            break;
          case 'percentDecrease':
            calculated = percentDecrease(val1, val2);
            break;
        }
        setResult(calculated);

        // Track calculator usage
        trackCalculatorUsage('Percentage Calculator', {
          calculation_type: calculationType,
          input1: val1,
          input2: val2,
          result: calculated
        });
      }
    } else {
      setResult(null);
    }
  }, [input1, input2, calculationType]);

  const getLabels = () => {
    switch (calculationType) {
      case 'percentOf':
        return { label1: 'Percentage (%)', label2: 'Number', resultText: 'Result' };
      case 'whatPercent':
        return { label1: 'Part', label2: 'Whole', resultText: 'Percentage' };
      case 'percentIncrease':
        return { label1: 'Original Value', label2: 'New Value', resultText: 'Percentage Increase' };
      case 'percentDecrease':
        return { label1: 'Original Value', label2: 'New Value', resultText: 'Percentage Decrease' };
    }
  };

  const getFormula = () => {
    switch (calculationType) {
      case 'percentOf':
        return `${input1}% of ${input2} = ${result?.toFixed(2)}`;
      case 'whatPercent':
        return `${input1} is ${result?.toFixed(2)}% of ${input2}`;
      case 'percentIncrease':
        return `${result?.toFixed(2)}% increase from ${input1} to ${input2}`;
      case 'percentDecrease':
        return `${result?.toFixed(2)}% decrease from ${input1} to ${input2}`;
    }
  };

  const labels = getLabels();

  const faqItems = [
    {
      question: "How do I calculate what percentage one number is of another?",
      answer: "Divide the part by the whole and multiply by 100. For example, to find what percentage 25 is of 200: (25 ÷ 200) × 100 = 12.5%. Use the 'X is what % of Y?' calculator type."
    },
    {
      question: "What's the difference between percentage increase and decrease?",
      answer: "Percentage increase shows how much a value has grown, while percentage decrease shows how much it has shrunk. Both are calculated relative to the original value. A 50% increase from 100 is 150, while a 50% decrease from 100 is 50."
    },
    {
      question: "Can a percentage increase be more than 100%?",
      answer: "Yes! A percentage increase over 100% means the new value is more than double the original. For example, going from 10 to 25 is a 150% increase. There's no upper limit to percentage increases."
    },
    {
      question: "How do I calculate a discount percentage?",
      answer: "Use the percentage decrease calculator. Enter the original price and the sale price to find the discount percentage. For example, if an item was $100 and is now $75, that's a 25% discount."
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Percentages come up everywhere - discounts, tips, grades, statistics. Our calculator handles all the common percentage calculations:",
      steps: [
        "Choose your calculation type from the options provided.",
        "For 'What is X% of Y': Enter the percentage and the number to calculate the portion (e.g., What is 15% of 200?).",
        "For 'X is what % of Y': Enter both numbers to find the percentage relationship (e.g., 30 is what % of 150?).",
        "For percentage increase/decrease: Enter the original and new values to find the percent change.",
        "Click 'Calculate' to see your result instantly."
      ]
    },
    whyMatters: {
      description: "Percentages are fundamental to everyday decision-making, from understanding sale prices to analyzing data at work. Whether you're calculating a discount, figuring out a tip, determining grade scores, or analyzing business metrics, percentage calculations help you make sense of proportions and changes. A solid grasp of percentages helps you spot deals, understand statistics in the news, and make better financial decisions.",
      benefits: [
        "Quickly verify discounts and sale prices while shopping",
        "Calculate grades and scores for school or work assessments",
        "Understand statistical data and research findings",
        "Compare proportional changes across different scenarios",
        "Make informed financial decisions about raises, investments, and expenses"
      ]
    },
    examples: [
      {
        title: "Sale Discount",
        scenario: "A $80 shirt is 25% off. What's the discount amount and final price?",
        calculation: "25% of $80 = 0.25 × $80 = $20 discount",
        result: "You save $20. Final price: $60"
      },
      {
        title: "Grade Calculation",
        scenario: "You scored 42 out of 50 on a test. What's your percentage?",
        calculation: "(42 ÷ 50) × 100 = 84%",
        result: "Your score is 84%"
      },
      {
        title: "Salary Increase",
        scenario: "Your salary went from $52,000 to $56,000. What percent raise is that?",
        calculation: "((56,000 - 52,000) ÷ 52,000) × 100 = 7.69%",
        result: "You received a 7.69% raise"
      }
    ],
    commonMistakes: [
      "Confusing percentage points with percent - a rate going from 5% to 7% is a 2 percentage point increase but a 40% relative increase.",
      "Forgetting that percentage increase and decrease aren't reversible - a 50% increase followed by 50% decrease doesn't return to the original.",
      "Calculating percent change using the new value instead of the original - always divide by the starting value.",
      "Mixing up 'of' and 'off' - 20% of $100 is $20, but 20% off $100 means you pay $80.",
      "Not converting percentages to decimals for calculations - 15% = 0.15 when multiplying."
    ]
  };

  const relatedCalculators = [
    {
      title: "Discount Calculator",
      link: "/calculators/discount",
      description: "Calculate sale prices with single or multiple discounts"
    },
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips and split bills for dining"
    },
    {
      title: "GPA Calculator",
      link: "/calculators/gpa-calculator",
      description: "Calculate your grade point average"
    }
  ];

  return (
    <CalculatorLayout
      title="Percentage Calculator"
      description="Calculate percentages easily - find what percent one number is of another, calculate percentage of a number, or determine percentage increase and decrease."
    >
      <CalculatorSchema
        name="Percentage Calculator"
        description="Free percentage calculator for all common calculations. Find percentages, calculate percent of numbers, and determine percentage increase or decrease."
        url="/calculators/percentage"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Calculation Type</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'percentOf' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('percentOf')}
            >
              X% of Y
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'whatPercent' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('whatPercent')}
            >
              X is what % of Y?
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'percentIncrease' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('percentIncrease')}
            >
              % Increase
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'percentDecrease' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('percentDecrease')}
            >
              % Decrease
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="input1" className={styles.label}>
            {labels.label1}
          </label>
          <input
            id="input1"
            type="number"
            className={styles.input}
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            placeholder={`Enter ${labels.label1.toLowerCase()}`}
            step="any"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="input2" className={styles.label}>
            {labels.label2}
          </label>
          <input
            id="input2"
            type="number"
            className={styles.input}
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            placeholder={`Enter ${labels.label2.toLowerCase()}`}
            step="any"
          />
        </div>
      </div>

      {result !== null && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>{labels.resultText}</span>
            <span className={styles.resultValuePrimary}>
              {calculationType === 'percentOf'
                ? result.toFixed(2)
                : `${result.toFixed(2)}%`
              }
            </span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Formula</span>
            <span className={styles.resultValue}>{getFormula()}</span>
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Percentage Calculator"
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
