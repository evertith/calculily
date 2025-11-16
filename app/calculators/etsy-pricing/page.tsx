'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

export default function EtsyPricingCalculator() {
  const [materialCost, setMaterialCost] = useState<string>('');
  const [laborHours, setLaborHours] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [profitMargin, setProfitMargin] = useState<string>('30');
  const [result, setResult] = useState<{
    recommendedPrice: number;
    materialCost: number;
    laborCost: number;
    profitAmount: number;
    totalFees: number;
    netProfit: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const faqItems = [
    {
      question: "What should I set as my hourly rate?",
      answer: "Your hourly rate should reflect your skill level and market. Beginners often start at $15-20/hour, intermediate crafters charge $25-35/hour, and experts with specialized skills can charge $40-60+/hour. Don't undervalue your time - remember this needs to cover not just making the item, but photography, listing, customer service, and business overhead too."
    },
    {
      question: "Is 30% profit margin too high or too low?",
      answer: "30% is a good starting point for handmade items. Serious businesses often target 40-50% to remain sustainable and allow for sales/discounts. Lower margins (20-30%) work for simpler items or competitive markets. Remember, this profit needs to cover your shop overhead, packaging, marketing, and business growth - it's not all take-home pay."
    },
    {
      question: "Should I include packaging and shipping costs?",
      answer: "Packaging materials should be included in your material costs. Shipping is typically charged separately on Etsy. If you offer free shipping, add your average shipping cost to material costs. Many successful sellers charge shipping separately and pad it slightly to cover materials like boxes, bubble wrap, and tape."
    },
    {
      question: "Are these Etsy fees current and accurate?",
      answer: "This calculator uses Etsy's current fee structure as of 2024: $0.20 listing fee per item, 6.5% transaction fee on the sale price, and 3% + $0.25 payment processing fee. Etsy occasionally updates fees, so check Etsy's seller handbook for the latest rates. The calculator doesn't include optional advertising costs or off-site ad fees."
    }
  ];

  const relatedCalculators = [
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips and split bills quickly"
    },
    {
      title: "Fuel Cost Calculator",
      link: "/calculators/fuel-cost",
      description: "Estimate fuel costs for shipping or craft fair travel"
    },
    {
      title: "Loan Calculator",
      link: "/calculators/loan",
      description: "Plan financing for business equipment or inventory"
    }
  ];

  const calculatePricing = () => {
    const materials = parseFloat(materialCost);
    const hours = parseFloat(laborHours);
    const rate = parseFloat(hourlyRate);
    const margin = parseFloat(profitMargin);

    if (!materials || !hours || !rate || !margin) return;

    const laborCost = hours * rate;
    const baseCost = materials + laborCost;
    const profitAmount = baseCost * (margin / 100);
    const subtotal = baseCost + profitAmount;

    // Etsy fees
    const listingFee = 0.20;
    const transactionFee = subtotal * 0.065; // 6.5%
    const paymentProcessingFee = (subtotal + 0.30) / (1 - 0.03) - subtotal; // 3% + $0.30

    const totalFees = listingFee + transactionFee + paymentProcessingFee;
    const recommendedPrice = subtotal + totalFees;
    const netProfit = recommendedPrice - baseCost - totalFees;

    setResult({
      recommendedPrice,
      materialCost: materials,
      laborCost,
      profitAmount,
      totalFees,
      netProfit,
    });

    // Track calculator usage
    trackCalculatorUsage('Etsy Pricing Calculator', {
      material_cost: materials,
      labor_hours: hours,
      hourly_rate: rate,
      profit_margin: margin,
      recommended_price: recommendedPrice
    });
  };

  return (
    <CalculatorLayout
      title="Etsy Pricing Calculator"
      description="Calculate the right price for your handmade products on Etsy, including all fees and desired profit margin."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculatePricing(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="materialCost" className={styles.label}>
            Material Cost ($)
          </label>
          <input
            id="materialCost"
            type="number"
            className={styles.input}
            value={materialCost}
            onChange={(e) => setMaterialCost(e.target.value)}
            placeholder="Enter total material cost"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="laborHours" className={styles.label}>
            Labor Hours
          </label>
          <input
            id="laborHours"
            type="number"
            className={styles.input}
            value={laborHours}
            onChange={(e) => setLaborHours(e.target.value)}
            placeholder="Hours spent making item"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="hourlyRate" className={styles.label}>
            Hourly Rate ($)
          </label>
          <input
            id="hourlyRate"
            type="number"
            className={styles.input}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="Your desired hourly rate"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="profitMargin" className={styles.label}>
            Desired Profit Margin (%)
          </label>
          <input
            id="profitMargin"
            type="number"
            className={styles.input}
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value)}
            placeholder="Typical: 30-50%"
            step="1"
            min="0"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate Selling Price
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Selling Price</span>
            <span className={styles.resultValuePrimary}>${result.recommendedPrice.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #222' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Breakdown</h3>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Materials</span>
              <span className={styles.resultValue}>${result.materialCost.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Labor</span>
              <span className={styles.resultValue}>${result.laborCost.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Etsy Fees</span>
              <span className={styles.resultValue}>${result.totalFees.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Your Profit</span>
              <span className={styles.resultValue}>${result.netProfit.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> Etsy fees include listing fee ($0.20), transaction fee (6.5%), and payment processing fee (3% + $0.30). This calculator uses current 2024 rates.
          </div>
        </div>
      )}

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Etsy Pricing Calculator"
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
