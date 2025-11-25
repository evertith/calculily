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
import type { Metadata } from 'next';
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

export default function SolarPanelCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [dailyUsage, setDailyUsage] = useState<string>('');
  const [sunHours, setSunHours] = useState<string>('5.0');
  const [systemType, setSystemType] = useState<'grid-tied' | 'off-grid'>('grid-tied');
  const [systemVoltage, setSystemVoltage] = useState<string>('24');
  const [panelWattage, setPanelWattage] = useState<string>('400');
  const [autonomyDays, setAutonomyDays] = useState<string>('3');
  const [depthOfDischarge, setDepthOfDischarge] = useState<string>('50');
  const [systemEfficiency, setSystemEfficiency] = useState<string>('80');
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const usStates = [
    { name: 'Arizona', hours: 6.5 },
    { name: 'California', hours: 5.5 },
    { name: 'Florida', hours: 5.0 },
    { name: 'Texas', hours: 5.0 },
    { name: 'North Carolina', hours: 4.5 },
    { name: 'Colorado', hours: 5.5 },
    { name: 'Nevada', hours: 6.0 },
    { name: 'New Mexico', hours: 6.5 },
    { name: 'Utah', hours: 5.5 },
    { name: 'Oregon', hours: 4.0 },
    { name: 'Washington', hours: 3.5 },
    { name: 'New York', hours: 4.0 },
    { name: 'New Jersey', hours: 4.5 },
    { name: 'Georgia', hours: 5.0 },
    { name: 'Montana', hours: 4.5 },
    { name: 'Wyoming', hours: 5.5 },
    { name: 'Custom', hours: 0 }
  ];

  const faqItems = [
    {
      question: "How many solar panels do I need for my home?",
      answer: "The number of panels depends on your daily electricity usage and available sunlight. First, find your daily kWh usage from your electric bill (monthly kWh ÷ 30). Then divide by your area's peak sun hours and system efficiency (typically 75-85%). For example, a home using 30 kWh/day in an area with 5 sun hours needs approximately 7.5kW of panels (30 ÷ 5 ÷ 0.8), or about 19 standard 400W panels."
    },
    {
      question: "What are peak sun hours and how do they differ from daylight hours?",
      answer: "Peak sun hours represent the equivalent hours of full 1000W/m² sunlight per day, not just daylight hours. A location might have 12 hours of daylight but only 5 peak sun hours because the sun isn't at full intensity all day. Arizona averages 6.5 peak sun hours, while Washington averages 3.5. This significantly impacts how many panels you need."
    },
    {
      question: "What's the difference between grid-tied and off-grid solar systems?",
      answer: "Grid-tied systems connect to the utility grid - excess power goes back to the grid (net metering), and you draw from the grid when needed. They're simpler and cheaper with no batteries required. Off-grid systems are independent with battery storage for 24/7 power, requiring larger panel arrays (25-30% more) and battery banks for nighttime use. Off-grid systems are essential for remote locations but cost 2-3x more."
    },
    {
      question: "How do I size a battery bank for off-grid solar?",
      answer: "Battery capacity should provide power for your autonomy period (typically 2-4 days of cloudy weather). Calculate: (Daily Usage × Autonomy Days) ÷ (System Voltage × Depth of Discharge). For 10 kWh/day usage, 3 days autonomy, 24V system, 50% DoD: (10,000 × 3) ÷ (24 × 0.5) = 2,500 Ah. Lead-acid batteries should use 50% DoD max; lithium can safely use 80%."
    }
  ];

  const relatedCalculators = [
    {
      title: "LED Power Calculator",
      link: "/calculators/led-power",
      description: "Calculate power for LED installations"
    },
    {
      title: "Battery Runtime Calculator",
      link: "/calculators/battery-runtime",
      description: "Calculate battery backup times"
    },
    {
      title: "Amp Draw Calculator",
      link: "/calculators/amp-draw",
      description: "Calculate electrical load"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Estimate solar panel requirements based on your energy needs:",
      steps: [
        "Enter your average daily or monthly electricity usage in kWh (check your utility bill).",
        "Input your location's average peak sun hours per day (typically 4-6 hours in most of the US).",
        "Enter the wattage of the solar panels you're considering.",
        "Click 'Calculate' to see the number of panels and total system size needed."
      ]
    },
    whyMatters: {
      description: "Solar power can significantly reduce or eliminate your electricity bills, but proper sizing is crucial. An undersized system won't meet your needs, while an oversized system wastes money on unnecessary panels. Factors like roof space, local sun hours, panel efficiency, and future energy needs all play into the calculation. This calculator helps you estimate system size before getting quotes from installers.",
      benefits: [
        "Estimate system size before getting installer quotes",
        "Understand how energy usage affects panel requirements",
        "Compare different panel wattages for your roof space",
        "Plan for future energy needs like EV charging",
        "Calculate rough payback periods based on system size"
      ]
    },
    examples: [
      {
        title: "Average Home",
        scenario: "Home using 900 kWh/month in Arizona (6 peak sun hours). Using 400W panels.",
        calculation: "30 kWh/day ÷ 6 sun hours = 5 kW system needed. 5,000W ÷ 400W = 12.5 panels",
        result: "Need approximately 13 panels (5.2 kW system) to offset usage."
      },
      {
        title: "Energy-Efficient Home",
        scenario: "Efficient home using 500 kWh/month in Oregon (4.5 peak sun hours). 370W panels.",
        calculation: "16.7 kWh/day ÷ 4.5 hours = 3.7 kW. 3,700W ÷ 370W = 10 panels",
        result: "10 panels should offset most electricity usage."
      },
      {
        title: "With EV Charging",
        scenario: "Current usage 800 kWh + EV adds 400 kWh/month. California (5.5 sun hours). 400W panels.",
        calculation: "40 kWh/day ÷ 5.5 = 7.3 kW system. 7,300W ÷ 400W = 18.25 panels",
        result: "Plan for 19-20 panels to cover home and EV charging."
      }
    ],
    commonMistakes: [
      "Using nameplate panel wattage without accounting for real-world efficiency losses (typically 15-20%).",
      "Forgetting that shading from trees or buildings dramatically reduces output.",
      "Not considering roof orientation and pitch - south-facing at optimal angle produces most.",
      "Ignoring local utility policies on net metering and system size limits.",
      "Sizing only for current needs without considering future EV or heat pump additions."
    ]
  };

  const selectLocation = (locationName: string) => {
    const location = usStates.find(s => s.name === locationName);
    if (location && location.hours > 0) {
      setSunHours(location.hours.toString());
    }
  };

  const calculateSolar = () => {
    const usage = parseFloat(dailyUsage);
    const hours = parseFloat(sunHours);
    const efficiency = parseFloat(systemEfficiency) / 100;
    const panelSize = parseFloat(panelWattage);

    const newErrors: string[] = [];

    if (!dailyUsage || usage <= 0) {
      newErrors.push("Please enter a valid daily energy usage");
    }
    if (!sunHours || hours <= 0) {
      newErrors.push("Please enter valid sun hours");
    }
    if (hours > 12) {
      newErrors.push("Peak sun hours cannot exceed 12 hours per day");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    // Solar array size calculation
    const wattsNeeded = (usage * 1000) / (hours * efficiency);
    const kilowatts = wattsNeeded / 1000;

    // Number of panels
    const numPanels = Math.ceil(wattsNeeded / panelSize);

    // Annual production
    const annualProduction = (wattsNeeded * hours * 365) / 1000;

    // Cost estimation
    const costPerWatt = systemType === 'off-grid' ? 4.0 : 2.5;
    const systemCost = Math.round(wattsNeeded * costPerWatt);

    // Off-grid specific calculations
    let batteryResults = null;
    if (systemType === 'off-grid') {
      const days = parseFloat(autonomyDays);
      const voltage = parseFloat(systemVoltage);
      const dod = parseFloat(depthOfDischarge) / 100;

      const whNeeded = usage * 1000 * days;
      const ahNeeded = whNeeded / voltage;
      const totalAh = Math.ceil(ahNeeded / dod);

      // Number of batteries (assuming 200Ah batteries for 12V, 100Ah for 24V/48V)
      const batteryCapacity = voltage === 12 ? 200 : 100;
      const numBatteries = Math.ceil(totalAh / batteryCapacity);

      batteryResults = {
        totalAh,
        numBatteries,
        batteryVoltage: voltage,
        batteryCapacity
      };
    }

    // Grid-tied benefits
    let gridTiedResults = null;
    if (systemType === 'grid-tied') {
      const avgElectricRate = 0.14; // $0.14/kWh national average
      const annualSavings = Math.round(annualProduction * avgElectricRate);
      const paybackYears = (systemCost / annualSavings).toFixed(1);

      gridTiedResults = {
        annualSavings,
        paybackYears
      };
    }

    setResult({
      wattsNeeded: Math.round(wattsNeeded),
      kilowatts: kilowatts.toFixed(2),
      numPanels,
      annualProduction: Math.round(annualProduction),
      systemCost,
      batteryResults,
      gridTiedResults
    });

    trackCalculatorUsage('Solar Panel Calculator', {
      systemType,
      kilowatts: kilowatts.toFixed(2),
      numPanels: numPanels.toString()
    });
  };

  return (
    <CalculatorLayout
      title="Solar Panel Calculator"
      description="Calculate how many solar panels you need based on your electricity usage. Estimate system size and panel count for your home solar installation."
    >
      <CalculatorSchema
        name="Solar Panel Calculator"
        description="Free solar panel calculator to estimate system size and panel count. Calculate how many solar panels you need based on energy usage and sun hours."
        url="/calculators/solar-panel"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateSolar(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="dailyUsage" className={styles.label}>
            Daily Energy Usage (kWh)
          </label>
          <input
            id="dailyUsage"
            type="number"
            className={styles.input}
            value={dailyUsage}
            onChange={(e) => setDailyUsage(e.target.value)}
            placeholder="Enter daily kWh (check your electric bill)"
            step="0.1"
            min="0"
          />
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
            Average US home: 30 kWh/day (900 kWh/month)
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>
            Location (Peak Sun Hours)
          </label>
          <select
            id="location"
            className={styles.select}
            onChange={(e) => selectLocation(e.target.value)}
            defaultValue=""
          >
            <option value="">Select your location...</option>
            {usStates.map(state => (
              <option key={state.name} value={state.name}>
                {state.name} {state.hours > 0 ? `(${state.hours} hrs)` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sunHours" className={styles.label}>
            Peak Sun Hours per Day
          </label>
          <input
            id="sunHours"
            type="number"
            className={styles.input}
            value={sunHours}
            onChange={(e) => setSunHours(e.target.value)}
            placeholder="Average peak sun hours"
            step="0.1"
            min="0"
            max="12"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>System Type</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${systemType === 'grid-tied' ? styles.buttonOptionActive : ''}`}
              onClick={() => setSystemType('grid-tied')}
            >
              Grid-Tied
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${systemType === 'off-grid' ? styles.buttonOptionActive : ''}`}
              onClick={() => setSystemType('off-grid')}
            >
              Off-Grid (with batteries)
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="panelWattage" className={styles.label}>
            Solar Panel Wattage
          </label>
          <select
            id="panelWattage"
            className={styles.select}
            value={panelWattage}
            onChange={(e) => setPanelWattage(e.target.value)}
          >
            <option value="250">250W (older panels)</option>
            <option value="300">300W (standard)</option>
            <option value="350">350W (common)</option>
            <option value="400">400W (modern)</option>
            <option value="450">450W (high efficiency)</option>
            <option value="500">500W (premium)</option>
          </select>
        </div>

        {systemType === 'off-grid' && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="systemVoltage" className={styles.label}>
                System Voltage
              </label>
              <select
                id="systemVoltage"
                className={styles.select}
                value={systemVoltage}
                onChange={(e) => setSystemVoltage(e.target.value)}
              >
                <option value="12">12V (small systems, RV)</option>
                <option value="24">24V (medium systems)</option>
                <option value="48">48V (large systems)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="autonomyDays" className={styles.label}>
                Battery Autonomy (days)
              </label>
              <input
                id="autonomyDays"
                type="number"
                className={styles.input}
                value={autonomyDays}
                onChange={(e) => setAutonomyDays(e.target.value)}
                placeholder="Days of backup power"
                step="1"
                min="1"
                max="7"
              />
              <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
                Typical: 2-4 days for cloudy weather backup
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="depthOfDischarge" className={styles.label}>
                Depth of Discharge (%)
              </label>
              <input
                id="depthOfDischarge"
                type="number"
                className={styles.input}
                value={depthOfDischarge}
                onChange={(e) => setDepthOfDischarge(e.target.value)}
                placeholder="50"
                step="5"
                min="20"
                max="80"
              />
              <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
                Lead-acid: 50%, Lithium: 80%
              </div>
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="systemEfficiency" className={styles.label}>
            System Efficiency (%)
          </label>
          <input
            id="systemEfficiency"
            type="number"
            className={styles.input}
            value={systemEfficiency}
            onChange={(e) => setSystemEfficiency(e.target.value)}
            placeholder="80"
            step="5"
            min="60"
            max="95"
          />
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
            Typical: 75-85% (accounts for inverter, wiring, temperature losses)
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Solar System
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

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Solar Array Size Needed</span>
            <span className={styles.resultValuePrimary}>{result.kilowatts} kW</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Watts</span>
            <span className={styles.resultValue}>{result.wattsNeeded.toLocaleString()} W</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Number of {panelWattage}W Panels</span>
            <span className={styles.resultValue}>{result.numPanels} panels</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Annual Energy Production</span>
            <span className={styles.resultValue}>{result.annualProduction.toLocaleString()} kWh/year</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Estimated System Cost</span>
            <span className={styles.resultValue}>${result.systemCost.toLocaleString()}</span>
          </div>

          {result.batteryResults && (
            <>
              <div style={{ borderTop: '2px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
                <h3 style={{ color: '#4a9eff', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  Battery Bank Requirements
                </h3>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Battery Capacity</span>
                <span className={styles.resultValue}>{result.batteryResults.totalAh} Ah</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Battery Configuration</span>
                <span className={styles.resultValue}>
                  {result.batteryResults.numBatteries}x {result.batteryResults.batteryCapacity}Ah @ {result.batteryResults.batteryVoltage}V
                </span>
              </div>
            </>
          )}

          {result.gridTiedResults && (
            <>
              <div style={{ borderTop: '2px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
                <h3 style={{ color: '#4a9eff', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  Financial Analysis (Grid-Tied)
                </h3>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Annual Savings</span>
                <span className={styles.resultValue}>${result.gridTiedResults.annualSavings.toLocaleString()}/year</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Payback Period</span>
                <span className={styles.resultValue}>{result.gridTiedResults.paybackYears} years</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Installation Notes:</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Roof space needed: ~{(result.numPanels * 18).toFixed(0)} sq ft ({result.numPanels} panels × ~18 sq ft each)</li>
              <li>System includes panels, inverter, mounting hardware, and wiring</li>
              <li>{systemType === 'grid-tied' ? 'Grid-tied systems may qualify for 30% federal tax credit (ITC)' : 'Off-grid systems include charge controller and battery bank'}</li>
              <li>Professional installation recommended for safety and optimal performance</li>
              <li>Permits and inspections required in most jurisdictions</li>
            </ul>
          </div>

          {systemType === 'off-grid' && (
            <div className={styles.warning}>
              <strong>Off-Grid System Warning:</strong> Off-grid solar systems require careful planning and maintenance. Consider consulting with a solar professional to ensure adequate sizing for your needs, especially for critical loads. Battery banks require proper ventilation and regular maintenance.
            </div>
          )}

          {parseFloat(result.kilowatts) > 10 && (
            <div className={styles.note}>
              <strong>Large System:</strong> This is a substantial solar installation. Most residential systems are 5-10kW. Verify your roof can support this many panels and that your electrical service can handle the system size. Commercial-grade equipment may be required.
            </div>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('electrical', 3)}
        calculatorName="Solar Panel Calculator"
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
