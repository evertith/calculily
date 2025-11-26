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

type InputMethod = 'rise-run' | 'angle' | 'ratio';

export default function RoofPitchCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputMethod, setInputMethod] = useState<InputMethod>('rise-run');
  const [rise, setRise] = useState<string>('');
  const [run, setRun] = useState<string>('12');
  const [angle, setAngle] = useState<string>('');
  const [pitchRatio, setPitchRatio] = useState<string>('');
  const [roofArea, setRoofArea] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let riseValue = 0;
    let runValue = 12;
    let angleValue = 0;

    if (inputMethod === 'rise-run') {
      if (!rise || parseFloat(rise) < 0) newErrors.push('Please enter a valid rise');
      if (!run || parseFloat(run) <= 0) newErrors.push('Please enter a valid run');
      if (newErrors.length === 0) {
        riseValue = parseFloat(rise);
        runValue = parseFloat(run);
        angleValue = Math.atan(riseValue / runValue) * (180 / Math.PI);
      }
    } else if (inputMethod === 'angle') {
      if (!angle || parseFloat(angle) < 0 || parseFloat(angle) > 90) {
        newErrors.push('Please enter a valid angle (0-90 degrees)');
      }
      if (newErrors.length === 0) {
        angleValue = parseFloat(angle);
        riseValue = Math.tan(angleValue * Math.PI / 180) * 12;
        runValue = 12;
      }
    } else if (inputMethod === 'ratio') {
      if (!pitchRatio || !pitchRatio.includes('/')) {
        newErrors.push('Please enter pitch in X/12 format (e.g., 4/12)');
      }
      if (newErrors.length === 0) {
        const parts = pitchRatio.split('/');
        riseValue = parseFloat(parts[0]);
        runValue = parseFloat(parts[1]) || 12;
        angleValue = Math.atan(riseValue / runValue) * (180 / Math.PI);
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // Normalize to X:12 pitch
    const normalizedPitch = (riseValue / runValue) * 12;

    // Calculate pitch multiplier (for area calculations)
    const pitchMultiplier = Math.sqrt(1 + Math.pow(normalizedPitch / 12, 2));

    // Calculate actual roof area if base area provided
    const baseArea = parseFloat(roofArea) || 0;
    const actualArea = baseArea > 0 ? baseArea * pitchMultiplier : 0;

    // Grade/slope as percentage
    const gradePercent = (riseValue / runValue) * 100;

    // Pitch categories
    let pitchCategory = '';
    if (normalizedPitch <= 2) pitchCategory = 'Flat/Low Slope (special materials required)';
    else if (normalizedPitch <= 4) pitchCategory = 'Low Slope';
    else if (normalizedPitch <= 6) pitchCategory = 'Standard Slope';
    else if (normalizedPitch <= 9) pitchCategory = 'Steep Slope';
    else if (normalizedPitch <= 12) pitchCategory = 'Very Steep (45° or less)';
    else pitchCategory = 'Extreme Pitch (safety equipment required)';

    // Common pitch reference table
    const pitchTable = [
      { pitch: '1/12', angle: 4.8, multiplier: 1.003 },
      { pitch: '2/12', angle: 9.5, multiplier: 1.014 },
      { pitch: '3/12', angle: 14.0, multiplier: 1.031 },
      { pitch: '4/12', angle: 18.4, multiplier: 1.054 },
      { pitch: '5/12', angle: 22.6, multiplier: 1.083 },
      { pitch: '6/12', angle: 26.6, multiplier: 1.118 },
      { pitch: '7/12', angle: 30.3, multiplier: 1.158 },
      { pitch: '8/12', angle: 33.7, multiplier: 1.202 },
      { pitch: '9/12', angle: 36.9, multiplier: 1.250 },
      { pitch: '10/12', angle: 39.8, multiplier: 1.302 },
      { pitch: '11/12', angle: 42.5, multiplier: 1.357 },
      { pitch: '12/12', angle: 45.0, multiplier: 1.414 },
    ];

    setResults({
      rise: riseValue.toFixed(2),
      run: runValue.toFixed(2),
      pitchRatio: `${normalizedPitch.toFixed(1)}/12`,
      angle: angleValue.toFixed(1),
      pitchMultiplier: pitchMultiplier.toFixed(3),
      gradePercent: gradePercent.toFixed(1),
      pitchCategory,
      baseArea: baseArea > 0 ? baseArea.toFixed(0) : null,
      actualArea: actualArea > 0 ? actualArea.toFixed(0) : null,
      pitchTable
    });

    trackCalculatorUsage('Roof Pitch Calculator', {
      inputMethod,
      pitch: `${normalizedPitch.toFixed(1)}/12`,
      angle: angleValue.toFixed(1)
    });
  };

  const faqItems = [
    {
      question: 'What does roof pitch mean?',
      answer: 'Roof pitch is the slope of your roof expressed as a ratio of rise (vertical height) to run (horizontal distance). A 6/12 pitch means the roof rises 6 inches for every 12 inches of horizontal run.'
    },
    {
      question: 'How do I measure roof pitch?',
      answer: 'Place a level horizontally against the roof, measure 12 inches along the level, then measure vertically from that point to the roof surface. That vertical measurement is your rise (X/12 pitch). You can also measure from inside the attic.'
    },
    {
      question: 'What is a good roof pitch?',
      answer: 'Most residential roofs have a pitch between 4/12 and 9/12. A 6/12 pitch is common and provides good water runoff while being walkable. Steeper pitches shed water and snow better but cost more to build and reroof.'
    },
    {
      question: 'What is the minimum pitch for shingles?',
      answer: 'Standard asphalt shingles require a minimum 2/12 pitch, though 4/12 or greater is recommended. Low-slope roofs (below 2/12) require special roofing materials like rolled roofing, EPDM, or built-up roofing.'
    },
    {
      question: 'How does pitch affect roof area?',
      answer: 'Steeper roofs have more surface area than the footprint suggests. A 12/12 (45°) roof has 41% more area than a flat roof of the same footprint. Use the pitch multiplier to convert footprint area to actual roof area.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Roofing Calculator',
      link: '/construction/roofing',
      description: 'Calculate shingles and roofing materials'
    },
    {
      title: 'Metal Roofing Calculator',
      link: '/construction/metal-roofing',
      description: 'Calculate metal roofing panels'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate lumber for roof framing'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Knowing your roof pitch is essential for ordering materials and planning roofing projects. Here's how to calculate it:",
      steps: [
        "Choose your input method: rise and run measurements, angle in degrees, or pitch ratio (X/12).",
        "Enter your measurements. For rise/run, measure the vertical rise over a known horizontal distance (typically 12 inches).",
        "Optionally enter your roof footprint area to calculate actual roof surface area.",
        "Click 'Calculate' to see pitch ratio, angle, and area multiplier.",
        "Use the reference table to compare with common roof pitches."
      ]
    },
    whyMatters: {
      description: "Roof pitch affects everything from material choices to worker safety. Low-slope roofs (under 2/12) can't use standard shingles. Steep roofs (over 7/12) require safety equipment. The pitch also determines how much roofing material you need - steeper roofs have significantly more surface area than their footprint suggests.",
      benefits: [
        "Convert between pitch ratio, angle, and grade percentage",
        "Calculate the pitch multiplier for accurate material ordering",
        "Determine if standard shingles are appropriate for your roof",
        "Know when safety equipment is required for roof work",
        "Calculate actual roof area from footprint measurements"
      ]
    },
    examples: [
      {
        title: "Measuring from the Attic",
        scenario: "You measure 8 inches of rise over 12 inches of run from inside the attic.",
        calculation: "Rise/Run = 8/12 pitch. Angle = arctan(8/12) = 33.7°. Multiplier = 1.202.",
        result: "This is a steep slope (8/12). A 1,500 sq ft footprint has 1,803 sq ft actual roof area."
      },
      {
        title: "Converting Angle to Pitch",
        scenario: "A roofing contractor quotes work for a 30-degree roof.",
        calculation: "Rise = tan(30°) × 12 = 6.93\". This is approximately a 7/12 pitch.",
        result: "Order materials based on 7/12 pitch multiplier (1.158)."
      },
      {
        title: "Low-Slope Verification",
        scenario: "Checking if a porch roof can use standard shingles.",
        calculation: "Measured 2 inches rise over 12 inches run = 2/12 pitch = 9.5 degrees.",
        result: "Minimum for asphalt shingles. Consider underlayment or alternative materials."
      }
    ],
    commonMistakes: [
      "Confusing pitch with angle - a 6/12 pitch is NOT 6 degrees; it's 26.6 degrees.",
      "Measuring run on the slope instead of horizontally - run must be horizontal distance.",
      "Using footprint area for material ordering - apply the pitch multiplier for actual roof area.",
      "Assuming low-slope roofs can use standard shingles - below 2/12 requires special materials.",
      "Not accounting for both sides of a gable roof - measure one side and double if symmetrical."
    ]
  };

  return (
    <CalculatorLayout
      title="Roof Pitch Calculator"
      description="Calculate roof pitch, angle, and area multiplier from rise/run measurements. Convert between pitch ratio, degrees, and grade percentage."
    >
      <CalculatorSchema
        name="Roof Pitch Calculator"
        description="Free roof pitch calculator to determine pitch ratio, angle, and area multiplier. Convert between rise/run, degrees, and slope percentage."
        url="/construction/roof-pitch"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Input Method</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${inputMethod === 'rise-run' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputMethod('rise-run')}
            >
              Rise & Run
            </button>
            <button
              className={`${styles.buttonOption} ${inputMethod === 'angle' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputMethod('angle')}
            >
              Angle (degrees)
            </button>
            <button
              className={`${styles.buttonOption} ${inputMethod === 'ratio' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputMethod('ratio')}
            >
              Pitch Ratio
            </button>
          </div>
        </div>

        {inputMethod === 'rise-run' && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Rise (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={rise}
                onChange={(e) => setRise(e.target.value)}
                placeholder="e.g., 6"
                step="0.25"
              />
              <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
                Vertical height over the run distance
              </small>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Run (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={run}
                onChange={(e) => setRun(e.target.value)}
                placeholder="e.g., 12"
                step="0.25"
              />
              <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
                Standard is 12 inches (1 foot)
              </small>
            </div>
          </>
        )}

        {inputMethod === 'angle' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Roof Angle (degrees)</label>
            <input
              type="number"
              className={styles.input}
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="e.g., 30"
              step="0.1"
              min="0"
              max="90"
            />
          </div>
        )}

        {inputMethod === 'ratio' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Pitch Ratio (X/12 format)</label>
            <input
              type="text"
              className={styles.input}
              value={pitchRatio}
              onChange={(e) => setPitchRatio(e.target.value)}
              placeholder="e.g., 6/12"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Enter as rise/run (e.g., 4/12, 8/12)
            </small>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Roof Footprint Area (sq ft) - Optional</label>
          <input
            type="number"
            className={styles.input}
            value={roofArea}
            onChange={(e) => setRoofArea(e.target.value)}
            placeholder="e.g., 1500"
            step="1"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            Calculate actual roof surface area from footprint
          </small>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Pitch
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Roof Pitch Results</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rise</span>
            <span className={styles.resultValue}>{results.rise}" per {results.run}" run</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Pitch Ratio</span>
            <span className={styles.resultValuePrimary}>{results.pitchRatio}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Angle</span>
            <span className={styles.resultValuePrimary}>{results.angle}°</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Grade/Slope</span>
            <span className={styles.resultValue}>{results.gradePercent}%</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Area Multiplier</span>
            <span className={styles.resultValuePrimary}>×{results.pitchMultiplier}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Category</span>
            <span className={styles.resultValue}>{results.pitchCategory}</span>
          </div>

          {results.baseArea && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Area Calculation</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Footprint Area</span>
                <span className={styles.resultValue}>{results.baseArea} sq ft</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Actual Roof Area</span>
                <span className={styles.resultValuePrimary}>{results.actualArea} sq ft</span>
              </div>
            </>
          )}

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Common Pitch Reference</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ color: '#888', fontWeight: 'bold' }}>Pitch</div>
            <div style={{ color: '#888', fontWeight: 'bold' }}>Angle</div>
            <div style={{ color: '#888', fontWeight: 'bold' }}>Multiplier</div>
            {results.pitchTable.map((row: any) => (
              <>
                <div key={`pitch-${row.pitch}`} style={{ color: '#e0e0e0' }}>{row.pitch}</div>
                <div key={`angle-${row.pitch}`} style={{ color: '#b0b0b0' }}>{row.angle}°</div>
                <div key={`mult-${row.pitch}`} style={{ color: '#b0b0b0' }}>{row.multiplier}</div>
              </>
            ))}
          </div>

          <div className={styles.note}>
            <strong>Area Multiplier Usage:</strong> Multiply your roof footprint (bird's-eye view area) by {results.pitchMultiplier}
            to get the actual roof surface area for material ordering.
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
