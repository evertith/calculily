'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import styles from '@/styles/Calculator.module.css';

export default function CarDepreciationCalculator() {
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [vehicleAge, setVehicleAge] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('New Car (Average)');
  const [currentMileage, setCurrentMileage] = useState<string>('');
  const [futureYears, setFutureYears] = useState<string>('3');
  const [result, setResult] = useState<{
    currentValue: number;
    totalDepreciation: number;
    depreciationPercent: number;
    monthlyDepreciation: number;
    futureValue: number;
    futureDepreciation: number;
    averageMilesPerYear: number;
  } | null>(null);

  const depreciationRates: { [key: string]: number[] } = {
    'New Car (Average)': [0.20, 0.15, 0.10, 0.10, 0.10],
    'Luxury Car': [0.30, 0.20, 0.15, 0.10, 0.10],
    'Truck/SUV': [0.15, 0.12, 0.10, 0.08, 0.08],
    'Economy Car': [0.25, 0.18, 0.12, 0.10, 0.10],
    'Electric Vehicle': [0.35, 0.20, 0.15, 0.12, 0.10]
  };

  const faqItems = [
    {
      question: "Why do cars depreciate so quickly?",
      answer: "Cars lose value rapidly due to several factors: 1) They become 'used' the moment you drive off the lot, losing 20-30% in year one, 2) Mechanical wear and tear from use, 3) New model releases making older models less desirable, 4) Accumulated mileage, 5) Advancing technology making older features obsolete, and 6) General market supply and demand. Unlike homes or land, cars are depreciating assets - they wear out with use and have a limited useful lifespan."
    },
    {
      question: "Which vehicles hold their value best?",
      answer: "Vehicles that hold value best include: Trucks (especially Toyota Tacoma, Ford F-150), SUVs (Toyota 4Runner, Jeep Wrangler, Subaru Outback), and certain brands known for reliability (Toyota, Honda, Subaru, Porsche). Factors that help retain value: strong brand reputation, proven reliability, lower cost of ownership, unique features or capabilities, limited production, and strong demand in the used market. Luxury cars and EVs typically depreciate fastest."
    },
    {
      question: "How does mileage affect depreciation?",
      answer: "Average annual mileage is about 12,000-15,000 miles. Higher mileage accelerates depreciation significantly. A car with 100,000 miles typically loses more value than the same car with 50,000 miles, even if the same age. High mileage indicates more wear on mechanical components, closer to expensive repairs (transmission, engine), and reduced remaining useful life. However, well-maintained high-mileage vehicles can still be reliable - condition matters as much as miles."
    },
    {
      question: "Can I reduce depreciation on my vehicle?",
      answer: "While you can't stop depreciation, you can minimize it: 1) Buy a 2-3 year old used car (let someone else take the initial hit), 2) Choose brands/models known to hold value, 3) Keep mileage reasonable (under 15k/year), 4) Maintain meticulous service records, 5) Keep the vehicle in excellent condition (no accidents, clean interior/exterior), 6) Avoid modifications, 7) Choose popular colors (white, black, silver), and 8) Keep it longer (5-10+ years) to spread depreciation over more time."
    }
  ];

  const relatedCalculators = [
    {
      title: "Car Payment Calculator",
      link: "/calculators/car-payment",
      description: "Calculate monthly car loan payments"
    },
    {
      title: "Gas Mileage Calculator",
      link: "/calculators/gas-mileage",
      description: "Track your vehicle's fuel economy"
    },
    {
      title: "Fuel Cost Calculator",
      link: "/calculators/fuel-cost",
      description: "Calculate trip fuel costs"
    }
  ];

  const calculateCurrentValue = (price: number, years: number, type: string): number => {
    const rates = depreciationRates[type];
    let value = price;

    // Apply depreciation rates for first 5 years
    for (let year = 0; year < Math.min(years, rates.length); year++) {
      value -= value * rates[year];
    }

    // After 5 years, use constant 6% per year
    if (years > rates.length) {
      const remainingYears = years - rates.length;
      const annualRate = 0.06;
      value = value * Math.pow(1 - annualRate, remainingYears);
    }

    return value;
  };

  const calculateFutureValue = (currentValue: number, yearsInFuture: number): number => {
    // Use conservative 6% annual depreciation for future estimates
    return currentValue * Math.pow(1 - 0.06, yearsInFuture);
  };

  const calculateDepreciation = () => {
    const price = parseFloat(purchasePrice);
    const age = parseFloat(vehicleAge);
    const mileage = parseFloat(currentMileage) || 0;
    const future = parseFloat(futureYears);

    if (!price || age < 0 || price <= 0) return;

    const currentValue = calculateCurrentValue(price, age, vehicleType);
    const totalDepreciation = price - currentValue;
    const depreciationPercent = (totalDepreciation / price) * 100;
    const monthlyDepreciation = age > 0 ? totalDepreciation / (age * 12) : 0;
    const futureValue = future > 0 ? calculateFutureValue(currentValue, future) : currentValue;
    const futureDepreciation = price - futureValue;
    const averageMilesPerYear = age > 0 ? mileage / age : 0;

    setResult({
      currentValue,
      totalDepreciation,
      depreciationPercent,
      monthlyDepreciation,
      futureValue,
      futureDepreciation,
      averageMilesPerYear
    });
  };

  return (
    <CalculatorLayout
      title="Car Depreciation Calculator"
      description="Calculate vehicle depreciation and estimated current or future value based on age, type, and mileage."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateDepreciation(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="purchasePrice" className={styles.label}>
            Purchase Price ($)
          </label>
          <input
            id="purchasePrice"
            type="number"
            className={styles.input}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="Enter original purchase price"
            step="100"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="vehicleAge" className={styles.label}>
            Vehicle Age (years)
          </label>
          <input
            id="vehicleAge"
            type="number"
            className={styles.input}
            value={vehicleAge}
            onChange={(e) => setVehicleAge(e.target.value)}
            placeholder="Enter vehicle age"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="vehicleType" className={styles.label}>
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            className={styles.select}
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="New Car (Average)">New Car (Average)</option>
            <option value="Luxury Car">Luxury Car</option>
            <option value="Truck/SUV">Truck/SUV</option>
            <option value="Economy Car">Economy Car</option>
            <option value="Electric Vehicle">Electric Vehicle</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="currentMileage" className={styles.label}>
            Current Mileage (optional)
          </label>
          <input
            id="currentMileage"
            type="number"
            className={styles.input}
            value={currentMileage}
            onChange={(e) => setCurrentMileage(e.target.value)}
            placeholder="Enter current mileage"
            step="100"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="futureYears" className={styles.label}>
            Future Value Estimate (years from now)
          </label>
          <input
            id="futureYears"
            type="number"
            className={styles.input}
            value={futureYears}
            onChange={(e) => setFutureYears(e.target.value)}
            placeholder="Years in the future"
            step="1"
            min="0"
            max="20"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate Depreciation
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Current Estimated Value</span>
            <span className={styles.resultValuePrimary}>${result.currentValue.toFixed(2)}</span>
          </div>

          <div style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e0e0e0' }}>Depreciation Analysis</h3>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Original Purchase Price</span>
              <span className={styles.resultValue}>${parseFloat(purchasePrice).toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Depreciation</span>
              <span className={styles.resultValue}>-${result.totalDepreciation.toFixed(2)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Depreciation Percentage</span>
              <span className={styles.resultValue}>{result.depreciationPercent.toFixed(1)}%</span>
            </div>
            {parseFloat(vehicleAge) > 0 && (
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Monthly Depreciation Cost</span>
                <span className={styles.resultValue}>${result.monthlyDepreciation.toFixed(2)}/month</span>
              </div>
            )}
          </div>

          {parseFloat(futureYears) > 0 && (
            <div style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e0e0e0' }}>Future Value Estimate</h3>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>
                  Estimated Value in {futureYears} Year{parseFloat(futureYears) !== 1 ? 's' : ''}
                </span>
                <span className={styles.resultValue}>${result.futureValue.toFixed(2)}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Depreciation from Purchase</span>
                <span className={styles.resultValue}>-${result.futureDepreciation.toFixed(2)}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Additional Depreciation</span>
                <span className={styles.resultValue}>
                  -${(result.futureDepreciation - result.totalDepreciation).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {parseFloat(currentMileage) > 0 && result.averageMilesPerYear > 0 && (
            <div style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e0e0e0' }}>Mileage Analysis</h3>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Current Mileage</span>
                <span className={styles.resultValue}>{parseFloat(currentMileage).toLocaleString()} miles</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Average Miles per Year</span>
                <span className={styles.resultValue}>{result.averageMilesPerYear.toFixed(0).toLocaleString()} miles/year</span>
              </div>
            </div>
          )}

          <div className={styles.note}>
            <strong>Note:</strong> This calculation uses typical depreciation rates for {vehicleType.toLowerCase()}s.
            Actual depreciation varies based on condition, mileage, market demand, maintenance history, and regional factors.
            {result.averageMilesPerYear > 15000 && (
              <> Your higher-than-average annual mileage ({result.averageMilesPerYear.toFixed(0)} miles/year) may result in faster depreciation than estimated.</>
            )}
          </div>

          {depreciationRates[vehicleType] && (
            <div style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#e0e0e0' }}>Typical Depreciation Rates for {vehicleType}</h3>
              <div style={{ fontSize: '0.9rem', color: '#b0b0b0', lineHeight: '1.6' }}>
                <div>Year 1: {(depreciationRates[vehicleType][0] * 100).toFixed(0)}% loss</div>
                <div>Year 2: {(depreciationRates[vehicleType][1] * 100).toFixed(0)}% loss</div>
                <div>Year 3: {(depreciationRates[vehicleType][2] * 100).toFixed(0)}% loss</div>
                <div>Year 4: {(depreciationRates[vehicleType][3] * 100).toFixed(0)}% loss</div>
                <div>Year 5: {(depreciationRates[vehicleType][4] * 100).toFixed(0)}% loss</div>
                <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>Years 6+: ~6% annual loss</div>
              </div>
            </div>
          )}
        </div>
      )}

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
