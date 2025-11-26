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

export default function DuctSizeCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [cfm, setCfm] = useState('');
  const [velocity, setVelocity] = useState('700');
  const [ductType, setDuctType] = useState('round');
  const [frictionRate, setFrictionRate] = useState('0.08');
  const [result, setResult] = useState<{
    roundDiameter: number;
    rectangularOptions: { width: number; height: number }[];
    ductArea: number;
    actualVelocity: number;
    equivalentDiameter: number;
    frictionLoss: number;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const airflow = parseFloat(cfm);
    const vel = parseFloat(velocity);
    const friction = parseFloat(frictionRate);

    if (isNaN(airflow) || airflow <= 0) {
      setError('Please enter a valid CFM (airflow)');
      setResult(null);
      return;
    }
    if (isNaN(vel) || vel < 300 || vel > 2000) {
      setError('Velocity should be between 300-2000 FPM');
      setResult(null);
      return;
    }

    // Calculate required duct area: A = CFM / Velocity (in sq ft)
    const areaInSqFt = airflow / vel;
    const areaInSqIn = areaInSqFt * 144;

    // Round duct diameter: A = π × (d/2)², solve for d
    // d = 2 × √(A/π)
    const roundDiameter = 2 * Math.sqrt(areaInSqIn / Math.PI);

    // Round up to nearest standard size
    const standardSizes = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36];
    let selectedDiameter = standardSizes.find(size => size >= roundDiameter) || 36;

    // Calculate actual velocity with selected size
    const actualArea = Math.PI * Math.pow(selectedDiameter / 2, 2);
    const actualVelocity = (airflow * 144) / actualArea;

    // Rectangular duct equivalents
    // Using the equivalent diameter formula: De = 1.3 × (ab)^0.625 / (a+b)^0.25
    const rectangularOptions: { width: number; height: number }[] = [];
    const standardRectSizes = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

    for (const width of standardRectSizes) {
      for (const height of standardRectSizes) {
        if (height <= width) { // Avoid duplicates and prefer wider ducts
          const rectArea = width * height;
          if (rectArea >= areaInSqIn * 0.9 && rectArea <= areaInSqIn * 1.3) {
            // Calculate equivalent diameter for friction comparison
            const de = 1.3 * Math.pow(width * height, 0.625) / Math.pow(width + height, 0.25);
            if (Math.abs(de - selectedDiameter) < 4) {
              rectangularOptions.push({ width, height });
            }
          }
        }
      }
    }

    // Limit to 4 best options
    rectangularOptions.sort((a, b) => {
      const aAspect = a.width / a.height;
      const bAspect = b.width / b.height;
      // Prefer aspect ratios closer to 1.5 (optimal)
      return Math.abs(aAspect - 1.5) - Math.abs(bAspect - 1.5);
    });
    const bestRectOptions = rectangularOptions.slice(0, 4);

    // Friction loss calculation (simplified)
    // Using: f = 0.109 × (CFM^1.9) / (D^5.02) per 100ft
    const frictionLoss = 0.109 * Math.pow(airflow, 1.9) / Math.pow(selectedDiameter, 5.02);

    const recommendations: string[] = [];

    if (actualVelocity > 900) {
      recommendations.push('⚠ High velocity may cause noise - consider larger duct');
    } else if (actualVelocity < 500) {
      recommendations.push('⚠ Low velocity - may have settling issues');
    } else {
      recommendations.push('✓ Velocity in optimal range (500-900 FPM)');
    }

    if (ductType === 'flex' && selectedDiameter > 12) {
      recommendations.push('⚠ Flex duct over 12" has high friction - consider rigid');
    }

    if (frictionLoss > 0.1) {
      recommendations.push('⚠ High friction loss - consider upsizing duct');
    } else {
      recommendations.push('✓ Friction loss acceptable');
    }

    // Aspect ratio recommendation for rectangular
    if (bestRectOptions.length > 0) {
      const bestOption = bestRectOptions[0];
      const aspectRatio = bestOption.width / bestOption.height;
      if (aspectRatio > 4) {
        recommendations.push('⚠ Rectangular aspect ratio over 4:1 not recommended');
      }
    }

    setResult({
      roundDiameter: selectedDiameter,
      rectangularOptions: bestRectOptions,
      ductArea: areaInSqIn,
      actualVelocity,
      equivalentDiameter: selectedDiameter,
      frictionLoss,
      recommendations
    });
    setError('');
    trackCalculatorUsage('duct-size');
  };

  const faqItems = [
    {
      question: 'What velocity should I use for residential ductwork?',
      answer: 'For residential systems, main trunk ducts typically use 700-900 FPM (feet per minute), branch ducts use 600-700 FPM, and supply registers use 500-600 FPM. Higher velocities save material but increase noise and friction. Keep velocity under 900 FPM in living areas to minimize noise.'
    },
    {
      question: 'How do I calculate CFM for a room?',
      answer: 'CFM per room is calculated from the heating/cooling load, typically 1 CFM per square foot for average rooms, or more precisely: CFM = BTU/h ÷ (1.08 × ΔT). For example, a room needing 6,000 BTU/h with a 20°F temperature differential needs about 278 CFM. Use our BTU Calculator to determine room loads first.'
    },
    {
      question: 'What is the difference between round and rectangular ductwork?',
      answer: 'Round ducts are more efficient (less friction per CFM), quieter, and easier to insulate, but require more vertical space. Rectangular ducts fit in tight spaces like joist cavities and are easier to fabricate on-site. Round is preferred for efficiency; rectangular for space constraints. Flex duct combines round shape with flexibility but has higher friction.'
    },
    {
      question: 'What is equivalent diameter and why does it matter?',
      answer: 'Equivalent diameter is the round duct size that produces the same friction loss as a rectangular duct at the same airflow. A 12" × 8" rectangular duct has an equivalent diameter of about 10". This matters because round and rectangular ducts of the same cross-sectional area do NOT have the same friction - round is always more efficient.'
    },
    {
      question: 'How much CFM does a 6-inch duct carry?',
      answer: 'A 6-inch round duct at 600 FPM (typical branch velocity) carries about 118 CFM. At 700 FPM, it carries about 138 CFM. This is suitable for one or two small registers. Larger rooms typically need 8-inch or larger branch ducts.'
    }
  ];

  const relatedCalculators = [
    { title: 'BTU Calculator', link: '/construction/btu', description: 'Calculate heating and cooling BTU needs' },
    { title: 'Electrical Load Calculator', link: '/construction/electrical-load', description: 'Calculate electrical service requirements' },
    { title: 'Wire Size Calculator', link: '/construction/wire-size', description: 'Calculate wire gauge for circuits' }
  ];

  const contentData = {
    howToUse: {
      intro: "Size HVAC ductwork for optimal airflow:",
      steps: [
        "Enter the required airflow in CFM for your duct run",
        "Select target velocity (lower = quieter, higher = smaller ducts)",
        "Choose your duct type (round, rectangular, flex, or duct board)",
        "Select friction rate based on system design",
        "Review recommended duct size and rectangular equivalents"
      ]
    },
    whyMatters: {
      description: "Properly sized ductwork is critical for HVAC system performance. Undersized ducts restrict airflow, causing poor heating/cooling, system strain, higher energy bills, and premature equipment failure.",
      benefits: [
        "Calculate optimal duct diameter for CFM requirements",
        "Get rectangular duct equivalent dimensions",
        "Check velocity for noise considerations",
        "Estimate friction loss per 100 feet"
      ]
    },
    examples: [
      {
        title: "Main Trunk Duct",
        scenario: "1,200 CFM at 800 FPM for main supply",
        calculation: "1200 ÷ 800 = 1.5 sq ft = 216 sq in area needed",
        result: "18 inch round or 20×12 rectangular"
      },
      {
        title: "Bedroom Branch Duct",
        scenario: "150 CFM at 600 FPM for quiet operation",
        calculation: "150 ÷ 600 = 0.25 sq ft = 36 sq in",
        result: "7 inch round or 8×6 rectangular"
      }
    ],
    commonMistakes: [
      "Using same size throughout instead of reducing at branches",
      "Forgetting flex duct needs 1-2 inches larger than rigid",
      "Ignoring equivalent length of fittings (90° elbow = 10-15 ft)",
      "Installing rectangular ducts with aspect ratio over 4:1",
      "Not accounting for filter and coil pressure drops"
    ]
  };

  return (
    <CalculatorLayout
      title="Duct Size Calculator"
      description="Calculate HVAC duct size based on CFM airflow requirements. Find optimal round and rectangular duct dimensions for heating and cooling systems."
    >
      <CalculatorSchema
        name="Duct Size Calculator"
        description="Calculate HVAC ductwork sizing based on CFM airflow, velocity, and friction requirements for round and rectangular ducts"
        url="/construction/duct-size"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="cfm">Airflow (CFM)</label>
          <input
            type="number"
            id="cfm"
            value={cfm}
            onChange={(e) => setCfm(e.target.value)}
            placeholder="e.g., 400"
            min="50"
            step="10"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="velocity">Target Velocity (FPM)</label>
          <select
            id="velocity"
            value={velocity}
            onChange={(e) => setVelocity(e.target.value)}
          >
            <option value="500">500 FPM (Quiet - Bedrooms)</option>
            <option value="600">600 FPM (Branch Ducts)</option>
            <option value="700">700 FPM (Standard Residential)</option>
            <option value="800">800 FPM (Main Trunk)</option>
            <option value="900">900 FPM (Space Limited)</option>
            <option value="1000">1000 FPM (Commercial)</option>
            <option value="1200">1200 FPM (Industrial)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="ductType">Duct Type</label>
          <select
            id="ductType"
            value={ductType}
            onChange={(e) => setDuctType(e.target.value)}
          >
            <option value="round">Round (Rigid Metal)</option>
            <option value="rectangular">Rectangular (Sheet Metal)</option>
            <option value="flex">Flex Duct</option>
            <option value="fiberboard">Duct Board</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="frictionRate">Friction Rate (in. w.g./100ft)</label>
          <select
            id="frictionRate"
            value={frictionRate}
            onChange={(e) => setFrictionRate(e.target.value)}
          >
            <option value="0.05">0.05 (Low - Long Runs)</option>
            <option value="0.08">0.08 (Standard Residential)</option>
            <option value="0.10">0.10 (Typical)</option>
            <option value="0.15">0.15 (Compact System)</option>
          </select>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Duct Size
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Recommended Duct Size</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Round Duct:</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff', fontSize: '1.25rem' }}>{result.roundDiameter}" diameter</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Required Area:</span>
                <span className={styles.resultValue}>{result.ductArea.toFixed(1)} sq in</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Actual Velocity:</span>
                <span className={styles.resultValue}>{result.actualVelocity.toFixed(0)} FPM</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Friction Loss:</span>
                <span className={styles.resultValue}>{result.frictionLoss.toFixed(3)} in. w.g./100ft</span>
              </div>
            </div>

            {result.rectangularOptions.length > 0 && (
              <>
                <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Rectangular Equivalents</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {result.rectangularOptions.map((opt, index) => (
                    <span key={index} style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      {opt.width}" × {opt.height}"
                    </span>
                  ))}
                </div>
              </>
            )}

            <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>System Notes</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.9rem' }}>
              {result.recommendations.map((rec, index) => (
                <li key={index} style={{
                  padding: '0.25rem 0',
                  color: rec.startsWith('✓') ? '#4CAF50' : '#FFC107'
                }}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <CalculatorContent {...contentData} />

      <FAQ items={faqItems} />

      <RelatedCalculators calculators={relatedCalculators} />

      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
