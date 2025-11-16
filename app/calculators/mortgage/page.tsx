'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('20');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('');
  const [propertyTax, setPropertyTax] = useState<string>('1.2');
  const [insurance, setInsurance] = useState<string>('');
  const [hoa, setHoa] = useState<string>('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalPaid: number;
    downPaymentAmount: number;
    principal: number;
    monthlyPropertyTax: number;
    monthlyInsurance: number;
    monthlyHoa: number;
    totalMonthly: number;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const faqItems = [
    {
      question: "Should I put 20% down?",
      answer: "Putting 20% down is often recommended because it helps you avoid Private Mortgage Insurance (PMI), which typically adds 0.5-1% of the loan amount annually. However, if you can get a good interest rate and have other investment opportunities, a smaller down payment might make sense. Consider your full financial picture, emergency savings, and local market conditions when deciding."
    },
    {
      question: "What's the difference between a 15-year and 30-year mortgage?",
      answer: "A 15-year mortgage has higher monthly payments but you'll pay much less interest overall and own your home faster. A 30-year mortgage has lower monthly payments, giving you more flexibility, but you'll pay significantly more interest over time. For example, on a $300,000 loan at 6%, you'd save over $200,000 in interest with a 15-year term, but pay about $800 more per month."
    },
    {
      question: "What is included in my monthly mortgage payment?",
      answer: "Your total monthly payment typically includes Principal (loan repayment), Interest (cost of borrowing), Taxes (property taxes), and Insurance (homeowners insurance and PMI if applicable) - often called PITI. Many lenders also include HOA fees if applicable. Use our advanced options to see your complete monthly cost."
    },
    {
      question: "How much house can I afford?",
      answer: "A general rule is that your monthly housing costs shouldn't exceed 28% of your gross monthly income, and your total debt payments shouldn't exceed 36%. However, this varies based on your location, other debts, and financial goals. Use this calculator to see what different home prices would cost monthly."
    },
    {
      question: "Should I pay points to lower my interest rate?",
      answer: "Paying points (prepaid interest) can lower your rate, but you need to stay in the home long enough for the monthly savings to offset the upfront cost. Calculate your break-even point: if you pay $3,000 in points to save $50/month, you need to stay 60 months (5 years) to break even. If you plan to move or refinance sooner, points may not be worth it."
    }
  ];

  const relatedCalculators = [
    {
      title: "Loan Calculator",
      link: "/calculators/loan",
      description: "Calculate payments for personal loans and other financing"
    },
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips and split bills easily"
    }
  ];

  const calculateMortgage = () => {
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const term = parseInt(loanTerm);
    const rate = parseFloat(interestRate);

    const newErrors: string[] = [];

    if (!homePrice || price <= 0) {
      newErrors.push("Please enter a valid home price");
    }
    if (!downPayment || down < 0 || down > 100) {
      newErrors.push("Down payment must be between 0% and 100%");
    }
    if (!interestRate || rate <= 0) {
      newErrors.push("Please enter a valid interest rate");
    }
    if (price > 10000000) {
      newErrors.push("For homes over $10M, consult a mortgage specialist");
    }
    if (down < 20 && price > 0) {
      newErrors.push("Note: Down payments under 20% typically require PMI (not included in this calculation)");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      if (newErrors.filter(e => !e.startsWith("Note:")).length > 0) {
        return;
      }
    }

    setErrors(newErrors.filter(e => e.startsWith("Note:")));

    const principal = price - (price * down / 100);
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                           (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - principal;
    const downPaymentAmount = price * down / 100;

    // Calculate additional monthly costs
    const monthlyPropertyTax = propertyTax ? (price * parseFloat(propertyTax) / 100) / 12 : 0;
    const monthlyInsurance = insurance ? parseFloat(insurance) : 0;
    const monthlyHoa = hoa ? parseFloat(hoa) : 0;
    const totalMonthly = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyHoa;

    setResult({
      monthlyPayment,
      totalInterest,
      totalPaid,
      downPaymentAmount,
      principal,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyHoa,
      totalMonthly
    });

    // Track calculator usage
    trackCalculatorUsage('Mortgage Calculator', {
      home_price: price,
      down_payment_percent: down,
      loan_term: term,
      interest_rate: rate,
      monthly_payment: monthlyPayment
    });
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
            <option value="10">10 years</option>
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

        <button
          type="button"
          className={styles.button}
          style={{ background: '#333', marginBottom: '1rem' }}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        {showAdvanced && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="propertyTax" className={styles.label}>
                Annual Property Tax Rate (%)
              </label>
              <input
                id="propertyTax"
                type="number"
                className={styles.input}
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                placeholder="Enter property tax rate"
                step="0.1"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="insurance" className={styles.label}>
                Monthly Home Insurance ($)
              </label>
              <input
                id="insurance"
                type="number"
                className={styles.input}
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder="Enter monthly insurance cost"
                step="10"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="hoa" className={styles.label}>
                Monthly HOA Fees ($)
              </label>
              <input
                id="hoa"
                type="number"
                className={styles.input}
                value={hoa}
                onChange={(e) => setHoa(e.target.value)}
                placeholder="Enter monthly HOA fees"
                step="10"
                min="0"
              />
            </div>
          </>
        )}

        <button type="submit" className={styles.button}>
          Calculate Mortgage
        </button>
      </form>

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((error, index) => (
            <div key={index} className={styles.error}>
              {error}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Monthly P&I Payment</span>
            <span className={styles.resultValuePrimary}>${result.monthlyPayment.toFixed(2)}</span>
          </div>

          {showAdvanced && (result.monthlyPropertyTax > 0 || result.monthlyInsurance > 0 || result.monthlyHoa > 0) && (
            <>
              {result.monthlyPropertyTax > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Monthly Property Tax</span>
                  <span className={styles.resultValue}>${result.monthlyPropertyTax.toFixed(2)}</span>
                </div>
              )}
              {result.monthlyInsurance > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Monthly Insurance</span>
                  <span className={styles.resultValue}>${result.monthlyInsurance.toFixed(2)}</span>
                </div>
              )}
              {result.monthlyHoa > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Monthly HOA</span>
                  <span className={styles.resultValue}>${result.monthlyHoa.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Monthly Payment</span>
                <span className={styles.resultValuePrimary}>${result.totalMonthly.toFixed(2)}</span>
              </div>
            </>
          )}

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
            <strong>Note:</strong> This calculation shows principal and interest. {!showAdvanced && "Use advanced options to include property taxes, insurance, and HOA fees."}
          </div>

          {parseFloat(downPayment) < 20 && (
            <div className={styles.warning}>
              <strong>PMI Required:</strong> With less than 20% down, you'll typically need Private Mortgage Insurance, adding $50-150+ to your monthly payment until you reach 20% equity.
            </div>
          )}
        </div>
      )}

      <ProductRecommendation
        products={getProducts('finance', 3)}
        calculatorName="Mortgage Calculator"
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
