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

export default function SpiralStairsCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [floorHeight, setFloorHeight] = useState('');
  const [diameter, setDiameter] = useState('');
  const [riserHeight, setRiserHeight] = useState('7.5');
  const [rotationDegrees, setRotationDegrees] = useState('360');
  const [result, setResult] = useState<{
    numberOfRisers: number;
    actualRiserHeight: number;
    treadDepth: number;
    walklineRadius: number;
    walklineTreadDepth: number;
    totalRotation: number;
    rotationPerStep: number;
    centerColumnDiameter: number;
    headroomCheck: string;
    codeCompliance: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const height = parseFloat(floorHeight);
    const diam = parseFloat(diameter);
    const targetRiser = parseFloat(riserHeight);
    const rotation = parseFloat(rotationDegrees);

    if (isNaN(height) || height <= 0) {
      setError('Please enter a valid floor-to-floor height');
      setResult(null);
      return;
    }
    if (isNaN(diam) || diam < 42) {
      setError('Minimum diameter for spiral stairs is 42 inches');
      setResult(null);
      return;
    }
    if (isNaN(targetRiser) || targetRiser < 6 || targetRiser > 9.5) {
      setError('Riser height must be between 6 and 9.5 inches');
      setResult(null);
      return;
    }

    // Calculate number of risers
    const numberOfRisers = Math.round(height / targetRiser);
    const actualRiserHeight = height / numberOfRisers;

    // Spiral stair calculations
    const stairRadius = diam / 2;
    // Walkline is 12 inches from narrow end per code
    const walklineRadius = Math.min(stairRadius - 6, 12);
    const centerColumnDiameter = 4; // Standard center column

    // Calculate rotation per step
    const rotationPerStep = rotation / numberOfRisers;

    // Tread depth at outer edge
    const outerCircumference = Math.PI * diam;
    const treadDepthOuter = outerCircumference / numberOfRisers;

    // Tread depth at walkline (12" from center or narrow end)
    const walklineCircumference = 2 * Math.PI * walklineRadius;
    const walklineTreadDepth = walklineCircumference / numberOfRisers;

    // Headroom check (typically need 78" minimum)
    const heightPerRotation = (actualRiserHeight * numberOfRisers) / (rotation / 360);
    const headroomCheck = heightPerRotation >= 78 ? 'Adequate (≥78")' : `Insufficient (${heightPerRotation.toFixed(1)}")`;

    // Code compliance checks
    const codeCompliance: string[] = [];

    if (diam >= 60) {
      codeCompliance.push('✓ Diameter meets IRC minimum (60")');
    } else if (diam >= 42) {
      codeCompliance.push('⚠ Diameter below IRC (60"), but may meet local codes (42" min)');
    }

    if (actualRiserHeight <= 9.5) {
      codeCompliance.push('✓ Riser height compliant (≤9.5")');
    } else {
      codeCompliance.push('✗ Riser height exceeds maximum (9.5")');
    }

    if (walklineTreadDepth >= 7.5) {
      codeCompliance.push('✓ Tread depth at walkline compliant (≥7.5")');
    } else {
      codeCompliance.push('✗ Tread depth at walkline insufficient (<7.5")');
    }

    if (rotationPerStep <= 30) {
      codeCompliance.push('✓ Rotation per step acceptable (≤30°)');
    } else {
      codeCompliance.push('⚠ High rotation per step (>30°)');
    }

    setResult({
      numberOfRisers,
      actualRiserHeight,
      treadDepth: treadDepthOuter,
      walklineRadius,
      walklineTreadDepth,
      totalRotation: rotation,
      rotationPerStep,
      centerColumnDiameter,
      headroomCheck,
      codeCompliance
    });
    setError('');
    trackCalculatorUsage('spiral-stairs');
  };

  const faqItems = [
    {
      question: 'What is the minimum diameter for a spiral staircase?',
      answer: 'The IRC requires a minimum diameter of 60 inches for residential spiral stairs. However, some local codes allow 42-inch diameter for secondary stairs or space-constrained applications. Commercial spiral stairs typically require larger diameters (66-72 inches) to meet ADA accessibility standards.'
    },
    {
      question: 'How is tread depth measured on spiral stairs?',
      answer: 'Tread depth on spiral stairs is measured along the walkline, which is 12 inches from the narrow end of the tread (or from the center column). The IRC requires minimum 7.5-inch tread depth at this walkline. The tread depth varies from narrow at the center to wide at the outer edge.'
    },
    {
      question: 'What is the maximum riser height for spiral stairs?',
      answer: 'The IRC allows a maximum riser height of 9.5 inches for spiral stairs, which is higher than the 7.75-inch maximum for standard stairs. This accommodates the space constraints typical of spiral installations while maintaining reasonable climbability.'
    },
    {
      question: 'How much rotation should a spiral staircase have?',
      answer: 'Spiral stairs typically rotate 360 degrees (one full turn) for a standard floor height. However, some designs use 270 degrees or 450 degrees depending on entry/exit orientations and space constraints. Less rotation means steeper stairs with fewer treads.'
    },
    {
      question: 'Can spiral stairs be used as primary stairs?',
      answer: 'Yes, spiral stairs can serve as primary stairs if they meet code requirements: minimum 60-inch diameter, 26-inch clear width, 7.5-inch minimum tread depth at walkline, maximum 9.5-inch riser height, and proper headroom. Some jurisdictions restrict them to secondary access only.'
    }
  ];

  const relatedCalculators = [
    { title: 'Stair Stringer Calculator', link: '/construction/stair-stringer', description: 'Calculate stair stringer dimensions' },
    { title: 'Concrete Steps Calculator', link: '/construction/concrete-steps', description: 'Calculate concrete for steps' },
    { title: 'Deck Railing Calculator', link: '/construction/deck-railing', description: 'Calculate railing materials' }
  ];

  const contentData = {
    howToUse: {
      intro: "Design code-compliant spiral staircases:",
      steps: [
        "Enter floor-to-floor height in inches",
        "Enter overall staircase diameter (60 inch minimum for code)",
        "Select target riser height (7.5 inches typical)",
        "Choose total rotation (360 degrees = one full turn)",
        "Review tread depths, rotation per step, and code compliance"
      ]
    },
    whyMatters: {
      description: "Spiral staircases require precise calculations because tread dimensions vary from narrow at center to wide at outer edge. Building codes measure compliance at the walkline (12 inches from narrow end).",
      benefits: [
        "Calculate number of treads for floor height",
        "Verify tread depth meets 7.5 inch minimum at walkline",
        "Check headroom through rotation",
        "Ensure IRC code compliance for all dimensions"
      ]
    },
    examples: [
      {
        title: "9-Foot Floor Height",
        scenario: "108 inch rise, 60 inch diameter, 360 degree rotation",
        calculation: "108 ÷ 7.5 = 14 risers, actual 7.71 inch riser height",
        result: "Walkline tread: 5.4 inch - FAILS code (need larger diameter or more rotation)"
      },
      {
        title: "Standard Residential Spiral",
        scenario: "96 inch rise, 66 inch diameter, 450 degree rotation",
        calculation: "13 risers at 7.4 inches, more rotation = more tread depth",
        result: "Walkline tread: 7.8 inch - PASSES 7.5 inch minimum"
      }
    ],
    commonMistakes: [
      "Measuring tread depth at outer edge instead of walkline",
      "Forgetting headroom compounds with rotation angle",
      "Using standard 7.75 inch max riser (spirals allow 9.5 inch)",
      "Ignoring center column diameter in calculations",
      "Underestimating diameter needs (60 inch minimum for primary stairs)"
    ]
  };

  return (
    <CalculatorLayout
      title="Spiral Stairs Calculator"
      description="Calculate spiral staircase dimensions including tread depth, riser height, rotation, and verify building code compliance for your spiral stair design."
    >
      <CalculatorSchema
        name="Spiral Stairs Calculator"
        description="Calculate spiral staircase dimensions, tread depths at walkline, rotation per step, and verify IRC code compliance"
        url="/construction/spiral-stairs"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="floorHeight">Floor-to-Floor Height (inches)</label>
          <input
            type="number"
            id="floorHeight"
            value={floorHeight}
            onChange={(e) => setFloorHeight(e.target.value)}
            placeholder="e.g., 108"
            min="60"
            step="0.5"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="diameter">Overall Diameter (inches)</label>
          <input
            type="number"
            id="diameter"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            placeholder="e.g., 60"
            min="42"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="riserHeight">Target Riser Height (inches)</label>
          <select
            id="riserHeight"
            value={riserHeight}
            onChange={(e) => setRiserHeight(e.target.value)}
          >
            <option value="6.5">6.5" (Comfortable)</option>
            <option value="7">7" (Standard)</option>
            <option value="7.5">7.5" (Typical)</option>
            <option value="8">8" (Steep)</option>
            <option value="8.5">8.5" (Very Steep)</option>
            <option value="9">9" (Maximum Comfort)</option>
            <option value="9.5">9.5" (Code Maximum)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="rotation">Total Rotation (degrees)</label>
          <select
            id="rotation"
            value={rotationDegrees}
            onChange={(e) => setRotationDegrees(e.target.value)}
          >
            <option value="270">270° (3/4 Turn)</option>
            <option value="360">360° (Full Turn)</option>
            <option value="450">450° (1¼ Turn)</option>
            <option value="540">540° (1½ Turn)</option>
            <option value="630">630° (1¾ Turn)</option>
            <option value="720">720° (2 Full Turns)</option>
          </select>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Spiral Stairs
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Spiral Stair Design</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Number of Treads/Risers:</span>
                <span className={styles.resultValue}>{result.numberOfRisers}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Actual Riser Height:</span>
                <span className={styles.resultValue}>{result.actualRiserHeight.toFixed(2)}"</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Outer Tread Depth:</span>
                <span className={styles.resultValue}>{result.treadDepth.toFixed(2)}"</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Walkline Tread Depth:</span>
                <span className={styles.resultValue}>{result.walklineTreadDepth.toFixed(2)}"</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Rotation Per Step:</span>
                <span className={styles.resultValue}>{result.rotationPerStep.toFixed(1)}°</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Headroom:</span>
                <span className={styles.resultValue}>{result.headroomCheck}</span>
              </div>
            </div>

            <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Code Compliance</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0' }}>
              {result.codeCompliance.map((item, index) => (
                <li key={index} style={{
                  padding: '0.25rem 0',
                  color: item.startsWith('✓') ? '#4CAF50' : item.startsWith('⚠') ? '#FFC107' : '#f44336'
                }}>
                  {item}
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
