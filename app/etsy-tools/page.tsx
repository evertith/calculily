'use client';

import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import styles from './EtsyTools.module.css';

export default function EtsyToolsHub() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Free Etsy Seller Calculators - Know Your Real Profit</h1>
        <p className={styles.heroSubtitle}>
          Calculate fees, shipping costs, and true profit margins. Built for Etsy sellers who want to price smarter and earn more.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/etsy-tools/fee-calculator" className={styles.primaryButton}>
            Calculate Etsy Fees
          </Link>
          <Link href="/etsy-tools/shipping-calculator" className={styles.primaryButton}>
            Calculate Shipping Costs
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
        <div className={styles.calculatorGrid}>
          {/* Fee Calculator Card */}
          <div className={styles.calculatorCard}>
            <div className={styles.cardIcon}>💰</div>
            <h3 className={styles.cardTitle}>Etsy Fee Calculator</h3>
            <p className={styles.cardDescription}>
              Calculate all Etsy fees including listing fees, transaction fees, payment processing, and mandatory offsite ads.
              See exactly what Etsy takes from each sale.
            </p>
            <ul className={styles.featureList}>
              <li>✓ All Etsy fees (2025 rates)</li>
              <li>✓ Offsite ads calculator (12-15%)</li>
              <li>✓ Regional regulatory fees</li>
              <li>✓ Currency conversion costs</li>
            </ul>
            <Link href="/etsy-tools/fee-calculator" className={styles.cardButton}>
              Calculate Fees
            </Link>
          </div>

          {/* Shipping Calculator Card */}
          <div className={styles.calculatorCard}>
            <div className={styles.cardIcon}>📦</div>
            <h3 className={styles.cardTitle}>Etsy Shipping Calculator</h3>
            <p className={styles.cardDescription}>
              Compare USPS, UPS, and FedEx rates. Optimize package dimensions and choose between calculated vs.
              fixed shipping strategies.
            </p>
            <ul className={styles.featureList}>
              <li>✓ Multi-carrier rate comparison</li>
              <li>✓ Package dimension optimizer</li>
              <li>✓ Domestic & international shipping</li>
              <li>✓ 2025 Etsy shipping policy updates</li>
            </ul>
            <Link href="/etsy-tools/shipping-calculator" className={styles.cardButton}>
              Calculate Shipping
            </Link>
          </div>

          {/* Profit Calculator Card */}
          <div className={styles.calculatorCard}>
            <div className={styles.cardIcon}>📊</div>
            <h3 className={styles.cardTitle}>Total Profit Calculator</h3>
            <p className={styles.cardDescription}>
              The complete picture. Calculate your actual profit after ALL costs: Etsy fees, shipping, materials,
              labor, and overhead.
            </p>
            <ul className={styles.featureList}>
              <li>✓ Combines fees + shipping + costs</li>
              <li>✓ Profit margin percentage</li>
              <li>✓ Break-even analysis</li>
              <li>✓ Pricing recommendations</li>
            </ul>
            <Link href="/etsy-tools/profit-calculator" className={styles.cardButton}>
              Calculate Profit
            </Link>
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section className={styles.educationalSection}>
        <h2 className={styles.sectionTitle}>Understanding Etsy's Fee Structure (2025)</h2>

        <div className={styles.feeBreakdown}>
          <div className={styles.feeItem}>
            <h3>Listing Fee: $0.20</h3>
            <p>Charged when you create or renew a listing. Good for 4 months or until the item sells.
            Automatically renews if auto-renew is enabled.</p>
          </div>

          <div className={styles.feeItem}>
            <h3>Transaction Fee: 6.5%</h3>
            <p>Charged on the total sale price INCLUDING shipping. This is Etsy's main revenue source and applies to every sale.</p>
          </div>

          <div className={styles.feeItem}>
            <h3>Payment Processing: 3% + $0.25</h3>
            <p>Charged if using Etsy Payments (required for most sellers). Similar to PayPal or Stripe fees.</p>
          </div>

          <div className={styles.feeItem}>
            <h3>Offsite Ads: 12-15%</h3>
            <p><strong>MANDATORY</strong> if you made $10,000+ in the last 12 months. Optional at 15% if under $10K,
            mandatory at 12% if over $10K. Charged only when an ad results in a sale. Cannot be opted out at $10K+ threshold.</p>
          </div>

          <div className={styles.feeItem}>
            <h3>Shipping Cost Changes (2025)</h3>
            <p>As of 2025, Etsy removed the handling fee from calculated shipping, making it more seller-friendly.
            You can now offer calculated shipping without Etsy adding extra fees on top.</p>
          </div>
        </div>

        <p className={styles.mistakeWarning}>
          <strong>Common mistake:</strong> Most new sellers forget about offsite ads fees and are shocked when they hit $10K in sales
          and suddenly see 12% deducted from sales driven by Etsy's external advertising. Always plan for this in your pricing!
        </p>
      </section>

      {/* Mid Content Square Ad - After educational content */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

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
          <Link href="/etsy-tools/shipping-calculator" className={styles.secondaryButton}>
            Shipping Calculator
          </Link>
          <Link href="/etsy-tools/profit-calculator" className={styles.secondaryButton}>
            Profit Calculator
          </Link>
        </div>
      </section>

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </div>
  );
}
