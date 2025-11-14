'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import styles from '@/styles/Calculator.module.css';

export default function LEDPowerCalculator() {
  const [numLEDs, setNumLEDs] = useState<string>('');
  const [wattsPerLED, setWattsPerLED] = useState<string>('0.3');
  const [usageFactor, setUsageFactor] = useState<number>(80);
  const [voltage, setVoltage] = useState<string>('5');
  const [result, setResult] = useState<{
    totalWatts: number;
    amps: number;
    recommendedPowerSupply: number;
  } | null>(null);

  const calculateLEDPower = () => {
    const leds = parseFloat(numLEDs);
    const watts = parseFloat(wattsPerLED);
    const volts = parseFloat(voltage);

    if (!leds || !watts || !volts) return;

    const totalWatts = leds * watts * (usageFactor / 100);
    const amps = totalWatts / volts;
    const recommendedPowerSupply = Math.ceil(totalWatts * 1.2);

    setResult({ totalWatts, amps, recommendedPowerSupply });
  };

  return (
    <CalculatorLayout
      title="LED Power Calculator"
      description="Calculate power requirements for LED strips and pixels, including recommended power supply sizing."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateLEDPower(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="numLEDs" className={styles.label}>
            Number of LEDs/Pixels
          </label>
          <input
            id="numLEDs"
            type="number"
            className={styles.input}
            value={numLEDs}
            onChange={(e) => setNumLEDs(e.target.value)}
            placeholder="Enter number of LEDs"
            step="1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="wattsPerLED" className={styles.label}>
            Watts per LED
          </label>
          <input
            id="wattsPerLED"
            type="number"
            className={styles.input}
            value={wattsPerLED}
            onChange={(e) => setWattsPerLED(e.target.value)}
            placeholder="Typical: 0.3W for WS2812B"
            step="0.01"
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
            <option value="5">5V</option>
            <option value="12">12V</option>
            <option value="24">24V</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="usageFactor" className={styles.label}>
            Usage Factor: {usageFactor}%
          </label>
          <input
            id="usageFactor"
            type="range"
            className={styles.input}
            value={usageFactor}
            onChange={(e) => setUsageFactor(parseInt(e.target.value))}
            min="0"
            max="100"
            step="5"
            style={{ cursor: 'pointer' }}
          />
          <small style={{ color: '#808080', fontSize: '0.85rem' }}>
            Typical usage: 80% (not all LEDs at full brightness all the time)
          </small>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Power Requirements
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Watts Required</span>
            <span className={styles.resultValuePrimary}>{result.totalWatts.toFixed(1)}W</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Amperage Draw</span>
            <span className={styles.resultValue}>{result.amps.toFixed(2)}A</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Power Supply</span>
            <span className={styles.resultValue}>{result.recommendedPowerSupply}W</span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> The recommended power supply includes 20% overhead for safety and longevity. Always use a power supply rated for at least this wattage.
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
