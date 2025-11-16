'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(18);
  const [customTip, setCustomTip] = useState<string>('');
  const [numPeople, setNumPeople] = useState<string>('1');
  const [result, setResult] = useState<{
    tipAmount: number;
    totalAmount: number;
    perPerson: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const faqItems = [
    {
      question: "What is the standard tip percentage?",
      answer: "In the United States, 15-20% is standard for table service at restaurants. 18% is a good baseline for good service, 20% or more for excellent service, and 15% for acceptable service. For counter service or takeout, 10% or a few dollars is appreciated but not mandatory. Delivery services typically warrant 15-20% with a $3-5 minimum."
    },
    {
      question: "Should I tip on the pre-tax or post-tax amount?",
      answer: "There's no strict rule, but most people calculate tips on the pre-tax amount. However, the difference is usually small (under $1 on a $50 bill), so tipping on the post-tax total is also common and acceptable. Choose whichever is easier to calculate or feels right to you."
    },
    {
      question: "How do I split the bill fairly when people ordered different amounts?",
      answer: "The simplest approach is splitting evenly if orders were roughly similar. For very different orders, you can either: 1) Ask for separate checks upfront, 2) Each person calculates their portion plus their share of tax and tip, or 3) Use a bill-splitting app that lets you assign items to individuals. This calculator helps once you know each person's share."
    },
    {
      question: "Should I tip on discounted or comped items?",
      answer: "Yes, you should tip on the original price before discounts or coupons. Your server did the same amount of work regardless of your discount. If your meal was completely comped, tipping 20% of what the bill would have been is good etiquette. Remember, the server's effort was the same."
    }
  ];

  const relatedCalculators = [
    {
      title: "Fuel Cost Calculator",
      link: "/calculators/fuel-cost",
      description: "Calculate fuel costs for trips and travel"
    },
    {
      title: "Loan Calculator",
      link: "/calculators/loan",
      description: "Calculate loan payments and total interest"
    },
    {
      title: "Mortgage Calculator",
      link: "/calculators/mortgage",
      description: "Estimate your monthly mortgage payments"
    }
  ];

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const people = parseInt(numPeople);
    const tip = customTip ? parseFloat(customTip) : tipPercentage;

    if (!bill || !people || !tip) return;

    const tipAmount = bill * (tip / 100);
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / people;

    setResult({ tipAmount, totalAmount, perPerson });

    // Track calculator usage
    trackCalculatorUsage('Tip Calculator', {
      bill_amount: bill,
      tip_percentage: tip,
      num_people: people
    });
  };

  const handleTipButtonClick = (percentage: number) => {
    setTipPercentage(percentage);
    setCustomTip('');
  };

  return (
    <CalculatorLayout
      title="Tip Calculator"
      description="Calculate tips and split bills easily with your dining companions."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateTip(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="billAmount" className={styles.label}>
            Bill Amount ($)
          </label>
          <input
            id="billAmount"
            type="number"
            className={styles.input}
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="Enter bill amount"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tip Percentage</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${!customTip && tipPercentage === 15 ? styles.buttonOptionActive : ''}`}
              onClick={() => handleTipButtonClick(15)}
            >
              15%
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${!customTip && tipPercentage === 18 ? styles.buttonOptionActive : ''}`}
              onClick={() => handleTipButtonClick(18)}
            >
              18%
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${!customTip && tipPercentage === 20 ? styles.buttonOptionActive : ''}`}
              onClick={() => handleTipButtonClick(20)}
            >
              20%
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="customTip" className={styles.label}>
            Custom Tip (%)
          </label>
          <input
            id="customTip"
            type="number"
            className={styles.input}
            value={customTip}
            onChange={(e) => setCustomTip(e.target.value)}
            placeholder="Enter custom percentage"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="numPeople" className={styles.label}>
            Number of People
          </label>
          <input
            id="numPeople"
            type="number"
            className={styles.input}
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            placeholder="Number of people"
            step="1"
            min="1"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate Tip
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tip Amount</span>
            <span className={styles.resultValue}>${result.tipAmount.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total with Tip</span>
            <span className={styles.resultValuePrimary}>${result.totalAmount.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Amount per Person</span>
            <span className={styles.resultValue}>${result.perPerson.toFixed(2)}</span>
          </div>
        </div>
      )}

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Tip Calculator"
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
