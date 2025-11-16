'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import InfoBox from '@/components/InfoBox';
import AdUnit from '@/components/AdUnit';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

export default function EtsyProfitCalculator() {
  const [itemPrice, setItemPrice] = useState<string>('');
  const [shippingCharged, setShippingCharged] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [materialCost, setMaterialCost] = useState<string>('');
  const [packagingCost, setPackagingCost] = useState<string>('');
  const [actualShippingCost, setActualShippingCost] = useState<string>('');
  const [laborOption, setLaborOption] = useState<string>('none');
  const [hourlyRate, setHourlyRate] = useState<string>('25');
  const [laborHours, setLaborHours] = useState<string>('');
  const [includeOverhead, setIncludeOverhead] = useState(false);
  const [monthlyShopFees, setMonthlyShopFees] = useState<string>('');
  const [avgItemsPerMonth, setAvgItemsPerMonth] = useState<string>('');
  const [salesVolume, setSalesVolume] = useState<string>('under10k');
  const [isInternational, setIsInternational] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { trackCalculatorUsage } = useAnalytics();

  const calculateProfit = () => {
    const price = parseFloat(itemPrice) || 0;
    const shipping = parseFloat(shippingCharged) || 0;
    const qty = parseInt(quantity) || 1;
    const materials = parseFloat(materialCost) || 0;
    const packaging = parseFloat(packagingCost) || 0;
    const shippingCost = parseFloat(actualShippingCost) || 0;

    if (price <= 0) return;

    const totalItemPrice = price * qty;
    const totalRevenue = totalItemPrice + shipping;

    // Calculate Etsy fees
    const listingFee = 0.20;
    const transactionFee = totalRevenue * 0.065;
    const paymentProcessingFee = totalRevenue * 0.03 + 0.25;

    let offsiteAdsFee = 0;
    if (salesVolume === '10kto50k' || salesVolume === 'over50k') {
      offsiteAdsFee = totalItemPrice * 0.12; // 12% mandatory
    }

    const currencyConversionFee = isInternational ? totalRevenue * 0.025 : 0;
    const totalEtsyFees = listingFee + transactionFee + paymentProcessingFee + offsiteAdsFee + currencyConversionFee;

    // Calculate product costs
    let laborCost = 0;
    if (laborOption !== 'none' && laborHours) {
      const rate = laborOption === 'custom' ? parseFloat(hourlyRate) : parseFloat(laborOption);
      laborCost = rate * parseFloat(laborHours);
    }

    let overheadPerItem = 0;
    if (includeOverhead && monthlyShopFees && avgItemsPerMonth) {
      const monthlyFees = parseFloat(monthlyShopFees);
      const avgItems = parseFloat(avgItemsPerMonth);
      overheadPerItem = avgItems > 0 ? monthlyFees / avgItems : 0;
    }

    const totalProductCosts = materials + packaging + shippingCost + laborCost + overheadPerItem;
    const netProfit = totalRevenue - totalEtsyFees - totalProductCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Calculate recommended prices for target margins
    const targetMargins = [30, 40, 50];
    const recommendations = targetMargins.map(margin => {
      // Work backwards: we need price where (price - fees - costs) / price = margin%
      // This requires solving for price accounting for percentage-based fees
      const fixedCosts = listingFee + 0.25 + totalProductCosts;
      const variableFeeRate = 0.065 + 0.03 + (salesVolume !== 'under10k' ? 0.12 : 0) + (isInternational ? 0.025 : 0);
      const recommendedPrice = fixedCosts / (1 - variableFeeRate - (margin / 100));
      const recommendedProfit = recommendedPrice * (margin / 100);

      return {
        margin,
        price: recommendedPrice,
        profit: recommendedProfit
      };
    });

    setResult({
      totalRevenue,
      itemPrice: totalItemPrice,
      shipping,
      listingFee,
      transactionFee,
      paymentProcessingFee,
      offsiteAdsFee,
      currencyConversionFee,
      totalEtsyFees,
      materialCost: materials,
      packagingCost: packaging,
      actualShippingCost: shippingCost,
      laborCost,
      overheadPerItem,
      totalProductCosts,
      netProfit,
      profitMargin,
      recommendations,
      etsyPercentage: (totalEtsyFees / totalRevenue) * 100,
      costsPercentage: (totalProductCosts / totalRevenue) * 100,
      profitPercentage: (netProfit / totalRevenue) * 100
    });

    trackCalculatorUsage('Etsy Profit Calculator', {
      item_price: price,
      total_revenue: totalRevenue,
      profit_margin: profitMargin,
      net_profit: netProfit,
      includes_labor: laborCost > 0,
      includes_overhead: overheadPerItem > 0
    });
  };

  const getProfitAlert = () => {
    if (!result) return null;
    const margin = result.profitMargin;

    if (margin < 0) {
      return (
        <InfoBox type="error" title="LOSING MONEY ON THIS SALE">
          Your costs exceed your revenue! You need to either:
          <ul>
            <li>Increase your prices significantly</li>
            <li>Reduce production costs</li>
            <li>Discontinue this product</li>
          </ul>
          Never sell at a loss unless it's a strategic loss-leader.
        </InfoBox>
      );
    } else if (margin < 20) {
      return (
        <InfoBox type="warning" title="Low Profit Margin Warning">
          Your profit margin is below 20%, which is considered risky for handmade businesses. Consider:
          <ul>
            <li>Increasing your prices</li>
            <li>Reducing material costs (bulk purchasing)</li>
            <li>Streamlining production time</li>
            <li>Offering bundles or higher-priced items</li>
          </ul>
        </InfoBox>
      );
    } else if (margin >= 20 && margin < 40) {
      return (
        <InfoBox type="success" title="Healthy Profit Margin">
          Your 20-40% margin is solid for a handmade business. You have room for:
          <ul>
            <li>Occasional sales/discounts</li>
            <li>Testing new products</li>
            <li>Scaling production</li>
          </ul>
        </InfoBox>
      );
    } else {
      return (
        <InfoBox type="success" title="Excellent Profit Margin">
          Your margin is strong! Consider:
          <ul>
            <li>Investing in better materials</li>
            <li>Offering premium versions</li>
            <li>Running promotions to increase volume</li>
          </ul>
        </InfoBox>
      );
    }
  };

  const faqItems = [
    {
      question: "What's a healthy profit margin for Etsy products?",
      answer: "For handmade businesses, aim for 30-50% profit margin. This accounts for the unpredictability of sales, allows room for discounts, and provides cushion for business growth. Margins below 20% are risky and leave little room for error. Remember, this profit needs to cover your time, overhead, and business expenses - it's not all take-home pay."
    },
    {
      question: "Should I include my time/labor in the calculation?",
      answer: "Absolutely! Many sellers undervalue their time and burn out. Even if you're working from home, your time has value. Beginners might start at $15-20/hour, intermediate makers at $25-35/hour, and experts at $40-60+/hour. Include ALL time: making, photographing, listing, customer service, and shipping."
    },
    {
      question: "What counts as overhead costs?",
      answer: "Overhead includes ongoing business expenses not tied to a specific product: Etsy subscription fees, photography equipment, workspace rent, utilities, business insurance, marketing/ads, website hosting, shipping supplies bought in bulk, and accounting software. Divide your monthly overhead by average items sold to get overhead per item."
    },
    {
      question: "How do I use the pricing recommendations?",
      answer: "The recommendations show what you should charge to achieve 30%, 40%, or 50% profit margins with your current costs. If your actual price is lower than recommended, you're either making less profit than you think or selling at a loss. Use these as guidelines - also research competitor pricing and test what your market will bear."
    },
    {
      question: "Should I offer free shipping or charge separately?",
      answer: "There's no one-size-fits-all answer. Free shipping (building cost into item price) can increase conversion rates, especially for lightweight items. Calculated/fixed shipping works better for heavy or fragile items where shipping varies significantly. Many sellers use free shipping on items under 1 lb and charge shipping for heavier products."
    },
    {
      question: "When should I raise my prices?",
      answer: "Raise prices when: (1) Your profit margin falls below 25%, (2) Material costs increase, (3) Demand exceeds your capacity, (4) You're adding premium features or better materials, (5) Competitors are charging more for similar quality. Most customers understand price increases for handmade goods, especially if you communicate the value."
    }
  ];

  return (
    <CalculatorLayout
      title="Complete Etsy Profit Calculator"
      description="Calculate your true profit after ALL costs: Etsy fees, shipping, materials, labor, and overhead. Get pricing recommendations and profit margin analysis."
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <Link href="/" style={{ color: '#4a9eff' }}>Home</Link>
        {' > '}
        <Link href="/etsy-tools" style={{ color: '#4a9eff' }}>Etsy Tools</Link>
        {' > '}
        <span>Profit Calculator</span>
      </div>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateProfit(); }}>
        {/* Product Pricing */}
        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Product Pricing</h3>

          <div className={styles.formGroup}>
            <label htmlFor="itemPrice" className={styles.label}>
              Item Sale Price ($) *
            </label>
            <input
              id="itemPrice"
              type="number"
              className={styles.input}
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="Enter sale price"
              step="0.01"
              min="0"
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
              placeholder="0.00"
              step="0.01"
              min="0"
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
        </div>

        {/* Product Costs */}
        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Product Costs</h3>

          <div className={styles.formGroup}>
            <label htmlFor="materialCost" className={styles.label}>
              Material Costs ($)
            </label>
            <input
              id="materialCost"
              type="number"
              className={styles.input}
              value={materialCost}
              onChange={(e) => setMaterialCost(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Raw materials, supplies, components
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="packagingCost" className={styles.label}>
              Packaging Costs ($)
            </label>
            <input
              id="packagingCost"
              type="number"
              className={styles.input}
              value={packagingCost}
              onChange={(e) => setPackagingCost(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Boxes, mailers, tissue paper, stickers, etc.
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="actualShippingCost" className={styles.label}>
              Actual Shipping Cost ($)
            </label>
            <input
              id="actualShippingCost"
              type="number"
              className={styles.input}
              value={actualShippingCost}
              onChange={(e) => setActualShippingCost(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              What you actually pay the carrier •{' '}
              <Link href="/etsy-tools/shipping-calculator" target="_blank" style={{ color: '#4a9eff' }}>
                Calculate shipping cost
              </Link>
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="laborOption" className={styles.label}>
              Labor / Time
            </label>
            <select
              id="laborOption"
              className={styles.select}
              value={laborOption}
              onChange={(e) => setLaborOption(e.target.value)}
            >
              <option value="none">Don't include labor</option>
              <option value="15">$15/hour</option>
              <option value="25">$25/hour</option>
              <option value="50">$50/hour</option>
              <option value="custom">Custom hourly rate</option>
            </select>
          </div>

          {laborOption !== 'none' && (
            <>
              {laborOption === 'custom' && (
                <div className={styles.formGroup}>
                  <label htmlFor="hourlyRate" className={styles.label}>
                    Custom Hourly Rate ($)
                  </label>
                  <input
                    id="hourlyRate"
                    type="number"
                    className={styles.input}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="25"
                    step="0.01"
                    min="0"
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="laborHours" className={styles.label}>
                  Hours Spent
                </label>
                <input
                  id="laborHours"
                  type="number"
                  className={styles.input}
                  value={laborHours}
                  onChange={(e) => setLaborHours(e.target.value)}
                  placeholder="0"
                  step="0.1"
                  min="0"
                />
              </div>
            </>
          )}
        </div>

        {/* Overhead (Optional) */}
        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={includeOverhead}
              onChange={(e) => setIncludeOverhead(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ color: '#e0e0e0', fontSize: '1.1rem', fontWeight: 500 }}>Include Overhead Costs</span>
          </label>

          {includeOverhead && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="monthlyShopFees" className={styles.label}>
                  Monthly Shop Fees ($)
                </label>
                <input
                  id="monthlyShopFees"
                  type="number"
                  className={styles.input}
                  value={monthlyShopFees}
                  onChange={(e) => setMonthlyShopFees(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
                  Subscription, tools, marketing, workspace, etc.
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="avgItemsPerMonth" className={styles.label}>
                  Average Items Sold Per Month
                </label>
                <input
                  id="avgItemsPerMonth"
                  type="number"
                  className={styles.input}
                  value={avgItemsPerMonth}
                  onChange={(e) => setAvgItemsPerMonth(e.target.value)}
                  placeholder="0"
                  min="1"
                />
              </div>
            </>
          )}
        </div>

        {/* Etsy Details */}
        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Etsy Details</h3>

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
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isInternational}
                onChange={(e) => setIsInternational(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span className={styles.label}>International Sale</span>
            </label>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Total Profit
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          {/* Profit Summary */}
          <div style={{ padding: '2rem', backgroundColor: '#1a2332', borderRadius: '12px', border: '2px solid #4a9eff', marginBottom: '2rem' }}>
            <h3 style={{ color: '#4a9eff', marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>
              PROFIT SUMMARY
            </h3>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Revenue</span>
              <span className={styles.resultValue}>${result.totalRevenue.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>- Total Etsy Fees</span>
              <span className={styles.resultValue} style={{ color: '#ff6b6b' }}>-${result.totalEtsyFees.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>- Total Product Costs</span>
              <span className={styles.resultValue} style={{ color: '#ff6b6b' }}>-${result.totalProductCosts.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem} style={{ borderTop: '2px solid #4a9eff', paddingTop: '1rem', marginTop: '1rem' }}>
              <span className={styles.resultLabel} style={{ fontSize: '1.25rem' }}>NET PROFIT</span>
              <span className={styles.resultValuePrimary} style={{ color: result.netProfit >= 0 ? '#4caf50' : '#ff6b6b' }}>
                ${result.netProfit.toFixed(2)}
              </span>
            </div>
            <div className={styles.resultItem} style={{ borderBottom: 'none' }}>
              <span className={styles.resultLabel}>Profit Margin</span>
              <span className={styles.resultValue} style={{ color: result.profitMargin >= 30 ? '#4caf50' : result.profitMargin >= 20 ? '#ffaa00' : '#ff6b6b' }}>
                {result.profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Where Your Money Goes</h4>
            <div style={{ display: 'flex', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.max(result.etsyPercentage, 0)}%`,
                  backgroundColor: '#ff6b6b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {result.etsyPercentage > 10 && `Etsy ${result.etsyPercentage.toFixed(0)}%`}
              </div>
              <div
                style={{
                  width: `${Math.max(result.costsPercentage, 0)}%`,
                  backgroundColor: '#ffaa00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {result.costsPercentage > 10 && `Costs ${result.costsPercentage.toFixed(0)}%`}
              </div>
              <div
                style={{
                  width: `${Math.max(result.profitPercentage, 0)}%`,
                  backgroundColor: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {result.profitPercentage > 10 && `Profit ${result.profitPercentage.toFixed(0)}%`}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem', color: '#b0b0b0' }}>
              <div>Etsy Fees: {result.etsyPercentage.toFixed(1)}%</div>
              <div>Product Costs: {result.costsPercentage.toFixed(1)}%</div>
              <div>Your Profit: {result.profitPercentage.toFixed(1)}%</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <details style={{ marginBottom: '2rem' }}>
            <summary style={{ cursor: 'pointer', color: '#4a9eff', fontWeight: 600, marginBottom: '1rem' }}>
              View Detailed Breakdown
            </summary>

            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: '#e0e0e0', marginBottom: '0.75rem' }}>REVENUE</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Item Sale Price</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.itemPrice.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Shipping Charged</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.shipping.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', fontWeight: 600 }}>Total Revenue</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', fontWeight: 600, textAlign: 'right' }}>${result.totalRevenue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <h4 style={{ color: '#e0e0e0', marginBottom: '0.75rem' }}>ETSY FEES</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Listing Fee</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.listingFee.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Transaction Fee (6.5%)</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.transactionFee.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Payment Processing</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.paymentProcessingFee.toFixed(2)}</td>
                  </tr>
                  {result.offsiteAdsFee > 0 && (
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Offsite Ads (12%)</td>
                      <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.offsiteAdsFee.toFixed(2)}</td>
                    </tr>
                  )}
                  {result.currencyConversionFee > 0 && (
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Currency Conversion</td>
                      <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.currencyConversionFee.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', fontWeight: 600 }}>Total Etsy Fees</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', fontWeight: 600, textAlign: 'right' }}>${result.totalEtsyFees.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <h4 style={{ color: '#e0e0e0', marginBottom: '0.75rem' }}>PRODUCT COSTS</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Materials</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.materialCost.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Packaging</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.packagingCost.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Actual Shipping</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.actualShippingCost.toFixed(2)}</td>
                  </tr>
                  {result.laborCost > 0 && (
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Labor/Time</td>
                      <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.laborCost.toFixed(2)}</td>
                    </tr>
                  )}
                  {result.overheadPerItem > 0 && (
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Overhead (per item)</td>
                      <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.overheadPerItem.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', fontWeight: 600 }}>Total Product Costs</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', fontWeight: 600, textAlign: 'right' }}>${result.totalProductCosts.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>

          {/* Profit Alert */}
          {getProfitAlert()}

          {/* Pricing Recommendations */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Pricing Recommendations</h4>
            <p style={{ color: '#b0b0b0', marginBottom: '1rem', fontSize: '0.95rem' }}>
              To achieve target profit margins with your current costs, consider these prices:
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Target Margin</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Recommended Price</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Your Profit</th>
                </tr>
              </thead>
              <tbody>
                {result.recommendations.map((rec: any, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>{rec.margin}% margin</td>
                    <td style={{ padding: '0.75rem 0', color: '#4a9eff', textAlign: 'right', fontWeight: 600 }}>
                      ${rec.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 0', color: '#4caf50', textAlign: 'right' }}>
                      ${rec.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.85rem' }}>
              Note: These prices maintain your current costs but adjust selling price to hit target margins. Always research competitor pricing and test what your market will bear.
            </p>
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <div style={{ marginTop: '2rem' }}>
        <InfoBox type="info" title="Automate Your Etsy Bookkeeping">
          <p style={{ marginBottom: '1rem' }}>Stop tracking expenses in spreadsheets! Use accounting software designed for sellers:</p>

          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <strong>QuickBooks Self-Employed</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
                <li>Auto-imports Etsy sales</li>
                <li>Tracks expenses</li>
                <li>Quarterly tax estimates</li>
              </ul>
              <a href="https://quickbooks.intuit.com/self-employed/" target="_blank" rel="noopener noreferrer sponsored" style={{ color: '#4a9eff' }}>
                Try Free for 30 Days →
              </a>
            </div>

            <div>
              <strong>FreshBooks</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
                <li>Built for makers & creators</li>
                <li>Invoice customers directly</li>
                <li>Profit & loss reports</li>
              </ul>
              <a href="https://www.freshbooks.com" target="_blank" rel="noopener noreferrer sponsored" style={{ color: '#4a9eff' }}>
                Get 60% Off 6 Months →
              </a>
            </div>
          </div>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Calculate Individual Components</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Link href="/etsy-tools/fee-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Etsy Fee Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Calculate just Etsy fees</div>
          </Link>
          <Link href="/etsy-tools/shipping-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Shipping Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Compare carrier rates</div>
          </Link>
          <Link href="/etsy-tools" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>All Etsy Tools</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Back to hub</div>
          </Link>
        </div>
      </div>

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      <FAQ items={faqItems} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
