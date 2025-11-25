'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import AdUnit from '@/components/AdUnit';
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
      title: "Discount Calculator",
      link: "/calculators/discount",
      description: "Calculate sale prices and savings on purchases"
    },
    {
      title: "Sales Tax Calculator",
      link: "/calculators/sales-tax",
      description: "Calculate sales tax for any state or custom rate"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages, increases, and decreases"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculating the right tip is simple with our calculator. Here's how to get an accurate tip amount in seconds:",
      steps: [
        "Enter your total bill amount before tax (though calculating on the post-tax total is also acceptable and common).",
        "Select a preset tip percentage (15%, 18%, or 20%) or enter a custom percentage that matches the service level.",
        "If you're splitting the bill, enter the number of people in your party.",
        "Click 'Calculate Tip' to see the tip amount, total with tip, and each person's share."
      ]
    },
    whyMatters: {
      description: "Tipping is more than just a social custom in the United States - it's a significant part of how service industry workers earn their living. Many servers, bartenders, and delivery drivers earn a base wage below minimum wage, with the expectation that tips will make up the difference. Understanding appropriate tipping helps you show appreciation for good service while supporting workers who depend on gratuities.",
      benefits: [
        "Quickly calculate the exact tip amount without mental math errors",
        "Easily split bills among groups for fair, hassle-free payments",
        "Ensure you're tipping appropriately for the level of service received",
        "Avoid awkward moments of under-tipping or over-calculating at the table"
      ]
    },
    examples: [
      {
        title: "Dinner for Two",
        scenario: "You and a friend have dinner with a $75 bill before tax. The service was excellent, so you want to tip 20%.",
        calculation: "$75 × 20% = $75 × 0.20 = $15 tip",
        result: "Total: $90.00 | Per person: $45.00"
      },
      {
        title: "Group Lunch",
        scenario: "A work lunch for 5 people comes to $125. You decide on a standard 18% tip and want to split evenly.",
        calculation: "$125 × 18% = $22.50 tip | Total: $147.50",
        result: "Per person: $29.50"
      },
      {
        title: "Quick Service",
        scenario: "You grab a $12 coffee and pastry at a counter-service cafe. You want to leave a 15% tip.",
        calculation: "$12 × 15% = $1.80 tip",
        result: "Total: $13.80"
      }
    ],
    commonMistakes: [
      "Forgetting to account for tax when tipping - while optional, many people tip on the pre-tax amount to avoid inflating the tip.",
      "Not adjusting tip percentage based on service quality - 15% is for adequate service, 18-20% for good service, and 20%+ for exceptional service.",
      "Splitting tips unevenly when someone had a much cheaper meal - consider calculating individual tips for fairness in mixed-order groups.",
      "Forgetting to tip on delivery orders - delivery drivers rely on tips just like restaurant servers, typically 15-20% or $3-5 minimum.",
      "Not tipping on discounted or comped items - tip should be calculated on what the meal would have cost at full price."
    ]
  };

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
      description="Calculate tips and split bills easily with your dining companions. Enter your bill amount, choose a tip percentage, and instantly see the total with per-person amounts for group dining."
    >
      <CalculatorSchema
        name="Tip Calculator"
        description="Free online tip calculator to calculate restaurant tips and split bills. Enter bill amount, tip percentage, and number of people for instant calculations."
        url="/calculators/tip"
        faqItems={faqItems}
      />
      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

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

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Tip Calculator"
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
