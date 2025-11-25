'use client';

import { useState } from 'react';
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
      title: "Etsy Fee Calculator",
      link: "/etsy-tools/fee-calculator",
      description: "Calculate all Etsy fees"
    },
    {
      title: "Etsy Profit Calculator",
      link: "/etsy-tools/profit-calculator",
      description: "Calculate true profit after costs"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate margin percentages"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Set Etsy prices that ensure profitability while staying competitive:",
      steps: [
        "Enter your costs: materials, labor (time × hourly rate), and packaging.",
        "Set your target profit margin percentage.",
        "The calculator factors in all Etsy fees automatically.",
        "Click 'Calculate' to see the selling price needed to hit your target margin.",
        "Adjust inputs to find the sweet spot between price and profit."
      ]
    },
    whyMatters: {
      description: "Pricing handmade items is challenging - too high and you lose sales, too low and you lose money. Many sellers price based on competitors or gut feeling, only to discover they're barely breaking even after costs and fees. Working backward from your target profit margin ensures every sale contributes to a sustainable business. This approach also helps you decide which products are worth making at market prices.",
      benefits: [
        "Price confidently knowing you'll hit profit targets",
        "Account for all Etsy fees in your pricing strategy",
        "Compare prices needed at different margin targets",
        "Identify if products can be priced competitively",
        "Build a sustainable, profitable Etsy business"
      ]
    },
    examples: [
      {
        title: "Handmade Earrings",
        scenario: "Materials: $4, Labor (20 min @ $20/hr): $6.67, Packaging: $1.50. Target: 30% margin.",
        calculation: "$12.17 costs ÷ (1 - 0.30 margin - 0.15 fees) = $22.13",
        result: "Price at $22-25 to achieve 30% profit margin after all costs and fees."
      },
      {
        title: "Custom Portrait",
        scenario: "Materials: $5, Labor (4 hrs @ $30/hr): $120, Packaging: $8. Target: 25% margin.",
        calculation: "$133 costs ÷ (1 - 0.25 - 0.15) = $221.67",
        result: "Need to price at $220+ for 25% margin - is the market willing to pay that?"
      },
      {
        title: "Finding Minimum Viable Price",
        scenario: "Same portrait, but willing to accept 10% margin to be competitive.",
        calculation: "$133 costs ÷ (1 - 0.10 - 0.15) = $177.33",
        result: "Minimum sustainable price is ~$180. Below this, you're losing money."
      }
    ],
    commonMistakes: [
      "Setting prices based only on material costs - labor is usually your biggest expense.",
      "Forgetting that Etsy takes ~15% of every sale (fees on item + shipping).",
      "Pricing to match competitors who may be underpricing their own work.",
      "Not valuing your own time - pay yourself a fair hourly rate.",
      "Lowering prices when sales are slow instead of improving marketing."
    ]
  };

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
      description="Calculate the right selling price for your Etsy products. Enter costs and target profit margin to set prices that ensure profitability."
    >
      <CalculatorSchema
        name="Etsy Pricing Calculator"
        description="Free Etsy pricing calculator to set profitable prices. Enter costs and target margin to find the right selling price with all Etsy fees included."
        url="/calculators/etsy-pricing"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

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

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Etsy Pricing Calculator"
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
