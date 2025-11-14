'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import styles from '@/styles/Calculator.module.css';
import type { Metadata } from 'next';

export default function WireGaugeCalculator() {
  const [distance, setDistance] = useState<string>('');
  const [amperage, setAmperage] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('120');
  const [result, setResult] = useState<{
    gauge: string;
    voltageDrop: number;
  } | null>(null);

  const calculateWireGauge = () => {
    const dist = parseFloat(distance);
    const amps = parseFloat(amperage);
    const volts = parseFloat(voltage);

    if (!dist || !amps || !volts) return;

    // Circular mils calculation
    const cmils = (2 * 12.9 * dist * amps) / (volts * 0.03);

    // Wire gauge determination
    let gauge = '14 AWG';
    let actualCmils = 4110;

    if (cmils > 83690) {
      gauge = '4 AWG';
      actualCmils = 41740;
    } else if (cmils > 66360) {
      gauge = '6 AWG';
      actualCmils = 26240;
    } else if (cmils > 52620) {
      gauge = '8 AWG';
      actualCmils = 16510;
    } else if (cmils > 33100) {
      gauge = '10 AWG';
      actualCmils = 10380;
    } else if (cmils > 20820) {
      gauge = '12 AWG';
      actualCmils = 6530;
    }

    // Voltage drop calculation using actual wire gauge
    const voltageDrop = (2 * 12.9 * dist * amps) / actualCmils;

    setResult({ gauge, voltageDrop });
  };

  return (
    <CalculatorLayout
      title="Wire Gauge Calculator"
      description="Calculate the proper wire gauge for your electrical project based on distance, amperage, and voltage."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateWireGauge(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="distance" className={styles.label}>
            Distance (feet)
          </label>
          <input
            id="distance"
            type="number"
            className={styles.input}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter distance in feet"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="amperage" className={styles.label}>
            Amperage (amps)
          </label>
          <input
            id="amperage"
            type="number"
            className={styles.input}
            value={amperage}
            onChange={(e) => setAmperage(e.target.value)}
            placeholder="Enter amperage"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="voltage" className={styles.label}>
            Voltage
          </label>
          <select
            id="voltage"
            className={styles.select}
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
          >
            <option value="120">120V</option>
            <option value="240">240V</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Wire Gauge
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Wire Gauge</span>
            <span className={styles.resultValuePrimary}>{result.gauge}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Voltage Drop</span>
            <span className={styles.resultValue}>{result.voltageDrop.toFixed(2)}V</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Percentage Drop</span>
            <span className={styles.resultValue}>
              {((result.voltageDrop / parseFloat(voltage)) * 100).toFixed(2)}%
            </span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This calculator provides general guidance. Always consult local electrical codes and a licensed electrician for your specific installation.
          </div>

          {((result.voltageDrop / parseFloat(voltage)) * 100) > 3 && (
            <div className={styles.warning}>
              <strong>Warning:</strong> Voltage drop exceeds 3%, which may cause issues. Consider using a larger wire gauge.
            </div>
          )}
        </div>
      )}
    </CalculatorLayout>
  );
}
