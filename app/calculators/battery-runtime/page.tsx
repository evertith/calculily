'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import styles from '@/styles/Calculator.module.css';
import type { Metadata } from 'next';

export default function BatteryRuntimeCalculator() {
  const [calculatorMode, setCalculatorMode] = useState<'runtime' | 'capacity'>('runtime');
  const [capacityValue, setCapacityValue] = useState<string>('');
  const [capacityUnit, setCapacityUnit] = useState<'ah' | 'mah'>('ah');
  const [batteryVoltage, setBatteryVoltage] = useState<string>('12');
  const [loadType, setLoadType] = useState<'watts' | 'amps'>('watts');
  const [loadValue, setLoadValue] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('90');
  const [desiredRuntime, setDesiredRuntime] = useState<string>('');
  const [numParallel, setNumParallel] = useState<string>('1');
  const [numSeries, setNumSeries] = useState<string>('1');
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const faqItems = [
    {
      question: "How do I calculate battery runtime?",
      answer: "Battery runtime is calculated by dividing the battery capacity (Ah) by the load current (A), then accounting for efficiency losses. The formula is: Runtime (hours) = (Capacity × Efficiency) ÷ Load Current. For example, a 100Ah battery powering a 500W load at 12V with 90% efficiency would last approximately 2.16 hours."
    },
    {
      question: "What is battery efficiency and why does it matter?",
      answer: "Battery efficiency accounts for energy losses during discharge due to internal resistance, temperature effects, and discharge rate. Most batteries operate at 85-95% efficiency. Lead-acid batteries are typically 85-90%, while lithium batteries can reach 95-98%. Higher discharge rates and extreme temperatures reduce efficiency."
    },
    {
      question: "What's the difference between Ah and mAh?",
      answer: "Ah (amp-hours) and mAh (milliamp-hours) both measure battery capacity. 1 Ah = 1000 mAh. Use Ah for larger batteries like car batteries (50-100 Ah) and mAh for smaller batteries like phone batteries (3000-5000 mAh). The calculator converts between them automatically."
    },
    {
      question: "How do series and parallel battery configurations work?",
      answer: "Batteries in series (positive to negative) add voltage while keeping capacity the same. Two 12V 100Ah batteries in series = 24V 100Ah. Batteries in parallel (positive to positive) add capacity while keeping voltage the same. Two 12V 100Ah batteries in parallel = 12V 200Ah. This is crucial for matching your system voltage and runtime needs."
    }
  ];

  const relatedCalculators = [
    {
      title: "Solar Panel Calculator",
      link: "/calculators/solar-panel",
      description: "Size solar panels and battery banks for off-grid power"
    },
    {
      title: "Amp Draw Calculator",
      link: "/calculators/amp-draw",
      description: "Calculate total power consumption of your devices"
    },
    {
      title: "Wire Gauge Calculator",
      link: "/calculators/wire-gauge",
      description: "Find proper wire size for your battery system"
    }
  ];

  const calculateRuntime = () => {
    const newErrors: string[] = [];

    if (calculatorMode === 'runtime') {
      const capacity = parseFloat(capacityValue);
      const voltage = parseFloat(batteryVoltage);
      const load = parseFloat(loadValue);
      const eff = parseFloat(efficiency) / 100;
      const parallel = parseFloat(numParallel);
      const series = parseFloat(numSeries);

      if (!capacityValue || capacity <= 0) {
        newErrors.push("Please enter a valid battery capacity");
      }
      if (!loadValue || load <= 0) {
        newErrors.push("Please enter a valid load");
      }
      if (eff <= 0 || eff > 1) {
        newErrors.push("Efficiency must be between 1-100%");
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors([]);

      // Convert capacity to Ah if needed
      const capacityAh = capacityUnit === 'mah' ? capacity / 1000 : capacity;

      // Calculate total voltage and capacity based on configuration
      const totalVoltage = voltage * series;
      const totalCapacity = capacityAh * parallel;

      // Convert load to amps
      const loadAmps = loadType === 'watts' ? load / totalVoltage : load;

      // Calculate runtime
      const runtimeHours = (totalCapacity * eff) / loadAmps;
      const runtimeMinutes = runtimeHours * 60;
      const runtimeDays = runtimeHours / 24;

      // Calculate watt-hours
      const wattHours = totalCapacity * totalVoltage;
      const usableWattHours = wattHours * eff;

      setResult({
        mode: 'runtime',
        runtimeHours: runtimeHours.toFixed(2),
        runtimeMinutes: runtimeMinutes.toFixed(0),
        runtimeDays: runtimeDays.toFixed(2),
        wattHours: wattHours.toFixed(0),
        usableWattHours: usableWattHours.toFixed(0),
        loadAmps: loadAmps.toFixed(2),
        totalVoltage: totalVoltage.toFixed(1),
        totalCapacity: totalCapacity.toFixed(1)
      });
    } else {
      // Calculate capacity needed
      const runtime = parseFloat(desiredRuntime);
      const voltage = parseFloat(batteryVoltage);
      const load = parseFloat(loadValue);
      const eff = parseFloat(efficiency) / 100;
      const series = parseFloat(numSeries);

      if (!desiredRuntime || runtime <= 0) {
        newErrors.push("Please enter a valid desired runtime");
      }
      if (!loadValue || load <= 0) {
        newErrors.push("Please enter a valid load");
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors([]);

      const totalVoltage = voltage * series;
      const loadAmps = loadType === 'watts' ? load / totalVoltage : load;
      const capacityNeeded = (runtime * loadAmps) / eff;

      setResult({
        mode: 'capacity',
        capacityNeeded: capacityNeeded.toFixed(2),
        capacityNeededMah: (capacityNeeded * 1000).toFixed(0),
        loadAmps: loadAmps.toFixed(2),
        totalVoltage: totalVoltage.toFixed(1)
      });
    }
  };

  return (
    <CalculatorLayout
      title="Battery Runtime Calculator"
      description="Calculate how long a battery will last under load, or determine what capacity you need for a desired runtime."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateRuntime(); }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Calculator Mode</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculatorMode === 'runtime' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculatorMode('runtime')}
            >
              Calculate Runtime
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculatorMode === 'capacity' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculatorMode('capacity')}
            >
              Calculate Capacity Needed
            </button>
          </div>
        </div>

        {calculatorMode === 'runtime' && (
          <div className={styles.formGroup}>
            <label htmlFor="capacity" className={styles.label}>
              Battery Capacity
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id="capacity"
                type="number"
                className={styles.input}
                value={capacityValue}
                onChange={(e) => setCapacityValue(e.target.value)}
                placeholder="Enter capacity"
                step="0.1"
                min="0"
                style={{ flex: 1 }}
              />
              <select
                className={styles.select}
                value={capacityUnit}
                onChange={(e) => setCapacityUnit(e.target.value as 'ah' | 'mah')}
                style={{ flex: '0 0 100px' }}
              >
                <option value="ah">Ah</option>
                <option value="mah">mAh</option>
              </select>
            </div>
          </div>
        )}

        {calculatorMode === 'capacity' && (
          <div className={styles.formGroup}>
            <label htmlFor="desiredRuntime" className={styles.label}>
              Desired Runtime (hours)
            </label>
            <input
              id="desiredRuntime"
              type="number"
              className={styles.input}
              value={desiredRuntime}
              onChange={(e) => setDesiredRuntime(e.target.value)}
              placeholder="Enter desired runtime in hours"
              step="0.1"
              min="0"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="batteryVoltage" className={styles.label}>
            Battery Voltage (per battery)
          </label>
          <select
            id="batteryVoltage"
            className={styles.select}
            value={batteryVoltage}
            onChange={(e) => setBatteryVoltage(e.target.value)}
          >
            <option value="1.5">1.5V (AA, AAA, C, D)</option>
            <option value="3.7">3.7V (Li-ion cell)</option>
            <option value="6">6V (Lantern battery)</option>
            <option value="12">12V (Car battery, deep cycle)</option>
            <option value="24">24V (Marine, RV)</option>
            <option value="48">48V (Solar, industrial)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Load Type</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              className={styles.select}
              value={loadType}
              onChange={(e) => setLoadType(e.target.value as 'watts' | 'amps')}
              style={{ flex: '0 0 120px' }}
            >
              <option value="watts">Watts</option>
              <option value="amps">Amps</option>
            </select>
            <input
              type="number"
              className={styles.input}
              value={loadValue}
              onChange={(e) => setLoadValue(e.target.value)}
              placeholder={`Enter load in ${loadType}`}
              step="0.1"
              min="0"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="efficiency" className={styles.label}>
            Battery Efficiency (%)
          </label>
          <input
            id="efficiency"
            type="number"
            className={styles.input}
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            placeholder="90"
            step="1"
            min="1"
            max="100"
          />
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
            Lead-acid: 85-90%, Lithium: 95-98%, NiMH: 80-85%
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Battery Configuration (Advanced)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#b0b0b0', display: 'block', marginBottom: '0.25rem' }}>
                Batteries in Parallel
              </label>
              <input
                type="number"
                className={styles.input}
                value={numParallel}
                onChange={(e) => setNumParallel(e.target.value)}
                min="1"
                step="1"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#b0b0b0', display: 'block', marginBottom: '0.25rem' }}>
                Batteries in Series
              </label>
              <input
                type="number"
                className={styles.input}
                value={numSeries}
                onChange={(e) => setNumSeries(e.target.value)}
                min="1"
                step="1"
              />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Calculate
        </button>
      </form>

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((error, index) => (
            <div key={index} className={styles.error}>
              {error}
            </div>
          ))}
        </div>
      )}

      {result && result.mode === 'runtime' && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Runtime</span>
            <span className={styles.resultValuePrimary}>{result.runtimeHours} hours</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Runtime (minutes)</span>
            <span className={styles.resultValue}>{result.runtimeMinutes} minutes</span>
          </div>
          {parseFloat(result.runtimeDays) >= 0.1 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Runtime (days)</span>
              <span className={styles.resultValue}>{result.runtimeDays} days</span>
            </div>
          )}
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Battery Capacity</span>
            <span className={styles.resultValue}>{result.totalCapacity} Ah</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>System Voltage</span>
            <span className={styles.resultValue}>{result.totalVoltage} V</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Load Current</span>
            <span className={styles.resultValue}>{result.loadAmps} A</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Watt-Hours</span>
            <span className={styles.resultValue}>{result.wattHours} Wh</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Usable Watt-Hours</span>
            <span className={styles.resultValue}>{result.usableWattHours} Wh</span>
          </div>

          <div className={styles.note}>
            <strong>Battery Life Note:</strong> Deep discharge cycles reduce battery lifespan. For lead-acid batteries, avoid discharging below 50% capacity. For lithium batteries, 80% depth of discharge is generally safe. This calculator shows total runtime to complete discharge.
          </div>

          {parseFloat(result.runtimeHours) < 1 && (
            <div className={styles.warning}>
              <strong>Short Runtime Warning:</strong> This battery will only last {result.runtimeMinutes} minutes under this load. Consider using a higher capacity battery or reducing your load.
            </div>
          )}
        </div>
      )}

      {result && result.mode === 'capacity' && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Required Capacity</span>
            <span className={styles.resultValuePrimary}>{result.capacityNeeded} Ah</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Required Capacity (mAh)</span>
            <span className={styles.resultValue}>{result.capacityNeededMah} mAh</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>System Voltage</span>
            <span className={styles.resultValue}>{result.totalVoltage} V</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Load Current</span>
            <span className={styles.resultValue}>{result.loadAmps} A</span>
          </div>

          <div className={styles.note}>
            <strong>Battery Selection:</strong> Choose a battery with at least {result.capacityNeeded} Ah capacity at {result.totalVoltage}V. Consider adding 20-30% extra capacity as a safety margin, especially for lead-acid batteries where deep discharge should be avoided.
          </div>
        </div>
      )}

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
