'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import styles from '@/styles/Calculator.module.css';

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('20');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalPaid: number;
    downPaymentAmount: number;
    principal: number;
  } | null>(null);

  const calculateMortgage = () => {
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const term = parseInt(loanTerm);
    const rate = parseFloat(interestRate);

    if (!price || !term || !rate) return;

    const principal = price - (price * down / 100);
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                           (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - principal;
    const downPaymentAmount = price * down / 100;

    setResult({ monthlyPayment, totalInterest, totalPaid, downPaymentAmount, principal });
  };

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payments, total interest, and total cost over the life of your loan."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateMortgage(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="homePrice" className={styles.label}>
            Home Price ($)
          </label>
          <input
            id="homePrice"
            type="number"
            className={styles.input}
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
            placeholder="Enter home price"
            step="1000"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="downPayment" className={styles.label}>
            Down Payment (%)
          </label>
          <input
            id="downPayment"
            type="number"
            className={styles.input}
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="Enter down payment percentage"
            step="0.1"
            min="0"
            max="100"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="loanTerm" className={styles.label}>
            Loan Term (years)
          </label>
          <select
            id="loanTerm"
            className={styles.select}
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          >
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="30">30 years</option>
          </select>
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
            placeholder="Enter interest rate"
            step="0.01"
            min="0"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate Mortgage
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Monthly Payment</span>
            <span className={styles.resultValuePrimary}>${result.monthlyPayment.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Down Payment Amount</span>
            <span className={styles.resultValue}>${result.downPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Loan Amount (Principal)</span>
            <span className={styles.resultValue}>${result.principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Interest Paid</span>
            <span className={styles.resultValue}>${result.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Amount Paid</span>
            <span className={styles.resultValue}>${result.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This calculation does not include property taxes, insurance, HOA fees, or other costs associated with homeownership.
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
