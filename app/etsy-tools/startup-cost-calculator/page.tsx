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

export default function EtsyStartupCostCalculator() {
  const [numberOfListings, setNumberOfListings] = useState<string>('');
  const [productCategory, setProductCategory] = useState<string>('handmade');
  const [shippingStrategy, setShippingStrategy] = useState<string>('charged');
  const [expectedMonthlySales, setExpectedMonthlySales] = useState<string>('');
  const [averagePrice, setAveragePrice] = useState<string>('');
  const [includeInventory, setIncludeInventory] = useState(false);
  const [inventoryCost, setInventoryCost] = useState<string>('');
  const [includeSupplies, setIncludeSupplies] = useState(false);
  const [suppliesCost, setSuppliesCost] = useState<string>('');
  const [includePackaging, setIncludePackaging] = useState(false);
  const [packagingCost, setPackagingCost] = useState<string>('');
  const [includePhotography, setIncludePhotography] = useState(false);
  const [photographyCost, setPhotographyCost] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const { trackCalculatorUsage } = useAnalytics();

  const calculateCosts = () => {
    const listings = parseInt(numberOfListings) || 0;
    const monthlySales = parseInt(expectedMonthlySales) || 0;
    const price = parseFloat(averagePrice) || 0;
    const inventory = includeInventory ? (parseFloat(inventoryCost) || 0) : 0;
    const supplies = includeSupplies ? (parseFloat(suppliesCost) || 0) : 0;
    const packaging = includePackaging ? (parseFloat(packagingCost) || 0) : 0;
    const photography = includePhotography ? (parseFloat(photographyCost) || 0) : 0;

    if (listings <= 0) return;

    // Initial listing fees
    const listingFees = listings * 0.20;

    // First month projected fees (if sales occur)
    const monthlyRevenue = monthlySales * price;
    const transactionFees = monthlyRevenue * 0.065;
    const paymentProcessingFees = monthlySales > 0 ? (monthlyRevenue * 0.03) + (monthlySales * 0.25) : 0;
    const saleRenewalFees = monthlySales * 0.20;

    // Total Etsy fees for first month
    const totalEtsyFees = listingFees + transactionFees + paymentProcessingFees + saleRenewalFees;

    // Optional costs
    const totalOptionalCosts = inventory + supplies + packaging + photography;

    // Total startup cost
    const totalStartupCost = totalEtsyFees + totalOptionalCosts;

    // Break-even calculation
    // Profit per sale = price - (price * 0.095) - 0.45 (etsy fees) - cost per item
    const etsyFeePerSale = (price * 0.095) + 0.45;
    const estimatedCostPerItem = totalOptionalCosts > 0 && monthlySales > 0
      ? totalOptionalCosts / monthlySales
      : price * 0.3; // Assume 30% cost if not specified
    const profitPerSale = price - etsyFeePerSale - estimatedCostPerItem;
    const breakEvenSales = profitPerSale > 0 ? Math.ceil(totalStartupCost / profitPerSale) : 0;

    // Monthly recurring costs estimate
    const monthlyListingRenewals = listings / 4 * 0.20; // 1/4 of listings renew each month on average
    const monthlyEtsyFees = transactionFees + paymentProcessingFees + saleRenewalFees + monthlyListingRenewals;

    setResult({
      listings,
      listingFees,
      transactionFees,
      paymentProcessingFees,
      saleRenewalFees,
      totalEtsyFees,
      inventory,
      supplies,
      packaging,
      photography,
      totalOptionalCosts,
      totalStartupCost,
      monthlyRevenue,
      monthlySales,
      profitPerSale,
      breakEvenSales,
      monthlyEtsyFees,
      monthlyListingRenewals,
      price
    });

    trackCalculatorUsage('Etsy Startup Cost Calculator', {
      number_of_listings: listings,
      product_category: productCategory,
      expected_monthly_sales: monthlySales,
      total_startup_cost: totalStartupCost,
      break_even_sales: breakEvenSales
    });
  };

  const contentData = {
    howToUse: {
      intro: "Calculate the true cost of starting your Etsy shop:",
      steps: [
        "Enter the number of listings you plan to create initially.",
        "Select your product category (affects typical pricing and costs).",
        "Choose your shipping strategy (free vs charged).",
        "Estimate your expected monthly sales and average price.",
        "Add optional startup costs: inventory, supplies, packaging, photography.",
        "Click 'Calculate' to see your total startup investment and break-even point."
      ]
    },
    whyMatters: {
      description: "Starting an Etsy shop isn't free. Between listing fees, initial inventory, packaging supplies, and photography equipment, costs add up quickly. Many sellers underestimate startup costs and end up underfunded or discouraged. Knowing your true investment helps you plan properly, set realistic expectations, and price your products to actually make money from day one.",
      benefits: [
        "Know exactly how much to invest before launching",
        "Calculate break-even sales to cover startup costs",
        "Plan inventory purchases strategically",
        "Understand ongoing monthly fee commitments",
        "Make informed decisions about shop size and scope"
      ]
    },
    examples: [
      {
        title: "Small Handmade Jewelry Shop",
        scenario: "25 listings, $300 materials, $50 packaging, $0 photography (phone photos).",
        calculation: "$5 listing fees + $350 optional costs",
        result: "Total startup: ~$355. At $35 avg price with 40% margin, break-even: ~25 sales."
      },
      {
        title: "Print-on-Demand Shop",
        scenario: "50 listings, $0 inventory (POD), $100 for design software, mock-up photos.",
        calculation: "$10 listing fees + $100 optional costs",
        result: "Total startup: ~$110. Very low barrier to entry, but margins are thinner."
      },
      {
        title: "Vintage/Resale Shop",
        scenario: "100 listings, $1,000 inventory, $200 supplies, $150 photography setup.",
        calculation: "$20 listing fees + $1,350 optional costs",
        result: "Total startup: ~$1,370. Higher investment but established market with good margins."
      }
    ],
    commonMistakes: [
      "Starting with too many listings before validating products - you pay $0.20 each!",
      "Underestimating packaging costs - quality packaging is expected by buyers.",
      "Skipping photography investment - poor photos mean poor sales.",
      "Not budgeting for initial paid advertising to gain visibility.",
      "Forgetting about ongoing costs like Etsy subscription or accounting software."
    ]
  };

  const faqItems = [
    {
      question: "What's the minimum cost to start an Etsy shop?",
      answer: "The absolute minimum is $0.20 for one listing. However, a realistic minimum for a viable shop is around $50-100: 10-20 listings ($2-4), basic supplies for your first products, and minimal packaging. Digital product shops have the lowest startup costs since there's no inventory. Plan for at least $200-500 if you're selling physical handmade goods."
    },
    {
      question: "Should I start with many listings or few?",
      answer: "Start with 10-25 quality listings rather than 100+ mediocre ones. Quality photos, descriptions, and tags matter more than quantity. Once you identify which products sell, you can expand. Starting small also limits your listing fee investment while you learn what works. You can always add more listings later."
    },
    {
      question: "Do I need professional photography equipment?",
      answer: "No! Many successful Etsy sellers use smartphones. Good natural lighting, a clean background, and multiple angles matter more than expensive equipment. A $20 photo backdrop and free editing apps can produce professional-looking photos. Only invest in professional equipment after you've validated your products and built revenue."
    },
    {
      question: "How much inventory should I stock initially?",
      answer: "For made-to-order items, you only need materials for a few products. For ready-to-ship items, stock 2-5 of each product initially. Don't over-invest in inventory until you know what sells. Many successful sellers start with 'sample' inventory and scale production based on demand. Test before you invest heavily."
    },
    {
      question: "What ongoing costs should I expect?",
      answer: "Monthly costs include: listing renewal fees (~$0.20 per listing every 4 months), transaction fees (6.5% per sale), payment processing (3% + $0.25 per sale), and optionally Etsy Plus subscription ($10/month). Budget roughly 10-15% of revenue for Etsy fees alone, plus your product costs and shipping supplies."
    },
    {
      question: "Should I invest in Etsy Plus as a new seller?",
      answer: "No, not initially. Etsy Plus ($10/month) offers shop credits, discounts on business cards, and customization options - but these aren't essential for a new shop. Focus on getting your products and listings right first. Consider Plus after you're making consistent sales and want the extra features and credits."
    }
  ];

  return (
    <CalculatorLayout
      title="Etsy Shop Startup Cost Calculator"
      description="Calculate how much it costs to start an Etsy shop. Includes listing fees, inventory, supplies, and break-even analysis."
    >
      <CalculatorSchema
        name="Etsy Shop Startup Cost Calculator"
        description="Free Etsy startup cost calculator. Estimate your total investment to launch an Etsy shop including listing fees, inventory, supplies, and photography costs."
        url="/etsy-tools/startup-cost-calculator"
        faqItems={faqItems}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <Link href="/" style={{ color: '#4a9eff' }}>Home</Link>
        {' > '}
        <Link href="/etsy-tools" style={{ color: '#4a9eff' }}>Etsy Tools</Link>
        {' > '}
        <span>Startup Cost Calculator</span>
      </div>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateCosts(); }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Shop Basics</h3>

          <div className={styles.formGroup}>
            <label htmlFor="numberOfListings" className={styles.label}>
              Number of Initial Listings *
            </label>
            <input
              id="numberOfListings"
              type="number"
              className={styles.input}
              value={numberOfListings}
              onChange={(e) => setNumberOfListings(e.target.value)}
              placeholder="e.g., 25"
              min="1"
              required
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Each listing costs $0.20 to create
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="productCategory" className={styles.label}>
              Product Category
            </label>
            <select
              id="productCategory"
              className={styles.select}
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="handmade">Handmade Products</option>
              <option value="digital">Digital Downloads</option>
              <option value="vintage">Vintage Items</option>
              <option value="supplies">Craft Supplies</option>
              <option value="pod">Print-on-Demand</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="shippingStrategy" className={styles.label}>
              Shipping Strategy
            </label>
            <select
              id="shippingStrategy"
              className={styles.select}
              value={shippingStrategy}
              onChange={(e) => setShippingStrategy(e.target.value)}
            >
              <option value="charged">Charge Shipping to Buyer</option>
              <option value="free">Free Shipping (built into price)</option>
              <option value="threshold">Free Shipping over $35</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Expected Sales (First Month)</h3>

          <div className={styles.formGroup}>
            <label htmlFor="expectedMonthlySales" className={styles.label}>
              Expected Monthly Sales
            </label>
            <input
              id="expectedMonthlySales"
              type="number"
              className={styles.input}
              value={expectedMonthlySales}
              onChange={(e) => setExpectedMonthlySales(e.target.value)}
              placeholder="e.g., 10"
              min="0"
            />
            <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Be realistic - new shops often start with 0-5 sales/month
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="averagePrice" className={styles.label}>
              Average Product Price ($)
            </label>
            <input
              id="averagePrice"
              type="number"
              className={styles.input}
              value={averagePrice}
              onChange={(e) => setAveragePrice(e.target.value)}
              placeholder="e.g., 35.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Optional Startup Costs</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Include any additional investments you plan to make
          </p>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={includeInventory}
                onChange={(e) => setIncludeInventory(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span className={styles.label}>Initial Inventory / Materials</span>
            </label>
            {includeInventory && (
              <input
                type="number"
                className={styles.input}
                value={inventoryCost}
                onChange={(e) => setInventoryCost(e.target.value)}
                placeholder="Enter inventory cost"
                step="0.01"
                min="0"
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={includeSupplies}
                onChange={(e) => setIncludeSupplies(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span className={styles.label}>Tools & Supplies</span>
            </label>
            {includeSupplies && (
              <input
                type="number"
                className={styles.input}
                value={suppliesCost}
                onChange={(e) => setSuppliesCost(e.target.value)}
                placeholder="Enter supplies cost"
                step="0.01"
                min="0"
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={includePackaging}
                onChange={(e) => setIncludePackaging(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span className={styles.label}>Packaging & Shipping Supplies</span>
            </label>
            {includePackaging && (
              <input
                type="number"
                className={styles.input}
                value={packagingCost}
                onChange={(e) => setPackagingCost(e.target.value)}
                placeholder="Enter packaging cost"
                step="0.01"
                min="0"
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={includePhotography}
                onChange={(e) => setIncludePhotography(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span className={styles.label}>Photography / Props</span>
            </label>
            {includePhotography && (
              <input
                type="number"
                className={styles.input}
                value={photographyCost}
                onChange={(e) => setPhotographyCost(e.target.value)}
                placeholder="Enter photography cost"
                step="0.01"
                min="0"
              />
            )}
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Startup Costs
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          {/* Total Investment Summary */}
          <div style={{ padding: '2rem', backgroundColor: '#1a2332', borderRadius: '12px', border: '2px solid #4a9eff', marginBottom: '2rem', textAlign: 'center' }}>
            <h3 style={{ color: '#4a9eff', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
              TOTAL STARTUP INVESTMENT
            </h3>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#e0e0e0', marginBottom: '1rem' }}>
              ${result.totalStartupCost.toFixed(2)}
            </div>
            {result.breakEvenSales > 0 && (
              <div style={{ color: '#b0b0b0' }}>
                Break-even after approximately <strong style={{ color: '#4a9eff' }}>{result.breakEvenSales} sales</strong>
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Cost Breakdown</h4>

            {/* Etsy Fees */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
              <h5 style={{ color: '#b0b0b0', marginBottom: '0.75rem', fontSize: '0.95rem' }}>ETSY FEES (First Month)</h5>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0' }}>Listing Fees ({result.listings} listings)</td>
                    <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.listingFees.toFixed(2)}</td>
                  </tr>
                  {result.monthlySales > 0 && (
                    <>
                      <tr style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0' }}>Transaction Fees (6.5%)</td>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.transactionFees.toFixed(2)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0' }}>Payment Processing (3% + $0.25)</td>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.paymentProcessingFees.toFixed(2)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0' }}>Sale Renewal Fees ({result.monthlySales} sales)</td>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.saleRenewalFees.toFixed(2)}</td>
                      </tr>
                    </>
                  )}
                  <tr style={{ borderTop: '2px solid #333' }}>
                    <td style={{ padding: '0.5rem 0', color: '#4a9eff', fontWeight: 600 }}>Subtotal Etsy Fees</td>
                    <td style={{ padding: '0.5rem 0', color: '#4a9eff', textAlign: 'right', fontWeight: 600 }}>${result.totalEtsyFees.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Optional Costs */}
            {result.totalOptionalCosts > 0 && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
                <h5 style={{ color: '#b0b0b0', marginBottom: '0.75rem', fontSize: '0.95rem' }}>OPTIONAL STARTUP COSTS</h5>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {result.inventory > 0 && (
                      <tr style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0' }}>Inventory / Materials</td>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.inventory.toFixed(2)}</td>
                      </tr>
                    )}
                    {result.supplies > 0 && (
                      <tr style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0' }}>Tools & Supplies</td>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.supplies.toFixed(2)}</td>
                      </tr>
                    )}
                    {result.packaging > 0 && (
                      <tr style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0' }}>Packaging & Shipping Supplies</td>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.packaging.toFixed(2)}</td>
                      </tr>
                    )}
                    {result.photography > 0 && (
                      <tr style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0' }}>Photography / Props</td>
                        <td style={{ padding: '0.5rem 0', color: '#e0e0e0', textAlign: 'right' }}>${result.photography.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr style={{ borderTop: '2px solid #333' }}>
                      <td style={{ padding: '0.5rem 0', color: '#4a9eff', fontWeight: 600 }}>Subtotal Optional Costs</td>
                      <td style={{ padding: '0.5rem 0', color: '#4a9eff', textAlign: 'right', fontWeight: 600 }}>${result.totalOptionalCosts.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Monthly Recurring Costs */}
          {result.monthlySales > 0 && (
            <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
              <h4 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Estimated Monthly Recurring Costs</h4>
              <p style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Based on {result.monthlySales} sales/month at ${result.price?.toFixed(2) || '0.00'} average:
              </p>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Monthly Etsy Fees</span>
                <span className={styles.resultValue}>${result.monthlyEtsyFees.toFixed(2)}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Monthly Revenue</span>
                <span className={styles.resultValue} style={{ color: '#4caf50' }}>${result.monthlyRevenue.toFixed(2)}</span>
              </div>
              <div className={styles.resultItem} style={{ borderBottom: 'none' }}>
                <span className={styles.resultLabel}>Fees as % of Revenue</span>
                <span className={styles.resultValue}>
                  {result.monthlyRevenue > 0 ? ((result.monthlyEtsyFees / result.monthlyRevenue) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          )}

          {/* Break-Even Analysis */}
          {result.breakEvenSales > 0 && result.profitPerSale > 0 && (
            <div style={{ padding: '1.5rem', backgroundColor: '#1a2332', borderRadius: '8px', border: '1px solid #4a9eff' }}>
              <h4 style={{ color: '#4a9eff', marginBottom: '1rem' }}>Break-Even Analysis</h4>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Profit Per Sale</span>
                <span className={styles.resultValue}>${result.profitPerSale.toFixed(2)}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Sales Needed to Break Even</span>
                <span className={styles.resultValuePrimary}>{result.breakEvenSales}</span>
              </div>
              <p style={{ color: '#b0b0b0', fontSize: '0.85rem', marginTop: '1rem' }}>
                * Assumes 30% product cost if inventory not specified. Actual break-even depends on your true costs.
              </p>
            </div>
          )}

          {result.totalStartupCost < 100 && (
            <InfoBox type="success" title="Low Startup Cost!">
              Your estimated startup cost is very manageable. This is a great opportunity to test your products with minimal risk. Focus on quality listings and learning what sells before scaling up your investment.
            </InfoBox>
          )}

          {result.totalStartupCost >= 500 && (
            <InfoBox type="info" title="Significant Investment">
              Your startup costs are substantial. Consider starting smaller to validate your products before investing heavily. You can always scale up inventory and listings once you know what sells.
            </InfoBox>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <InfoBox type="info" title="Plan Your Pricing">
        <p>Now that you know your startup costs, make sure your pricing covers them:</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/etsy-tools/profit-calculator" className={styles.button} style={{ display: 'inline-block' }}>
            Profit Calculator
          </Link>
          <Link href="/etsy-tools/fee-calculator" className={styles.button} style={{ display: 'inline-block', backgroundColor: '#333' }}>
            Fee Calculator
          </Link>
        </div>
      </InfoBox>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Related Etsy Tools</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Link href="/etsy-tools/listing-fee-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Listing Fee Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Project ongoing listing costs</div>
          </Link>
          <Link href="/etsy-tools/profit-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Profit Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Calculate true profit per sale</div>
          </Link>
          <Link href="/etsy-tools/etsy-vs-amazon-calculator" style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>Etsy vs Amazon Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Compare platform fees</div>
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
