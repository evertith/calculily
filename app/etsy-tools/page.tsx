'use client';

import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import EtsyFeeBreakdown from '@/components/EtsyFeeBreakdown';
import styles from './EtsyTools.module.css';

export default function EtsyToolsHub() {
  const calculators = [
    {
      icon: '💰',
      title: 'Etsy Fee Calculator',
      description: 'Calculate all Etsy fees including listing fees, transaction fees, payment processing, and mandatory offsite ads. See exactly what Etsy takes from each sale.',
      features: [
        'All Etsy fees (2025 rates)',
        'Offsite ads calculator (12-15%)',
        'Regional regulatory fees',
        'Currency conversion costs'
      ],
      link: '/etsy-tools/fee-calculator',
      buttonText: 'Calculate Fees'
    },
    {
      icon: '📊',
      title: 'Profit Calculator',
      description: 'The complete picture. Calculate your actual profit after ALL costs: Etsy fees, shipping, materials, labor, and overhead.',
      features: [
        'Combines fees + shipping + costs',
        'Profit margin percentage',
        'Break-even analysis',
        'Pricing recommendations'
      ],
      link: '/etsy-tools/profit-calculator',
      buttonText: 'Calculate Profit'
    },
    {
      icon: '📦',
      title: 'Shipping Calculator',
      description: 'Compare USPS, UPS, and FedEx rates. Optimize package dimensions and choose between calculated vs. fixed shipping strategies.',
      features: [
        'Multi-carrier rate comparison',
        'Package dimension optimizer',
        'Domestic & international shipping',
        '2025 Etsy shipping policy updates'
      ],
      link: '/etsy-tools/shipping-calculator',
      buttonText: 'Calculate Shipping'
    },
    {
      icon: '📝',
      title: 'Listing Fee Calculator',
      description: 'Project your listing fee costs over time. Calculate auto-renewal fees, multi-quantity listing costs, and sale renewal charges.',
      features: [
        'Auto-renewal cost projection',
        'Multi-quantity listing fees',
        'Monthly/yearly fee estimates',
        'Cost optimization tips'
      ],
      link: '/etsy-tools/listing-fee-calculator',
      buttonText: 'Calculate Listing Fees'
    },
    {
      icon: '📈',
      title: 'Ads ROI Calculator',
      description: 'Determine if your Etsy Ads are actually profitable. Calculate ROAS, break-even CPC, and true profit after all fees.',
      features: [
        'Return on Ad Spend (ROAS)',
        'Break-even CPC calculation',
        'Profitability analysis',
        'Optimization recommendations'
      ],
      link: '/etsy-tools/ads-roi-calculator',
      buttonText: 'Calculate Ad ROI'
    },
    {
      icon: '🚀',
      title: 'Startup Cost Calculator',
      description: 'Estimate your total investment to launch an Etsy shop. Includes listing fees, inventory, supplies, and break-even analysis.',
      features: [
        'Initial setup cost breakdown',
        'Optional costs (inventory, supplies)',
        'Break-even sales calculation',
        'Monthly fee projections'
      ],
      link: '/etsy-tools/startup-cost-calculator',
      buttonText: 'Calculate Startup Costs'
    },
    {
      icon: '⚖️',
      title: 'Etsy vs Amazon Calculator',
      description: 'Compare Etsy and Amazon Handmade fees side-by-side. See which platform keeps you more profit on your products.',
      features: [
        'Side-by-side fee comparison',
        'Volume-based analysis',
        'FBA fee estimates',
        'Platform recommendations'
      ],
      link: '/etsy-tools/etsy-vs-amazon-calculator',
      buttonText: 'Compare Platforms'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Free Etsy Seller Calculators - Know Your Real Profit</h1>
        <p className={styles.heroSubtitle}>
          Calculate fees, shipping costs, and true profit margins. Built for Etsy sellers who want to price smarter and earn more.
          7 free tools to help you maximize your Etsy business.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/etsy-tools/fee-calculator" className={styles.primaryButton}>
            Calculate Etsy Fees
          </Link>
          <Link href="/etsy-tools/profit-calculator" className={styles.primaryButton}>
            Calculate Profit
          </Link>
        </div>
      </section>

      {/* Problem Statement */}
      <section className={styles.problemSection}>
        <h2 className={styles.sectionTitle}>Why Etsy Sellers Lose Money Without Realizing It</h2>
        <p className={styles.problemText}>
          Etsy's fee structure is more complex than most sellers realize. Between listing fees, transaction fees,
          payment processing, and mandatory offsite ads (once you hit $10K in sales), the costs add up fast.
          Add in shipping expenses that many sellers underestimate, and it's easy to lose 15-25% more than you expected.
        </p>
        <p className={styles.problemText}>
          <strong>The truth is simple:</strong> If you don't know your TRUE profit per sale, you're probably leaving money on the table - or worse,
          losing money without knowing it.
        </p>
      </section>

      {/* Top Banner Ad - After hero, before calculator cards */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      {/* Calculator Cards */}
      <section className={styles.calculatorsSection}>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>All Etsy Calculator Tools</h2>
        <div className={styles.calculatorGrid}>
          {calculators.map((calc, index) => (
            <div key={index} className={styles.calculatorCard}>
              <div className={styles.cardIcon}>{calc.icon}</div>
              <h3 className={styles.cardTitle}>{calc.title}</h3>
              <p className={styles.cardDescription}>{calc.description}</p>
              <ul className={styles.featureList}>
                {calc.features.map((feature, fIndex) => (
                  <li key={fIndex}>✓ {feature}</li>
                ))}
              </ul>
              <Link href={calc.link} className={styles.cardButton}>
                {calc.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Mid Content Square Ad - After calculator cards */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      {/* Fee Breakdown Component */}
      <section style={{ marginBottom: '3rem' }}>
        <EtsyFeeBreakdown showTitle={true} compact={false} />
      </section>

      {/* Educational Section */}
      <section className={styles.educationalSection}>
        <h2 className={styles.sectionTitle}>Understanding Etsy's Fee Structure (2025)</h2>

        <div className={styles.feeBreakdown}>
          <div className={styles.feeItem}>
            <h3>Listing Fee: $0.20</h3>
            <p>Charged when you create or renew a listing. Good for 4 months or until the item sells.
            Automatically renews if auto-renew is enabled. Also charged when an item sells to relist it.</p>
          </div>

          <div className={styles.feeItem}>
            <h3>Transaction Fee: 6.5%</h3>
            <p>Charged on the total sale price INCLUDING shipping. This is Etsy's main revenue source and applies to every sale.
            This is one of the highest transaction fees among e-commerce platforms.</p>
          </div>

          <div className={styles.feeItem}>
            <h3>Payment Processing: 3% + $0.25</h3>
            <p>Charged if using Etsy Payments (required for most sellers). Similar to PayPal or Stripe fees.
            This is on top of transaction fees, not included in them.</p>
          </div>

          <div className={styles.feeItem}>
            <h3>Offsite Ads: 12-15%</h3>
            <p><strong>MANDATORY</strong> if you made $10,000+ in the last 12 months. Optional at 15% if under $10K,
            mandatory at 12% if over $10K. Charged only when an ad results in a sale. Cannot be opted out at $10K+ threshold.
            This fee alone can change whether selling on Etsy is profitable for your products.</p>
          </div>

          <div className={styles.feeItem}>
            <h3>Shipping Cost Changes (2025)</h3>
            <p>As of 2025, Etsy removed the handling fee from calculated shipping, making it more seller-friendly.
            You can now offer calculated shipping without Etsy adding extra fees on top. Use our shipping calculator
            to find the best rates across carriers.</p>
          </div>
        </div>

        <p className={styles.mistakeWarning}>
          <strong>Common mistake:</strong> Most new sellers forget about offsite ads fees and are shocked when they hit $10K in sales
          and suddenly see 12% deducted from sales driven by Etsy's external advertising. Always plan for this in your pricing!
        </p>
      </section>

      {/* Quick Links Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Quick Calculator Links</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <Link href="/etsy-tools/fee-calculator" style={{
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600 }}>Fee Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>All Etsy fees</div>
          </Link>
          <Link href="/etsy-tools/profit-calculator" style={{
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600 }}>Profit Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>True profit</div>
          </Link>
          <Link href="/etsy-tools/shipping-calculator" style={{
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600 }}>Shipping Calculator</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Compare rates</div>
          </Link>
          <Link href="/etsy-tools/listing-fee-calculator" style={{
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600 }}>Listing Fees</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Project costs</div>
          </Link>
          <Link href="/etsy-tools/ads-roi-calculator" style={{
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600 }}>Ads ROI</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Ad profitability</div>
          </Link>
          <Link href="/etsy-tools/startup-cost-calculator" style={{
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600 }}>Startup Costs</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Launch budget</div>
          </Link>
          <Link href="/etsy-tools/etsy-vs-amazon-calculator" style={{
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ color: '#e0e0e0', fontWeight: 600 }}>Etsy vs Amazon</div>
            <div style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Compare platforms</div>
          </Link>
        </div>
      </section>

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      {/* Value Proposition */}
      <section className={styles.valueSection}>
        <h2 className={styles.sectionTitle}>Free Tools Built for Etsy Sellers</h2>
        <p className={styles.valueText}>
          We built these calculators because too many talented Etsy sellers were underpricing their work and burning out.
          Every calculator is <strong>completely free</strong>, requires <strong>no signup</strong>, and is updated for
          <strong> 2025 Etsy policies</strong>. Used by thousands of Etsy sellers every month to price profitably and grow sustainably.
        </p>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCta}>
        <h2 className={styles.ctaTitle}>Start Calculating Your Etsy Profits Now</h2>
        <div className={styles.ctaButtons}>
          <Link href="/etsy-tools/fee-calculator" className={styles.secondaryButton}>
            Fee Calculator
          </Link>
          <Link href="/etsy-tools/profit-calculator" className={styles.secondaryButton}>
            Profit Calculator
          </Link>
          <Link href="/etsy-tools/shipping-calculator" className={styles.secondaryButton}>
            Shipping Calculator
          </Link>
          <Link href="/etsy-tools/listing-fee-calculator" className={styles.secondaryButton}>
            Listing Fees
          </Link>
          <Link href="/etsy-tools/ads-roi-calculator" className={styles.secondaryButton}>
            Ads ROI
          </Link>
          <Link href="/etsy-tools/startup-cost-calculator" className={styles.secondaryButton}>
            Startup Costs
          </Link>
          <Link href="/etsy-tools/etsy-vs-amazon-calculator" className={styles.secondaryButton}>
            Etsy vs Amazon
          </Link>
        </div>
      </section>

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </div>
  );
}
