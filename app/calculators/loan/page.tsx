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

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalPaid: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

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
      title: "Car Payment Calculator",
      link: "/calculators/car-payment",
      description: "Calculate auto loan payments with trade-in values"
    },
    {
      title: "Simple Interest Calculator",
      link: "/calculators/simple-interest",
      description: "Understand how simple interest works on loans and savings"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Our loan calculator helps you understand the true cost of borrowing before you sign. Here's how to calculate your loan payment:",
      steps: [
        "Enter the loan amount - the total principal you need to borrow.",
        "Input the annual interest rate (APR) you've been offered or expect to qualify for based on your credit score.",
        "Select the loan term in years - shorter terms mean higher payments but less total interest.",
        "Click 'Calculate' to see your monthly payment, total interest, and total amount you'll repay."
      ]
    },
    whyMatters: {
      description: "Whether you're financing a car, consolidating debt, or funding a major purchase, understanding your loan terms is crucial for financial health. The difference between loan offers might seem small (a few percentage points), but over years of payments, it can add up to thousands of dollars. This calculator helps you compare offers and understand exactly what you're committing to before signing loan documents.",
      benefits: [
        "Compare loan offers from different lenders to find the best deal",
        "Understand how interest rate changes affect your total cost",
        "See the impact of different loan terms on monthly payments vs total interest",
        "Plan your budget accurately with precise monthly payment calculations",
        "Make informed decisions about whether to borrow or save for purchases"
      ]
    },
    examples: [
      {
        title: "Personal Loan",
        scenario: "You need a $15,000 personal loan for home improvements. Your bank offers 8.5% APR for 5 years.",
        calculation: "Monthly payment: $307.26 | Total interest: $3,435.60",
        result: "You'll pay back $18,435.60 total over 60 months."
      },
      {
        title: "Comparing Loan Terms",
        scenario: "You're borrowing $10,000 at 7% APR. Compare a 3-year vs 5-year term.",
        calculation: "3-year: $308.77/mo ($1,115.72 interest) | 5-year: $198.01/mo ($1,880.60 interest)",
        result: "The shorter term saves $764.88 in interest but costs $110.76 more monthly."
      },
      {
        title: "Debt Consolidation",
        scenario: "You're consolidating $25,000 in credit card debt (was 22% APR) to a personal loan at 10% APR for 4 years.",
        calculation: "New payment: $634.07/mo | Total interest: $5,435.36",
        result: "Much better than credit card minimum payments - you'll be debt-free in 4 years with a clear end date."
      }
    ],
    commonMistakes: [
      "Focusing only on monthly payment instead of total cost - a longer term means lower payments but much more interest overall.",
      "Not comparing APR across lenders - even 1% difference on a $20,000 loan can mean $1,000+ in savings.",
      "Forgetting about origination fees - some lenders charge 1-5% upfront, which should factor into your comparison.",
      "Taking the longest term available just for lower payments - you'll pay significantly more interest over time.",
      "Not checking your credit score first - knowing your score helps you understand what rates you'll qualify for."
    ]
  };

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

    // Track calculator usage
    trackCalculatorUsage('Loan Calculator', {
      loan_amount: amount,
      interest_rate: rate,
      loan_term_months: term,
      monthly_payment: monthlyPayment
    });
  };

  return (
    <CalculatorLayout
      title="Loan Calculator"
      description="Calculate monthly loan payments, total interest, and total repayment amount. Compare loan terms to find the best financing option for personal loans, auto loans, and more."
    >
      <CalculatorSchema
        name="Loan Calculator"
        description="Free loan calculator to compute monthly payments and total interest for personal loans, auto loans, and other financing. Compare terms and find the best loan option."
        url="/calculators/loan"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

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

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('finance', 3)}
        calculatorName="Loan Calculator"
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
