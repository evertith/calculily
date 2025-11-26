'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import AdUnit from '@/components/AdUnit';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

export default function ElectricalLoadCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [squareFootage, setSquareFootage] = useState<string>('');
  const [hasElectricRange, setHasElectricRange] = useState<boolean>(false);
  const [rangeWatts, setRangeWatts] = useState<string>('12000');
  const [hasElectricDryer, setHasElectricDryer] = useState<boolean>(false);
  const [dryerWatts, setDryerWatts] = useState<string>('5000');
  const [hasElectricWaterHeater, setHasElectricWaterHeater] = useState<boolean>(false);
  const [waterHeaterWatts, setWaterHeaterWatts] = useState<string>('4500');
  const [hasHeatPump, setHasHeatPump] = useState<boolean>(false);
  const [heatPumpWatts, setHeatPumpWatts] = useState<string>('5000');
  const [hasElectricHeat, setHasElectricHeat] = useState<boolean>(false);
  const [electricHeatWatts, setElectricHeatWatts] = useState<string>('10000');
  const [hasACUnit, setHasACUnit] = useState<boolean>(false);
  const [acWatts, setAcWatts] = useState<string>('3500');
  const [hasHotTub, setHasHotTub] = useState<boolean>(false);
  const [hotTubWatts, setHotTubWatts] = useState<string>('6000');
  const [hasEVCharger, setHasEVCharger] = useState<boolean>(false);
  const [evChargerWatts, setEvChargerWatts] = useState<string>('7200');
  const [hasWorkshop, setHasWorkshop] = useState<boolean>(false);
  const [workshopWatts, setWorkshopWatts] = useState<string>('3000');
  const [additionalLoad, setAdditionalLoad] = useState<string>('0');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const sqFt = parseFloat(squareFootage);
    if (isNaN(sqFt) || sqFt <= 0) {
      newErrors.push('Please enter a valid square footage');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // NEC Standard Calculation Method (Article 220)

    // General lighting load: 3 VA per sq ft
    const lightingLoad = sqFt * 3;

    // Small appliance circuits: 2 circuits @ 1500 VA each
    const smallApplianceLoad = 2 * 1500;

    // Laundry circuit: 1500 VA
    const laundryLoad = 1500;

    // Total general loads
    const generalLoads = lightingLoad + smallApplianceLoad + laundryLoad;

    // Apply NEC demand factors to general loads
    // First 3000 VA at 100%, remainder at 35%
    let demandGeneralLoad = 0;
    if (generalLoads <= 3000) {
      demandGeneralLoad = generalLoads;
    } else {
      demandGeneralLoad = 3000 + (generalLoads - 3000) * 0.35;
    }

    // Large appliance loads
    const loads: { name: string; watts: number; demand: number }[] = [];

    if (hasElectricRange) {
      const watts = parseFloat(rangeWatts) || 12000;
      // NEC Table 220.55 demand for single range
      const demandWatts = watts <= 12000 ? 8000 : 8000 + (watts - 12000) * 0.4;
      loads.push({ name: 'Electric Range', watts, demand: demandWatts });
    }

    if (hasElectricDryer) {
      const watts = parseFloat(dryerWatts) || 5000;
      // NEC 220.54: 5000 watts or nameplate, whichever is larger
      loads.push({ name: 'Electric Dryer', watts, demand: Math.max(watts, 5000) });
    }

    if (hasElectricWaterHeater) {
      const watts = parseFloat(waterHeaterWatts) || 4500;
      loads.push({ name: 'Water Heater', watts, demand: watts });
    }

    if (hasHeatPump) {
      const watts = parseFloat(heatPumpWatts) || 5000;
      loads.push({ name: 'Heat Pump', watts, demand: watts });
    }

    if (hasElectricHeat) {
      const watts = parseFloat(electricHeatWatts) || 10000;
      // Largest of heating or AC is included at 100%, omit smaller
      loads.push({ name: 'Electric Heat', watts, demand: watts });
    }

    if (hasACUnit) {
      const watts = parseFloat(acWatts) || 3500;
      loads.push({ name: 'Central A/C', watts, demand: watts });
    }

    if (hasHotTub) {
      const watts = parseFloat(hotTubWatts) || 6000;
      loads.push({ name: 'Hot Tub/Spa', watts, demand: watts });
    }

    if (hasEVCharger) {
      const watts = parseFloat(evChargerWatts) || 7200;
      loads.push({ name: 'EV Charger', watts, demand: watts });
    }

    if (hasWorkshop) {
      const watts = parseFloat(workshopWatts) || 3000;
      loads.push({ name: 'Workshop', watts, demand: watts });
    }

    const additional = parseFloat(additionalLoad) || 0;
    if (additional > 0) {
      loads.push({ name: 'Additional Loads', watts: additional, demand: additional });
    }

    // HVAC: Use larger of heating or cooling, not both
    let hvacDemand = 0;
    const heatingLoad = loads.find(l => l.name === 'Electric Heat')?.demand || 0;
    const coolingLoad = loads.find(l => l.name === 'Central A/C')?.demand || 0;
    const heatPumpLoad = loads.find(l => l.name === 'Heat Pump')?.demand || 0;

    // Largest of heating methods
    const maxHeating = Math.max(heatingLoad, heatPumpLoad);
    hvacDemand = Math.max(maxHeating, coolingLoad);

    // Calculate appliance demand (excluding redundant HVAC)
    let applianceDemand = 0;
    loads.forEach(load => {
      if (['Electric Heat', 'Central A/C', 'Heat Pump'].includes(load.name)) {
        return; // Skip HVAC, we handle it separately
      }
      applianceDemand += load.demand;
    });

    // Total demand load
    const totalDemandWatts = demandGeneralLoad + applianceDemand + hvacDemand;

    // Convert to amps at 240V (standard residential service)
    const totalAmps = totalDemandWatts / 240;

    // Recommended service size
    let recommendedService = 100;
    if (totalAmps > 150) {
      recommendedService = 200;
    } else if (totalAmps > 100) {
      recommendedService = 150;
    } else if (totalAmps > 60) {
      recommendedService = 100;
    }

    // If EV charger or electric heat, often need 200A
    if ((hasEVCharger || hasElectricHeat) && recommendedService < 200) {
      recommendedService = 200;
    }

    // Calculate utilization percentage at recommended service
    const utilization = (totalAmps / recommendedService) * 100;

    setResults({
      squareFootage: sqFt,
      lightingLoad,
      smallApplianceLoad,
      laundryLoad,
      generalLoads,
      demandGeneralLoad: demandGeneralLoad.toFixed(0),
      loads,
      applianceDemand: applianceDemand.toFixed(0),
      hvacDemand: hvacDemand.toFixed(0),
      totalDemandWatts: totalDemandWatts.toFixed(0),
      totalAmps: totalAmps.toFixed(1),
      recommendedService,
      utilization: utilization.toFixed(1)
    });

    trackCalculatorUsage('Electrical Load Calculator', {
      squareFootage: sqFt.toString(),
      totalAmps: totalAmps.toFixed(1),
      recommendedService: recommendedService.toString()
    });
  };

  const faqItems = [
    {
      question: 'What size electrical service do I need for my house?',
      answer: 'Most modern homes need 200-amp service, especially with electric heating, EV charging, or multiple large appliances. Older or smaller homes may be adequate with 100-amp service. The NEC calculation method determines minimum requirements based on square footage and appliances.'
    },
    {
      question: 'How is residential electrical load calculated?',
      answer: 'The NEC (National Electrical Code) prescribes the standard method: 3 VA per square foot for general lighting, plus specific loads for appliances. Demand factors reduce the calculated load because not everything runs simultaneously.'
    },
    {
      question: 'What is a demand factor in electrical calculations?',
      answer: 'Demand factors account for the fact that not all loads operate simultaneously at full capacity. For example, general lighting uses 100% of the first 3000 VA and 35% of the remainder. This prevents oversizing the service.'
    },
    {
      question: 'Do I need to upgrade to 200-amp service?',
      answer: 'Consider upgrading if: adding an EV charger, installing electric heat, adding a hot tub or pool, or if your 100-amp panel is nearly full. Modern all-electric homes typically require 200-amp minimum.'
    },
    {
      question: 'What loads require dedicated circuits?',
      answer: 'NEC requires dedicated circuits for: kitchen small appliances (2 circuits), laundry, bathroom receptacles, refrigerator, dishwasher, garbage disposal, microwave, electric range, dryer, water heater, HVAC equipment, and any motor over 1/8 HP.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Wire Size Calculator',
      link: '/construction/wire-size',
      description: 'Calculate proper wire gauge'
    },
    {
      title: 'Circuit Breaker Calculator',
      link: '/calculators/circuit-breaker',
      description: 'Size circuit breakers correctly'
    },
    {
      title: 'BTU Calculator',
      link: '/construction/btu',
      description: 'Calculate heating/cooling needs'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "This calculator uses the NEC (National Electrical Code) standard method to determine your home's electrical service requirements. Accurate load calculations ensure your electrical system can safely handle all connected equipment.",
      steps: [
        "Enter your home's total living square footage.",
        "Check boxes for all major electric appliances you have or plan to install.",
        "Adjust wattage values if you know your specific appliance ratings.",
        "Add any additional loads not listed (pools, workshops, etc.).",
        "Review the recommended service size and panel capacity."
      ]
    },
    whyMatters: {
      description: "Electrical service sizing affects safety, cost, and future flexibility. Undersized service causes tripped breakers, voltage drops, and fire hazards. Oversized service wastes money on installation. The NEC calculation method provides a standardized approach that meets safety codes while being economically practical.",
      benefits: [
        "Determine if your current service is adequate",
        "Plan for new appliance additions",
        "Size new construction electrical systems",
        "Understand NEC demand factor calculations",
        "Avoid costly service upgrade surprises"
      ]
    },
    examples: [
      {
        title: "Standard Home",
        scenario: "2,000 sq ft home with gas heat, electric dryer, central AC, and standard appliances.",
        calculation: "General: 6,000 + Small App: 3,000 + Laundry: 1,500 + Dryer: 5,000 + AC: 3,500",
        result: "Approximately 80 amps calculated load. 100-amp service adequate."
      },
      {
        title: "All-Electric Home",
        scenario: "2,500 sq ft home with electric heat (15kW), heat pump, electric water heater, and dryer.",
        calculation: "Higher base load + 15,000W heat + 4,500W water heater + 5,000W dryer",
        result: "Approximately 140 amps. 200-amp service required."
      },
      {
        title: "Home with EV Charger",
        scenario: "Existing 1,800 sq ft home adding a Level 2 EV charger (7.2kW).",
        calculation: "Existing 70A calculated load + 30A for EV charger",
        result: "Total ~100 amps. May need upgrade from 100A to 200A service."
      }
    ],
    commonMistakes: [
      "Adding up all nameplate ratings - demand factors account for non-simultaneous use.",
      "Forgetting about heating and cooling - these are often the largest loads.",
      "Not planning for future loads - EV chargers, hot tubs, and additions need capacity.",
      "Ignoring kitchen circuits - NEC requires two 20A small appliance circuits minimum.",
      "Confusing VA with watts - for residential, they are treated as equivalent."
    ]
  };

  return (
    <CalculatorLayout
      title="Electrical Load Calculator"
      description="Calculate your home's electrical load using the NEC standard method. Determine required service size and panel capacity."
    >
      <CalculatorSchema
        name="Electrical Load Calculator"
        description="Free electrical load calculator to determine residential service size requirements using NEC calculation methods."
        url="/construction/electrical-load"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Home Square Footage</label>
          <input
            type="number"
            className={styles.input}
            value={squareFootage}
            onChange={(e) => setSquareFootage(e.target.value)}
            placeholder="e.g., 2000"
            step="100"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            Total living area (used for general lighting calculation)
          </small>
        </div>

        <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Major Appliances</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasElectricRange}
                onChange={(e) => setHasElectricRange(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Electric Range/Oven
            </label>
            {hasElectricRange && (
              <input
                type="number"
                className={styles.input}
                value={rangeWatts}
                onChange={(e) => setRangeWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasElectricDryer}
                onChange={(e) => setHasElectricDryer(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Electric Dryer
            </label>
            {hasElectricDryer && (
              <input
                type="number"
                className={styles.input}
                value={dryerWatts}
                onChange={(e) => setDryerWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasElectricWaterHeater}
                onChange={(e) => setHasElectricWaterHeater(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Electric Water Heater
            </label>
            {hasElectricWaterHeater && (
              <input
                type="number"
                className={styles.input}
                value={waterHeaterWatts}
                onChange={(e) => setWaterHeaterWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasACUnit}
                onChange={(e) => setHasACUnit(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Central Air Conditioning
            </label>
            {hasACUnit && (
              <input
                type="number"
                className={styles.input}
                value={acWatts}
                onChange={(e) => setAcWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasHeatPump}
                onChange={(e) => setHasHeatPump(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Heat Pump
            </label>
            {hasHeatPump && (
              <input
                type="number"
                className={styles.input}
                value={heatPumpWatts}
                onChange={(e) => setHeatPumpWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasElectricHeat}
                onChange={(e) => setHasElectricHeat(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Electric Baseboard/Furnace
            </label>
            {hasElectricHeat && (
              <input
                type="number"
                className={styles.input}
                value={electricHeatWatts}
                onChange={(e) => setElectricHeatWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasHotTub}
                onChange={(e) => setHasHotTub(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Hot Tub / Spa
            </label>
            {hasHotTub && (
              <input
                type="number"
                className={styles.input}
                value={hotTubWatts}
                onChange={(e) => setHotTubWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasEVCharger}
                onChange={(e) => setHasEVCharger(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              EV Charger (Level 2)
            </label>
            {hasEVCharger && (
              <input
                type="number"
                className={styles.input}
                value={evChargerWatts}
                onChange={(e) => setEvChargerWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={hasWorkshop}
                onChange={(e) => setHasWorkshop(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Workshop / Garage
            </label>
            {hasWorkshop && (
              <input
                type="number"
                className={styles.input}
                value={workshopWatts}
                onChange={(e) => setWorkshopWatts(e.target.value)}
                placeholder="Watts"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Additional Loads (Watts)</label>
          <input
            type="number"
            className={styles.input}
            value={additionalLoad}
            onChange={(e) => setAdditionalLoad(e.target.value)}
            placeholder="e.g., 0"
            step="500"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            Pool pumps, well pumps, additional HVAC, etc.
          </small>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Electrical Load
        </button>
      </div>

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((error, index) => (
            <div key={index} className={styles.error}>
              {error}
            </div>
          ))}
        </div>
      )}

      {results && (
        <div className={styles.results}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Electrical Load Analysis</h2>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>General Loads (NEC 220.12)</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Lighting Load ({results.squareFootage} sq ft × 3 VA)</span>
            <span className={styles.resultValue}>{results.lightingLoad.toLocaleString()} VA</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Small Appliance Circuits (2 × 1500)</span>
            <span className={styles.resultValue}>{results.smallApplianceLoad.toLocaleString()} VA</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Laundry Circuit</span>
            <span className={styles.resultValue}>{results.laundryLoad.toLocaleString()} VA</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total General Loads</span>
            <span className={styles.resultValue}>{results.generalLoads.toLocaleString()} VA</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>After Demand Factor (35% over 3000)</span>
            <span className={styles.resultValue}>{parseFloat(results.demandGeneralLoad).toLocaleString()} VA</span>
          </div>

          {results.loads.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Appliance Loads</h3>
              </div>

              {results.loads.map((load: any, index: number) => (
                <div key={index} className={styles.resultItem}>
                  <span className={styles.resultLabel}>{load.name}</span>
                  <span className={styles.resultValue}>{load.demand.toLocaleString()} VA</span>
                </div>
              ))}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>HVAC Demand (larger of heat/cool)</span>
                <span className={styles.resultValue}>{parseFloat(results.hvacDemand).toLocaleString()} VA</span>
              </div>
            </>
          )}

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Service Requirements</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Demand Load</span>
            <span className={styles.resultValuePrimary}>{parseFloat(results.totalDemandWatts).toLocaleString()} VA</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Calculated Load (at 240V)</span>
            <span className={styles.resultValuePrimary}>{results.totalAmps} Amps</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Service Size</span>
            <span className={styles.resultValuePrimary}>{results.recommendedService} Amps</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Utilization at {results.recommendedService}A</span>
            <span className={styles.resultValue}>{results.utilization}%</span>
          </div>

          {parseFloat(results.utilization) > 80 && (
            <div className={styles.warning}>
              <strong>Warning:</strong> Calculated load is over 80% of recommended service. Consider the next larger service size for future expansion.
            </div>
          )}

          <div className={styles.note}>
            <strong>Note:</strong> This calculation follows NEC Article 220 standard method. Local codes may vary. Always consult a licensed electrician for service upgrades and permit requirements.
          </div>
        </div>
      )}

      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <CalculatorContent
        howToUse={contentData.howToUse}
        whyMatters={contentData.whyMatters}
        examples={contentData.examples}
        commonMistakes={contentData.commonMistakes}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />

      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
