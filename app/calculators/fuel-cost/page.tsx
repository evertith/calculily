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
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

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
      title: "Gas Mileage Calculator",
      link: "/calculators/gas-mileage",
      description: "Track and calculate your vehicle's actual MPG"
    },
    {
      title: "Car Depreciation Calculator",
      link: "/calculators/car-depreciation",
      description: "Calculate how your car's value decreases over time"
    },
    {
      title: "Car Payment Calculator",
      link: "/calculators/car-payment",
      description: "Calculate monthly auto loan payments"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Planning a road trip or comparing commute costs? Our fuel cost calculator gives you accurate estimates for any journey:",
      steps: [
        "Enter the trip distance in miles (use Google Maps or a similar tool for accurate distances).",
        "Input your vehicle's fuel efficiency in miles per gallon (MPG). Check your owner's manual or fueleconomy.gov for your car's rating.",
        "Enter the current fuel price per gallon in your area.",
        "Click 'Calculate' to see total gallons needed and the cost for your trip."
      ]
    },
    whyMatters: {
      description: "Fuel costs add up quickly, whether you're planning a road trip vacation, evaluating a job offer with a longer commute, or deciding between driving and flying. Understanding your actual fuel costs helps you budget accurately, compare travel options, and even evaluate whether a more fuel-efficient vehicle would save you money. For regular commuters, small differences in MPG can mean hundreds of dollars saved per year.",
      benefits: [
        "Budget accurately for road trips and vacations",
        "Compare the cost of driving vs flying or taking transit",
        "Evaluate how a longer commute affects your finances",
        "Calculate the real savings of a more fuel-efficient vehicle",
        "Plan multi-leg trips with different fuel prices by region"
      ]
    },
    examples: [
      {
        title: "Weekend Road Trip",
        scenario: "Driving from Los Angeles to Las Vegas (270 miles each way) in a car that gets 28 MPG with gas at $4.50/gallon.",
        calculation: "540 miles ÷ 28 MPG = 19.3 gallons × $4.50",
        result: "Total fuel cost: $86.79 for the round trip"
      },
      {
        title: "Monthly Commute Cost",
        scenario: "A 25-mile each way commute (50 miles/day) working 22 days/month. Your car gets 32 MPG and gas is $3.80/gallon.",
        calculation: "1,100 miles/month ÷ 32 MPG = 34.4 gallons × $3.80",
        result: "Monthly commute cost: $130.63"
      },
      {
        title: "Cross-Country Trip",
        scenario: "Driving from NYC to LA (2,800 miles) in an SUV getting 22 MPG with average gas price of $3.60/gallon.",
        calculation: "2,800 miles ÷ 22 MPG = 127.3 gallons × $3.60",
        result: "One-way fuel cost: $458.18 (compare to flights!)"
      }
    ],
    commonMistakes: [
      "Using the EPA highway rating when you'll be doing mostly city driving - city MPG is often 20-30% lower.",
      "Forgetting that MPG decreases at higher speeds - driving 80 mph vs 65 mph can reduce efficiency by 15-25%.",
      "Not accounting for fuel price differences by region - prices can vary by $1 or more across states.",
      "Ignoring the return trip when budgeting for road trips - always calculate round-trip costs.",
      "Using manufacturer MPG ratings instead of real-world experience - track your actual fuel usage for accuracy."
    ]
  };

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
      description="Calculate fuel costs for any trip. Enter distance, your vehicle's MPG, and current gas prices to estimate your total fuel expenses."
    >
      <CalculatorSchema
        name="Fuel Cost Calculator"
        description="Free fuel cost calculator to estimate gas expenses for any trip. Enter distance, MPG, and fuel price to calculate total trip costs."
        url="/calculators/fuel-cost"
        faqItems={faqItems}
      />

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

      <CalculatorContent
        howToUse={contentData.howToUse}
        whyMatters={contentData.whyMatters}
        examples={contentData.examples}
        commonMistakes={contentData.commonMistakes}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
