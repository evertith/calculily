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

export default function EtsyFeeCalculator() {
  const [itemPrice, setItemPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [shippingCharged, setShippingCharged] = useState<string>('');
  const [salesVolume, setSalesVolume] = useState<string>('under10k');
  const [isInternational, setIsInternational] = useState(false);
  const [usingEtsyPayments, setUsingEtsyPayments] = useState(true);
  const [result, setResult] = useState<any>(null);
  const { trackCalculatorUsage } = useAnalytics();

  const calculateFees = () => {
    const price = parseFloat(itemPrice) || 0;
    const qty = parseInt(quantity) || 1;
    const shipping = parseFloat(shippingCharged) || 0;

    if (price <= 0) return;

    const totalItemPrice = price * qty;
    const totalSaleAmount = totalItemPrice + shipping;

    // Listing fee: $0.20 per listing
    const listingFee = 0.20;

    // Transaction fee: 6.5% of (item price + shipping)
    const transactionFee = totalSaleAmount * 0.065;

    // Payment processing: 3% + $0.25
    const paymentProcessingFee = usingEtsyPayments
      ? (totalSaleAmount * 0.03 + 0.25)
      : 0;

    // Offsite ads fee (only if applicable)
    let offsiteAdsFee = 0;
    let offsiteAdsRate = 0;
    if (salesVolume === 'under10k') {
      offsiteAdsFee = 0; // Optional, so we don't include it
      offsiteAdsRate = 15;
    } else if (salesVolume === '10kto50k' || salesVolume === 'over50k') {
      offsiteAdsFee = totalItemPrice * 0.12; // 12% mandatory
      offsiteAdsRate = 12;
    }

    // Regulatory fee (minimal for US, note for others)
    const regulatoryFee = 0; // Typically negligible for US sellers

    // Currency conversion (2.5% if international)
    const currencyConversionFee = isInternational
      ? totalSaleAmount * 0.025
      : 0;

    const totalFees = listingFee + transactionFee + paymentProcessingFee +
                     offsiteAdsFee + regulatoryFee + currencyConversionFee;

    const netAfterFees = totalSaleAmount - totalFees;
    const etsyCutPercentage = (totalFees / totalSaleAmount) * 100;

    setResult({
      itemPrice: totalItemPrice,
      shipping: shipping,
      totalSaleAmount,
      listingFee,
      transactionFee,
      paymentProcessingFee,
      offsiteAdsFee,
      offsiteAdsRate,
      regulatoryFee,
      currencyConversionFee,
      totalFees,
      netAfterFees,
      etsyCutPercentage,
      hasOffsiteAds: offsiteAdsFee > 0
    });

    trackCalculatorUsage('Etsy Fee Calculator', {
      item_price: price,
      quantity: qty,
      shipping: shipping,
      sales_volume: salesVolume,
      total_fees: totalFees,
      etsy_cut_percentage: etsyCutPercentage
    });
  };

  const contentData = {
    howToUse: {
      intro: "Calculate the true cost of selling on Etsy with all fees included:",
      steps: [
        "Enter your item's selling price.",
        "Add the shipping amount you'll charge the buyer.",
        "Select whether you have Etsy Plus (affects listing fees).",
        "Indicate if this sale might trigger Offsite Ads fees (applies to shops over $10K annual sales).",
        "Click 'Calculate' to see all fees broken down and your actual earnings."
      ]
    },
    whyMatters: {
      description: "Etsy's fee structure is complex - listing fees, transaction fees, payment processing fees, and potentially Offsite Ads fees can significantly eat into your profits. Many sellers are surprised to find fees taking 15-25% of their sale price. Understanding these fees BEFORE setting prices ensures you're actually making money on each sale and helps you price competitively while maintaining healthy margins.",
      benefits: [
        "See all Etsy fees in one clear breakdown",
        "Calculate actual profit after all fees are deducted",
        "Price products to maintain target profit margins",
        "Understand how Offsite Ads affect high-volume sellers",
        "Compare Etsy costs with other selling platforms"
      ]
    },
    examples: [
      {
        title: "Handmade Jewelry",
        scenario: "Selling a $35 necklace with $5 shipping to a US buyer.",
        calculation: "Listing: $0.20 | Transaction (6.5%): $2.60 | Payment (3%+$0.25): $1.45",
        result: "Total fees: ~$4.25 | You keep: ~$35.75 of the $40 total (89%)"
      },
      {
        title: "With Offsite Ads",
        scenario: "Same $35 necklace, but buyer came through Offsite Ads (12-15% fee on sale).",
        calculation: "Base fees: $4.25 + Offsite Ads (12%): $4.80",
        result: "Total fees: ~$9.05 | You keep: ~$30.95 (77%) - significantly less!"
      },
      {
        title: "Digital Download",
        scenario: "Selling a $5 digital printable (no shipping).",
        calculation: "Listing: $0.20 | Transaction: $0.33 | Payment: $0.40",
        result: "Total fees: ~$0.93 | You keep: ~$4.07 (81%) - still profitable on low-priced items."
      }
    ],
    commonMistakes: [
      "Forgetting that transaction fees apply to shipping amount too - not just item price.",
      "Not accounting for Offsite Ads if your shop exceeds $10K annually (mandatory 12-15% fee).",
      "Ignoring the $0.20 listing fee when calculating margins on low-priced items.",
      "Thinking payment processing fees are included in transaction fees - they're separate.",
      "Setting prices based on competitors without checking if they're actually profitable."
    ]
  };

  const faqItems = [
    {
      question: "What is the listing fee?",
      answer: "Etsy charges $0.20 when you create or renew a listing. The listing is active for 4 months or until the item sells. If you have auto-renew enabled, Etsy will automatically charge another $0.20 to renew the listing."
    },
    {
      question: "How does the transaction fee work?",
      answer: "Etsy charges 6.5% on the total sale price, which includes BOTH the item price AND the shipping cost you charge to customers. This is Etsy's main revenue source and applies to every single sale you make."
    },
    {
      question: "What are offsite ads and when are they mandatory?",
      answer: "Offsite ads are advertisements Etsy runs on Google, Facebook, and other platforms. If your shop makes less than $10,000 in a 12-month period, offsite ads are optional and charge 15% when they result in a sale. Once you cross $10,000 in annual sales, offsite ads become MANDATORY and the fee drops to 12%. You cannot opt out once you hit this threshold. The fee is only charged when an ad directly results in a sale."
    },
    {
      question: "Why is payment processing required?",
      answer: "Etsy Payments is required for most sellers in most countries. It charges 3% + $0.25 per transaction, similar to PayPal or Stripe fees. This fee covers credit card processing and payment handling."
    },
    {
      question: "What changed with Etsy fees in 2025?",
      answer: "As of 2025, Etsy removed the handling fee from calculated shipping, making it more seller-friendly. Previously, Etsy would add extra fees on top of calculated shipping costs. Now, when you use calculated shipping, customers pay the exact carrier rate without additional Etsy markups."
    },
    {
      question: "Are there regulatory fees?",
      answer: "Regulatory operating fees vary by location. UK sellers pay 0.4%, and EU sellers may pay varying amounts by country. US sellers typically don't pay regulatory fees. Check Etsy's fee structure for your specific region."
    }
  ];

  return (
    <CalculatorLayout
      title="Etsy Fee Calculator"
      description="Calculate all Etsy seller fees including listing fees, transaction fees, payment processing, and Offsite Ads. See exactly what you keep from each sale."
    >
      <CalculatorSchema
        name="Etsy Fee Calculator"
        description="Free Etsy fee calculator to see all seller fees including listing, transaction, payment processing, and Offsite Ads. Calculate your true earnings on every sale."
        url="/etsy-tools/fee-calculator"
        faqItems={faqItems}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <Link href="/" style={{ color: '#4a9eff' }}>Home</Link>
        {' > '}
        <Link href="/etsy-tools" style={{ color: '#4a9eff' }}>Etsy Tools</Link>
        {' > '}
        <span>Fee Calculator</span>
      </div>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateFees(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="itemPrice" className={styles.label}>
            Item Price ($) *
          </label>
          <input
            id="itemPrice"
            type="number"
            className={styles.input}
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            placeholder="Enter item price"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="quantity" className={styles.label}>
            Quantity Sold
          </label>
          <input
            id="quantity"
            type="number"
            className={styles.input}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1"
            min="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="shippingCharged" className={styles.label}>
            Shipping Cost Charged to Customer ($)
          </label>
          <input
            id="shippingCharged"
            type="number"
            className={styles.input}
            value={shippingCharged}
            onChange={(e) => setShippingCharged(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
            Etsy's transaction fee applies to shipping too!
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="salesVolume" className={styles.label}>
            Annual Sales Volume
          </label>
          <select
            id="salesVolume"
            className={styles.select}
            value={salesVolume}
            onChange={(e) => setSalesVolume(e.target.value)}
          >
            <option value="under10k">Under $10,000/year</option>
            <option value="10kto50k">$10,000 - $50,000/year</option>
            <option value="over50k">Over $50,000/year</option>
          </select>
          <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
            Affects offsite ads fee (mandatory at $10K+)
          </small>
        </div>

        <div className={styles.formGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isInternational}
              onChange={(e) => setIsInternational(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span className={styles.label}>International Sale (2.5% currency conversion fee)</span>
          </label>
        </div>

        <div className={styles.formGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={usingEtsyPayments}
              onChange={(e) => setUsingEtsyPayments(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span className={styles.label}>Using Etsy Payments (required for most sellers)</span>
          </label>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Etsy Fees
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.25rem' }}>Fee Breakdown</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Fee Type</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Calculation</th>
                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>Listing Fee</td>
                <td style={{ padding: '0.75rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>$0.20 per listing</td>
                <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.listingFee.toFixed(2)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>Transaction Fee</td>
                <td style={{ padding: '0.75rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>6.5% of (item + shipping)</td>
                <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.transactionFee.toFixed(2)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>Payment Processing</td>
                <td style={{ padding: '0.75rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>3% + $0.25</td>
                <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.paymentProcessingFee.toFixed(2)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>Offsite Ads Fee</td>
                <td style={{ padding: '0.75rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>
                  {result.hasOffsiteAds ? `${result.offsiteAdsRate}% of item price` : 'Not applicable'}
                </td>
                <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>
                  {result.hasOffsiteAds ? `$${result.offsiteAdsFee.toFixed(2)}` : 'N/A'}
                </td>
              </tr>
              {isInternational && (
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>Currency Conversion</td>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0', fontSize: '0.9rem' }}>2.5%</td>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.currencyConversionFee.toFixed(2)}</td>
                </tr>
              )}
              <tr style={{ borderTop: '2px solid #4a9eff' }}>
                <td style={{ padding: '0.75rem 0', color: '#4a9eff', fontWeight: 600 }} colSpan={2}>TOTAL ETSY FEES</td>
                <td style={{ padding: '0.75rem 0', color: '#4a9eff', fontWeight: 600, textAlign: 'right' }}>
                  ${result.totalFees.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a2332', borderRadius: '8px', border: '1px solid #4a9eff' }}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Item Price</span>
              <span className={styles.resultValue}>${result.itemPrice.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Etsy Fees</span>
              <span className={styles.resultValue}>${result.totalFees.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Net After Fees</span>
              <span className={styles.resultValuePrimary}>${result.netAfterFees.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem} style={{ borderBottom: 'none' }}>
              <span className={styles.resultLabel}>Etsy's Cut</span>
              <span className={styles.resultValue}>{result.etsyCutPercentage.toFixed(1)}%</span>
            </div>
          </div>

          {salesVolume !== 'under10k' && (
            <InfoBox type="warning" title="Offsite Ads Fee Applied">
              Since your annual sales are over $10,000, the 12% offsite ads fee is <strong>mandatory</strong> and has been included
              in your calculation. This fee is charged when Etsy's external advertising (Google, Facebook, etc.) results in a sale.
            </InfoBox>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <InfoBox type="info" title="Next Step">
        Want to calculate your total profit including shipping and materials?
        <div style={{ marginTop: '1rem' }}>
          <Link href="/etsy-tools/profit-calculator" className={styles.button} style={{ display: 'inline-block' }}>
            Use Complete Profit Calculator
          </Link>
        </div>
      </InfoBox>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Related Tools</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Link href="/etsy-tools/profit-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Etsy Profit Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Calculate true profit after all costs</div>
          </Link>
          <Link href="/etsy-tools/shipping-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Etsy Shipping Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Compare shipping carrier rates</div>
          </Link>
          <Link href="/calculators/etsy-pricing" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Etsy Pricing Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Set prices for target profit margins</div>
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
