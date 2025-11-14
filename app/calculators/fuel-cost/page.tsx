'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
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

  const calculateFuelCost = () => {
    const dist = parseFloat(distance);
    const mpg = parseFloat(fuelEconomy);
    const price = parseFloat(fuelPrice);

    if (!dist || !mpg || !price) return;

    const gallonsNeeded = dist / mpg;
    const totalCost = gallonsNeeded * price;
    const costPerMile = price / mpg;

    setResult({ totalCost, gallonsNeeded, costPerMile });
  };

  return (
    <CalculatorLayout
      title="Fuel Cost Calculator"
      description="Calculate the fuel cost for your trip based on distance, fuel economy, and current gas prices."
    >
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
    </CalculatorLayout>
  );
}
