'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import AdUnit from '@/components/AdUnit';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState<string>('');
  const [fuelEconomy, setFuelEconomy] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [result, setResult] = useState<{
    totalCost: number;
    gallonsNeeded: number;
    costPerMile: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const faqItems = [
    {
      question: "How do I find my vehicle's actual fuel economy?",
      answer: "Your car's real-world MPG often differs from the EPA estimate. To find your actual MPG: Fill your tank completely, reset your trip odometer, drive normally until you need to refuel, fill up again and note the gallons, then divide miles driven by gallons used. Highway driving typically gets better MPG than city driving, so calculate both separately if you can."
    },
    {
      question: "Should I enter one-way or round-trip distance?",
      answer: "Enter the total distance you'll be traveling. If you're planning a round trip, add the distance both ways. For example, a trip to a destination 100 miles away and back would be 200 miles total. Don't forget to account for any detours, scenic routes, or stops along the way that add mileage."
    },
    {
      question: "How can I improve my fuel economy and reduce costs?",
      answer: "You can improve MPG by: 1) Maintaining steady speeds and using cruise control on highways, 2) Avoiding rapid acceleration and hard braking, 3) Keeping tires properly inflated, 4) Removing unnecessary weight from your vehicle, 5) Regular maintenance (oil changes, air filters), and 6) Driving at moderate speeds (55-65 mph is optimal for most vehicles). These habits can improve fuel economy by 10-25%."
    },
    {
      question: "Does this calculator include all travel costs?",
      answer: "No, this calculator only estimates direct fuel costs. For a complete trip budget, also consider: tolls, parking fees, vehicle wear and tear (roughly $0.10-0.20 per mile for maintenance/depreciation), food, lodging, and potential emergency expenses. The IRS standard mileage rate (around $0.67/mile) is a good estimate for total vehicle costs including fuel."
    }
  ];

  const relatedCalculators = [
    {
      title: "Tip Calculator",
      link: "/calculators/tip",
      description: "Calculate tips at restaurants during your trip"
    },
    {
      title: "Loan Calculator",
      link: "/calculators/loan",
      description: "Calculate payments if financing a vehicle"
    },
    {
      title: "Etsy Pricing Calculator",
      link: "/calculators/etsy-pricing",
      description: "Calculate delivery costs for your handmade business"
    }
  ];

  const calculateFuelCost = () => {
    const dist = parseFloat(distance);
    const mpg = parseFloat(fuelEconomy);
    const price = parseFloat(fuelPrice);

    if (!dist || !mpg || !price) return;

    const gallonsNeeded = dist / mpg;
    const totalCost = gallonsNeeded * price;
    const costPerMile = price / mpg;

    setResult({ totalCost, gallonsNeeded, costPerMile });

    // Track calculator usage
    trackCalculatorUsage('Fuel Cost Calculator', {
      distance: dist,
      fuel_economy_mpg: mpg,
      fuel_price: price,
      total_cost: totalCost
    });
  };

  return (
    <CalculatorLayout
      title="Fuel Cost Calculator"
      description="Calculate the fuel cost for your trip based on distance, fuel economy, and current gas prices."
    >
      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateFuelCost(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="distance" className={styles.label}>
            Distance (miles)
          </label>
          <input
            id="distance"
            type="number"
            className={styles.input}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter total distance"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fuelEconomy" className={styles.label}>
            Fuel Economy (MPG)
          </label>
          <input
            id="fuelEconomy"
            type="number"
            className={styles.input}
            value={fuelEconomy}
            onChange={(e) => setFuelEconomy(e.target.value)}
            placeholder="Miles per gallon"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fuelPrice" className={styles.label}>
            Fuel Price ($/gallon)
          </label>
          <input
            id="fuelPrice"
            type="number"
            className={styles.input}
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            placeholder="Price per gallon"
            step="0.01"
            min="0"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate Fuel Cost
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Fuel Cost</span>
            <span className={styles.resultValuePrimary}>${result.totalCost.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Gallons Needed</span>
            <span className={styles.resultValue}>{result.gallonsNeeded.toFixed(2)} gal</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cost per Mile</span>
            <span className={styles.resultValue}>${result.costPerMile.toFixed(3)}</span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This calculation is for fuel costs only. It does not include tolls, vehicle wear and tear, or other travel expenses.
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Fuel Cost Calculator"
      />

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
