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

export default function GasMileageCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [calculationType, setCalculationType] = useState<'simple' | 'refill'>('simple');
  const [milesDriven, setMilesDriven] = useState<string>('');
  const [gallonsUsed, setGallonsUsed] = useState<string>('');
  const [currentOdometer, setCurrentOdometer] = useState<string>('');
  const [lastOdometer, setLastOdometer] = useState<string>('');
  const [gallonsAdded, setGallonsAdded] = useState<string>('');
  const [pricePerGallon, setPricePerGallon] = useState<string>('');
  const [result, setResult] = useState<{
    mpg: number;
    costPerMile: number;
    tripCost: number;
  } | null>(null);

  const faqItems = [
    {
      question: "How do I accurately calculate my MPG?",
      answer: "For the most accurate MPG calculation, fill your tank completely until the pump clicks off. Reset your trip odometer to zero. Drive normally until you need to refuel (ideally when tank is 1/4 full or less). Fill up again to the click-off point and note the gallons added. Divide the trip odometer reading by gallons to get your MPG. This 'tank-to-tank' method is more accurate than relying on the fuel gauge."
    },
    {
      question: "Why is my actual MPG lower than the EPA rating?",
      answer: "Your real-world MPG can be 10-30% lower than EPA estimates due to several factors: aggressive driving (rapid acceleration and braking), excessive idling, cold weather operation, carrying heavy loads, improper tire pressure, poor vehicle maintenance, and short trips where the engine doesn't fully warm up. City driving typically gets significantly lower MPG than highway driving."
    },
    {
      question: "How can I improve my gas mileage?",
      answer: "To improve MPG: 1) Maintain steady speeds using cruise control on highways, 2) Avoid rapid acceleration and hard braking, 3) Keep tires inflated to recommended pressure, 4) Remove unnecessary weight from your vehicle, 5) Get regular oil changes and replace air filters, 6) Drive at moderate speeds (55-65 mph is optimal for most vehicles), 7) Avoid excessive idling, and 8) Plan routes to minimize stops and turns. These habits can improve fuel economy by 10-25%."
    },
    {
      question: "Should I track MPG separately for city vs highway driving?",
      answer: "Yes, tracking city and highway MPG separately provides valuable insights. Highway driving typically yields 20-40% better fuel economy than city driving because there's less acceleration/deceleration and the engine operates at optimal efficiency. If your driving is mixed, you can calculate an overall average, but separate tracking helps you understand your vehicle's performance in different conditions and plan trips more accurately."
    }
  ];

  const relatedCalculators = [
    {
      title: "Fuel Cost Calculator",
      link: "/calculators/fuel-cost",
      description: "Calculate fuel costs for any trip"
    },
    {
      title: "Car Depreciation Calculator",
      link: "/calculators/car-depreciation",
      description: "Track your car's value over time"
    },
    {
      title: "Car Payment Calculator",
      link: "/calculators/car-payment",
      description: "Calculate monthly auto loan payments"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Track your actual fuel efficiency by recording fill-ups. Here's how to calculate your real-world MPG:",
      steps: [
        "Fill your tank completely and note your odometer reading (or reset your trip odometer).",
        "Drive normally until you need to refuel.",
        "Fill up again and record the gallons pumped and new odometer reading.",
        "Enter the miles driven and gallons used into the calculator.",
        "Click 'Calculate' to see your actual miles per gallon."
      ]
    },
    whyMatters: {
      description: "Your vehicle's actual fuel economy often differs significantly from EPA ratings. Real-world MPG depends on your driving style, terrain, weather, tire pressure, and vehicle condition. Tracking your gas mileage helps you spot problems early - a sudden drop in MPG often indicates maintenance issues like dirty air filters, underinflated tires, or engine problems. Regular tracking also helps you understand how your driving habits affect fuel costs.",
      benefits: [
        "Monitor vehicle health - sudden MPG drops indicate potential problems",
        "Understand how driving habits affect fuel economy",
        "Verify if vehicle modifications actually improve efficiency",
        "Track seasonal variations in fuel economy",
        "Make informed decisions about vehicle maintenance"
      ]
    },
    examples: [
      {
        title: "Weekly Commute",
        scenario: "You drove 280 miles this week and filled up with 9.5 gallons.",
        calculation: "280 miles ÷ 9.5 gallons",
        result: "29.5 MPG - pretty good for mixed driving!"
      },
      {
        title: "Road Trip Check",
        scenario: "Highway trip: 450 miles on 12.8 gallons in your sedan rated for 35 MPG highway.",
        calculation: "450 ÷ 12.8 = 35.2 MPG",
        result: "You're right at the EPA rating - your car is running efficiently."
      },
      {
        title: "Detecting a Problem",
        scenario: "Usually get 26 MPG but this tank calculated to only 21 MPG (195 miles on 9.3 gallons).",
        calculation: "195 ÷ 9.3 = 21 MPG (19% below normal)",
        result: "Check tire pressure, air filter, or driving conditions - something's affecting efficiency."
      }
    ],
    commonMistakes: [
      "Not filling the tank completely - partial fills give inaccurate MPG calculations.",
      "Using one tank's data as gospel - average several fill-ups for accurate baseline MPG.",
      "Comparing city driving MPG to highway ratings - they're very different scenarios.",
      "Forgetting that MPG varies seasonally - winter fuel, cold engines, and snow tires reduce efficiency.",
      "Not resetting the trip odometer at fill-up - guessing at miles driven leads to inaccurate results."
    ]
  };

  const calculateMPG = () => {
    if (calculationType === 'simple') {
      const miles = parseFloat(milesDriven);
      const gallons = parseFloat(gallonsUsed);
      const price = parseFloat(pricePerGallon) || 0;

      if (!miles || !gallons || miles <= 0 || gallons <= 0) return;

      const mpg = miles / gallons;
      const costPerMile = price > 0 ? price / mpg : 0;
      const tripCost = price > 0 ? gallons * price : 0;

      setResult({ mpg, costPerMile, tripCost });

      trackCalculatorUsage('Gas Mileage Calculator', {
        calculationType,
        mpg: mpg.toFixed(2),
        miles: miles.toString()
      });
    } else {
      const current = parseFloat(currentOdometer);
      const last = parseFloat(lastOdometer);
      const gallons = parseFloat(gallonsAdded);
      const price = parseFloat(pricePerGallon) || 0;

      if (!current || !last || !gallons || current <= last || gallons <= 0) return;

      const miles = current - last;
      const mpg = miles / gallons;
      const costPerMile = price > 0 ? price / mpg : 0;
      const tripCost = price > 0 ? gallons * price : 0;

      setResult({ mpg, costPerMile, tripCost });

      trackCalculatorUsage('Gas Mileage Calculator', {
        calculationType,
        mpg: mpg.toFixed(2),
        miles: miles.toString()
      });
    }
  };

  return (
    <CalculatorLayout
      title="Gas Mileage Calculator"
      description="Calculate your vehicle's actual MPG by tracking fill-ups. Enter miles driven and gallons used to monitor your real-world fuel efficiency."
    >
      <CalculatorSchema
        name="Gas Mileage Calculator"
        description="Free MPG calculator to track your vehicle's actual fuel efficiency. Enter miles driven and gallons used to calculate real-world gas mileage."
        url="/calculators/gas-mileage"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.buttonOption} ${calculationType === 'simple' ? styles.buttonOptionActive : ''}`}
          onClick={() => setCalculationType('simple')}
        >
          Simple MPG
        </button>
        <button
          type="button"
          className={`${styles.buttonOption} ${calculationType === 'refill' ? styles.buttonOptionActive : ''}`}
          onClick={() => setCalculationType('refill')}
        >
          Tank Refill
        </button>
      </div>

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateMPG(); }}>
        {calculationType === 'simple' ? (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="milesDriven" className={styles.label}>
                Miles Driven
              </label>
              <input
                id="milesDriven"
                type="number"
                className={styles.input}
                value={milesDriven}
                onChange={(e) => setMilesDriven(e.target.value)}
                placeholder="Enter miles driven"
                step="0.1"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gallonsUsed" className={styles.label}>
                Gallons Used
              </label>
              <input
                id="gallonsUsed"
                type="number"
                className={styles.input}
                value={gallonsUsed}
                onChange={(e) => setGallonsUsed(e.target.value)}
                placeholder="Enter gallons used"
                step="0.01"
                min="0"
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="currentOdometer" className={styles.label}>
                Current Odometer Reading
              </label>
              <input
                id="currentOdometer"
                type="number"
                className={styles.input}
                value={currentOdometer}
                onChange={(e) => setCurrentOdometer(e.target.value)}
                placeholder="Enter current odometer"
                step="0.1"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastOdometer" className={styles.label}>
                Last Odometer Reading
              </label>
              <input
                id="lastOdometer"
                type="number"
                className={styles.input}
                value={lastOdometer}
                onChange={(e) => setLastOdometer(e.target.value)}
                placeholder="Enter last odometer"
                step="0.1"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gallonsAdded" className={styles.label}>
                Gallons Added at Refill
              </label>
              <input
                id="gallonsAdded"
                type="number"
                className={styles.input}
                value={gallonsAdded}
                onChange={(e) => setGallonsAdded(e.target.value)}
                placeholder="Enter gallons added"
                step="0.01"
                min="0"
              />
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="pricePerGallon" className={styles.label}>
            Price per Gallon (optional)
          </label>
          <input
            id="pricePerGallon"
            type="number"
            className={styles.input}
            value={pricePerGallon}
            onChange={(e) => setPricePerGallon(e.target.value)}
            placeholder="Enter price per gallon"
            step="0.01"
            min="0"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate MPG
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Fuel Economy (MPG)</span>
            <span className={styles.resultValuePrimary}>{result.mpg.toFixed(2)} MPG</span>
          </div>
          {result.costPerMile > 0 && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Cost per Mile</span>
                <span className={styles.resultValue}>${result.costPerMile.toFixed(3)}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Trip Fuel Cost</span>
                <span className={styles.resultValue}>${result.tripCost.toFixed(2)}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Tip:</strong> Track your MPG over multiple fill-ups to get a more accurate average.
            Highway driving typically yields 20-40% better fuel economy than city driving.
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('automotive', 3)}
        calculatorName="Gas Mileage Calculator"
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
