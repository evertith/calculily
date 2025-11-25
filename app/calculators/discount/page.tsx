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

type CalculationType = 'priceAfterDiscount' | 'originalFromSale' | 'discountPercent';

export default function DiscountCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('priceAfterDiscount');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('');
  const [result, setResult] = useState<{
    finalPrice?: number;
    originalPrice?: number;
    discountAmount: number;
    discountPercent?: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const priceAfterDiscount = (originalPrice: number, discountPercent: number) => {
    const discountAmount = originalPrice * (discountPercent / 100);
    const finalPrice = originalPrice - discountAmount;
    return { finalPrice, discountAmount, discountPercent };
  };

  const originalFromSale = (salePrice: number, discountPercent: number) => {
    const originalPrice = salePrice / (1 - discountPercent / 100);
    const savings = originalPrice - salePrice;
    return { originalPrice, discountAmount: savings, discountPercent };
  };

  const calculateDiscountPercent = (originalPrice: number, salePrice: number) => {
    const percent = ((originalPrice - salePrice) / originalPrice) * 100;
    const savings = originalPrice - salePrice;
    return { discountPercent: percent, discountAmount: savings, finalPrice: salePrice };
  };

  useEffect(() => {
    if (calculationType === 'priceAfterDiscount' && originalPrice && discountPercent) {
      const orig = parseFloat(originalPrice);
      const disc = parseFloat(discountPercent);

      if (!isNaN(orig) && !isNaN(disc) && orig >= 0 && disc >= 0 && disc <= 100) {
        const resultData = priceAfterDiscount(orig, disc);
        setResult(resultData);

        // Track calculator usage
        trackCalculatorUsage('Discount Calculator', {
          calculation_type: calculationType,
          original_price: orig,
          discount_percent: disc
        });
      } else {
        setResult(null);
      }
    } else if (calculationType === 'originalFromSale' && salePrice && discountPercent) {
      const sale = parseFloat(salePrice);
      const disc = parseFloat(discountPercent);

      if (!isNaN(sale) && !isNaN(disc) && sale >= 0 && disc >= 0 && disc < 100) {
        const resultData = originalFromSale(sale, disc);
        setResult(resultData);

        // Track calculator usage
        trackCalculatorUsage('Discount Calculator', {
          calculation_type: calculationType,
          sale_price: sale,
          discount_percent: disc
        });
      } else {
        setResult(null);
      }
    } else if (calculationType === 'discountPercent' && originalPrice && salePrice) {
      const orig = parseFloat(originalPrice);
      const sale = parseFloat(salePrice);

      if (!isNaN(orig) && !isNaN(sale) && orig >= 0 && sale >= 0 && sale <= orig) {
        const resultData = calculateDiscountPercent(orig, sale);
        setResult(resultData);

        // Track calculator usage
        trackCalculatorUsage('Discount Calculator', {
          calculation_type: calculationType,
          original_price: orig,
          sale_price: sale
        });
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [calculationType, originalPrice, salePrice, discountPercent]);

  const faqItems = [
    {
      question: "How do I calculate the final price after a discount?",
      answer: "Multiply the original price by the discount percentage (as a decimal), then subtract that amount from the original price. For example, a $100 item with 20% off: $100 × 0.20 = $20 discount, so $100 - $20 = $80 final price."
    },
    {
      question: "Can I combine multiple discounts?",
      answer: "When combining discounts, they're usually applied sequentially, not added together. For example, 20% off then 10% off a $100 item: first discount gives $80, second discount is 10% of $80 = $8, final price is $72 (not $70 which would be 30% off)."
    },
    {
      question: "What's the difference between discount percentage and amount saved?",
      answer: "Discount percentage is the portion of the original price you're saving (e.g., 25% off). Amount saved is the actual dollar value (e.g., $25 off a $100 item). Both represent the same savings, just expressed differently."
    },
    {
      question: "How do I find the original price if I only know the sale price?",
      answer: "Divide the sale price by (1 - discount percentage as decimal). For example, if an item is $60 after a 20% discount: $60 ÷ 0.80 = $75 original price. Use the 'Original from Sale Price' calculator for this."
    }
  ];

  const relatedCalculators = [
    {
      title: "Sales Tax Calculator",
      link: "/calculators/sales-tax",
      description: "Calculate total price including sales tax"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate any percentage or percent change"
    },
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips and split bills"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Never wonder if a sale is really a good deal again. Our discount calculator shows you exactly what you'll pay:",
      steps: [
        "Enter the original price of the item before any discounts.",
        "Input the discount percentage (e.g., 25 for 25% off).",
        "If there's a second discount (like an extra 10% off sale items), enter that too.",
        "Click 'Calculate' to see your savings, the discounted price, and the effective discount percentage."
      ]
    },
    whyMatters: {
      description: "Sales and discounts are everywhere, but not all deals are created equal. Understanding the actual savings helps you make smarter purchasing decisions and avoid marketing tricks. Multiple discounts especially can be confusing - a 20% off plus an extra 15% off doesn't equal 35% off total. This calculator shows you exactly what you'll pay and your true percentage savings, helping you compare deals across different stores and decide if a 'limited time offer' is worth acting on.",
      benefits: [
        "Instantly verify if a sale price is calculated correctly",
        "Compare deals across different stores with varying discount structures",
        "Understand stacking discounts - multiple percentages off don't simply add together",
        "Budget accurately for shopping trips with exact after-discount prices",
        "Spot fake discounts where the 'original' price was inflated"
      ]
    },
    examples: [
      {
        title: "Simple Discount",
        scenario: "A $150 jacket is marked 30% off.",
        calculation: "$150 × 0.30 = $45 discount",
        result: "You save $45. Sale price: $105"
      },
      {
        title: "Stacking Discounts",
        scenario: "A $200 item is 25% off, and you have a coupon for an extra 10% off the sale price.",
        calculation: "$200 × 0.75 = $150 after first discount | $150 × 0.90 = $135 after second",
        result: "Final price: $135 | Total savings: $65 (32.5% total, not 35%)"
      },
      {
        title: "Bulk Discount",
        scenario: "Buy 3 get 1 free on items priced at $25 each. What's the effective discount?",
        calculation: "4 items normally = $100 | You pay: $75 | Discount: $25",
        result: "Effective discount: 25% off when buying 4"
      }
    ],
    commonMistakes: [
      "Adding percentages together for stacking discounts - 20% off plus 10% off is 28% total, not 30%.",
      "Forgetting that percentage is calculated on different bases - the second discount applies to the already-reduced price.",
      "Not comparing unit prices after discount - a 'deal' might still be more expensive than alternatives.",
      "Assuming 'up to X% off' means everything is that percentage off - it's usually just select items.",
      "Buying something just because it's on sale - a discount on something you don't need isn't saving money."
    ]
  };

  return (
    <CalculatorLayout
      title="Discount Calculator"
      description="Calculate sale prices and savings instantly. Enter original price and discount percentage to see how much you save and the final price after discount."
    >
      <CalculatorSchema
        name="Discount Calculator"
        description="Free discount calculator to compute sale prices and savings. Calculate single or stacking discounts and see your true percentage off."
        url="/calculators/discount"
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
              className={`${styles.buttonOption} ${calculationType === 'priceAfterDiscount' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('priceAfterDiscount')}
            >
              Price After Discount
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'originalFromSale' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('originalFromSale')}
            >
              Original from Sale
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'discountPercent' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('discountPercent')}
              style={{ flex: 1 }}
            >
              Calculate Discount %
            </button>
          </div>
        </div>

        {calculationType === 'priceAfterDiscount' && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="originalPrice" className={styles.label}>
                Original Price ($)
              </label>
              <input
                id="originalPrice"
                type="number"
                className={styles.input}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Enter original price"
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="discountPercent" className={styles.label}>
                Discount (%)
              </label>
              <input
                id="discountPercent"
                type="number"
                className={styles.input}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="Enter discount percentage"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </>
        )}

        {calculationType === 'originalFromSale' && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="salePrice" className={styles.label}>
                Sale Price ($)
              </label>
              <input
                id="salePrice"
                type="number"
                className={styles.input}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Enter sale price"
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="discountPercent" className={styles.label}>
                Discount (%)
              </label>
              <input
                id="discountPercent"
                type="number"
                className={styles.input}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="Enter discount percentage"
                step="0.01"
                min="0"
                max="99.99"
              />
            </div>
          </>
        )}

        {calculationType === 'discountPercent' && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="originalPrice" className={styles.label}>
                Original Price ($)
              </label>
              <input
                id="originalPrice"
                type="number"
                className={styles.input}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Enter original price"
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="salePrice" className={styles.label}>
                Sale Price ($)
              </label>
              <input
                id="salePrice"
                type="number"
                className={styles.input}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Enter sale price"
                step="0.01"
                min="0"
              />
            </div>
          </>
        )}
      </div>

      {result && (
        <div className={styles.results}>
          {result.finalPrice !== undefined && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Final Price</span>
              <span className={styles.resultValuePrimary}>${result.finalPrice.toFixed(2)}</span>
            </div>
          )}
          {result.originalPrice !== undefined && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Original Price</span>
              <span className={styles.resultValuePrimary}>${result.originalPrice.toFixed(2)}</span>
            </div>
          )}
          {result.discountPercent !== undefined && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Discount Percentage</span>
              <span className={styles.resultValue}>{result.discountPercent.toFixed(2)}%</span>
            </div>
          )}
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>You Save</span>
            <span className={styles.resultValue} style={{ color: '#4ade80' }}>
              ${result.discountAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Discount Calculator"
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
