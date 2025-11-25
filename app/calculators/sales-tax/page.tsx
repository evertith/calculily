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
      description: "Calculate sale prices and savings"
    },
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips and split bills"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate any percentage or percent change"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Knowing the total price including tax helps you budget accurately. Here's how to calculate sales tax:",
      steps: [
        "Enter the item price or subtotal before tax.",
        "Select your state from the dropdown to use the average combined state and local rate, or enter a custom rate.",
        "If you know your exact local rate differs from the state average, enter it in the custom rate field.",
        "Click 'Calculate' to see the tax amount and total price."
      ]
    },
    whyMatters: {
      description: "Sales tax varies dramatically across the United States - from 0% in states like Delaware and Oregon to over 10% in parts of Louisiana and Tennessee when combining state and local rates. Understanding sales tax helps you budget for purchases, compare prices across state lines, and avoid sticker shock at checkout. For large purchases like cars, appliances, or electronics, even a 1% difference can mean hundreds of dollars.",
      benefits: [
        "Know exactly what you'll pay before reaching the register",
        "Compare out-the-door prices when shopping across state lines",
        "Budget accurately for large purchases where tax adds up significantly",
        "Understand the true cost of online purchases shipped to your state",
        "Calculate tax-inclusive prices for business pricing decisions"
      ]
    },
    examples: [
      {
        title: "Electronics Purchase",
        scenario: "Buying a $999 laptop in California with an 8.68% combined sales tax rate.",
        calculation: "$999 × 0.0868 = $86.71 tax",
        result: "Total price: $1,085.71"
      },
      {
        title: "Comparing Across States",
        scenario: "A $500 purchase: Oregon (0% tax) vs Washington (9.29% average).",
        calculation: "Oregon: $500 total | Washington: $500 + $46.45 = $546.45",
        result: "You'd save $46.45 buying in Oregon"
      },
      {
        title: "Restaurant Bill",
        scenario: "A $75 dinner bill in New York City with 8.875% sales tax (before tip).",
        calculation: "$75 × 0.08875 = $6.66 tax",
        result: "Subtotal with tax: $81.66 (then add tip on the pre-tax amount)"
      }
    ],
    commonMistakes: [
      "Forgetting that online purchases often have sales tax now - most states require collection on online orders.",
      "Using state-only rates when local taxes add significantly - some cities add 3-5% on top of state rates.",
      "Not accounting for tax when comparing prices across retailers - a lower price plus higher tax might cost more.",
      "Assuming all items are taxed equally - groceries, clothing, and medications are exempt or reduced in many states.",
      "Forgetting about use tax - if you buy from a state with no sales tax, you may owe use tax in your home state."
    ]
  };

  return (
    <CalculatorLayout
      title="Sales Tax Calculator"
      description="Calculate sales tax for any state or custom rate. See the tax amount and total price for purchases to budget accurately."
    >
      <CalculatorSchema
        name="Sales Tax Calculator"
        description="Free sales tax calculator with rates for all 50 US states. Calculate total price including tax or enter a custom rate for accurate totals."
        url="/calculators/sales-tax"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

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

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Sales Tax Calculator"
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
