'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import styles from '@/styles/Calculator.module.css';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(18);
  const [customTip, setCustomTip] = useState<string>('');
  const [numPeople, setNumPeople] = useState<string>('1');
  const [result, setResult] = useState<{
    tipAmount: number;
    totalAmount: number;
    perPerson: number;
  } | null>(null);

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const people = parseInt(numPeople);
    const tip = customTip ? parseFloat(customTip) : tipPercentage;

    if (!bill || !people || !tip) return;

    const tipAmount = bill * (tip / 100);
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / people;

    setResult({ tipAmount, totalAmount, perPerson });
  };

  const handleTipButtonClick = (percentage: number) => {
    setTipPercentage(percentage);
    setCustomTip('');
  };

  return (
    <CalculatorLayout
      title="Tip Calculator"
      description="Calculate tips and split bills easily with your dining companions."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateTip(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="billAmount" className={styles.label}>
            Bill Amount ($)
          </label>
          <input
            id="billAmount"
            type="number"
            className={styles.input}
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="Enter bill amount"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tip Percentage</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${!customTip && tipPercentage === 15 ? styles.buttonOptionActive : ''}`}
              onClick={() => handleTipButtonClick(15)}
            >
              15%
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${!customTip && tipPercentage === 18 ? styles.buttonOptionActive : ''}`}
              onClick={() => handleTipButtonClick(18)}
            >
              18%
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${!customTip && tipPercentage === 20 ? styles.buttonOptionActive : ''}`}
              onClick={() => handleTipButtonClick(20)}
            >
              20%
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="customTip" className={styles.label}>
            Custom Tip (%)
          </label>
          <input
            id="customTip"
            type="number"
            className={styles.input}
            value={customTip}
            onChange={(e) => setCustomTip(e.target.value)}
            placeholder="Enter custom percentage"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="numPeople" className={styles.label}>
            Number of People
          </label>
          <input
            id="numPeople"
            type="number"
            className={styles.input}
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            placeholder="Number of people"
            step="1"
            min="1"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate Tip
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tip Amount</span>
            <span className={styles.resultValue}>${result.tipAmount.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total with Tip</span>
            <span className={styles.resultValuePrimary}>${result.totalAmount.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Amount per Person</span>
            <span className={styles.resultValue}>${result.perPerson.toFixed(2)}</span>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
