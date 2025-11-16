'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import styles from '@/styles/Calculator.module.css';

type TimeUnit = 'days' | 'months' | 'years';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('years');
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [result, setResult] = useState<{
    interest: number;
    total: number;
    principal: number;
    timeInYears: number;
  } | null>(null);

  const calculateSimpleInterest = (principal: number, rate: number, time: number, unit: TimeUnit) => {
    let years = time;
    if (unit === 'months') years = time / 12;
    if (unit === 'days') years = time / 365;

    const interest = principal * (rate / 100) * years;
    const total = principal + interest;

    return {
      interest,
      total,
      principal,
      timeInYears: years
    };
  };

  const generateMonthlyBreakdown = (principal: number, rate: number, years: number) => {
    const months = Math.ceil(years * 12);
    const breakdown: { month: number; interest: number; total: number }[] = [];

    for (let i = 1; i <= Math.min(months, 60); i++) {
      const yearsElapsed = i / 12;
      const interest = principal * (rate / 100) * yearsElapsed;
      breakdown.push({
        month: i,
        interest,
        total: principal + interest
      });
    }

    return breakdown;
  };

  useEffect(() => {
    if (principal && rate && time) {
      const p = parseFloat(principal);
      const r = parseFloat(rate);
      const t = parseFloat(time);

      if (!isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r > 0 && t > 0) {
        setResult(calculateSimpleInterest(p, r, t, timeUnit));
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [principal, rate, time, timeUnit]);

  const faqItems = [
    {
      question: "What is simple interest and how is it calculated?",
      answer: "Simple interest is calculated using the formula: I = P × R × T, where I is interest, P is principal (initial amount), R is the annual interest rate (as a decimal), and T is time in years. Unlike compound interest, simple interest is calculated only on the principal amount."
    },
    {
      question: "What's the difference between simple and compound interest?",
      answer: "Simple interest is calculated only on the original principal amount. Compound interest is calculated on the principal plus previously earned interest. For example, $1000 at 5% for 2 years: Simple interest earns $100, while compound interest earns $102.50. Over long periods, compound interest grows much faster."
    },
    {
      question: "When is simple interest used?",
      answer: "Simple interest is commonly used for short-term loans, car loans, and some personal loans. It's also used in certain savings bonds and certificates of deposit. Most savings accounts and mortgages use compound interest instead."
    },
    {
      question: "How do I calculate the interest rate if I know the principal and interest earned?",
      answer: "Rearrange the formula: R = I / (P × T). For example, if you earned $50 interest on $1000 over 1 year, the rate is: 50 / (1000 × 1) = 0.05 or 5% annual interest."
    }
  ];

  const relatedCalculators = [
    {
      title: "Loan Calculator",
      link: "/calculators/loan",
      description: "Calculate loan payments and total interest"
    },
    {
      title: "Mortgage Calculator",
      link: "/calculators/mortgage",
      description: "Estimate your monthly mortgage payments"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percentage changes"
    }
  ];

  return (
    <CalculatorLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest on loans, savings, or investments. Find out how much interest you'll earn or pay with our easy-to-use calculator."
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="principal" className={styles.label}>
            Principal Amount ($)
          </label>
          <input
            id="principal"
            type="number"
            className={styles.input}
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Enter principal amount"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rate" className={styles.label}>
            Annual Interest Rate (%)
          </label>
          <input
            id="rate"
            type="number"
            className={styles.input}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Enter interest rate"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="time" className={styles.label}>
            Time Period
          </label>
          <input
            id="time"
            type="number"
            className={styles.input}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Enter time period"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="timeUnit" className={styles.label}>
            Time Unit
          </label>
          <select
            id="timeUnit"
            className={styles.select}
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
          >
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>

        {result && result.timeInYears >= 0.25 && (
          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showBreakdown}
                onChange={(e) => setShowBreakdown(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <span className={styles.label} style={{ margin: 0 }}>Show Monthly Breakdown</span>
            </label>
          </div>
        )}
      </div>

      {result && (
        <>
          <div className={styles.results}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Principal Amount</span>
              <span className={styles.resultValue}>${result.principal.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Interest Earned/Paid</span>
              <span className={styles.resultValuePrimary}>${result.interest.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Amount</span>
              <span className={styles.resultValue}>${result.total.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Time Period</span>
              <span className={styles.resultValue}>
                {time} {timeUnit} ({result.timeInYears.toFixed(2)} years)
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Formula</span>
              <span className={styles.resultValue} style={{ fontSize: '0.9rem' }}>
                I = {result.principal.toFixed(2)} × {rate}% × {result.timeInYears.toFixed(2)}
              </span>
            </div>
          </div>

          {showBreakdown && result.timeInYears >= 0.25 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ color: '#e0e0e0', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Monthly Breakdown
              </h3>
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                backgroundColor: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', color: '#b0b0b0', fontSize: '0.9rem' }}>
                        Month
                      </th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', color: '#b0b0b0', fontSize: '0.9rem' }}>
                        Interest
                      </th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', color: '#b0b0b0', fontSize: '0.9rem' }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateMonthlyBreakdown(result.principal, parseFloat(rate), result.timeInYears).map((row) => (
                      <tr key={row.month} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.5rem', color: '#e0e0e0', fontSize: '0.9rem' }}>
                          {row.month}
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'right', color: '#e0e0e0', fontSize: '0.9rem' }}>
                          ${row.interest.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'right', color: '#e0e0e0', fontSize: '0.9rem' }}>
                          ${row.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <div className={styles.note}>
        <strong>Note:</strong> This calculator uses the simple interest formula (I = P × R × T). Most savings accounts and loans use compound interest, which will result in different amounts. Simple interest is typically used for short-term loans and certain financial instruments.
      </div>


      <ProductRecommendation
        products={getProducts('finance', 3)}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
