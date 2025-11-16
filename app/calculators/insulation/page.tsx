'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import styles from '@/styles/Calculator.module.css';

const recommendedRValues = {
  'Zone 1 (Hot)': { attic: 30, walls: 13, floor: 13 },
  'Zone 2 (Warm)': { attic: 30, walls: 13, floor: 13 },
  'Zone 3 (Mixed)': { attic: 38, walls: 20, floor: 25 },
  'Zone 4 (Mixed)': { attic: 49, walls: 20, floor: 25 },
  'Zone 5 (Cold)': { attic: 49, walls: 20, floor: 30 },
  'Zone 6 (Cold)': { attic: 49, walls: 21, floor: 30 },
  'Zone 7 (Very Cold)': { attic: 49, walls: 21, floor: 30 }
};

const insulationTypes = {
  'Fiberglass Batts': { rValuePerInch: 3.2, costPerSqFt: 0.50 },
  'Blown Fiberglass': { rValuePerInch: 2.5, costPerSqFt: 0.40 },
  'Blown Cellulose': { rValuePerInch: 3.6, costPerSqFt: 0.60 },
  'Spray Foam (Open)': { rValuePerInch: 3.7, costPerSqFt: 1.20 },
  'Spray Foam (Closed)': { rValuePerInch: 6.5, costPerSqFt: 2.00 },
  'Rigid Foam': { rValuePerInch: 5.0, costPerSqFt: 0.75 }
};

