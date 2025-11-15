'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import styles from '@/styles/Calculator.module.css';

export default function GasMileageCalculator() {
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
      description: "Calculate total fuel cost for a trip"
    },
    {
      title: "Car Payment Calculator",
      link: "/calculators/car-payment",
      description: "Calculate monthly car loan payments"
    },
    {
      title: "Car Depreciation Calculator",
      link: "/calculators/car-depreciation",
      description: "Estimate vehicle value over time"
    }
  ];

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
    }
  };

  return (
    <CalculatorLayout
      title="Gas Mileage Calculator"
      description="Track your vehicle's fuel economy and calculate MPG, cost per mile, and trip fuel costs."
    >
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

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
