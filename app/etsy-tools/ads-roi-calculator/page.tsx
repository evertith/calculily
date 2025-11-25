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

export default function EtsyAdsRoiCalculator() {
  const [dailyBudget, setDailyBudget] = useState<string>('');
  const [averageCpc, setAverageCpc] = useState<string>('');
  const [conversionRate, setConversionRate] = useState<string>('');
  const [averageOrderValue, setAverageOrderValue] = useState<string>('');
  const [profitMargin, setProfitMargin] = useState<string>('');
  const [daysRunning, setDaysRunning] = useState<string>('30');
  const [result, setResult] = useState<any>(null);
  const { trackCalculatorUsage } = useAnalytics();

  const calculateRoi = () => {
    const budget = parseFloat(dailyBudget) || 0;
    const cpc = parseFloat(averageCpc) || 0;
    const conversion = parseFloat(conversionRate) || 0;
    const aov = parseFloat(averageOrderValue) || 0;
    const margin = parseFloat(profitMargin) || 0;
    const days = parseInt(daysRunning) || 30;

    if (budget <= 0 || cpc <= 0 || aov <= 0) return;

    // Calculate metrics
    const totalAdSpend = budget * days;
    const dailyClicks = budget / cpc;
    const totalClicks = dailyClicks * days;
    const conversionRateDecimal = conversion / 100;
    const dailySales = dailyClicks * conversionRateDecimal;
    const totalSales = dailySales * days;
    const dailyRevenue = dailySales * aov;
    const totalRevenue = dailyRevenue * days;

    // Etsy fees on ad-driven sales (approximate)
    // Transaction: 6.5%, Payment: 3% + $0.25, Listing: $0.20
    const etsyFeeRate = 0.095; // 9.5% approximate
    const fixedFeePerSale = 0.45; // $0.20 listing + $0.25 payment
    const totalEtsyFees = (totalRevenue * etsyFeeRate) + (totalSales * fixedFeePerSale);

    // Profit calculation
    const marginDecimal = margin / 100;
    const grossProfit = totalRevenue * marginDecimal;
    const netProfitBeforeAds = grossProfit - totalEtsyFees;
    const netProfitAfterAds = netProfitBeforeAds - totalAdSpend;

    // ROI and ROAS calculations
    const roas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
    const roi = totalAdSpend > 0 ? ((netProfitAfterAds) / totalAdSpend) * 100 : 0;

    // Break-even calculations
    // To break even: revenue * margin - etsy_fees - ad_spend = 0
    // Required CPC for break-even at current conversion rate
    const profitPerSale = (aov * marginDecimal) - (aov * etsyFeeRate) - fixedFeePerSale;
    const breakEvenCpc = profitPerSale * conversionRateDecimal;
    const breakEvenConversionRate = cpc / profitPerSale * 100;

    // Cost per acquisition
    const cpa = totalSales > 0 ? totalAdSpend / totalSales : 0;

    // Is this profitable?
    const isProfitable = netProfitAfterAds > 0;
    const profitabilityThreshold = profitPerSale; // Max CPA to be profitable

    setResult({
      totalAdSpend,
      dailyClicks,
      totalClicks,
      dailySales,
      totalSales,
      dailyRevenue,
      totalRevenue,
      totalEtsyFees,
      grossProfit,
      netProfitBeforeAds,
      netProfitAfterAds,
      roas,
      roi,
      cpa,
      breakEvenCpc,
      breakEvenConversionRate,
      isProfitable,
      profitabilityThreshold,
      days,
      cpc,
      conversionRateDecimal
    });

    trackCalculatorUsage('Etsy Ads ROI Calculator', {
      daily_budget: budget,
      average_cpc: cpc,
      conversion_rate: conversion,
      aov: aov,
      profit_margin: margin,
      roas: roas,
      roi: roi,
      is_profitable: isProfitable
    });
  };

  const contentData = {
    howToUse: {
      intro: "Calculate whether your Etsy Ads are actually profitable:",
      steps: [
        "Enter your daily ad budget (what you set in Etsy Ads).",
        "Input your average cost per click (CPC) from Etsy Ads dashboard.",
        "Add your conversion rate (sales / clicks, typically 1-5% on Etsy).",
        "Enter your average order value from your shop stats.",
        "Input your profit margin BEFORE Etsy fees (materials + labor markup).",
        "Click 'Calculate ROI' to see if your ads are making or losing money."
      ]
    },
    whyMatters: {
      description: "Many Etsy sellers run ads without knowing if they're actually profitable. With Etsy's complex fee structure layered on top of ad costs, it's easy to spend money on ads that generate sales but lose money overall. Understanding your true ROI helps you optimize ad spend, set appropriate budgets, and know when to pause underperforming campaigns.",
      benefits: [
        "Know if your ads are truly profitable after all fees",
        "Calculate your break-even CPC and conversion rate",
        "Understand cost per acquisition vs. profit per sale",
        "Make data-driven decisions about ad budget",
        "Identify when to scale up or pause campaigns"
      ]
    },
    examples: [
      {
        title: "Profitable Campaign",
        scenario: "$5/day budget, $0.30 CPC, 3% conversion, $40 AOV, 50% margin.",
        calculation: "~17 clicks/day, ~0.5 sales/day, $20 revenue, $10 gross profit",
        result: "After $5 ads + ~$2 Etsy fees = ~$3 net profit/day. ROAS: 4x. Keep it running!"
      },
      {
        title: "Break-Even Campaign",
        scenario: "$10/day budget, $0.50 CPC, 2% conversion, $35 AOV, 40% margin.",
        calculation: "20 clicks/day, 0.4 sales/day, $14 revenue, $5.60 gross profit",
        result: "After $10 ads + ~$1.50 fees = -$5.90/day. ROAS: 1.4x. Needs optimization!"
      },
      {
        title: "Losing Campaign",
        scenario: "$15/day budget, $0.80 CPC, 1% conversion, $25 AOV, 35% margin.",
        calculation: "~19 clicks/day, 0.19 sales/day, $4.75 revenue, $1.66 gross profit",
        result: "After $15 ads + ~$0.50 fees = -$13.84/day. ROAS: 0.3x. Pause immediately!"
      }
    ],
    commonMistakes: [
      "Looking only at ROAS without accounting for Etsy's fees on those sales.",
      "Setting budgets based on revenue instead of profit - high sales can still lose money.",
      "Not tracking conversion rate over time - it fluctuates seasonally.",
      "Running ads on low-margin items where CPA exceeds profit per sale.",
      "Expecting immediate results - Etsy's algorithm needs 2-4 weeks to optimize."
    ]
  };

  const faqItems = [
    {
      question: "What is a good ROAS for Etsy Ads?",
      answer: "ROAS (Return on Ad Spend) of 4x or higher is generally considered good for Etsy. This means for every $1 spent on ads, you generate $4 in revenue. However, ROAS alone doesn't tell the full story - you need to factor in your profit margin and Etsy fees. A 4x ROAS with 50% margins is profitable, but 4x ROAS with 20% margins might not be."
    },
    {
      question: "What's a typical Etsy Ads conversion rate?",
      answer: "Etsy Ads conversion rates typically range from 1-5%, with 2-3% being average for most categories. High-demand items or seasonal products may see 5-10% during peak times. New shops or niche products might see 0.5-1%. If your rate is below 1%, focus on improving listings (photos, titles, pricing) before increasing ad spend."
    },
    {
      question: "How much should I spend on Etsy Ads?",
      answer: "Start with $1-5/day to test and gather data. After 2-4 weeks, analyze your results. If ROAS is 4x+ and you're profitable, consider scaling up gradually. Never spend more than you can afford to lose while testing. Many successful sellers spend 10-20% of their revenue on ads once they find profitable campaigns."
    },
    {
      question: "Should I use Etsy Ads or Offsite Ads?",
      answer: "They serve different purposes. Etsy Ads show your listings within Etsy search results - you control the budget and can pause anytime. Offsite Ads promote your listings on Google, Facebook, etc. - you can't control when they run (mandatory over $10K/year) and pay 12-15% only when they result in a sale. For most sellers, focus on optimizing Etsy Ads first."
    },
    {
      question: "Why are my Etsy Ads not converting?",
      answer: "Common reasons include: (1) Photos don't stand out in search results, (2) Pricing is higher than competitors, (3) Titles/tags don't match what buyers search, (4) Listings lack reviews or have low ratings, (5) Products are too niche or seasonal. Ads bring traffic, but your listing quality determines conversions."
    },
    {
      question: "How long should I run Etsy Ads before deciding if they work?",
      answer: "Give campaigns at least 2-4 weeks with consistent daily budget. Etsy's algorithm needs time to learn which searches your listings perform best for. Check results weekly but don't make major changes daily. After 30 days, you should have enough data to make informed decisions about continuing, adjusting, or pausing."
    }
  ];

  return (
    <CalculatorLayout
      title="Etsy Ads ROI Calculator"
      description="Calculate your Etsy Ads return on investment. See if your ad spend is actually profitable after all Etsy fees and costs."
    >
      <CalculatorSchema
        name="Etsy Ads ROI Calculator"
        description="Free Etsy Ads ROI calculator to determine if your advertising is profitable. Calculate ROAS, break-even CPC, and true profit after Etsy fees."
        url="/etsy-tools/ads-roi-calculator"
        faqItems={faqItems}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <Link href="/" style={{ color: '#4a9eff' }}>Home</Link>
        {' > '}
        <Link href="/etsy-tools" style={{ color: '#4a9eff' }}>Etsy Tools</Link>
        {' > '}
        <span>Ads ROI Calculator</span>
      </div>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateRoi(); }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Ad Campaign Settings</h3>

          <div className={styles.formGroup}>
            <label htmlFor="dailyBudget" className={styles.label}>
              Daily Ad Budget ($) *
            </label>
            <input
              id="dailyBudget"
              type="number"
              className={styles.input}
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value)}
              placeholder="e.g., 5.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="averageCpc" className={styles.label}>
              Average Cost Per Click (CPC) ($) *
            </label>
            <input
              id="averageCpc"
              type="number"
              className={styles.input}
              value={averageCpc}
              onChange={(e) => setAverageCpc(e.target.value)}
              placeholder="e.g., 0.35"
              step="0.01"
              min="0.01"
              required
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Find this in your Etsy Ads dashboard under "Avg. CPC"
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="conversionRate" className={styles.label}>
              Conversion Rate (%) *
            </label>
            <input
              id="conversionRate"
              type="number"
              className={styles.input}
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              placeholder="e.g., 2.5"
              step="0.1"
              min="0.1"
              required
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Orders from ads / Clicks from ads. Typical: 1-5%
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="daysRunning" className={styles.label}>
              Days Running
            </label>
            <select
              id="daysRunning"
              className={styles.select}
              value={daysRunning}
              onChange={(e) => setDaysRunning(e.target.value)}
            >
              <option value="7">7 days (1 week)</option>
              <option value="14">14 days (2 weeks)</option>
              <option value="30">30 days (1 month)</option>
              <option value="90">90 days (3 months)</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Product Economics</h3>

          <div className={styles.formGroup}>
            <label htmlFor="averageOrderValue" className={styles.label}>
              Average Order Value ($) *
            </label>
            <input
              id="averageOrderValue"
              type="number"
              className={styles.input}
              value={averageOrderValue}
              onChange={(e) => setAverageOrderValue(e.target.value)}
              placeholder="e.g., 35.00"
              step="0.01"
              min="0.01"
              required
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Your typical sale amount including shipping
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="profitMargin" className={styles.label}>
              Profit Margin BEFORE Etsy Fees (%) *
            </label>
            <input
              id="profitMargin"
              type="number"
              className={styles.input}
              value={profitMargin}
              onChange={(e) => setProfitMargin(e.target.value)}
              placeholder="e.g., 50"
              step="1"
              min="1"
              max="100"
              required
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              (Price - Materials - Labor) / Price. Don't include Etsy fees here.
            </small>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Calculate ROI
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          {/* Profitability Summary */}
          <div style={{
            padding: '2rem',
            backgroundColor: result.isProfitable ? '#1a2a1a' : '#2a1a1a',
            borderRadius: '12px',
            border: `2px solid ${result.isProfitable ? '#4caf50' : '#ff6b6b'}`,
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: result.isProfitable ? '#4caf50' : '#ff6b6b',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              {result.isProfitable ? 'PROFITABLE' : 'NOT PROFITABLE'}
            </h3>
            <p style={{ color: '#b0b0b0', marginBottom: '1.5rem' }}>
              {result.isProfitable
                ? 'Your Etsy Ads are generating positive returns!'
                : 'Your Etsy Ads are losing money. See recommendations below.'
              }
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Net Profit ({result.days} days)</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: result.netProfitAfterAds >= 0 ? '#4caf50' : '#ff6b6b'
                }}>
                  ${result.netProfitAfterAds.toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>ROAS</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: result.roas >= 4 ? '#4caf50' : result.roas >= 2 ? '#ffaa00' : '#ff6b6b'
                }}>
                  {result.roas.toFixed(1)}x
                </div>
              </div>
              <div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>ROI</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: result.roi >= 0 ? '#4caf50' : '#ff6b6b'
                }}>
                  {result.roi.toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Campaign Performance ({result.days} days)</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0' }}>Total Ad Spend</td>
                  <td style={{ padding: '0.75rem 0', color: '#ff6b6b', textAlign: 'right', fontWeight: 600 }}>
                    -${result.totalAdSpend.toFixed(2)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0' }}>Total Clicks</td>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>
                    {Math.round(result.totalClicks).toLocaleString()}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0' }}>Estimated Sales</td>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>
                    {result.totalSales.toFixed(1)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0' }}>Total Revenue</td>
                  <td style={{ padding: '0.75rem 0', color: '#4caf50', textAlign: 'right', fontWeight: 600 }}>
                    +${result.totalRevenue.toFixed(2)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0' }}>Gross Profit (before fees)</td>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>
                    ${result.grossProfit.toFixed(2)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0' }}>Estimated Etsy Fees</td>
                  <td style={{ padding: '0.75rem 0', color: '#ff6b6b', textAlign: 'right' }}>
                    -${result.totalEtsyFees.toFixed(2)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0' }}>Profit Before Ads</td>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>
                    ${result.netProfitBeforeAds.toFixed(2)}
                  </td>
                </tr>
                <tr style={{ borderTop: '2px solid #4a9eff' }}>
                  <td style={{ padding: '0.75rem 0', color: '#4a9eff', fontWeight: 600 }}>NET PROFIT AFTER ADS</td>
                  <td style={{
                    padding: '0.75rem 0',
                    color: result.netProfitAfterAds >= 0 ? '#4caf50' : '#ff6b6b',
                    textAlign: 'right',
                    fontWeight: 700,
                    fontSize: '1.25rem'
                  }}>
                    ${result.netProfitAfterAds.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key Metrics */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Key Metrics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Cost Per Acquisition</div>
                <div style={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 600 }}>${result.cpa.toFixed(2)}</div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>
                  Max profitable: ${result.profitabilityThreshold.toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Break-Even CPC</div>
                <div style={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 600 }}>
                  ${result.breakEvenCpc > 0 ? result.breakEvenCpc.toFixed(2) : 'N/A'}
                </div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>
                  Current: ${result.cpc.toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Break-Even Conv. Rate</div>
                <div style={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 600 }}>
                  {result.breakEvenConversionRate > 0 && result.breakEvenConversionRate < 100
                    ? `${result.breakEvenConversionRate.toFixed(1)}%`
                    : 'N/A'}
                </div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>
                  Current: {(result.conversionRateDecimal * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {!result.isProfitable ? (
            <InfoBox type="warning" title="Recommendations to Improve ROI">
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                <li><strong>Lower your CPC:</strong> Your break-even CPC is ${result.breakEvenCpc > 0 ? result.breakEvenCpc.toFixed(2) : 'very low'}. Pause high-CPC listings or reduce bids.</li>
                <li><strong>Improve conversion rate:</strong> Better photos, competitive pricing, and strong reviews increase conversions.</li>
                <li><strong>Increase AOV:</strong> Bundle products, offer variations, or target higher-priced items with ads.</li>
                <li><strong>Improve margins:</strong> Reduce material costs or increase prices if market allows.</li>
                <li><strong>Pause and optimize:</strong> Sometimes pausing for 1-2 weeks while improving listings is better than losing money.</li>
              </ul>
            </InfoBox>
          ) : (
            <InfoBox type="success" title="Your Campaign is Profitable!">
              <p>Consider these strategies to scale:</p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                <li><strong>Gradually increase budget:</strong> Add $1-2/day weekly while monitoring ROI.</li>
                <li><strong>Expand to similar products:</strong> Run ads on products with similar economics.</li>
                <li><strong>Monitor seasonality:</strong> Performance may vary - track trends over time.</li>
                <li><strong>Don't over-optimize:</strong> If it's working, small tweaks can hurt performance.</li>
              </ul>
            </InfoBox>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <InfoBox type="info" title="Calculate Your Complete Etsy Costs">
        <p>Ads are just one cost. Make sure you know your full fee structure:</p>
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
          <Link href="/etsy-tools/listing-fee-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Listing Fee Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Project listing fee costs</div>
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
