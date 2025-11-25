'use client';

import Link from 'next/link';
import CalculatorLayout from '@/components/CalculatorLayout';
import AdUnit from '@/components/AdUnit';
import EtsyFeeBreakdown from '@/components/EtsyFeeBreakdown';

export default function EtsyFeesExplained() {
  return (
    <CalculatorLayout
      title="Etsy Fees Explained: Complete 2024-2025 Seller Guide"
      description="Understand every Etsy fee in detail: listing fees, transaction fees, payment processing, offsite ads, and more. Learn how to calculate your true costs and maximize profit."
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <Link href="/" style={{ color: '#4a9eff' }}>Home</Link>
        {' > '}
        <Link href="/etsy-tools" style={{ color: '#4a9eff' }}>Etsy Tools</Link>
        {' > '}
        <span>Etsy Fees Explained</span>
      </div>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <article style={{ color: '#e0e0e0', lineHeight: 1.8 }}>
        {/* Introduction */}
        <section style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.15rem', color: '#b0b0b0', marginBottom: '1.5rem' }}>
            If you're selling on Etsy (or thinking about starting), understanding the fee structure is critical
            to running a profitable business. Etsy's fees have evolved significantly over the years, and as of
            2024-2025, sellers face multiple fee types that can add up to 15-25% of each sale. This comprehensive
            guide breaks down every Etsy fee, explains when they apply, and helps you calculate your true costs.
          </p>

          <div style={{
            padding: '1.5rem',
            backgroundColor: '#1a2332',
            borderRadius: '8px',
            border: '1px solid #4a9eff',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#4a9eff', marginBottom: '1rem' }}>Quick Summary: Total Etsy Fees</h3>
            <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
              <li><strong>Minimum fees (under $10K/year):</strong> ~9.5-11% of sale price</li>
              <li><strong>With mandatory offsite ads ($10K+/year):</strong> ~20-25% when ads trigger</li>
              <li><strong>Fixed costs:</strong> $0.20 listing fee + $0.25 payment processing per sale</li>
            </ul>
          </div>
        </section>

        {/* Table of Contents */}
        <nav style={{
          padding: '1.5rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          marginBottom: '3rem'
        }}>
          <h2 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.25rem' }}>Table of Contents</h2>
          <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li><a href="#listing-fee" style={{ color: '#4a9eff' }}>Listing Fee ($0.20)</a></li>
            <li><a href="#transaction-fee" style={{ color: '#4a9eff' }}>Transaction Fee (6.5%)</a></li>
            <li><a href="#payment-processing" style={{ color: '#4a9eff' }}>Payment Processing Fee (3% + $0.25)</a></li>
            <li><a href="#offsite-ads" style={{ color: '#4a9eff' }}>Offsite Ads Fee (12-15%)</a></li>
            <li><a href="#currency-conversion" style={{ color: '#4a9eff' }}>Currency Conversion Fee (2.5%)</a></li>
            <li><a href="#regulatory-fee" style={{ color: '#4a9eff' }}>Regulatory Operating Fee</a></li>
            <li><a href="#etsy-plus" style={{ color: '#4a9eff' }}>Etsy Plus Subscription</a></li>
            <li><a href="#etsy-ads" style={{ color: '#4a9eff' }}>Etsy Ads (Optional)</a></li>
            <li><a href="#examples" style={{ color: '#4a9eff' }}>Real-World Examples</a></li>
            <li><a href="#tips" style={{ color: '#4a9eff' }}>Tips to Minimize Fees</a></li>
          </ol>
        </nav>

        {/* Listing Fee */}
        <section id="listing-fee" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            1. Listing Fee: $0.20 Per Listing
          </h2>
          <p>
            Every time you create a new listing on Etsy, you pay a flat <strong>$0.20 listing fee</strong>.
            This fee is charged immediately when the listing is published, regardless of whether the item sells.
          </p>

          <h3 style={{ color: '#4a9eff', marginTop: '1.5rem', marginBottom: '1rem' }}>When You're Charged:</h3>
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li><strong>Creating a new listing:</strong> $0.20</li>
            <li><strong>Listing expires and auto-renews:</strong> $0.20 (every 4 months)</li>
            <li><strong>Item sells and relists:</strong> $0.20 (to replenish inventory)</li>
            <li><strong>Multi-quantity sale:</strong> $0.20 per transaction (not per item quantity)</li>
          </ul>

          <h3 style={{ color: '#4a9eff', marginTop: '1.5rem', marginBottom: '1rem' }}>Key Points:</h3>
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li>Listings expire after <strong>4 months</strong> if they don't sell</li>
            <li>Auto-renew is enabled by default - turn it off to avoid fees on slow-moving items</li>
            <li>Variations within a listing don't incur additional fees</li>
            <li>Private listings still cost $0.20</li>
          </ul>

          <div style={{
            padding: '1rem',
            backgroundColor: '#2a1a1a',
            borderLeft: '3px solid #ff6b6b',
            borderRadius: '4px',
            marginTop: '1.5rem'
          }}>
            <strong style={{ color: '#ff6b6b' }}>Watch Out:</strong>
            <span style={{ color: '#b0b0b0' }}> If you have 100 listings and they all auto-renew every 4 months,
            that's $60/year just in renewal fees - before you sell anything!</span>
          </div>
        </section>

        {/* Mid Content Ad */}
        <AdUnit adSlot="6129936879" className="ad-mid-content" />

        {/* Transaction Fee */}
        <section id="transaction-fee" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            2. Transaction Fee: 6.5% of Total Sale
          </h2>
          <p>
            Etsy's main revenue comes from the <strong>6.5% transaction fee</strong>. This is charged on the
            <strong> total sale amount</strong>, which includes both the item price AND any shipping charges
            you collect from the buyer.
          </p>

          <h3 style={{ color: '#4a9eff', marginTop: '1.5rem', marginBottom: '1rem' }}>What It Applies To:</h3>
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li>Item sale price</li>
            <li>Shipping charges (even if you use calculated shipping)</li>
            <li>Gift wrap fees (if offered)</li>
            <li>Any other charges to the buyer</li>
          </ul>

          <h3 style={{ color: '#4a9eff', marginTop: '1.5rem', marginBottom: '1rem' }}>Example Calculation:</h3>
          <div style={{
            padding: '1rem',
            backgroundColor: '#0a0a0a',
            borderRadius: '8px',
            fontFamily: 'monospace'
          }}>
            <p style={{ margin: 0 }}>Item Price: $40.00</p>
            <p style={{ margin: 0 }}>Shipping: $6.00</p>
            <p style={{ margin: 0 }}>Total: $46.00</p>
            <p style={{ margin: '0.5rem 0 0', color: '#4a9eff' }}>Transaction Fee: $46.00 × 6.5% = $2.99</p>
          </div>

          <p style={{ marginTop: '1rem', color: '#b0b0b0' }}>
            Note: This 6.5% is higher than many competitors. Amazon Handmade charges 15% but has no other
            transaction fees, while Shopify charges 0% (you only pay payment processing).
          </p>
        </section>

        {/* Payment Processing */}
        <section id="payment-processing" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            3. Payment Processing Fee: 3% + $0.25
          </h2>
          <p>
            When buyers pay through Etsy Payments (which handles credit cards, PayPal, Apple Pay, etc.),
            Etsy charges a <strong>3% + $0.25</strong> payment processing fee. This is similar to what
            PayPal or Stripe would charge.
          </p>

          <h3 style={{ color: '#4a9eff', marginTop: '1.5rem', marginBottom: '1rem' }}>Key Details:</h3>
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li><strong>Etsy Payments is mandatory</strong> for sellers in most countries</li>
            <li>The 3% applies to the total sale (item + shipping)</li>
            <li>The $0.25 is charged per transaction, not per item</li>
            <li>Refunds don't return the payment processing fee</li>
          </ul>

          <h3 style={{ color: '#4a9eff', marginTop: '1.5rem', marginBottom: '1rem' }}>Example:</h3>
          <div style={{
            padding: '1rem',
            backgroundColor: '#0a0a0a',
            borderRadius: '8px',
            fontFamily: 'monospace'
          }}>
            <p style={{ margin: 0 }}>Total Sale: $46.00</p>
            <p style={{ margin: '0.5rem 0 0', color: '#4a9eff' }}>Payment Processing: ($46.00 × 3%) + $0.25 = $1.63</p>
          </div>
        </section>

        {/* Offsite Ads */}
        <section id="offsite-ads" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #ff6b6b', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            4. Offsite Ads Fee: 12-15% (The Big One)
          </h2>
          <p>
            This is the fee that catches many sellers by surprise. Etsy runs ads for your products on
            Google, Facebook, Instagram, and other platforms. When those ads result in a sale, you pay
            an <strong>Offsite Ads fee</strong>.
          </p>

          <div style={{
            padding: '1.5rem',
            backgroundColor: '#2a1a1a',
            borderRadius: '8px',
            border: '1px solid #ff6b6b',
            marginTop: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Critical: Mandatory at $10K+</h3>
            <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
              <li><strong>Under $10,000/year:</strong> Optional, 15% fee when ads result in sale</li>
              <li><strong>$10,000+/year:</strong> MANDATORY, 12% fee - you cannot opt out</li>
              <li>The threshold is based on your trailing 12-month sales</li>
              <li>Fee is charged on the item price only (not shipping)</li>
            </ul>
          </div>

          <h3 style={{ color: '#4a9eff', marginTop: '1.5rem', marginBottom: '1rem' }}>How It Works:</h3>
          <ol style={{ paddingLeft: '1.25rem' }}>
            <li>Etsy shows ads for your products on external platforms</li>
            <li>Someone clicks the ad and visits your listing</li>
            <li>If they purchase within 30 days, you pay the offsite ads fee</li>
            <li>You have no control over which items are advertised</li>
          </ol>

          <h3 style={{ color: '#4a9eff', marginTop: '1.5rem', marginBottom: '1rem' }}>Example Impact:</h3>
          <div style={{
            padding: '1rem',
            backgroundColor: '#0a0a0a',
            borderRadius: '8px',
            fontFamily: 'monospace'
          }}>
            <p style={{ margin: 0 }}>$40 item sale from offsite ad (at $10K+ threshold)</p>
            <p style={{ margin: '0.5rem 0 0', color: '#ff6b6b' }}>Offsite Ads Fee: $40.00 × 12% = $4.80</p>
            <p style={{ margin: '0.5rem 0 0', color: '#b0b0b0', fontSize: '0.9rem' }}>
              This is ON TOP of all other fees, potentially bringing total fees to 20%+
            </p>
          </div>
        </section>

        {/* Sidebar Ad */}
        <AdUnit adSlot="5668678546" className="ad-sidebar" />

        {/* Currency Conversion */}
        <section id="currency-conversion" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            5. Currency Conversion Fee: 2.5%
          </h2>
          <p>
            When a buyer pays in a different currency than your shop's currency, Etsy charges a
            <strong> 2.5% currency conversion fee</strong>. This applies to international sales where
            currency conversion is needed.
          </p>
          <p>
            For US sellers receiving payments in USD, this fee typically doesn't apply. But for
            international sellers or when dealing with cross-border transactions, it adds up.
          </p>
        </section>

        {/* Regulatory Fee */}
        <section id="regulatory-fee" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            6. Regulatory Operating Fee
          </h2>
          <p>
            Some regions have regulatory operating fees that Etsy passes on to sellers:
          </p>
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li><strong>UK sellers:</strong> 0.4%</li>
            <li><strong>Some EU countries:</strong> Varies by country</li>
            <li><strong>US sellers:</strong> Generally none</li>
          </ul>
          <p style={{ color: '#b0b0b0' }}>
            These fees cover Etsy's compliance costs with local regulations. Check Etsy's current
            fee schedule for your specific country.
          </p>
        </section>

        {/* Etsy Plus */}
        <section id="etsy-plus" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            7. Etsy Plus Subscription: $10/month
          </h2>
          <p>
            Etsy Plus is an optional subscription that offers:
          </p>
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li>15 listing credits ($3 value)</li>
            <li>$5 Etsy Ads credit</li>
            <li>Advanced shop customization options</li>
            <li>Discounts on custom domains, packaging, and business cards</li>
            <li>Restock requests feature</li>
          </ul>
          <p style={{ color: '#b0b0b0', marginTop: '1rem' }}>
            <strong>Verdict:</strong> Not essential for new sellers. The credits don't fully offset
            the cost, and the features are nice-to-have rather than must-have. Consider it once
            you're making consistent sales.
          </p>
        </section>

        {/* Etsy Ads */}
        <section id="etsy-ads" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            8. Etsy Ads (Optional)
          </h2>
          <p>
            Unlike Offsite Ads (which are mandatory at $10K+), <strong>Etsy Ads</strong> are completely
            optional. These are ads shown within Etsy search results.
          </p>
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li>You set a daily budget (minimum $1/day)</li>
            <li>You're charged per click (CPC model)</li>
            <li>Average CPC ranges from $0.20-$1.00+ depending on category</li>
            <li>You can pause anytime</li>
          </ul>
          <p style={{ marginTop: '1rem' }}>
            <Link href="/etsy-tools/ads-roi-calculator" style={{ color: '#4a9eff' }}>
              Use our Etsy Ads ROI Calculator
            </Link> to determine if ads are profitable for your products.
          </p>
        </section>

        {/* Examples */}
        <section id="examples" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            9. Real-World Fee Examples
          </h2>

          {/* Example 1 */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#4a9eff', marginBottom: '1rem' }}>Example 1: Small Seller (Under $10K/year)</h3>
            <p><strong>$35 item + $5 shipping = $40 total</strong></p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Listing Fee</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>$0.20</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Transaction Fee (6.5%)</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>$2.60</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Payment Processing</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>$1.45</td>
                </tr>
                <tr style={{ borderTop: '2px solid #4a9eff' }}>
                  <td style={{ padding: '0.75rem 0', color: '#4a9eff', fontWeight: 600 }}>Total Fees</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#4a9eff', fontWeight: 600 }}>$4.25 (10.6%)</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: '1rem', color: '#4caf50' }}>You keep: $35.75</p>
          </div>

          {/* Example 2 */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Example 2: Same Sale WITH Offsite Ad (at $10K+ threshold)</h3>
            <p><strong>$35 item + $5 shipping = $40 total</strong></p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Listing Fee</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>$0.20</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Transaction Fee (6.5%)</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>$2.60</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.5rem 0', color: '#b0b0b0' }}>Payment Processing</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>$1.45</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.5rem 0', color: '#ff6b6b' }}>Offsite Ads (12%)</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right', color: '#ff6b6b' }}>$4.20</td>
                </tr>
                <tr style={{ borderTop: '2px solid #ff6b6b' }}>
                  <td style={{ padding: '0.75rem 0', color: '#ff6b6b', fontWeight: 600 }}>Total Fees</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#ff6b6b', fontWeight: 600 }}>$8.45 (21.1%)</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: '1rem', color: '#ffaa00' }}>You keep: $31.55 (vs $35.75 without offsite ads)</p>
          </div>
        </section>

        {/* Tips */}
        <section id="tips" style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#e0e0e0', borderBottom: '2px solid #4a9eff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            10. Tips to Minimize Etsy Fees
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '3px solid #4a9eff' }}>
              <h4 style={{ color: '#4a9eff', marginBottom: '0.5rem' }}>1. Use Multi-Quantity Listings</h4>
              <p style={{ margin: 0, color: '#b0b0b0' }}>
                Instead of creating separate listings for identical items, use multi-quantity listings.
                You pay $0.20 once instead of per listing.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '3px solid #4a9eff' }}>
              <h4 style={{ color: '#4a9eff', marginBottom: '0.5rem' }}>2. Consolidate with Variations</h4>
              <p style={{ margin: 0, color: '#b0b0b0' }}>
                Use variations (size, color, style) within one listing instead of separate listings.
                One listing with 10 variations costs $0.20 total.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '3px solid #4a9eff' }}>
              <h4 style={{ color: '#4a9eff', marginBottom: '0.5rem' }}>3. Turn Off Auto-Renew for Slow Items</h4>
              <p style={{ margin: 0, color: '#b0b0b0' }}>
                If a listing hasn't sold in multiple cycles, consider turning off auto-renew.
                Review and decide manually whether to renew.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '3px solid #4a9eff' }}>
              <h4 style={{ color: '#4a9eff', marginBottom: '0.5rem' }}>4. Price for Fees</h4>
              <p style={{ margin: 0, color: '#b0b0b0' }}>
                Build fees into your prices. If you want $30 profit, don't price at $30 -
                price at $35+ to cover fees. Use our{' '}
                <Link href="/etsy-tools/profit-calculator" style={{ color: '#4a9eff' }}>
                  Profit Calculator
                </Link>.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '3px solid #4a9eff' }}>
              <h4 style={{ color: '#4a9eff', marginBottom: '0.5rem' }}>5. Consider Higher Price Points</h4>
              <p style={{ margin: 0, color: '#b0b0b0' }}>
                Fixed fees ($0.20 listing, $0.25 processing) hurt more on low-priced items.
                A $10 item loses ~5% to fixed fees; a $50 item loses ~1%.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '3px solid #4a9eff' }}>
              <h4 style={{ color: '#4a9eff', marginBottom: '0.5rem' }}>6. Opt Out of Offsite Ads (If Eligible)</h4>
              <p style={{ margin: 0, color: '#b0b0b0' }}>
                If you're under $10K/year, you can opt out of Offsite Ads in your shop settings.
                Weigh the potential traffic benefit vs. the 15% fee.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator CTA */}
        <section style={{
          padding: '2rem',
          backgroundColor: '#1a2332',
          borderRadius: '12px',
          border: '2px solid #4a9eff',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h2 style={{ color: '#4a9eff', marginBottom: '1rem' }}>Calculate Your Etsy Fees</h2>
          <p style={{ color: '#b0b0b0', marginBottom: '1.5rem' }}>
            Use our free calculators to see exactly what you'll pay and keep from each sale.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/etsy-tools/fee-calculator" style={{
              padding: '1rem 2rem',
              backgroundColor: '#4a9eff',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              Fee Calculator
            </Link>
            <Link href="/etsy-tools/profit-calculator" style={{
              padding: '1rem 2rem',
              backgroundColor: '#333',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              Profit Calculator
            </Link>
            <Link href="/etsy-tools" style={{
              padding: '1rem 2rem',
              backgroundColor: '#333',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              All Etsy Tools
            </Link>
          </div>
        </section>

        {/* Fee Breakdown Component */}
        <EtsyFeeBreakdown showTitle={true} compact={false} />
      </article>

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
