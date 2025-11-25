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

export default function EtsyVsAmazonCalculator() {
  const [salePrice, setSalePrice] = useState<string>('');
  const [shippingCharged, setShippingCharged] = useState<string>('');
  const [category, setCategory] = useState<string>('handmade');
  const [etsySalesVolume, setEtsySalesVolume] = useState<string>('under10k');
  const [fulfillmentMethod, setFulfillmentMethod] = useState<string>('merchant');
  const [itemWeight, setItemWeight] = useState<string>('1');
  const [result, setResult] = useState<any>(null);
  const { trackCalculatorUsage } = useAnalytics();

  const calculateComparison = () => {
    const price = parseFloat(salePrice) || 0;
    const shipping = parseFloat(shippingCharged) || 0;
    const weight = parseFloat(itemWeight) || 1;

    if (price <= 0) return;

    const totalSaleAmount = price + shipping;

    // ETSY FEES
    const etsyListingFee = 0.20;
    const etsyTransactionFee = totalSaleAmount * 0.065;
    const etsyPaymentProcessing = (totalSaleAmount * 0.03) + 0.25;
    let etsyOffsiteAdsFee = 0;
    if (etsySalesVolume === '10kto50k' || etsySalesVolume === 'over50k') {
      etsyOffsiteAdsFee = price * 0.12; // Mandatory 12% on item price
    }
    const totalEtsyFees = etsyListingFee + etsyTransactionFee + etsyPaymentProcessing + etsyOffsiteAdsFee;
    const etsyNetRevenue = totalSaleAmount - totalEtsyFees;
    const etsyFeePercentage = (totalEtsyFees / totalSaleAmount) * 100;

    // AMAZON HANDMADE FEES
    // Amazon Handmade: 15% referral fee (no monthly fee for Handmade)
    // No listing fee for Amazon Handmade
    const amazonReferralFee = price * 0.15;

    // FBA fees if applicable (simplified estimate based on weight)
    let amazonFbaFee = 0;
    let amazonShippingCredit = 0;
    if (fulfillmentMethod === 'fba') {
      // Simplified FBA fee calculation
      if (weight <= 0.5) {
        amazonFbaFee = 3.22; // Small standard
      } else if (weight <= 1) {
        amazonFbaFee = 3.86; // Large standard tier 1
      } else if (weight <= 2) {
        amazonFbaFee = 4.95; // Large standard tier 2
      } else {
        amazonFbaFee = 5.95 + ((weight - 2) * 0.40); // Estimate for heavier items
      }
      // Amazon provides shipping credit for FBA items
      amazonShippingCredit = shipping > 0 ? Math.min(shipping, price * 0.1) : 0;
    }

    // Per-item fee for sellers without Professional account
    // Most Handmade sellers use Professional ($39.99/month) so we'll note it
    const amazonPerItemFee = 0; // Assuming Professional account

    const totalAmazonFees = amazonReferralFee + amazonFbaFee + amazonPerItemFee;
    const amazonNetRevenue = totalSaleAmount - totalAmazonFees + amazonShippingCredit;
    const amazonFeePercentage = (totalAmazonFees / totalSaleAmount) * 100;

    // Comparison
    const feeDifference = totalEtsyFees - totalAmazonFees;
    const revenueDifference = etsyNetRevenue - amazonNetRevenue;
    const betterPlatform = etsyNetRevenue > amazonNetRevenue ? 'etsy' : amazonNetRevenue > etsyNetRevenue ? 'amazon' : 'tie';

    // Monthly comparison (at different volumes)
    const monthlySalesScenarios = [10, 25, 50, 100];
    const monthlyComparison = monthlySalesScenarios.map(sales => {
      const etsyMonthly = sales * totalEtsyFees;
      const amazonMonthly = (sales * totalAmazonFees) + 39.99; // Include Professional subscription
      return {
        sales,
        etsyFees: etsyMonthly,
        amazonFees: amazonMonthly,
        difference: etsyMonthly - amazonMonthly,
        better: etsyMonthly < amazonMonthly ? 'etsy' : amazonMonthly < etsyMonthly ? 'amazon' : 'tie'
      };
    });

    setResult({
      price,
      shipping,
      totalSaleAmount,
      // Etsy
      etsyListingFee,
      etsyTransactionFee,
      etsyPaymentProcessing,
      etsyOffsiteAdsFee,
      totalEtsyFees,
      etsyNetRevenue,
      etsyFeePercentage,
      hasOffsiteAds: etsyOffsiteAdsFee > 0,
      // Amazon
      amazonReferralFee,
      amazonFbaFee,
      amazonPerItemFee,
      amazonShippingCredit,
      totalAmazonFees,
      amazonNetRevenue,
      amazonFeePercentage,
      fulfillmentMethod,
      // Comparison
      feeDifference,
      revenueDifference,
      betterPlatform,
      monthlyComparison
    });

    trackCalculatorUsage('Etsy vs Amazon Calculator', {
      sale_price: price,
      category: category,
      etsy_fees: totalEtsyFees,
      amazon_fees: totalAmazonFees,
      better_platform: betterPlatform
    });
  };

  const contentData = {
    howToUse: {
      intro: "Compare fees between Etsy and Amazon Handmade for your products:",
      steps: [
        "Enter your product's sale price (what the customer pays for the item).",
        "Add shipping amount if charged separately.",
        "Select your product category.",
        "Choose your Etsy sales volume tier (affects offsite ads fees).",
        "Select Amazon fulfillment method (Merchant or FBA).",
        "Click 'Compare Platforms' to see the fee breakdown for both."
      ]
    },
    whyMatters: {
      description: "Etsy and Amazon Handmade have very different fee structures. Etsy charges smaller percentages but has multiple fee types that add up. Amazon has a higher base referral fee (15%) but fewer hidden costs. The right platform depends on your price point, sales volume, and product category. Some sellers succeed by selling on both platforms strategically.",
      benefits: [
        "See exact fees for both platforms side-by-side",
        "Understand which platform keeps you more profit",
        "Factor in volume-based fee changes (Etsy offsite ads)",
        "Consider FBA fees vs. self-fulfillment",
        "Make data-driven decisions about where to sell"
      ]
    },
    examples: [
      {
        title: "Low-Priced Item ($15)",
        scenario: "$15 item, $4 shipping, Etsy under $10K annual sales.",
        calculation: "Etsy: ~$1.95 fees (10.3%) | Amazon: ~$2.25 (11.8%)",
        result: "Etsy is slightly cheaper for low-priced items due to flat referral fee."
      },
      {
        title: "Mid-Range Item ($50)",
        scenario: "$50 item, $8 shipping, Etsy over $10K (mandatory offsite ads).",
        calculation: "Etsy: ~$10.15 fees (17.5%) | Amazon: ~$7.50 (12.9%)",
        result: "Amazon is significantly cheaper once Etsy offsite ads kick in!"
      },
      {
        title: "High-Priced Item ($150)",
        scenario: "$150 item, free shipping built in.",
        calculation: "Etsy (under $10K): ~$15.15 (10.1%) | Amazon: ~$22.50 (15%)",
        result: "Etsy is better for high-priced items IF you're under the offsite ads threshold."
      }
    ],
    commonMistakes: [
      "Forgetting Etsy's mandatory offsite ads once you hit $10K - this changes the math significantly.",
      "Not accounting for Amazon's $39.99/month Professional fee when comparing.",
      "Ignoring Amazon FBA fees which can add $3-6+ per item.",
      "Only comparing single-item fees instead of monthly totals.",
      "Not considering audience differences - Etsy buyers expect handmade, Amazon buyers expect fast shipping."
    ]
  };

  const faqItems = [
    {
      question: "Which platform has lower fees overall?",
      answer: "It depends on your sales volume and price point. For sellers under $10K/year, Etsy is often cheaper (9-11% vs 15%). Once you hit $10K and mandatory offsite ads kick in (12% extra), Amazon becomes competitive or cheaper. For high-priced items ($100+), Etsy is usually better. For mid-range items with good volume, Amazon often wins."
    },
    {
      question: "What is Amazon Handmade vs regular Amazon selling?",
      answer: "Amazon Handmade is a special category for artisans selling genuinely handmade products. Unlike regular Amazon sellers, Handmade sellers get: no monthly subscription fee (Professional account is free), 15% referral fee (instead of category-variable rates), and a dedicated Handmade storefront. You must apply and be approved as an artisan."
    },
    {
      question: "Should I sell on both Etsy and Amazon?",
      answer: "Many successful sellers do! Each platform has different audiences. Etsy buyers specifically seek handmade/unique items and expect the handmade story. Amazon buyers often prioritize convenience and fast shipping. Selling on both diversifies your income and reaches different customer segments. Just ensure you can manage inventory across platforms."
    },
    {
      question: "What about Etsy offsite ads vs Amazon advertising?",
      answer: "Etsy offsite ads are mandatory once you hit $10K/year and charge 12% on sales they drive. You can't opt out. Amazon advertising is completely optional - you choose if and how much to spend. This is a major consideration: Etsy's mandatory ads can significantly eat into profits, while Amazon gives you control over ad spend."
    },
    {
      question: "Does Amazon Handmade require FBA?",
      answer: "No, FBA is optional for Amazon Handmade. You can fulfill orders yourself (Merchant Fulfilled). However, FBA items get Prime eligibility, which can significantly boost sales. FBA adds $3-6+ per item in fees but saves you shipping/handling time. Many Handmade sellers use Merchant fulfillment to maintain the personal touch."
    },
    {
      question: "Which platform is better for beginners?",
      answer: "Etsy is generally easier to start: no application process, lower startup costs, and a community focused on handmade goods. Amazon Handmade requires an application proving you're an artisan, has a steeper learning curve, and expects professional-level customer service. Start on Etsy, then consider Amazon once you've validated your products and have consistent sales."
    }
  ];

  return (
    <CalculatorLayout
      title="Etsy vs Amazon Handmade Fee Calculator"
      description="Compare Etsy and Amazon Handmade fees side-by-side. See which platform keeps you more profit on your handmade products."
    >
      <CalculatorSchema
        name="Etsy vs Amazon Handmade Fee Calculator"
        description="Free calculator to compare Etsy and Amazon Handmade fees. See exact fee breakdowns for both platforms and determine which is more profitable for your products."
        url="/etsy-tools/etsy-vs-amazon-calculator"
        faqItems={faqItems}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <Link href="/" style={{ color: '#4a9eff' }}>Home</Link>
        {' > '}
        <Link href="/etsy-tools" style={{ color: '#4a9eff' }}>Etsy Tools</Link>
        {' > '}
        <span>Etsy vs Amazon Calculator</span>
      </div>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateComparison(); }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Product Details</h3>

          <div className={styles.formGroup}>
            <label htmlFor="salePrice" className={styles.label}>
              Sale Price ($) *
            </label>
            <input
              id="salePrice"
              type="number"
              className={styles.input}
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="e.g., 35.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="shippingCharged" className={styles.label}>
              Shipping Charged to Customer ($)
            </label>
            <input
              id="shippingCharged"
              type="number"
              className={styles.input}
              value={shippingCharged}
              onChange={(e) => setShippingCharged(e.target.value)}
              placeholder="0.00 (enter 0 for free shipping)"
              step="0.01"
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Product Category
            </label>
            <select
              id="category"
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="handmade">Handmade Items</option>
              <option value="jewelry">Jewelry & Accessories</option>
              <option value="clothing">Clothing & Apparel</option>
              <option value="home">Home & Living</option>
              <option value="art">Art & Collectibles</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Platform Settings</h3>

          <div className={styles.formGroup}>
            <label htmlFor="etsySalesVolume" className={styles.label}>
              Etsy Annual Sales Volume
            </label>
            <select
              id="etsySalesVolume"
              className={styles.select}
              value={etsySalesVolume}
              onChange={(e) => setEtsySalesVolume(e.target.value)}
            >
              <option value="under10k">Under $10,000/year (no mandatory offsite ads)</option>
              <option value="10kto50k">$10,000+/year (12% mandatory offsite ads)</option>
              <option value="over50k">Over $50,000/year (12% mandatory offsite ads)</option>
            </select>
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Offsite ads become mandatory at $10K+ and significantly impact fees
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fulfillmentMethod" className={styles.label}>
              Amazon Fulfillment Method
            </label>
            <select
              id="fulfillmentMethod"
              className={styles.select}
              value={fulfillmentMethod}
              onChange={(e) => setFulfillmentMethod(e.target.value)}
            >
              <option value="merchant">Merchant Fulfilled (ship yourself)</option>
              <option value="fba">FBA (Fulfilled by Amazon)</option>
            </select>
          </div>

          {fulfillmentMethod === 'fba' && (
            <div className={styles.formGroup}>
              <label htmlFor="itemWeight" className={styles.label}>
                Item Weight (lbs) - for FBA fee estimate
              </label>
              <input
                id="itemWeight"
                type="number"
                className={styles.input}
                value={itemWeight}
                onChange={(e) => setItemWeight(e.target.value)}
                placeholder="1"
                step="0.1"
                min="0.1"
              />
            </div>
          )}
        </div>

        <button type="submit" className={styles.button}>
          Compare Platforms
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          {/* Winner Banner */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: result.betterPlatform === 'etsy' ? '#1a2a1a' : result.betterPlatform === 'amazon' ? '#1a1a2a' : '#2a2a1a',
            borderRadius: '12px',
            border: `2px solid ${result.betterPlatform === 'etsy' ? '#f97316' : result.betterPlatform === 'amazon' ? '#f59e0b' : '#666'}`,
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: result.betterPlatform === 'etsy' ? '#f97316' : result.betterPlatform === 'amazon' ? '#f59e0b' : '#e0e0e0',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              {result.betterPlatform === 'etsy' ? 'ETSY WINS' : result.betterPlatform === 'amazon' ? 'AMAZON WINS' : "IT'S A TIE"}
            </h3>
            <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
              {result.betterPlatform === 'etsy'
                ? `You keep $${Math.abs(result.revenueDifference).toFixed(2)} more per sale on Etsy`
                : result.betterPlatform === 'amazon'
                ? `You keep $${Math.abs(result.revenueDifference).toFixed(2)} more per sale on Amazon`
                : 'Both platforms have similar fees for this item'
              }
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#f97316', fontSize: '0.9rem' }}>Etsy Net Revenue</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#e0e0e0' }}>${result.etsyNetRevenue.toFixed(2)}</div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>{result.etsyFeePercentage.toFixed(1)}% fees</div>
              </div>
              <div>
                <div style={{ color: '#f59e0b', fontSize: '0.9rem' }}>Amazon Net Revenue</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#e0e0e0' }}>${result.amazonNetRevenue.toFixed(2)}</div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>{result.amazonFeePercentage.toFixed(1)}% fees</div>
              </div>
            </div>
          </div>

          {/* Side by Side Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Etsy Column */}
            <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderTop: '3px solid #f97316' }}>
              <h4 style={{ color: '#f97316', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Etsy Fees
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>Listing Fee</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.etsyListingFee.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>Transaction Fee (6.5%)</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.etsyTransactionFee.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>Payment Processing</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.etsyPaymentProcessing.toFixed(2)}</td>
                  </tr>
                  {result.hasOffsiteAds && (
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '0.5rem 0', color: '#ff6b6b', fontSize: '0.9rem' }}>Offsite Ads (12%)</td>
                      <td style={{ padding: '0.5rem 0', color: '#ff6b6b', textAlign: 'right' }}>${result.etsyOffsiteAdsFee.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '2px solid #f97316' }}>
                    <td style={{ padding: '0.75rem 0', color: '#f97316', fontWeight: 600 }}>Total Fees</td>
                    <td style={{ padding: '0.75rem 0', color: '#f97316', textAlign: 'right', fontWeight: 600 }}>${result.totalEtsyFees.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', fontWeight: 600 }}>You Keep</td>
                    <td style={{ padding: '0.5rem 0', color: '#4caf50', textAlign: 'right', fontWeight: 700, fontSize: '1.25rem' }}>${result.etsyNetRevenue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amazon Column */}
            <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderTop: '3px solid #f59e0b' }}>
              <h4 style={{ color: '#f59e0b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Amazon Handmade Fees
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>Referral Fee (15%)</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.amazonReferralFee.toFixed(2)}</td>
                  </tr>
                  {result.fulfillmentMethod === 'fba' && (
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '0.5rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>FBA Fee (estimated)</td>
                      <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.amazonFbaFee.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>Monthly Fee*</td>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0', textAlign: 'right', fontSize: '0.85rem' }}>$39.99/mo</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #f59e0b' }}>
                    <td style={{ padding: '0.75rem 0', color: '#f59e0b', fontWeight: 600 }}>Total Fees</td>
                    <td style={{ padding: '0.75rem 0', color: '#f59e0b', textAlign: 'right', fontWeight: 600 }}>${result.totalAmazonFees.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', fontWeight: 600 }}>You Keep</td>
                    <td style={{ padding: '0.5rem 0', color: '#4caf50', textAlign: 'right', fontWeight: 700, fontSize: '1.25rem' }}>${result.amazonNetRevenue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '1rem' }}>
                *$39.99/mo Professional account (free for Handmade but required for selling)
              </p>
            </div>
          </div>

          {/* Monthly Volume Comparison */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Monthly Fee Comparison (at different volumes)</h4>
            <p style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Amazon's $39.99/mo fee changes the math at different sales volumes:
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Sales/Month</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#f97316', fontWeight: 500 }}>Etsy Total</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#f59e0b', fontWeight: 500 }}>Amazon Total</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Better</th>
                </tr>
              </thead>
              <tbody>
                {result.monthlyComparison.map((scenario: any, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>{scenario.sales} sales</td>
                    <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>${scenario.etsyFees.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>${scenario.amazonFees.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        backgroundColor: scenario.better === 'etsy' ? '#1a2a1a' : '#1a1a2a',
                        color: scenario.better === 'etsy' ? '#f97316' : '#f59e0b'
                      }}>
                        {scenario.better === 'etsy' ? 'Etsy' : 'Amazon'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '1rem' }}>
              Note: Amazon total includes $39.99/month Professional subscription
            </p>
          </div>

          {result.hasOffsiteAds && (
            <InfoBox type="warning" title="Etsy Offsite Ads Impact">
              Your calculation includes Etsy's <strong>mandatory 12% offsite ads fee</strong> because you've exceeded $10K in annual sales.
              This significantly impacts Etsy's competitiveness. If you haven't hit this threshold yet, select "Under $10,000/year" to see the difference.
            </InfoBox>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <InfoBox type="info" title="Calculate Your Complete Costs">
        <p>Platform fees are just part of your costs. Make sure to factor in all expenses:</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/etsy-tools/profit-calculator" className={styles.button} style={{ display: 'inline-block' }}>
            Profit Calculator
          </Link>
          <Link href="/etsy-tools/fee-calculator" className={styles.button} style={{ display: 'inline-block', backgroundColor: '#333' }}>
            Etsy Fee Calculator
          </Link>
        </div>
      </InfoBox>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Related Etsy Tools</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Link href="/etsy-tools/fee-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Etsy Fee Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Detailed Etsy fee breakdown</div>
          </Link>
          <Link href="/etsy-tools/profit-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Profit Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>True profit after all costs</div>
          </Link>
          <Link href="/etsy-tools/startup-cost-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Startup Cost Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Plan your shop launch</div>
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
