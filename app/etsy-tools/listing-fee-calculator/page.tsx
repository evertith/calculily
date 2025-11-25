'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import InfoBox from '@/components/InfoBox';
import AdUnit from '@/components/AdUnit';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

export default function EtsyListingFeeCalculator() {
  const [numberOfListings, setNumberOfListings] = useState<string>('');
  const [listingDuration, setListingDuration] = useState<string>('4');
  const [autoRenew, setAutoRenew] = useState(true);
  const [multiQuantity, setMultiQuantity] = useState<string>('1');
  const [monthsToProject, setMonthsToProject] = useState<string>('12');
  const [averageSalesPerMonth, setAverageSalesPerMonth] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const { trackCalculatorUsage } = useAnalytics();

  const calculateFees = () => {
    const listings = parseInt(numberOfListings) || 0;
    const duration = parseInt(listingDuration) || 4;
    const quantity = parseInt(multiQuantity) || 1;
    const months = parseInt(monthsToProject) || 12;
    const salesPerMonth = parseInt(averageSalesPerMonth) || 0;

    if (listings <= 0) return;

    const listingFee = 0.20;

    // Initial listing cost
    const initialListingCost = listings * listingFee;

    // Calculate renewals per listing
    const renewalsPerYear = autoRenew ? Math.floor(12 / duration) : 0;

    // Monthly listing fee breakdown
    const monthlyRenewalCost = autoRenew ? (listings * listingFee * (1 / duration)) : 0;

    // Multi-quantity listing fees (charged per quantity when sold)
    // Each additional quantity beyond the first triggers a $0.20 fee when sold
    const multiQuantityFeePerSale = quantity > 1 ? listingFee : 0;
    const monthlyMultiQuantityFees = salesPerMonth * multiQuantityFeePerSale;

    // Sale renewal fees (listing auto-renews when an item sells)
    const monthlySaleRenewalFees = salesPerMonth * listingFee;

    // Total monthly fees
    const totalMonthlyFees = monthlyRenewalCost + monthlyMultiQuantityFees + monthlySaleRenewalFees;

    // Projected costs
    const projectedRenewalCost = monthlyRenewalCost * months;
    const projectedSaleRenewalCost = monthlySaleRenewalFees * months;
    const projectedMultiQuantityCost = monthlyMultiQuantityFees * months;
    const totalProjectedCost = initialListingCost + projectedRenewalCost + projectedSaleRenewalCost + projectedMultiQuantityCost;

    // Yearly breakdown
    const yearlyRenewalCost = monthlyRenewalCost * 12;
    const yearlySaleRenewalCost = monthlySaleRenewalFees * 12;
    const yearlyMultiQuantityCost = monthlyMultiQuantityFees * 12;
    const totalYearlyCost = yearlyRenewalCost + yearlySaleRenewalCost + yearlyMultiQuantityCost;

    setResult({
      initialListingCost,
      listingFee,
      listings,
      renewalsPerYear,
      monthlyRenewalCost,
      monthlyMultiQuantityFees,
      monthlySaleRenewalFees,
      totalMonthlyFees,
      projectedRenewalCost,
      projectedSaleRenewalCost,
      projectedMultiQuantityCost,
      totalProjectedCost,
      yearlyRenewalCost,
      yearlySaleRenewalCost,
      yearlyMultiQuantityCost,
      totalYearlyCost,
      months,
      salesPerMonth,
      quantity,
      autoRenew
    });

    trackCalculatorUsage('Etsy Listing Fee Calculator', {
      number_of_listings: listings,
      auto_renew: autoRenew,
      months_projected: months,
      monthly_sales: salesPerMonth,
      total_projected_cost: totalProjectedCost
    });
  };

  const contentData = {
    howToUse: {
      intro: "Calculate your Etsy listing fees and project costs over time:",
      steps: [
        "Enter the number of listings you plan to create or currently have.",
        "Select the listing duration (standard is 4 months).",
        "Enable auto-renew if your listings automatically renew when they expire.",
        "If you use multi-quantity listings, enter the quantity per listing.",
        "Add your average monthly sales to calculate sale renewal fees.",
        "Click 'Calculate' to see your projected listing costs."
      ]
    },
    whyMatters: {
      description: "Etsy's $0.20 listing fee seems small, but it adds up fast. Every time you create a listing, it expires and auto-renews, or when an item sells, you're charged $0.20. Sellers with hundreds of listings and high sales volume can spend hundreds of dollars annually just on listing fees. Understanding these costs helps you make informed decisions about your inventory strategy and pricing.",
      benefits: [
        "Project monthly and yearly listing fee expenses",
        "Understand the true cost of auto-renew",
        "Calculate multi-quantity listing fee impact",
        "Plan inventory size based on fee budget",
        "Make informed decisions about listing strategies"
      ]
    },
    examples: [
      {
        title: "Small Shop (50 listings)",
        scenario: "50 listings with auto-renew, 20 sales per month.",
        calculation: "Initial: $10 | Monthly renewals: ~$2.50 | Sale renewals: $4/month",
        result: "~$78/year in listing fees. Manageable for most small shops."
      },
      {
        title: "Medium Shop (200 listings)",
        scenario: "200 listings with auto-renew, 100 sales per month.",
        calculation: "Initial: $40 | Monthly renewals: ~$10 | Sale renewals: $20/month",
        result: "~$360/year in listing fees. Factor this into your pricing!"
      },
      {
        title: "High-Volume Shop (500 listings)",
        scenario: "500 listings, multi-quantity, 300 sales per month.",
        calculation: "Initial: $100 | Monthly renewals: ~$25 | Sale renewals: $60/month",
        result: "~$1,020/year just in listing fees! Significant cost to track."
      }
    ],
    commonMistakes: [
      "Forgetting that listing fees are charged when items SELL (auto-renews to relist).",
      "Not accounting for multi-quantity listings - each sale triggers a $0.20 fee.",
      "Creating too many listings without sales - paying renewal fees with no return.",
      "Ignoring the cumulative cost when scaling up inventory.",
      "Not factoring listing fees into per-item profit calculations."
    ]
  };

  const faqItems = [
    {
      question: "When am I charged the $0.20 listing fee?",
      answer: "You're charged $0.20 in three situations: (1) When you first create a listing, (2) When a listing expires after 4 months and auto-renews, (3) When an item sells and the listing automatically renews to relist it. If you have multi-quantity listings, you're charged $0.20 for each sale, not each quantity."
    },
    {
      question: "What is multi-quantity listing and how do fees work?",
      answer: "Multi-quantity listings let you sell multiple identical items under one listing (e.g., 10 units of the same t-shirt). You pay $0.20 to create the listing initially. When someone buys, you pay $0.20 regardless of how many they purchase in that transaction. If you have 10 units and someone buys 3, you pay $0.20 for that sale, and your quantity drops to 7."
    },
    {
      question: "Should I turn off auto-renew?",
      answer: "It depends on your strategy. Auto-renew keeps your listings active and searchable, which is important for SEO. However, if a listing hasn't sold in multiple 4-month cycles, you're paying $0.20 repeatedly for potentially stale inventory. Consider turning off auto-renew for slow-moving items and manually reviewing them."
    },
    {
      question: "How can I reduce my listing fees?",
      answer: "Strategies include: (1) Consolidate similar items into multi-quantity listings instead of separate listings, (2) Turn off auto-renew for items that consistently don't sell, (3) Delete listings that haven't sold in 6+ months, (4) Focus on fewer, higher-quality listings that actually convert, (5) Use digital downloads which don't auto-renew after sale."
    },
    {
      question: "Are digital download listing fees different?",
      answer: "Digital downloads work slightly differently. You still pay $0.20 to create the listing, but since there's unlimited inventory, the listing doesn't auto-renew after a sale in the same way. However, the listing still expires and renews every 4 months if auto-renew is on. This makes digital downloads more cost-effective for high-volume sellers."
    },
    {
      question: "Do listing fees apply to variations?",
      answer: "No, variations (like different sizes or colors) within a single listing don't incur additional listing fees. This is why using variations is more cost-effective than creating separate listings for each option. One listing with 10 color variations costs $0.20, while 10 separate listings would cost $2.00."
    }
  ];

  return (
    <CalculatorLayout
      title="Etsy Listing Fee Calculator"
      description="Calculate your Etsy listing fees including auto-renewals, multi-quantity listings, and sale renewals. Project monthly and yearly costs."
    >
      <CalculatorSchema
        name="Etsy Listing Fee Calculator"
        description="Free Etsy listing fee calculator to project your monthly and yearly listing costs. Calculate auto-renewal fees, multi-quantity listing costs, and sale renewal charges."
        url="/etsy-tools/listing-fee-calculator"
        faqItems={faqItems}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <Link href="/" style={{ color: '#4a9eff' }}>Home</Link>
        {' > '}
        <Link href="/etsy-tools" style={{ color: '#4a9eff' }}>Etsy Tools</Link>
        {' > '}
        <span>Listing Fee Calculator</span>
      </div>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateFees(); }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Listing Details</h3>

          <div className={styles.formGroup}>
            <label htmlFor="numberOfListings" className={styles.label}>
              Number of Listings *
            </label>
            <input
              id="numberOfListings"
              type="number"
              className={styles.input}
              value={numberOfListings}
              onChange={(e) => setNumberOfListings(e.target.value)}
              placeholder="Enter number of listings"
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="listingDuration" className={styles.label}>
              Listing Duration
            </label>
            <select
              id="listingDuration"
              className={styles.select}
              value={listingDuration}
              onChange={(e) => setListingDuration(e.target.value)}
            >
              <option value="4">4 months (standard)</option>
            </select>
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              All Etsy listings expire after 4 months
            </small>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span className={styles.label}>Auto-Renew Enabled</span>
            </label>
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Listings automatically renew every 4 months ($0.20 each)
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="multiQuantity" className={styles.label}>
              Average Quantity Per Listing
            </label>
            <input
              id="multiQuantity"
              type="number"
              className={styles.input}
              value={multiQuantity}
              onChange={(e) => setMultiQuantity(e.target.value)}
              placeholder="1"
              min="1"
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              For multi-quantity listings (e.g., 10 units of same item)
            </small>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Sales & Projection</h3>

          <div className={styles.formGroup}>
            <label htmlFor="averageSalesPerMonth" className={styles.label}>
              Average Sales Per Month
            </label>
            <input
              id="averageSalesPerMonth"
              type="number"
              className={styles.input}
              value={averageSalesPerMonth}
              onChange={(e) => setAverageSalesPerMonth(e.target.value)}
              placeholder="0"
              min="0"
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Each sale triggers a $0.20 listing renewal fee
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="monthsToProject" className={styles.label}>
              Months to Project
            </label>
            <select
              id="monthsToProject"
              className={styles.select}
              value={monthsToProject}
              onChange={(e) => setMonthsToProject(e.target.value)}
            >
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months (1 year)</option>
              <option value="24">24 months (2 years)</option>
            </select>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Listing Fees
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.25rem' }}>Listing Fee Breakdown</h3>

          {/* Initial Costs */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a2332', borderRadius: '8px', border: '1px solid #4a9eff' }}>
            <h4 style={{ color: '#4a9eff', marginBottom: '1rem' }}>Initial Setup Cost</h4>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>{result.listings} listings @ $0.20 each</span>
              <span className={styles.resultValuePrimary}>${result.initialListingCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Monthly Fee Breakdown</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Fee Type</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Calculation</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Monthly Cost</th>
                </tr>
              </thead>
              <tbody>
                {result.autoRenew && (
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>Listing Renewals</td>
                    <td style={{ padding: '0.75rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>
                      {result.listings} listings / 4 months @ $0.20
                    </td>
                    <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>
                      ${result.monthlyRenewalCost.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>Sale Renewal Fees</td>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>
                    {result.salesPerMonth} sales @ $0.20 each
                  </td>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>
                    ${result.monthlySaleRenewalFees.toFixed(2)}
                  </td>
                </tr>
                {result.quantity > 1 && (
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>Multi-Quantity Fees</td>
                    <td style={{ padding: '0.75rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>
                      {result.salesPerMonth} sales @ $0.20
                    </td>
                    <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>
                      ${result.monthlyMultiQuantityFees.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr style={{ borderTop: '2px solid #4a9eff' }}>
                  <td style={{ padding: '0.75rem 0', color: '#4a9eff', fontWeight: 600 }} colSpan={2}>
                    TOTAL MONTHLY LISTING FEES
                  </td>
                  <td style={{ padding: '0.75rem 0', color: '#4a9eff', fontWeight: 600, textAlign: 'right' }}>
                    ${result.totalMonthlyFees.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Projected Costs */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Projected Costs ({result.months} months)</h4>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Initial Listing Cost</span>
              <span className={styles.resultValue}>${result.initialListingCost.toFixed(2)}</span>
            </div>
            {result.autoRenew && (
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Renewal Fees</span>
                <span className={styles.resultValue}>${result.projectedRenewalCost.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Sale Renewal Fees</span>
              <span className={styles.resultValue}>${result.projectedSaleRenewalCost.toFixed(2)}</span>
            </div>
            {result.quantity > 1 && (
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Multi-Quantity Fees</span>
                <span className={styles.resultValue}>${result.projectedMultiQuantityCost.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.resultItem} style={{ borderTop: '2px solid #4a9eff', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <span className={styles.resultLabel} style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                TOTAL {result.months}-MONTH COST
              </span>
              <span className={styles.resultValuePrimary}>${result.totalProjectedCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Yearly Summary */}
          <div style={{ padding: '1.5rem', backgroundColor: '#1a2332', borderRadius: '8px', border: '1px solid #4a9eff' }}>
            <h4 style={{ color: '#4a9eff', marginBottom: '1rem' }}>Annual Summary (After First Year)</h4>
            <p style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Yearly recurring costs (excludes initial listing setup):
            </p>
            <div className={styles.resultItem} style={{ borderBottom: 'none' }}>
              <span className={styles.resultLabel}>Estimated Yearly Listing Fees</span>
              <span className={styles.resultValuePrimary}>${result.totalYearlyCost.toFixed(2)}</span>
            </div>
          </div>

          {result.totalYearlyCost > 100 && (
            <InfoBox type="info" title="Cost Optimization Tip">
              Your projected listing fees are significant. Consider:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                <li>Using multi-quantity listings instead of separate listings</li>
                <li>Turning off auto-renew for slow-moving items</li>
                <li>Consolidating similar items with variations</li>
                <li>Deleting listings that haven't sold in 6+ months</li>
              </ul>
            </InfoBox>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <InfoBox type="info" title="Next Steps">
        <p>Listing fees are just one part of your Etsy costs. Calculate your complete profit:</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/etsy-tools/fee-calculator" className={styles.button} style={{ display: 'inline-block' }}>
            All Etsy Fees
          </Link>
          <Link href="/etsy-tools/profit-calculator" className={styles.button} style={{ display: 'inline-block', backgroundColor: '#333' }}>
            Profit Calculator
          </Link>
        </div>
      </InfoBox>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Related Etsy Tools</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Link href="/etsy-tools/fee-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Etsy Fee Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Calculate all Etsy seller fees</div>
          </Link>
          <Link href="/etsy-tools/profit-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Profit Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Calculate true profit after all costs</div>
          </Link>
          <Link href="/etsy-tools/startup-cost-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Startup Cost Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Plan your shop launch costs</div>
          </Link>
        </div>
      </div>

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      <CalculatorContent
        howToUse={contentData.howToUse}
        whyMatters={contentData.whyMatters}
        examples={contentData.examples}
        commonMistakes={contentData.commonMistakes}
      />

      <FAQ items={faqItems} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
