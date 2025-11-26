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

export default function StairStringerCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [totalRise, setTotalRise] = useState<string>('');
  const [totalRun, setTotalRun] = useState<string>('');
  const [stairWidth, setStairWidth] = useState<string>('36');
  const [treadThickness, setTreadThickness] = useState<string>('1');
  const [preferredRise, setPreferredRise] = useState<string>('7.5');
  const [includeNosing, setIncludeNosing] = useState<boolean>(true);
  const [nosingOverhang, setNosingOverhang] = useState<string>('1');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const rise = parseFloat(totalRise);
    const run = parseFloat(totalRun);
    const width = parseFloat(stairWidth);
    const tread = parseFloat(treadThickness);
    const targetRise = parseFloat(preferredRise);

    if (isNaN(rise) || rise <= 0) newErrors.push('Please enter a valid total rise');
    if (isNaN(run) || run <= 0) newErrors.push('Please enter a valid total run');
    if (isNaN(width) || width <= 0) newErrors.push('Please enter a valid stair width');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // Calculate number of risers based on target rise height
    // Building code: risers typically 7-8 inches, max 7.75" residential
    let numRisers = Math.round(rise / targetRise);

    // Calculate actual rise per step
    let actualRise = rise / numRisers;

    // Check if rise is within code limits (4" min, 7.75" max typical)
    let codeCompliant = actualRise >= 4 && actualRise <= 7.75;

    // If not compliant, adjust number of risers
    if (actualRise > 7.75) {
      numRisers = Math.ceil(rise / 7.75);
      actualRise = rise / numRisers;
    } else if (actualRise < 4) {
      numRisers = Math.floor(rise / 7);
      actualRise = rise / numRisers;
    }

    codeCompliant = actualRise >= 4 && actualRise <= 7.75;

    // Number of treads = risers - 1 (top platform counts as landing, not tread)
    const numTreads = numRisers - 1;

    // Calculate tread depth (run per step)
    let treadDepth = run / numTreads;

    // Check code compliance (min 10" tread depth typically)
    const treadCompliant = treadDepth >= 10;

    // Nosing adds to tread depth for foot placement but not to structural run
    const nosing = includeNosing ? parseFloat(nosingOverhang) || 1 : 0;
    const effectiveTread = treadDepth + nosing;

    // 2R + T rule (should be 24-25" for comfortable stairs)
    const comfortRule = 2 * actualRise + treadDepth;
    const comfortCompliant = comfortRule >= 24 && comfortRule <= 25;

    // Stringer length (hypotenuse)
    const stringerLength = Math.sqrt(rise * rise + run * run);

    // Number of stringers needed based on width
    // Code typically requires stringers every 16-24" for 2x12 treads
    let numStringers = 2; // Minimum
    if (width > 36) numStringers = 3;
    if (width > 48) numStringers = 4;
    if (width > 60) numStringers = 5;

    // Stringer stock length (round up to standard lumber lengths)
    const stockLength = Math.ceil(stringerLength / 12) * 12; // Round to nearest foot

    // Minimum stringer width after notches
    // Need at least 3.5" of wood above the notch for 2x12
    const notchDepth = treadDepth;
    const minStockWidth = notchDepth + 3.5;
    const recommendedStock = minStockWidth <= 8.25 ? '2x10' : '2x12';

    // Stair angle
    const angleRad = Math.atan(rise / run);
    const angleDeg = angleRad * (180 / Math.PI);

    // Materials needed
    const treadBoardFeet = ((width / 12) * (treadDepth / 12) * tread) * numTreads;
    const stringerBoardFeet = numStringers * (stockLength / 12) * (11.25 / 12) * 1.5; // 2x12

    setResults({
      totalRise: rise,
      totalRun: run,
      numRisers,
      numTreads,
      actualRise: actualRise.toFixed(3),
      actualRiseInches: actualRise.toFixed(2),
      treadDepth: treadDepth.toFixed(3),
      treadDepthInches: treadDepth.toFixed(2),
      effectiveTread: effectiveTread.toFixed(2),
      nosing,
      stringerLength: stringerLength.toFixed(2),
      stockLength,
      numStringers,
      recommendedStock,
      angleDeg: angleDeg.toFixed(1),
      comfortRule: comfortRule.toFixed(1),
      codeCompliant,
      treadCompliant,
      comfortCompliant,
      treadBoardFeet: treadBoardFeet.toFixed(1),
      stringerBoardFeet: stringerBoardFeet.toFixed(1),
      stairWidth: width
    });

    trackCalculatorUsage('Stair Stringer Calculator', {
      totalRise: rise.toString(),
      totalRun: run.toString(),
      numRisers: numRisers.toString()
    });
  };

  const faqItems = [
    {
      question: 'What is the ideal rise and run for stairs?',
      answer: 'Ideal residential stairs have a 7-7.5 inch rise and 10-11 inch run. The "2R + T" comfort rule suggests 2 times the rise plus the tread should equal 24-25 inches. Building codes set maximums of 7.75 inch rise and minimum 10 inch tread depth.'
    },
    {
      question: 'How many stringers do I need?',
      answer: 'Use 3 stringers for stairs up to 36 inches wide, 4 stringers for up to 48 inches, and add another for each additional 12-16 inches of width. This prevents bounce and provides adequate support for treads.'
    },
    {
      question: 'What size lumber should I use for stringers?',
      answer: 'Use 2x12 dimensional lumber for most stair stringers. After cutting notches for treads and risers, you must have at least 3.5 inches of solid wood remaining. 2x10 only works for shallow-depth treads.'
    },
    {
      question: 'How do I cut stair stringers?',
      answer: 'Use a framing square with stair gauges set to your rise and run measurements. Mark each step, then cut with a circular saw, finishing corners with a handsaw or jigsaw. The bottom riser is cut shorter by the tread thickness.'
    },
    {
      question: 'What is the maximum riser height allowed by code?',
      answer: 'IRC building code limits residential risers to 7.75 inches maximum. The greatest riser height within a flight cannot exceed the smallest by more than 3/8 inch. Commercial codes are often stricter at 7 inches maximum.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Deck Stairs Calculator',
      link: '/construction/deck-stairs',
      description: 'Calculate complete deck stair materials'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate lumber quantities'
    },
    {
      title: 'Concrete Steps Calculator',
      link: '/construction/concrete-steps',
      description: 'Calculate concrete for poured stairs'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Building code-compliant stairs requires precise calculations. This calculator determines the exact rise and run for each step based on your total height change and available space.",
      steps: [
        "Measure total rise: the vertical distance from lower floor to upper floor surface.",
        "Measure total run: the horizontal distance available for the stairs.",
        "Enter the stair width (36 inches minimum for most residential codes).",
        "Specify tread thickness if using standard lumber or decking.",
        "Review results for code compliance and adjust if needed."
      ]
    },
    whyMatters: {
      description: "Stair safety depends on consistent rise and run dimensions. Uneven steps are a leading cause of falls. Building codes establish strict limits on riser height (max 7.75 inches) and tread depth (min 10 inches) to ensure safe, comfortable stairs. Proper stringer layout is essential for structural integrity.",
      benefits: [
        "Calculate code-compliant rise and run",
        "Determine number of stringers needed",
        "Get exact stringer cutting dimensions",
        "Verify comfort rule compliance",
        "Plan lumber and material quantities"
      ]
    },
    examples: [
      {
        title: "Standard Deck Stairs",
        scenario: "Deck 32 inches above ground with 48 inches of available run space.",
        calculation: "32\" rise / 7.5\" = 4.27 risers → 4 risers at 8\" (slightly over code)",
        result: "Adjust to 5 risers at 6.4\" rise, 4 treads at 12\" run. Code compliant."
      },
      {
        title: "Basement Stairs",
        scenario: "96 inches (8 feet) floor-to-floor rise with 10 feet of run available.",
        calculation: "96\" / 7.5\" = 12.8 risers → 13 risers at 7.38\"",
        result: "13 risers at 7.38\" rise, 12 treads at 10\" run. Perfect compliance."
      },
      {
        title: "Tight Space Stairs",
        scenario: "36 inch rise with only 36 inches of run available.",
        calculation: "36\" / 7\" = 5.14 risers → 5 risers at 7.2\" rise",
        result: "5 risers, 4 treads at 9\" run. Tread is under 10\" minimum - consider steeper or spiral stairs."
      }
    ],
    commonMistakes: [
      "Not accounting for tread thickness when measuring total rise - measure from finished floor to finished floor.",
      "Inconsistent rise heights - all risers must be within 3/8 inch of each other.",
      "Forgetting the bottom riser adjustment - cut bottom of stringer by tread thickness.",
      "Using undersized stringers - must maintain 3.5 inches of wood after notches.",
      "Not enough stringers - bounce and tread deflection indicate too few stringers."
    ]
  };

  return (
    <CalculatorLayout
      title="Stair Stringer Calculator"
      description="Calculate stair rise, run, and stringer dimensions. Get code-compliant measurements for safe, comfortable stairs."
    >
      <CalculatorSchema
        name="Stair Stringer Calculator"
        description="Free stair stringer calculator for rise, run, and cutting dimensions. Verify building code compliance for residential stairs."
        url="/construction/stair-stringer"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Rise (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={totalRise}
              onChange={(e) => setTotalRise(e.target.value)}
              placeholder="e.g., 96"
              step="0.25"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Floor-to-floor vertical height
            </small>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Run (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={totalRun}
              onChange={(e) => setTotalRun(e.target.value)}
              placeholder="e.g., 120"
              step="0.25"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Horizontal distance available
            </small>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Stair Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={stairWidth}
              onChange={(e) => setStairWidth(e.target.value)}
              placeholder="e.g., 36"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tread Thickness (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={treadThickness}
              onChange={(e) => setTreadThickness(e.target.value)}
              placeholder="e.g., 1"
              step="0.25"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Preferred Riser Height (inches)</label>
          <select
            className={styles.select}
            value={preferredRise}
            onChange={(e) => setPreferredRise(e.target.value)}
          >
            <option value="7">7 inches (comfortable)</option>
            <option value="7.25">7.25 inches (standard)</option>
            <option value="7.5">7.5 inches (common)</option>
            <option value="7.75">7.75 inches (code maximum)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeNosing}
              onChange={(e) => setIncludeNosing(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Tread Nosing
          </label>
        </div>

        {includeNosing && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Nosing Overhang (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={nosingOverhang}
              onChange={(e) => setNosingOverhang(e.target.value)}
              placeholder="e.g., 1"
              step="0.25"
            />
          </div>
        )}

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Stringer
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Stair Stringer Calculations</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Rise</span>
            <span className={styles.resultValue}>{results.totalRise} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Run</span>
            <span className={styles.resultValue}>{results.totalRun} inches</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Step Dimensions</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Number of Risers</span>
            <span className={styles.resultValuePrimary}>{results.numRisers}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Number of Treads</span>
            <span className={styles.resultValue}>{results.numTreads}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rise per Step</span>
            <span className={styles.resultValuePrimary}>{results.actualRiseInches} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tread Depth (run per step)</span>
            <span className={styles.resultValuePrimary}>{results.treadDepthInches} inches</span>
          </div>

          {results.nosing > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Effective Tread (with nosing)</span>
              <span className={styles.resultValue}>{results.effectiveTread} inches</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stair Angle</span>
            <span className={styles.resultValue}>{results.angleDeg}°</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Code Compliance</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Riser Height (max 7.75")</span>
            <span className={styles.resultValue} style={{ color: results.codeCompliant ? '#4ade80' : '#f87171' }}>
              {results.codeCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tread Depth (min 10")</span>
            <span className={styles.resultValue} style={{ color: results.treadCompliant ? '#4ade80' : '#f87171' }}>
              {results.treadCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Comfort Rule (2R+T = 24-25")</span>
            <span className={styles.resultValue}>
              {results.comfortRule}" {results.comfortCompliant ? '(comfortable)' : '(adjust recommended)'}
            </span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Stringer Specifications</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stringer Length</span>
            <span className={styles.resultValue}>{results.stringerLength} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stock Length Needed</span>
            <span className={styles.resultValue}>{results.stockLength} inches ({(results.stockLength / 12).toFixed(0)} feet)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Stock</span>
            <span className={styles.resultValue}>{results.recommendedStock}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Number of Stringers</span>
            <span className={styles.resultValuePrimary}>{results.numStringers} stringers</span>
          </div>

          {(!results.codeCompliant || !results.treadCompliant) && (
            <div className={styles.warning}>
              <strong>Warning:</strong> Current dimensions do not meet typical building code requirements. Adjust total run or rise to achieve compliance. Consult local codes and an inspector.
            </div>
          )}

          <div className={styles.note}>
            <strong>Stringer Cutting Notes:</strong>
            <br />• Set framing square to {results.actualRiseInches}" rise and {results.treadDepthInches}" run
            <br />• Cut bottom riser {results.treadThickness || 1}" shorter (tread thickness)
            <br />• Maintain minimum 3.5" of wood above notches
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