export default function InsulationCalculator() {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [areaType, setAreaType] = useState<string>('attic');
  const [climateZone, setClimateZone] = useState<string>('Zone 4 (Mixed)');
  const [currentRValue, setCurrentRValue] = useState<string>('0');
  const [insulationType, setInsulationType] = useState<string>('Fiberglass Batts');
  const [result, setResult] = useState<{
    squareFeet: number;
    targetRValue: number;
    rValueToAdd: number;
    thicknessNeeded: number;
    estimatedCost: number;
    annualSavings: number;
    paybackYears: number;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const faqItems = [
    {
      question: "What R-value do I need for my attic?",
      answer: "The recommended R-value for attics varies by climate zone. In most of the U.S., R-38 to R-49 is recommended for attics. In colder climates (zones 6-7), R-49 or higher is ideal. In warmer climates (zones 1-2), R-30 may be sufficient. Check the DOE recommendations for your specific climate zone."
    },
    {
      question: "What is R-value?",
      answer: "R-value measures insulation's resistance to heat flow. The higher the R-value, the better the insulation. R-value depends on the type of insulation, its thickness, and density. For example, 6 inches of fiberglass batts provides approximately R-19, while 6 inches of closed-cell spray foam provides R-39."
    },
    {
      question: "Should I remove old insulation before adding new?",
      answer: "Not necessarily. If your existing insulation is dry, in good condition, and not compressed, you can add new insulation on top of it. The R-values are additive. However, if the old insulation is wet, moldy, or damaged, it should be removed first. Never place vapor barriers between layers of insulation."
    },
    {
      question: "Which insulation type is best?",
      answer: "The best insulation depends on your application. Fiberglass batts are economical for walls and accessible attics. Blown cellulose is excellent for filling irregular spaces. Spray foam provides the highest R-value per inch and acts as an air barrier, but costs more. For DIY projects, batts or blown insulation are easier to install."
    }
  ];

  const relatedCalculators = [
    {
      title: "Drywall Calculator",
      link: "/calculators/drywall",
      description: "Calculate drywall sheets and materials needed"
    },
    {
      title: "Paint Calculator",
      link: "/calculators/paint",
      description: "Calculate paint needed for your project"
    }
  ];

  const calculateInsulation = () => {
    const len = parseFloat(length);
    const wid = parseFloat(width);
    const currentR = parseFloat(currentRValue);

    const newErrors: string[] = [];

    if (!length || len <= 0) {
      newErrors.push("Please enter a valid length");
    }
    if (!width || wid <= 0) {
      newErrors.push("Please enter a valid width");
    }
    if (currentR < 0) {
      newErrors.push("Current R-value cannot be negative");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    // Calculate square feet
    const hasStuds = areaType === 'walls';
    let squareFeet = len * wid;
    if (hasStuds) {
      squareFeet *= 0.90; // Reduce by 10% for framing
    }

    // Get target R-value
    const zone = climateZone as keyof typeof recommendedRValues;
    const targetRValue = recommendedRValues[zone][areaType as keyof typeof recommendedRValues[typeof zone]];

    // Calculate thickness needed
    const rValueToAdd = Math.max(0, targetRValue - currentR);
    const insulation = insulationTypes[insulationType as keyof typeof insulationTypes];
    const thicknessNeeded = rValueToAdd / insulation.rValuePerInch;

    // Calculate cost
    const estimatedCost = squareFeet * insulation.costPerSqFt;

    // Estimate annual energy savings (simplified)
    const annualSavings = (rValueToAdd / 10) * squareFeet * 0.05;

    // Calculate payback period
    const paybackYears = annualSavings > 0 ? estimatedCost / annualSavings : 0;

    setResult({
      squareFeet,
      targetRValue,
      rValueToAdd,
      thicknessNeeded,
      estimatedCost,
      annualSavings,
      paybackYears
    });
  };

  return (
    <CalculatorLayout
      title="Insulation Calculator"
      description="Calculate insulation needed for attics, walls, and floors. Find R-value requirements and estimated energy savings."
    >
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateInsulation(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="length" className={styles.label}>
            Length (feet)
          </label>
          <input
            id="length"
            type="number"
            className={styles.input}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Enter length"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="width" className={styles.label}>
            Width (feet)
          </label>
          <input
            id="width"
            type="number"
            className={styles.input}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Enter width"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="areaType" className={styles.label}>
            Area Type
          </label>
          <select
            id="areaType"
            className={styles.select}
            value={areaType}
            onChange={(e) => setAreaType(e.target.value)}
          >
            <option value="attic">Attic</option>
            <option value="walls">Walls</option>
            <option value="floor">Floor</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="climateZone" className={styles.label}>
            Climate Zone
          </label>
          <select
            id="climateZone"
            className={styles.select}
            value={climateZone}
            onChange={(e) => setClimateZone(e.target.value)}
          >
            <option value="Zone 1 (Hot)">Zone 1 (Hot) - Southern FL, HI</option>
            <option value="Zone 2 (Warm)">Zone 2 (Warm) - Southern CA, TX, FL</option>
            <option value="Zone 3 (Mixed)">Zone 3 (Mixed) - NC, AR, AZ, NM</option>
            <option value="Zone 4 (Mixed)">Zone 4 (Mixed) - Most of US</option>
            <option value="Zone 5 (Cold)">Zone 5 (Cold) - NY, PA, IL, CO</option>
            <option value="Zone 6 (Cold)">Zone 6 (Cold) - MN, WI, MT</option>
            <option value="Zone 7 (Very Cold)">Zone 7 (Very Cold) - Northern MN, ND</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="currentRValue" className={styles.label}>
            Current R-Value (if any)
          </label>
          <input
            id="currentRValue"
            type="number"
            className={styles.input}
            value={currentRValue}
            onChange={(e) => setCurrentRValue(e.target.value)}
            placeholder="Enter current R-value"
            step="1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="insulationType" className={styles.label}>
            Insulation Type
          </label>
          <select
            id="insulationType"
            className={styles.select}
            value={insulationType}
            onChange={(e) => setInsulationType(e.target.value)}
          >
            <option value="Fiberglass Batts">Fiberglass Batts (R-3.2/inch)</option>
            <option value="Blown Fiberglass">Blown Fiberglass (R-2.5/inch)</option>
            <option value="Blown Cellulose">Blown Cellulose (R-3.6/inch)</option>
            <option value="Spray Foam (Open)">Spray Foam Open Cell (R-3.7/inch)</option>
            <option value="Spray Foam (Closed)">Spray Foam Closed Cell (R-6.5/inch)</option>
            <option value="Rigid Foam">Rigid Foam Board (R-5.0/inch)</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Insulation
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
            <span className={styles.resultLabel}>Area to Insulate</span>
            <span className={styles.resultValuePrimary}>{result.squareFeet.toFixed(0)} sq ft</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Target R-Value</span>
            <span className={styles.resultValue}>R-{result.targetRValue}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>R-Value to Add</span>
            <span className={styles.resultValue}>R-{result.rValueToAdd.toFixed(1)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Thickness Needed</span>
            <span className={styles.resultValue}>{result.thicknessNeeded.toFixed(1)} inches</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Estimated Cost</span>
            <span className={styles.resultValue}>${result.estimatedCost.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Est. Annual Savings</span>
            <span className={styles.resultValue}>${result.annualSavings.toFixed(2)}</span>
          </div>
          {result.paybackYears > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Payback Period</span>
              <span className={styles.resultValue}>{result.paybackYears.toFixed(1)} years</span>
            </div>
          )}

          <div className={styles.note}>
            <strong>Note:</strong> Costs are estimates based on average material prices. Energy savings depend on local climate, energy costs, and existing insulation condition. Professional installation will add to material costs.
          </div>

          {result.rValueToAdd === 0 && (
            <div className={styles.note}>
              <strong>Good News:</strong> Your current insulation already meets or exceeds the recommended R-value for your climate zone and area type.
            </div>
          )}
        </div>
      )}


      <ProductRecommendation
        products={getProducts('concrete', 3)}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
