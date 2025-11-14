'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
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
    </CalculatorLayout>
  );
}
