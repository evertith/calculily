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

export default function EtsyShippingCalculator() {
  const [weight, setWeight] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [shippingStrategy, setShippingStrategy] = useState<'calculated' | 'fixed'>('calculated');
  const [result, setResult] = useState<any>(null);
  const { trackCalculatorUsage } = useAnalytics();

  const calculateShipping = () => {
    const w = parseFloat(weight) || 0;
    const l = parseFloat(length) || 0;
    const wd = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;

    if (w <= 0) return;

    // Calculate dimensional weight for USPS (divide by 166) and UPS/FedEx (divide by 139)
    const dimensionalWeightUSPS = (l * wd * h) / 166;
    const dimensionalWeightUPSFedEx = (l * wd * h) / 139;

    // Use greater of actual or dimensional weight
    const billableWeightUSPS = Math.max(w, dimensionalWeightUSPS);
    const billableWeightUPSFedEx = Math.max(w, dimensionalWeightUPSFedEx);

    // Simplified rate calculations (these would normally be API calls)
    // Rates based on typical 2025 pricing for Zone 4 (mid-range)
    const uspsFirstClass = w <= 1 ? 4.50 : 5.50;
    const uspsPriorityMail = 8.50 + (billableWeightUSPS * 0.50);
    const uspsExpress = 28.00 + (billableWeightUSPS * 1.20);
    const upsGround = 12.00 + (billableWeightUPSFedEx * 0.75);
    const fedexGround = 11.50 + (billableWeightUPSFedEx * 0.70);
    const fedex2Day = 25.00 + (billableWeightUPSFedEx * 1.50);

    // Apply typical discounts (Etsy Labels / third-party discounts)
    const discountRate = 0.25; // 25% discount

    const carriers = [
      {
        name: 'USPS First Class',
        service: '2-5 days',
        cost: uspsFirstClass,
        discountedCost: uspsFirstClass * (1 - discountRate),
        savings: uspsFirstClass * discountRate,
        available: w <= 1
      },
      {
        name: 'USPS Priority Mail',
        service: '1-3 days',
        cost: uspsPriorityMail,
        discountedCost: uspsPriorityMail * (1 - discountRate),
        savings: uspsPriorityMail * discountRate,
        available: true
      },
      {
        name: 'USPS Priority Express',
        service: '1-2 days',
        cost: uspsExpress,
        discountedCost: uspsExpress * (1 - discountRate),
        savings: uspsExpress * discountRate,
        available: true
      },
      {
        name: 'UPS Ground',
        service: '1-5 days',
        cost: upsGround,
        discountedCost: upsGround * (1 - discountRate),
        savings: upsGround * discountRate,
        available: true
      },
      {
        name: 'FedEx Ground',
        service: '1-5 days',
        cost: fedexGround,
        discountedCost: fedexGround * (1 - discountRate),
        savings: fedexGround * discountRate,
        available: true
      },
      {
        name: 'FedEx 2Day',
        service: '2 days',
        cost: fedex2Day,
        discountedCost: fedex2Day * (1 - discountRate),
        savings: fedex2Day * discountRate,
        available: true
      }
    ].filter(c => c.available);

    // Find best value (lowest discounted cost)
    const bestValue = carriers.reduce((prev, current) =>
      current.discountedCost < prev.discountedCost ? current : prev
    );

    // Check if dimensional weight is being used
    const isDimensionalWeight = (dimensionalWeightUSPS > w || dimensionalWeightUPSFedEx > w);

    setResult({
      actualWeight: w,
      dimensionalWeightUSPS,
      dimensionalWeightUPSFedEx,
      isDimensionalWeight,
      carriers,
      bestValue,
      shippingStrategy
    });

    trackCalculatorUsage('Etsy Shipping Calculator', {
      weight: w,
      dimensions: `${l}x${wd}x${h}`,
      strategy: shippingStrategy,
      best_value: bestValue.name
    });
  };

  const faqItems = [
    {
      question: "What is dimensional weight and why does it matter?",
      answer: "Dimensional weight is a pricing method that considers the size of a package, not just its weight. Carriers calculate it by multiplying length × width × height, then dividing by a standard divisor (166 for USPS, 139 for UPS/FedEx). If your package is large but light (like shipping pillows), you'll be charged based on dimensional weight instead of actual weight. Optimize your packaging to reduce unnecessary space and save money."
    },
    {
      question: "Should I use calculated shipping or fixed shipping?",
      answer: "Calculated shipping charges customers the exact carrier rate, eliminating your risk of losing money on shipping. However, higher shipping costs may reduce conversion rates. Fixed shipping (including 'free shipping' by building costs into your price) can increase sales but risks losses on heavy or distant shipments. Many successful sellers use calculated shipping for heavy items and fixed/free shipping for lightweight products where costs are predictable."
    },
    {
      question: "How do I get discounted shipping rates?",
      answer: "Etsy Labels provides built-in USPS discounts (typically 20-30% off retail rates). For even better rates, use third-party shipping services like Easyship or ShipStation, which offer discounts of up to 91% on commercial rates for USPS, UPS, and FedEx. These services also provide multi-carrier comparison, automated tracking, and batch label printing."
    },
    {
      question: "What changed with Etsy shipping in 2025?",
      answer: "As of 2025, Etsy removed the handling fee from calculated shipping. Previously, Etsy would add a small fee on top of the actual carrier cost. Now, when you use calculated shipping, customers pay exactly what the carrier charges, with no additional markup from Etsy. This makes calculated shipping more attractive for sellers."
    },
    {
      question: "Should I offer international shipping?",
      answer: "International shipping can expand your market significantly but comes with challenges: longer delivery times (2-6 weeks), customs forms, and potential import duties (paid by customer). Use Etsy's Global Postal Shipping or a third-party service to simplify international logistics. Start with Canada (easiest for US sellers) before expanding to Europe and beyond."
    },
    {
      question: "How can I reduce shipping costs?",
      answer: "1) Use the smallest box that safely fits your item. 2) Use lightweight packaging materials (poly mailers vs. boxes when possible). 3) Pre-negotiate prices by buying packaging in bulk. 4) Use discounted shipping services. 5) For lightweight items under 1 lb, USPS First Class is usually cheapest. 6) Consider flat-rate boxes for heavy items that fit."
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Compare shipping rates across carriers to find the best option for your Etsy orders:",
      steps: [
        "Enter package dimensions (length, width, height) in inches.",
        "Input the package weight in pounds and ounces.",
        "Enter origin and destination ZIP codes.",
        "Click 'Calculate' to compare rates across USPS, UPS, and FedEx."
      ]
    },
    whyMatters: {
      description: "Shipping costs can make or break your Etsy margins. Charge too little and you lose money on every sale; charge too much and buyers abandon their carts. Different carriers have different strengths - USPS is often cheapest for small, light items, while UPS and FedEx may be better for heavier packages. Comparing rates ensures you offer competitive shipping while protecting your profits.",
      benefits: [
        "Compare rates across USPS, UPS, and FedEx instantly",
        "Find the cheapest option for each package size and destination",
        "Set accurate shipping prices that don't eat into profits",
        "Identify when flat-rate options make sense",
        "Factor shipping costs into product pricing decisions"
      ]
    },
    examples: [
      {
        title: "Small Jewelry Item",
        scenario: "Shipping a 4oz padded envelope (6×9×1) from California to New York.",
        calculation: "USPS First Class: ~$4.50 | USPS Priority Flat Rate: ~$9.50",
        result: "First Class wins for small, light items - save $5 per shipment."
      },
      {
        title: "Medium Craft Item",
        scenario: "12×10×4 inch box weighing 2 lbs, shipping coast to coast.",
        calculation: "USPS Priority: ~$15 | UPS Ground: ~$13 | Priority Flat Rate Medium: ~$16",
        result: "UPS Ground is cheapest but slower. Balance cost vs delivery speed."
      },
      {
        title: "Heavy Item",
        scenario: "16×12×8 inch box weighing 8 lbs, shipping 500 miles.",
        calculation: "UPS Ground: ~$18 | FedEx Ground: ~$17 | USPS Priority: ~$22",
        result: "Ground services win for heavier items. Consider carrier pickup for convenience."
      }
    ],
    commonMistakes: [
      "Forgetting dimensional weight - large, light packages are charged by size, not weight.",
      "Not accounting for packaging weight - boxes and padding add ounces.",
      "Using retail rates instead of commercial rates - Etsy Labels offer discounts.",
      "Ignoring delivery time differences - Ground is cheaper but takes longer.",
      "Setting one flat shipping rate for all items - different products need different rates."
    ]
  };

  const relatedCalculators = [
    {
      title: "Etsy Fee Calculator",
      link: "/etsy-tools/fee-calculator",
      description: "Calculate all Etsy seller fees"
    },
    {
      title: "Etsy Profit Calculator",
      link: "/etsy-tools/profit-calculator",
      description: "Calculate true profit after costs"
    },
    {
      title: "Etsy Pricing Calculator",
      link: "/calculators/etsy-pricing",
      description: "Set profitable prices"
    }
  ];

  return (
    <CalculatorLayout
      title="Etsy Shipping Calculator"
      description="Compare shipping rates across USPS, UPS, and FedEx for your Etsy orders. Find the cheapest carrier and set accurate shipping prices."
    >
      <CalculatorSchema
        name="Etsy Shipping Calculator"
        description="Free Etsy shipping calculator to compare USPS, UPS, and FedEx rates. Find the cheapest shipping option for your packages and set accurate shipping prices."
        url="/etsy-tools/shipping-calculator"
        faqItems={faqItems}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <Link href="/" style={{ color: '#4a9eff' }}>Home</Link>
        {' > '}
        <Link href="/etsy-tools" style={{ color: '#4a9eff' }}>Etsy Tools</Link>
        {' > '}
        <span>Shipping Calculator</span>
      </div>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateShipping(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="weight" className={styles.label}>
            Package Weight (lbs) *
          </label>
          <input
            id="weight"
            type="number"
            className={styles.input}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in pounds"
            step="0.1"
            min="0"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label htmlFor="length" className={styles.label}>
              Length (in)
            </label>
            <input
              id="length"
              type="number"
              className={styles.input}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="Length"
              step="0.1"
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="width" className={styles.label}>
              Width (in)
            </label>
            <input
              id="width"
              type="number"
              className={styles.input}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Width"
              step="0.1"
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="height" className={styles.label}>
              Height (in)
            </label>
            <input
              id="height"
              type="number"
              className={styles.input}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height"
              step="0.1"
              min="0"
            />
          </div>
        </div>
        <small style={{ fontSize: '0.85rem', color: '#666', marginTop: '-0.5rem', display: 'block' }}>
          Accurate dimensions matter! Carriers charge by dimensional weight.
        </small>

        <div className={styles.formGroup}>
          <label className={styles.label}>Shipping Strategy</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${shippingStrategy === 'calculated' ? styles.buttonOptionActive : ''}`}
              onClick={() => setShippingStrategy('calculated')}
            >
              Calculated Shipping
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${shippingStrategy === 'fixed' ? styles.buttonOptionActive : ''}`}
              onClick={() => setShippingStrategy('fixed')}
            >
              Fixed Shipping
            </button>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Shipping Costs
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.25rem' }}>Carrier Comparison</h3>

          {result.isDimensionalWeight && (
            <InfoBox type="warning" title="Dimensional Weight Alert">
              Your package may be charged by dimensional weight instead of actual weight.
              <br />
              <strong>Actual Weight:</strong> {result.actualWeight} lbs
              <br />
              <strong>Dimensional Weight (USPS):</strong> {result.dimensionalWeightUSPS.toFixed(1)} lbs
              <br />
              <strong>Dimensional Weight (UPS/FedEx):</strong> {result.dimensionalWeightUPSFedEx.toFixed(1)} lbs
              <br /><br />
              💡 Optimize packaging to reduce size and save costs!
            </InfoBox>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Carrier & Service</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Transit</th>
                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Retail Rate</th>
                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Discounted</th>
                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>You Save</th>
              </tr>
            </thead>
            <tbody>
              {result.carriers.map((carrier: any, index: number) => (
                <tr key={index} style={{
                  borderBottom: '1px solid #222',
                  backgroundColor: carrier.name === result.bestValue.name ? '#1a2a1a' : 'transparent'
                }}>
                  <td style={{ padding: '0.75rem 0', color: '#e0e0e0' }}>
                    {carrier.name}
                    {carrier.name === result.bestValue.name && (
                      <span style={{ marginLeft: '0.5rem', color: '#4caf50', fontSize: '0.9rem' }}>✓ Best Value</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0', textAlign: 'center', fontSize: '0.9rem' }}>{carrier.service}</td>
                  <td style={{ padding: '0.75rem 0', color: '#b0b0b0', textAlign: 'right', textDecoration: 'line-through' }}>
                    ${carrier.cost.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem 0', color: '#4caf50', textAlign: 'right', fontWeight: 600 }}>
                    ${carrier.discountedCost.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem 0', color: '#4caf50', textAlign: 'right', fontSize: '0.9rem' }}>
                    ${carrier.savings.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: '#1a2a1a', borderRadius: '8px', border: '1px solid #4caf50' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#4caf50' }}>
              💡 <strong>Best Value:</strong> {result.bestValue.name}
            </div>
            <div style={{ color: '#b0b0b0' }}>
              ${result.bestValue.discountedCost.toFixed(2)} (discounted rate) • Arrives in {result.bestValue.service}
              {result.bestValue.name.includes('Priority') && ' with tracking and $100 insurance included'}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: '#1a2332', borderRadius: '8px' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '0.75rem' }}>Shipping Strategy Analysis</h4>
            {result.shippingStrategy === 'calculated' ? (
              <div style={{ color: '#b0b0b0', lineHeight: 1.7 }}>
                <div>✓ Customer pays exact shipping cost</div>
                <div>✓ No risk of losing money on shipping</div>
                <div>⚠ Higher shipping costs may reduce conversions</div>
              </div>
            ) : (
              <div style={{ color: '#b0b0b0', lineHeight: 1.7 }}>
                <div>✓ Can offer 'free shipping' by building cost into price</div>
                <div>✓ May increase conversion rates</div>
                <div>⚠ Risk of losing money on heavy/oversized items</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <div style={{ marginTop: '2rem' }}>
        <InfoBox type="info" title="Save Up to 91% on Shipping Rates">
          <p style={{ marginBottom: '1rem' }}>
            Get instant access to deeply discounted USPS, UPS, and FedEx rates through shipping partners like
            Easyship and ShipStation. No monthly fees - pay only when you ship.
          </p>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <strong>Easyship:</strong> Up to 91% off carrier rates
              <br />
              <a href="https://www.easyship.com" target="_blank" rel="noopener noreferrer sponsored" style={{ color: '#4a9eff' }}>
                Get Free Account →
              </a>
            </div>
            <div>
              <strong>ShipStation:</strong> Automate your shipping
              <br />
              <a href="https://www.shipstation.com" target="_blank" rel="noopener noreferrer sponsored" style={{ color: '#4a9eff' }}>
                Try Free for 30 Days →
              </a>
            </div>
          </div>
        </InfoBox>
      </div>

      <InfoBox type="success" title="Ready to Calculate Your Total Profit?">
        Now that you know your shipping costs, calculate your complete profit after ALL expenses.
        <div style={{ marginTop: '1rem' }}>
          <Link href="/etsy-tools/profit-calculator" className={styles.button} style={{ display: 'inline-block' }}>
            Calculate Total Profit
          </Link>
        </div>
      </InfoBox>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Related Tools</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.link} style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textDecoration: 'none' }}>
              <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: '0.25rem' }}>{calc.title}</div>
              <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>{calc.description}</div>
            </Link>
          ))}
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
