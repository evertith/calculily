'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
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
    </CalculatorLayout>
  );
}
