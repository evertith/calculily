'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

export default function SalesTaxCalculator() {
  const [price, setPrice] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('Custom');
  const [priceIncludesTax, setPriceIncludesTax] = useState<boolean>(false);
  const [result, setResult] = useState<{
    price: number;
    taxAmount: number;
    total: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const stateTaxRates: { [key: string]: number } = {
    'California': 7.25,
    'Texas': 6.25,
    'Florida': 6.0,
    'New York': 4.0,
    'Illinois': 6.25,
    'Pennsylvania': 6.0,
    'Ohio': 5.75,
    'Georgia': 4.0,
    'North Carolina': 4.75,
    'Michigan': 6.0,
    'New Jersey': 6.625,
    'Virginia': 5.3,
    'Washington': 6.5,
    'Arizona': 5.6,
    'Massachusetts': 6.25,
    'Tennessee': 7.0,
    'Indiana': 7.0,
    'Maryland': 6.0,
    'Missouri': 4.225,
    'Wisconsin': 5.0,
    'Colorado': 2.9,
    'Minnesota': 6.875,
    'South Carolina': 6.0,
    'Alabama': 4.0,
    'Louisiana': 4.45,
    'Kentucky': 6.0,
    'Oregon': 0.0,
    'Oklahoma': 4.5,
    'Connecticut': 6.35,
    'Utah': 6.1,
    'Custom': 0
  };

  const calculateTax = (price: number, taxRate: number) => {
    const taxAmount = price * (taxRate / 100);
    const total = price + taxAmount;
    return { price, taxAmount, total };
  };

  const priceBeforeTax = (totalWithTax: number, taxRate: number) => {
    const price = totalWithTax / (1 + taxRate / 100);
    const taxAmount = totalWithTax - price;
    return { price, taxAmount, total: totalWithTax };
  };

  useEffect(() => {
    if (selectedState !== 'Custom') {
      setTaxRate(stateTaxRates[selectedState].toString());
    }
  }, [selectedState]);

  useEffect(() => {
    if (price && taxRate) {
      const priceNum = parseFloat(price);
      const rateNum = parseFloat(taxRate);

      if (!isNaN(priceNum) && !isNaN(rateNum) && priceNum >= 0 && rateNum >= 0) {
        let resultData;
        if (priceIncludesTax) {
          resultData = priceBeforeTax(priceNum, rateNum);
        } else {
          resultData = calculateTax(priceNum, rateNum);
        }
        setResult(resultData);

        // Track calculator usage
        trackCalculatorUsage('Sales Tax Calculator', {
          price: priceNum,
          tax_rate: rateNum,
          price_includes_tax: priceIncludesTax,
          selected_state: selectedState
        });
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [price, taxRate, priceIncludesTax]);

  const faqItems = [
    {
      question: "What is sales tax and how is it calculated?",
      answer: "Sales tax is a percentage of the purchase price added at the point of sale. It's calculated by multiplying the item price by the tax rate. For example, a $100 item with 6% sales tax would have $6 in tax, totaling $106."
    },
    {
      question: "Do all states have the same sales tax rate?",
      answer: "No, sales tax rates vary by state and even by city or county within a state. Some states like Oregon have no sales tax, while others like California have rates over 7%. Local jurisdictions often add additional taxes on top of the state rate."
    },
    {
      question: "What does 'price includes tax' mean?",
      answer: "When a price includes tax, the displayed amount already has sales tax added. This calculator can work backwards to show you the pre-tax price and how much of the total is tax. This is common in some countries but rare in the US."
    },
    {
      question: "Are online purchases subject to sales tax?",
      answer: "Generally yes, especially since the 2018 Supreme Court decision in South Dakota v. Wayfair. Most online retailers now collect sales tax based on the buyer's location. The rate depends on where the item is shipped, not where the seller is located."
    }
  ];

  const relatedCalculators = [
    {
      title: "Discount Calculator",
      link: "/calculators/discount",
      description: "Calculate sale prices and savings from discounts"
    },
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips and split bills easily"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percentage changes"
    }
  ];

  return (
    <CalculatorLayout
      title="Sales Tax Calculator"
      description="Calculate sales tax by state or custom rate. Find total price including tax or determine price before tax."
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="state" className={styles.label}>
            Select State (or Custom)
          </label>
          <select
            id="state"
            className={styles.select}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {Object.keys(stateTaxRates).sort().map((state) => (
              <option key={state} value={state}>
                {state} {state !== 'Custom' ? `(${stateTaxRates[state]}%)` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="taxRate" className={styles.label}>
            Tax Rate (%)
          </label>
          <input
            id="taxRate"
            type="number"
            className={styles.input}
            value={taxRate}
            onChange={(e) => {
              setTaxRate(e.target.value);
              setSelectedState('Custom');
            }}
            placeholder="Enter tax rate"
            step="0.01"
            min="0"
            max="100"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            {priceIncludesTax ? 'Total Price (with tax)' : 'Price (before tax)'}
          </label>
          <input
            id="price"
            type="number"
            className={styles.input}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={priceIncludesTax}
              onChange={(e) => setPriceIncludesTax(e.target.checked)}
              style={{ width: 'auto' }}
            />
            <span className={styles.label} style={{ margin: 0 }}>Price already includes tax</span>
          </label>
        </div>
      </div>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Price Before Tax</span>
            <span className={styles.resultValue}>${result.price.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Sales Tax ({taxRate}%)</span>
            <span className={styles.resultValue}>${result.taxAmount.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Price</span>
            <span className={styles.resultValuePrimary}>${result.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className={styles.note}>
        <strong>Note:</strong> This calculator uses state-level base tax rates. Local taxes may apply in your area, which can increase the total rate. Check with your local tax authority for the exact rate in your location.
      </div>


      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Sales Tax Calculator"
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
