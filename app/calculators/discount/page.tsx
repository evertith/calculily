'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import styles from '@/styles/Calculator.module.css';

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
        setResult(priceAfterDiscount(orig, disc));
      } else {
        setResult(null);
      }
    } else if (calculationType === 'originalFromSale' && salePrice && discountPercent) {
      const sale = parseFloat(salePrice);
      const disc = parseFloat(discountPercent);

      if (!isNaN(sale) && !isNaN(disc) && sale >= 0 && disc >= 0 && disc < 100) {
        setResult(originalFromSale(sale, disc));
      } else {
        setResult(null);
      }
    } else if (calculationType === 'discountPercent' && originalPrice && salePrice) {
      const orig = parseFloat(originalPrice);
      const sale = parseFloat(salePrice);

      if (!isNaN(orig) && !isNaN(sale) && orig >= 0 && sale >= 0 && sale <= orig) {
        setResult(calculateDiscountPercent(orig, sale));
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
      description: "Calculate sales tax and total prices"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percentage changes"
    },
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips and split bills easily"
    }
  ];

  return (
    <CalculatorLayout
      title="Discount Calculator"
      description="Calculate sale prices, savings, and discount percentages. Find out how much you save with percentage off deals."
    >
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


      <ProductRecommendation
        products={getProducts('general-tools', 3)}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
