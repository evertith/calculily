'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import styles from '@/styles/Calculator.module.css';

export default function VoltageDropCalculator() {
  const [wireGauge, setWireGauge] = useState<string>('12');
  const [distance, setDistance] = useState<string>('');
  const [amperage, setAmperage] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('120');
  const [result, setResult] = useState<{
    voltageDrop: number;
    voltageDropPercent: number;
  } | null>(null);

  // Resistance per 1000ft for each gauge (in ohms)
  const resistance: { [key: string]: number } = {
    '14': 2.525,
    '12': 1.588,
    '10': 0.999,
    '8': 0.628,
    '6': 0.395,
    '4': 0.249,
    '2': 0.156,
    '0': 0.098,
  };

  const calculateVoltageDrop = () => {
    const dist = parseFloat(distance);
    const amps = parseFloat(amperage);
    const volts = parseFloat(voltage);
    const gaugeResistance = resistance[wireGauge];

    if (!dist || !amps || !volts || !gaugeResistance) return;

    const voltageDrop = (2 * gaugeResistance * dist * amps) / 1000;
    const voltageDropPercent = (voltageDrop / volts) * 100;

    setResult({ voltageDrop, voltageDropPercent });
  };

  return (
    <CalculatorLayout
      title="Voltage Drop Calculator"
      description="Calculate voltage drop over distance for various wire gauges and determine if your wire size is appropriate."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateVoltageDrop(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="wireGauge" className={styles.label}>
            Wire Gauge
          </label>
          <select
            id="wireGauge"
            className={styles.select}
            value={wireGauge}
            onChange={(e) => setWireGauge(e.target.value)}
          >
            <option value="14">14 AWG</option>
            <option value="12">12 AWG</option>
            <option value="10">10 AWG</option>
            <option value="8">8 AWG</option>
            <option value="6">6 AWG</option>
            <option value="4">4 AWG</option>
            <option value="2">2 AWG</option>
            <option value="0">0 AWG</option>
          </select>
        </div>

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
            placeholder="One-way distance"
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
            placeholder="Current draw"
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
            <option value="12">12V</option>
            <option value="24">24V</option>
            <option value="120">120V</option>
            <option value="240">240V</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Voltage Drop
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Voltage Drop</span>
            <span className={styles.resultValuePrimary}>{result.voltageDrop.toFixed(2)}V</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Percentage Drop</span>
            <span className={styles.resultValue}>{result.voltageDropPercent.toFixed(2)}%</span>
          </div>

          {result.voltageDropPercent > 3 ? (
            <div className={styles.warning}>
              <strong>Warning:</strong> Voltage drop exceeds 3%, which is generally considered excessive.
              This can lead to dimming lights, reduced appliance performance, and overheating.
              Consider using a larger wire gauge or reducing the distance.
            </div>
          ) : (
            <div className={styles.note}>
              <strong>Good:</strong> Voltage drop is within acceptable limits (under 3%).
              This wire gauge is appropriate for your application.
            </div>
          )}
        </div>
      )}
    </CalculatorLayout>
  );
}
