'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import styles from '@/styles/Calculator.module.css';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalPaid: number;
  } | null>(null);

  const faqItems = [
    {
      question: "What's the difference between APR and interest rate?",
      answer: "The interest rate is the cost of borrowing the principal amount. APR (Annual Percentage Rate) includes the interest rate plus other fees like origination fees, closing costs, and mortgage insurance. APR gives you a more accurate picture of the total cost. For this calculator, use your interest rate - if you want to account for fees, add them to your loan amount."
    },
    {
      question: "Should I choose a shorter loan term to save on interest?",
      answer: "Shorter terms mean higher monthly payments but significantly less interest paid overall. For example, a $20,000 loan at 7% costs $4,559 in interest over 60 months but only $2,321 over 36 months - saving $2,238! Choose based on your budget: shorter terms if you can afford higher payments and want to save money, longer terms for lower monthly payments and more flexibility."
    },
    {
      question: "Can I pay extra toward my loan to pay it off faster?",
      answer: "Yes! Most loans allow extra payments toward principal with no penalty. Even an extra $50-100/month can save thousands in interest and years off your loan. Make sure extra payments are applied to principal, not future payments. Check your loan terms - some loans have prepayment penalties, though these are increasingly rare for personal loans."
    },
    {
      question: "How does my credit score affect my interest rate?",
      answer: "Your credit score has a huge impact. Excellent credit (740+) typically gets rates 3-5% lower than fair credit (650-699). On a $15,000 5-year loan, the difference between 6% and 11% interest is over $2,000. Before applying, check your credit score and consider improving it first if it's below 700 - even a few months of on-time payments can help."
    }
  ];

  const relatedCalculators = [
    {
      title: "Mortgage Calculator",
      link: "/calculators/mortgage",
      description: "Calculate home loan payments with taxes and insurance"
    },
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips and split bills for dining"
    }
  ];

  const calculateLoan = () => {
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const term = parseInt(loanTerm);

    if (!amount || !rate || !term) return;

    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) /
                           (Math.pow(1 + monthlyRate, term) - 1);
    const totalPaid = monthlyPayment * term;
    const totalInterest = totalPaid - amount;

    setResult({ monthlyPayment, totalInterest, totalPaid });
  };

  return (
    <CalculatorLayout
      title="Loan Calculator"
      description="Calculate your loan payments, total interest, and see a complete amortization summary."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateLoan(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="loanAmount" className={styles.label}>
            Loan Amount ($)
          </label>
          <input
            id="loanAmount"
            type="number"
            className={styles.input}
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
            step="100"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="interestRate" className={styles.label}>
            Interest Rate (%)
          </label>
          <input
            id="interestRate"
            type="number"
            className={styles.input}
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter annual interest rate"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="loanTerm" className={styles.label}>
            Loan Term (months)
          </label>
          <input
            id="loanTerm"
            type="number"
            className={styles.input}
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="Enter term in months"
            step="1"
            min="1"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate Loan
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Monthly Payment</span>
            <span className={styles.resultValuePrimary}>${result.monthlyPayment.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Interest</span>
            <span className={styles.resultValue}>${result.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Amount Paid</span>
            <span className={styles.resultValue}>${result.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className={styles.note}>
            <strong>Amortization Summary:</strong> You will pay ${result.monthlyPayment.toFixed(2)} per month for {loanTerm} months.
            This includes ${parseFloat(loanAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in principal and ${result.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in interest.
          </div>
        </div>
      )}

      <ProductRecommendation
        products={getProducts('finance', 3)}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
