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

type TimeUnit = 'days' | 'months' | 'years';

export default function SimpleInterestCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
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
        const calculationResult = calculateSimpleInterest(p, r, t, timeUnit);
        setResult(calculationResult);

        trackCalculatorUsage('Simple Interest Calculator', {
          principal: p.toString(),
          rate: r.toString(),
          timeUnit,
          interest: calculationResult.interest.toFixed(2)
        });
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
      description: "Calculate loan payments with amortization"
    },
    {
      title: "Mortgage Calculator",
      link: "/calculators/mortgage",
      description: "Calculate home loan payments"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percent changes"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Simple interest is calculated only on the principal amount. Here's how to calculate it:",
      steps: [
        "Enter the principal amount - this is the initial loan or investment amount.",
        "Input the annual interest rate as a percentage.",
        "Enter the time period in years (use decimals for partial years, e.g., 0.5 for 6 months).",
        "Click 'Calculate' to see the interest earned and total amount."
      ]
    },
    whyMatters: {
      description: "Simple interest is used in many financial products including car loans, personal loans, and certificates of deposit. Unlike compound interest, simple interest is calculated only on the original principal, making it easier to understand and predict. Knowing how to calculate simple interest helps you compare loan offers, understand the true cost of borrowing, and make informed decisions about short-term investments and loans.",
      benefits: [
        "Understand exactly how much interest you'll pay on a loan",
        "Compare different loan offers fairly",
        "Calculate returns on CDs and bonds that use simple interest",
        "Plan payments for interest-only loan periods",
        "Verify interest charges on financial statements"
      ]
    },
    examples: [
      {
        title: "Personal Loan",
        scenario: "You borrow $5,000 at 8% simple interest for 2 years.",
        calculation: "$5,000 × 0.08 × 2 = $800 interest",
        result: "You'll pay $800 in interest, repaying $5,800 total."
      },
      {
        title: "Short-Term Investment",
        scenario: "Invest $10,000 in a 6-month CD paying 4.5% simple interest.",
        calculation: "$10,000 × 0.045 × 0.5 = $225 interest",
        result: "You'll earn $225 in interest over 6 months."
      },
      {
        title: "Car Loan Interest",
        scenario: "A $20,000 car loan at 6.5% simple interest for 4 years.",
        calculation: "$20,000 × 0.065 × 4 = $5,200 interest",
        result: "Total interest: $5,200. Monthly payment: ~$526 (principal + interest divided by 48 months)."
      }
    ],
    commonMistakes: [
      "Confusing simple interest with compound interest - compound interest grows exponentially, simple interest is linear.",
      "Using monthly rates when the formula calls for annual rates - convert monthly to annual by multiplying by 12.",
      "Forgetting to convert percentages to decimals - 8% should be 0.08 in the formula.",
      "Not converting time periods properly - 6 months = 0.5 years, 18 months = 1.5 years.",
      "Assuming all loans use simple interest - most mortgages and credit cards use compound interest."
    ]
  };

  return (
    <CalculatorLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest on loans and investments. Enter principal, interest rate, and time period to find total interest earned or owed."
    >
      <CalculatorSchema
        name="Simple Interest Calculator"
        description="Free simple interest calculator to compute interest on loans and investments. Enter principal, rate, and time to calculate total interest and amount."
        url="/calculators/simple-interest"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

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

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('finance', 3)}
        calculatorName="Simple Interest Calculator"
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
