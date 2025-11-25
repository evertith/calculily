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

export default function CarPaymentCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [vehiclePrice, setVehiclePrice] = useState<string>('');
  const [tradeInValue, setTradeInValue] = useState<string>('');
  const [tradeInOwed, setTradeInOwed] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('60');
  const [taxRate, setTaxRate] = useState<string>('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    loanAmount: number;
    totalInterest: number;
    totalPaid: number;
    salesTax: number;
    netTradeIn: number;
    totalCost: number;
  } | null>(null);

  const faqItems = [
    {
      question: "Should I include my trade-in even if I still owe money on it?",
      answer: "Yes, include your trade-in information even with negative equity (owing more than it's worth). The calculator accounts for this by subtracting what you owe from the trade-in value. If you owe more than the trade-in is worth, the difference (negative equity) gets added to your new loan amount. This is called being 'upside down' or 'underwater' on your trade-in, and it increases your new car's loan amount and monthly payment."
    },
    {
      question: "What's a good down payment for a car loan?",
      answer: "A good down payment is typically 20% for a new car and 10% for a used car. Larger down payments reduce your loan amount, monthly payment, total interest paid, and the risk of being underwater on the loan. They may also help you qualify for better interest rates. However, don't drain your emergency fund - maintain 3-6 months of expenses in savings even after your down payment."
    },
    {
      question: "How does the loan term affect my payment?",
      answer: "Longer loan terms (72-84 months) have lower monthly payments but cost significantly more in total interest. Shorter terms (36-48 months) have higher monthly payments but save thousands in interest and help you build equity faster. For example, a $30,000 loan at 6% APR: 36 months = $913/month ($2,869 interest), 60 months = $580/month ($4,799 interest), 72 months = $498/month ($5,799 interest). Avoid terms longer than 60 months if possible."
    },
    {
      question: "How can I get the best interest rate on a car loan?",
      answer: "To get the best rate: 1) Check your credit score and improve it if needed (740+ gets best rates), 2) Shop around - compare rates from banks, credit unions, and the dealer, 3) Get pre-approved before visiting dealerships, 4) Make a larger down payment (20%+), 5) Choose a shorter loan term, 6) Consider a used car 2-3 years old instead of new, and 7) Time your purchase - rates and deals vary seasonally. Credit unions often offer the best rates, sometimes 1-2% lower than banks or dealers."
    }
  ];

  const relatedCalculators = [
    {
      title: "Car Depreciation Calculator",
      link: "/calculators/car-depreciation",
      description: "See how your car's value decreases over time"
    },
    {
      title: "Fuel Cost Calculator",
      link: "/calculators/fuel-cost",
      description: "Calculate fuel costs for trips and compare vehicle efficiency"
    },
    {
      title: "Loan Calculator",
      link: "/calculators/loan",
      description: "Calculate payments for personal loans and other financing"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Understanding your car payment before visiting the dealership puts you in control. Here's how to calculate what you'll actually pay:",
      steps: [
        "Enter the vehicle price - use the 'out-the-door' price if you know it, or the sticker price to estimate.",
        "Input your down payment amount - the more you put down, the lower your monthly payment and total interest.",
        "If you have a trade-in, enter its value. This reduces the amount you need to finance.",
        "Enter the interest rate (APR) you expect - this varies based on your credit score and whether it's new/used.",
        "Select the loan term - 36, 48, 60, or 72 months are common options.",
        "Click 'Calculate' to see your monthly payment and total cost of the loan."
      ]
    },
    whyMatters: {
      description: "Car purchases are the second largest financial decision most people make, yet many focus only on the monthly payment without understanding total cost. Dealerships often negotiate by adjusting loan terms rather than price - extending your loan from 48 to 72 months lowers your payment but can cost thousands more in interest. Knowing your numbers beforehand helps you negotiate effectively and avoid financing traps.",
      benefits: [
        "Walk into dealerships knowing exactly what payment to expect",
        "Compare how different down payments affect your monthly cost",
        "Understand the true cost difference between loan terms (48 vs 72 months)",
        "Factor in trade-in value to see your real out-of-pocket costs",
        "Avoid dealership financing tricks by knowing your numbers in advance"
      ]
    },
    examples: [
      {
        title: "New Car Purchase",
        scenario: "Buying a $32,000 new car with $5,000 down, no trade-in, at 5.9% APR for 60 months.",
        calculation: "Loan amount: $27,000 | Monthly payment: $520.93",
        result: "Total interest paid: $4,255.80 | Total cost: $36,255.80"
      },
      {
        title: "Used Car with Trade-In",
        scenario: "Buying a $18,000 used car with $2,000 down and a trade-in worth $4,500 at 7.9% APR for 48 months.",
        calculation: "Loan amount: $11,500 | Monthly payment: $280.47",
        result: "Total interest paid: $1,962.56 | Total cost: $19,962.56"
      },
      {
        title: "Comparing Loan Terms",
        scenario: "Same $25,000 loan at 6% APR: comparing 48-month vs 72-month terms.",
        calculation: "48 months: $586.91/mo ($3,171.68 interest) | 72 months: $414.32/mo ($4,831.04 interest)",
        result: "The longer term costs $1,659 more in interest over the life of the loan."
      }
    ],
    commonMistakes: [
      "Focusing only on monthly payment - dealerships love stretching terms to lower payments while you pay more overall.",
      "Forgetting that trade-in value is negotiable separately from the car price - don't let them mix the two.",
      "Not getting pre-approved before shopping - dealership financing is often more expensive than bank/credit union loans.",
      "Ignoring the total cost of ownership - insurance, fuel, and maintenance vary significantly between vehicles.",
      "Financing for longer than you plan to keep the car - you could end up owing more than it's worth (underwater)."
    ]
  };

  const calculatePayment = () => {
    const price = parseFloat(vehiclePrice);
    const tradeIn = parseFloat(tradeInValue) || 0;
    const owed = parseFloat(tradeInOwed) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate);
    const months = parseFloat(loanTerm);
    const tax = parseFloat(taxRate) || 0;

    if (!price || !rate || !months || price <= 0 || rate < 0 || months <= 0) return;

    // Net trade-in value (can be negative)
    const netTradeIn = tradeIn - owed;

    // Sales tax on vehicle price
    const salesTax = price * (tax / 100);

    // Amount to finance
    const loanAmount = price + salesTax - netTradeIn - down;

    if (loanAmount <= 0) {
      setResult({
        monthlyPayment: 0,
        loanAmount: 0,
        totalInterest: 0,
        totalPaid: 0,
        salesTax,
        netTradeIn,
        totalCost: price + salesTax
      });
      return;
    }

    // Monthly interest rate
    const monthlyRate = rate / 100 / 12;

    // Monthly payment formula
    const monthlyPayment = loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    // Total paid over life of loan
    const totalPaid = monthlyPayment * months;
    const totalInterest = totalPaid - loanAmount;
    const totalCost = price + salesTax;

    setResult({
      monthlyPayment,
      loanAmount,
      totalInterest,
      totalPaid,
      salesTax,
      netTradeIn,
      totalCost
    });

    trackCalculatorUsage('Car Payment Calculator', {
      vehiclePrice: price.toString(),
      loanTerm: months.toString(),
      monthlyPayment: monthlyPayment.toFixed(2)
    });
  };

  return (
    <CalculatorLayout
      title="Car Payment Calculator"
      description="Calculate monthly car payments with down payment, trade-in value, and interest rates. Compare loan terms to understand the true cost of financing your vehicle."
    >
      <CalculatorSchema
        name="Car Payment Calculator"
        description="Free auto loan calculator to estimate monthly car payments. Factor in down payment, trade-in value, interest rate, and loan term for accurate payment calculations."
        url="/calculators/car-payment"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculatePayment(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="vehiclePrice" className={styles.label}>
            Vehicle Price ($)
          </label>
          <input
            id="vehiclePrice"
            type="number"
            className={styles.input}
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(e.target.value)}
            placeholder="Enter vehicle price"
            step="100"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="downPayment" className={styles.label}>
            Down Payment ($)
          </label>
          <input
            id="downPayment"
            type="number"
            className={styles.input}
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="Enter down payment"
            step="100"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tradeInValue" className={styles.label}>
            Trade-In Value ($)
          </label>
          <input
            id="tradeInValue"
            type="number"
            className={styles.input}
            value={tradeInValue}
            onChange={(e) => setTradeInValue(e.target.value)}
            placeholder="Trade-in value (optional)"
            step="100"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tradeInOwed" className={styles.label}>
            Amount Owed on Trade-In ($)
          </label>
          <input
            id="tradeInOwed"
            type="number"
            className={styles.input}
            value={tradeInOwed}
            onChange={(e) => setTradeInOwed(e.target.value)}
            placeholder="Amount still owed (optional)"
            step="100"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="taxRate" className={styles.label}>
            Sales Tax Rate (%)
          </label>
          <input
            id="taxRate"
            type="number"
            className={styles.input}
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            placeholder="Enter sales tax rate"
            step="0.1"
            min="0"
            max="15"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="interestRate" className={styles.label}>
            Interest Rate (APR %)
          </label>
          <input
            id="interestRate"
            type="number"
            className={styles.input}
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter interest rate"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="loanTerm" className={styles.label}>
            Loan Term (months)
          </label>
          <select
            id="loanTerm"
            className={styles.select}
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          >
            <option value="24">24 months (2 years)</option>
            <option value="36">36 months (3 years)</option>
            <option value="48">48 months (4 years)</option>
            <option value="60">60 months (5 years)</option>
            <option value="72">72 months (6 years)</option>
            <option value="84">84 months (7 years)</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Payment
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Monthly Payment</span>
            <span className={styles.resultValuePrimary}>${result.monthlyPayment.toFixed(2)}</span>
          </div>

          <div style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e0e0e0' }}>Loan Breakdown</h3>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Vehicle Price</span>
              <span className={styles.resultValue}>${parseFloat(vehiclePrice).toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Sales Tax</span>
              <span className={styles.resultValue}>${result.salesTax.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Vehicle Cost</span>
              <span className={styles.resultValue}>${result.totalCost.toFixed(2)}</span>
            </div>
            {result.netTradeIn !== 0 && (
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Net Trade-In Value</span>
                <span className={styles.resultValue}>
                  {result.netTradeIn >= 0 ? '-' : '+'}${Math.abs(result.netTradeIn).toFixed(2)}
                </span>
              </div>
            )}
            {parseFloat(downPayment) > 0 && (
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Down Payment</span>
                <span className={styles.resultValue}>-${parseFloat(downPayment).toFixed(2)}</span>
              </div>
            )}
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Loan Amount</span>
              <span className={styles.resultValue}>${result.loanAmount.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e0e0e0' }}>Total Cost</h3>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Interest Paid</span>
              <span className={styles.resultValue}>${result.totalInterest.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Amount Paid</span>
              <span className={styles.resultValue}>${result.totalPaid.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Out-of-Pocket</span>
              <span className={styles.resultValue}>
                ${(result.totalPaid + parseFloat(downPayment || '0')).toFixed(2)}
              </span>
            </div>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This calculation does not include dealer fees, registration, documentation fees,
            or extended warranties. Actual costs may be higher. Always review the final loan documents carefully
            before signing.
          </div>

          {result.netTradeIn < 0 && (
            <div className={styles.warning}>
              <strong>Negative Equity Warning:</strong> You owe more on your trade-in than it's worth.
              The difference of ${Math.abs(result.netTradeIn).toFixed(2)} is being added to your new loan,
              which increases your monthly payment and puts you underwater on the new vehicle from day one.
            </div>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('finance', 3)}
        calculatorName="Car Payment Calculator"
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
