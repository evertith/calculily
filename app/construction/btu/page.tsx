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

type CalculationType = 'cooling' | 'heating' | 'both';

export default function BTUCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [calculationType, setCalculationType] = useState<CalculationType>('cooling');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [ceilingHeight, setCeilingHeight] = useState<string>('8');
  const [climateZone, setClimateZone] = useState<string>('moderate');
  const [insulation, setInsulation] = useState<string>('average');
  const [sunExposure, setSunExposure] = useState<string>('average');
  const [numWindows, setNumWindows] = useState<string>('2');
  const [numOccupants, setNumOccupants] = useState<string>('2');
  const [numExteriorWalls, setNumExteriorWalls] = useState<string>('1');
  const [hasKitchen, setHasKitchen] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(ceilingHeight);

    if (isNaN(l) || l <= 0) newErrors.push('Please enter a valid room length');
    if (isNaN(w) || w <= 0) newErrors.push('Please enter a valid room width');
    if (isNaN(h) || h <= 0) newErrors.push('Please enter a valid ceiling height');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const sqFt = l * w;
    const cubicFt = sqFt * h;
    const windows = parseInt(numWindows) || 0;
    const occupants = parseInt(numOccupants) || 2;
    const exteriorWalls = parseInt(numExteriorWalls) || 1;

    // Base BTU calculation (20 BTU per sq ft is standard)
    let baseBTU = sqFt * 20;

    // Ceiling height adjustment (standard is 8 ft)
    const heightFactor = h / 8;
    baseBTU *= heightFactor;

    // Climate zone adjustments
    const climateFactors: Record<string, { cooling: number; heating: number }> = {
      hot: { cooling: 1.3, heating: 0.8 },
      warm: { cooling: 1.15, heating: 0.9 },
      moderate: { cooling: 1.0, heating: 1.0 },
      cool: { cooling: 0.9, heating: 1.15 },
      cold: { cooling: 0.8, heating: 1.3 }
    };
    const climateFactor = climateFactors[climateZone] || climateFactors.moderate;

    // Insulation adjustments
    const insulationFactors: Record<string, number> = {
      poor: 1.3,
      average: 1.0,
      good: 0.85,
      excellent: 0.7
    };
    const insulationFactor = insulationFactors[insulation] || 1.0;

    // Sun exposure adjustments (for cooling)
    const sunFactors: Record<string, number> = {
      shaded: 0.9,
      average: 1.0,
      sunny: 1.1
    };
    const sunFactor = sunFactors[sunExposure] || 1.0;

    // Additional heat sources
    let additionalBTU = 0;
    additionalBTU += windows * 1000; // Each window adds ~1000 BTU
    additionalBTU += (occupants - 2) * 600; // Each person above 2 adds 600 BTU
    additionalBTU += (exteriorWalls - 1) * sqFt * 2; // Additional exterior walls
    if (hasKitchen) additionalBTU += 4000; // Kitchen adds significant heat

    // Calculate cooling BTU
    const coolingBTU = Math.ceil((baseBTU * climateFactor.cooling * insulationFactor * sunFactor + additionalBTU) / 1000) * 1000;

    // Calculate heating BTU
    const heatingBTU = Math.ceil((baseBTU * climateFactor.heating * insulationFactor + additionalBTU * 0.5) / 1000) * 1000;

    // AC unit sizing (12,000 BTU = 1 ton)
    const acTons = coolingBTU / 12000;
    const acTonsRounded = Math.ceil(acTons * 2) / 2; // Round to nearest 0.5 ton

    // Furnace sizing (add 20% safety factor)
    const furnaceBTU = Math.ceil(heatingBTU * 1.2 / 5000) * 5000;

    // Window AC recommendation
    let windowACSize = '5,000 BTU';
    if (coolingBTU > 18000) windowACSize = '18,000+ BTU or Mini-Split';
    else if (coolingBTU > 14000) windowACSize = '14,000-18,000 BTU';
    else if (coolingBTU > 10000) windowACSize = '10,000-14,000 BTU';
    else if (coolingBTU > 8000) windowACSize = '8,000-10,000 BTU';
    else if (coolingBTU > 6000) windowACSize = '6,000-8,000 BTU';
    else windowACSize = '5,000-6,000 BTU';

    setResults({
      sqFt: sqFt.toFixed(0),
      cubicFt: cubicFt.toFixed(0),
      coolingBTU,
      heatingBTU,
      acTons: acTonsRounded,
      furnaceBTU,
      windowACSize,
      climateZone: climateZone.charAt(0).toUpperCase() + climateZone.slice(1),
      insulation: insulation.charAt(0).toUpperCase() + insulation.slice(1)
    });

    trackCalculatorUsage('BTU Calculator', {
      calculationType,
      sqFt: sqFt.toFixed(0),
      coolingBTU: coolingBTU.toString(),
      heatingBTU: heatingBTU.toString()
    });
  };

  const faqItems = [
    {
      question: 'How many BTU do I need per square foot?',
      answer: 'The general rule is 20 BTU per square foot for cooling. However, this varies based on ceiling height, insulation, climate zone, sun exposure, and the number of occupants. Poorly insulated spaces or rooms with lots of windows may need 25-30 BTU per square foot.'
    },
    {
      question: 'What size AC do I need for a 1,000 square foot space?',
      answer: 'For a well-insulated 1,000 sq ft space in a moderate climate, you typically need about 20,000 BTU or approximately 1.5-2 tons of cooling capacity. Add more for hot climates, poor insulation, or many windows.'
    },
    {
      question: 'What is the difference between BTU and tons for AC?',
      answer: 'BTU (British Thermal Units) measures heating/cooling capacity. One ton of cooling equals 12,000 BTU per hour. Central AC systems are typically rated in tons (1.5, 2, 2.5, etc.), while window units are rated in BTU.'
    },
    {
      question: 'Why is my AC not cooling enough even though the BTU seems right?',
      answer: 'Several factors affect real-world performance: dirty filters, inadequate insulation, air leaks around windows/doors, direct sun exposure, heat-generating appliances, or an incorrectly sized duct system. Also ensure the BTU calculation accounts for all heat sources.'
    },
    {
      question: 'Should I size my furnace to the same BTU as my AC?',
      answer: 'Not necessarily. Heating and cooling loads differ based on your climate. In cold climates, heating needs may exceed cooling needs significantly. Furnaces are typically sized with a 20% safety margin above calculated heating load.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Duct Size Calculator',
      link: '/construction/duct-size',
      description: 'Calculate HVAC duct dimensions'
    },
    {
      title: 'Insulation Calculator',
      link: '/calculators/insulation',
      description: 'Calculate insulation requirements'
    },
    {
      title: 'Electrical Load Calculator',
      link: '/construction/electrical-load',
      description: 'Calculate electrical service needs'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Properly sizing your HVAC system is crucial for comfort and energy efficiency. An undersized unit will run constantly and never reach the desired temperature, while an oversized unit will cycle too frequently, wasting energy and failing to dehumidify properly.",
      steps: [
        "Measure the room or space length and width in feet. For multiple rooms, calculate each separately.",
        "Enter the ceiling height (standard is 8 feet, but many homes have 9-10 foot ceilings).",
        "Select your climate zone - this significantly affects both heating and cooling needs.",
        "Rate your insulation quality - older homes typically have average to poor insulation.",
        "Add details about sun exposure, windows, occupants, and whether it includes a kitchen."
      ]
    },
    whyMatters: {
      description: "HVAC systems represent one of the largest energy expenses in a home, and proper sizing can reduce energy costs by 20-40%. An oversized AC cools quickly but shuts off before properly dehumidifying, leaving you with a cold, clammy space. An undersized unit runs constantly, increasing wear and energy bills while never achieving comfort.",
      benefits: [
        "Calculate cooling BTU for air conditioning sizing",
        "Determine heating BTU for furnace selection",
        "Get AC tonnage recommendations for central systems",
        "Find window AC unit size recommendations",
        "Account for climate, insulation, and usage factors"
      ]
    },
    examples: [
      {
        title: "Master Bedroom",
        scenario: "A 14' x 16' bedroom with 8-foot ceilings, average insulation, 2 windows, in a moderate climate.",
        calculation: "224 sq ft x 20 BTU + adjustments = ~6,000 BTU",
        result: "A 6,000-8,000 BTU window unit or 0.5 ton contribution to central AC."
      },
      {
        title: "Living Room in Hot Climate",
        scenario: "A 20' x 25' living room with high ceilings, south-facing windows, in Arizona.",
        calculation: "500 sq ft x 20 BTU x 1.3 (climate) x 1.1 (sun) + window load",
        result: "Approximately 18,000-20,000 BTU or a 1.5-2 ton system."
      },
      {
        title: "Whole House Calculation",
        scenario: "2,000 sq ft home in cold climate with average insulation.",
        calculation: "Cooling: 2,000 x 20 BTU = 40,000 BTU base. Heating: significantly higher.",
        result: "3-3.5 ton AC, 80,000-100,000 BTU furnace."
      }
    ],
    commonMistakes: [
      "Using square footage alone - ceiling height, windows, and insulation significantly affect BTU needs.",
      "Ignoring climate zone - a Florida home needs different sizing than one in Minnesota.",
      "Oversizing the system - bigger is not better for HVAC; it causes short cycling and humidity issues.",
      "Forgetting heat sources - kitchens, electronics, and extra occupants add significant heat load.",
      "Not accounting for ductwork - even a properly sized unit performs poorly with inadequate ducts."
    ]
  };

  return (
    <CalculatorLayout
      title="BTU Calculator"
      description="Calculate heating and cooling BTU requirements for your space. Get AC tonnage and furnace sizing recommendations."
    >
      <CalculatorSchema
        name="BTU Calculator"
        description="Free BTU calculator for HVAC sizing. Calculate heating and cooling requirements based on room size, climate, and insulation."
        url="/construction/btu"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Calculate For</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${calculationType === 'cooling' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('cooling')}
            >
              Cooling (AC)
            </button>
            <button
              className={`${styles.buttonOption} ${calculationType === 'heating' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('heating')}
            >
              Heating
            </button>
            <button
              className={`${styles.buttonOption} ${calculationType === 'both' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('both')}
            >
              Both
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Length (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="e.g., 20"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Width (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="e.g., 15"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ceiling Height (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={ceilingHeight}
              onChange={(e) => setCeilingHeight(e.target.value)}
              placeholder="e.g., 8"
              step="0.5"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Climate Zone</label>
          <select
            className={styles.select}
            value={climateZone}
            onChange={(e) => setClimateZone(e.target.value)}
          >
            <option value="hot">Hot (Arizona, Florida, Texas)</option>
            <option value="warm">Warm (Southern California, Georgia)</option>
            <option value="moderate">Moderate (Mid-Atlantic, Pacific NW)</option>
            <option value="cool">Cool (Northern states)</option>
            <option value="cold">Cold (Minnesota, Maine, Montana)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Insulation Quality</label>
          <select
            className={styles.select}
            value={insulation}
            onChange={(e) => setInsulation(e.target.value)}
          >
            <option value="poor">Poor (older home, minimal insulation)</option>
            <option value="average">Average (standard construction)</option>
            <option value="good">Good (newer construction, upgraded)</option>
            <option value="excellent">Excellent (high-efficiency, well-sealed)</option>
          </select>
        </div>

        {(calculationType === 'cooling' || calculationType === 'both') && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Sun Exposure</label>
            <select
              className={styles.select}
              value={sunExposure}
              onChange={(e) => setSunExposure(e.target.value)}
            >
              <option value="shaded">Heavily Shaded</option>
              <option value="average">Average</option>
              <option value="sunny">Sunny (south/west facing)</option>
            </select>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Windows</label>
            <input
              type="number"
              className={styles.input}
              value={numWindows}
              onChange={(e) => setNumWindows(e.target.value)}
              placeholder="e.g., 2"
              min="0"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Occupants</label>
            <input
              type="number"
              className={styles.input}
              value={numOccupants}
              onChange={(e) => setNumOccupants(e.target.value)}
              placeholder="e.g., 2"
              min="1"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Exterior Walls</label>
            <select
              className={styles.select}
              value={numExteriorWalls}
              onChange={(e) => setNumExteriorWalls(e.target.value)}
            >
              <option value="1">1 wall</option>
              <option value="2">2 walls</option>
              <option value="3">3 walls</option>
              <option value="4">4 walls</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={hasKitchen}
              onChange={(e) => setHasKitchen(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Room includes kitchen or significant heat-generating appliances
          </label>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate BTU
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>BTU Requirements</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Room Size</span>
            <span className={styles.resultValue}>{results.sqFt} sq ft ({results.cubicFt} cubic ft)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Climate Zone</span>
            <span className={styles.resultValue}>{results.climateZone}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Insulation</span>
            <span className={styles.resultValue}>{results.insulation}</span>
          </div>

          {(calculationType === 'cooling' || calculationType === 'both') && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#4a9eff', marginBottom: '1rem', fontSize: '1.1rem' }}>Cooling Requirements</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Cooling Capacity Needed</span>
                <span className={styles.resultValuePrimary}>{results.coolingBTU.toLocaleString()} BTU</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Central AC Size</span>
                <span className={styles.resultValue}>{results.acTons} tons</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Window AC Size</span>
                <span className={styles.resultValue}>{results.windowACSize}</span>
              </div>
            </>
          )}

          {(calculationType === 'heating' || calculationType === 'both') && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#ff9f4a', marginBottom: '1rem', fontSize: '1.1rem' }}>Heating Requirements</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Heating Capacity Needed</span>
                <span className={styles.resultValuePrimary}>{results.heatingBTU.toLocaleString()} BTU</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Recommended Furnace</span>
                <span className={styles.resultValue}>{results.furnaceBTU.toLocaleString()} BTU</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Important:</strong> This is an estimate for planning purposes. Professional HVAC contractors perform Manual J calculations that account for additional factors like duct losses, building orientation, and local weather data. Always consult a professional for final system sizing.
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
