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

export default function DeckStairCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [totalRise, setTotalRise] = useState<string>('');
  const [stairWidth, setStairWidth] = useState<string>('36');
  const [stringerSpacing, setStringerSpacing] = useState<string>('16');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    if (!totalRise || parseFloat(totalRise) <= 0) newErrors.push('Please enter a valid total rise');
    if (!stairWidth || parseFloat(stairWidth) <= 0) newErrors.push('Please enter a valid stair width');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const rise = parseFloat(totalRise);
    const width = parseFloat(stairWidth);
    const spacing = parseFloat(stringerSpacing) || 16;

    // Calculate number of steps
    // IRC max rise is 7.75", ideal is 7-7.5"
    // Try to get rise as close to 7" as possible
    let numSteps = Math.round(rise / 7);
    let riserHeight = rise / numSteps;

    // Adjust if outside code limits
    if (riserHeight > 7.75) {
      numSteps = Math.ceil(rise / 7.75);
      riserHeight = rise / numSteps;
    } else if (riserHeight < 4) {
      numSteps = Math.floor(rise / 5);
      riserHeight = rise / numSteps;
    }

    // Calculate tread depth (run)
    // IRC: 2R + T should equal 24-25" (step comfort formula)
    // Minimum tread: 10", typical: 10-11"
    let treadDepth = 25 - (2 * riserHeight);
    if (treadDepth < 10) treadDepth = 10;
    if (treadDepth > 12) treadDepth = 11;

    // Total run (horizontal distance)
    const totalRun = treadDepth * (numSteps - 1); // One less tread than risers (top is deck)

    // Stringer length (hypotenuse)
    const stringerLength = Math.sqrt(Math.pow(rise, 2) + Math.pow(totalRun, 2));

    // Minimum stringer board length (add extra for cuts)
    const minBoardLength = Math.ceil(stringerLength / 12) + 1; // In feet, rounded up

    // Number of stringers based on width
    // Max 16" spacing for strength
    const numStringers = Math.ceil(width / spacing) + 1;

    // Materials needed
    // Treads: number of steps (minus 1 if top step is deck surface)
    const numTreads = numSteps - 1;
    const treadBoards = numTreads * Math.ceil((treadDepth + 1) / 5.5); // 5.5" boards with overhang

    // Riser boards (if enclosed)
    const riserBoards = numSteps;

    // Calculate stringer angle
    const stringerAngle = Math.atan(rise / totalRun) * (180 / Math.PI);

    // Code compliance check
    const codeCompliant = riserHeight <= 7.75 && riserHeight >= 4 && treadDepth >= 10;

    // 7-11 rule check (comfortable stairs)
    const comfortRule = (2 * riserHeight) + treadDepth;
    const isComfortable = comfortRule >= 24 && comfortRule <= 25;

    setResults({
      totalRise: rise.toFixed(2),
      totalRun: totalRun.toFixed(2),
      numSteps,
      numTreads,
      riserHeight: riserHeight.toFixed(2),
      treadDepth: treadDepth.toFixed(2),
      stringerLength: stringerLength.toFixed(2),
      minBoardLength,
      numStringers,
      stairWidth: width,
      stringerAngle: stringerAngle.toFixed(1),
      treadBoards,
      riserBoards,
      codeCompliant,
      comfortRule: comfortRule.toFixed(1),
      isComfortable
    });

    trackCalculatorUsage('Deck Stair Calculator', {
      totalRise: rise.toString(),
      numSteps: numSteps.toString(),
      riserHeight: riserHeight.toFixed(2),
      treadDepth: treadDepth.toFixed(2)
    });
  };

  const faqItems = [
    {
      question: 'What is the maximum riser height allowed by code?',
      answer: 'The International Residential Code (IRC) allows a maximum riser height of 7.75 inches (7-3/4"). The minimum is 4 inches. Most comfortable stairs have risers between 7 and 7.5 inches.'
    },
    {
      question: 'What is the minimum tread depth for stairs?',
      answer: 'IRC requires a minimum tread depth of 10 inches. The tread depth is measured from the front edge of one tread to the front edge of the next, not including nosing.'
    },
    {
      question: 'How many stringers do I need for deck stairs?',
      answer: 'Stringers should be spaced no more than 16 inches apart for standard 2× lumber treads. A 36-inch wide stairway needs 3 stringers (one at each edge plus one in the middle).'
    },
    {
      question: 'What size lumber is used for stair stringers?',
      answer: '2×12 lumber is standard for stair stringers. After cutting the notches, at least 3.5 inches of wood must remain at the thinnest point for structural integrity.'
    },
    {
      question: 'How do I calculate the stringer angle for cutting?',
      answer: 'The stringer angle equals arctan(total rise ÷ total run). For a 28" rise and 40" run: arctan(28/40) = 35 degrees. Use a framing square with stair gauges set to your rise and run.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Deck Board Calculator',
      link: '/construction/deck-boards',
      description: 'Calculate deck boards and materials'
    },
    {
      title: 'Deck Calculator',
      link: '/calculators/deck',
      description: 'Calculate complete deck materials'
    },
    {
      title: 'Stair Stringer Calculator',
      link: '/construction/stair-stringer',
      description: 'Detailed stringer cutting dimensions'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Building safe, code-compliant deck stairs starts with accurate calculations. Here's how to get the dimensions right:",
      steps: [
        "Measure the total rise: the vertical distance from the ground to the top of the deck surface.",
        "Enter the desired stair width. Standard is 36 inches minimum; wider is more comfortable.",
        "Select stringer spacing based on tread material. 16 inches is standard for 2× lumber treads.",
        "Click 'Calculate' to get the number of steps, riser height, tread depth, and stringer dimensions.",
        "Verify the results meet your local building codes before construction."
      ]
    },
    whyMatters: {
      description: "Improperly designed stairs are a leading cause of falls and injuries. Building codes specify strict requirements for riser height (max 7.75\") and tread depth (min 10\") because inconsistent stairs are dangerous. All risers must be within 3/8\" of each other in height.",
      benefits: [
        "Calculate code-compliant riser and tread dimensions",
        "Determine the exact number of steps needed",
        "Know stringer length and cutting angles",
        "Ensure comfortable, safe stairs with the 7-11 rule",
        "Calculate materials: stringers, treads, and riser boards"
      ]
    },
    examples: [
      {
        title: "Standard Deck Height",
        scenario: "A deck 28 inches above ground with 36-inch wide stairs.",
        calculation: "28\" ÷ 4 steps = 7\" risers. Treads: 25\" - (2×7\") = 11\". Total run: 11\" × 3 = 33\".",
        result: "4 risers at 7\", 3 treads at 11\" deep, 3 stringers (2×12×4' minimum)."
      },
      {
        title: "High Deck",
        scenario: "A deck 56 inches above ground.",
        calculation: "56\" ÷ 8 steps = 7\" risers. Treads: 11\". Total run: 77\". Stringer: ~95\" (8 feet).",
        result: "8 risers, 7 treads, stringers from 2×12×10' boards. Consider a landing for stairs over 7 feet."
      },
      {
        title: "Low Step",
        scenario: "A single step down from a low deck, 14 inches total rise.",
        calculation: "14\" ÷ 2 steps = 7\" risers. One tread at 11\".",
        result: "2 risers at 7\", 1 tread. Consider 3 stringers even for a single step for stability."
      }
    ],
    commonMistakes: [
      "Measuring to the wrong point - measure total rise from finished ground to top of deck surface, not deck frame.",
      "Forgetting the bottom riser - the ground is your first tread, so you have one more riser than tread.",
      "Inconsistent risers - all risers must be within 3/8\" of each other. Even small variations cause trips.",
      "Not accounting for tread overhang - treads typically overhang risers by 3/4\" to 1-1/4\".",
      "Using undersized stringers - after notching, at least 3.5\" of wood must remain for strength."
    ]
  };

  return (
    <CalculatorLayout
      title="Deck Stair Calculator"
      description="Calculate deck stair dimensions including risers, treads, stringers, and materials. Ensures code-compliant, comfortable stairs."
    >
      <CalculatorSchema
        name="Deck Stair Calculator"
        description="Free deck stair calculator to determine riser height, tread depth, stringer length, and materials for code-compliant stairs."
        url="/construction/deck-stairs"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Total Rise (inches)</label>
          <input
            type="number"
            className={styles.input}
            value={totalRise}
            onChange={(e) => setTotalRise(e.target.value)}
            placeholder="e.g., 28"
            step="0.25"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            Vertical distance from ground to deck surface
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stair Width (inches)</label>
          <select
            className={styles.select}
            value={stairWidth}
            onChange={(e) => setStairWidth(e.target.value)}
          >
            <option value="36">36" - Minimum code</option>
            <option value="42">42" - Comfortable</option>
            <option value="48">48" - Wide</option>
            <option value="60">60" - Extra wide</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stringer Spacing (inches)</label>
          <select
            className={styles.select}
            value={stringerSpacing}
            onChange={(e) => setStringerSpacing(e.target.value)}
          >
            <option value="12">12" - Heavy duty</option>
            <option value="16">16" - Standard (2× treads)</option>
            <option value="24">24" - Light use (composite)</option>
          </select>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Stairs
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Stair Dimensions</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Rise</span>
            <span className={styles.resultValue}>{results.totalRise}" ({(parseFloat(results.totalRise) / 12).toFixed(2)} ft)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Run</span>
            <span className={styles.resultValue}>{results.totalRun}" ({(parseFloat(results.totalRun) / 12).toFixed(2)} ft)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stringer Angle</span>
            <span className={styles.resultValue}>{results.stringerAngle}°</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Step Dimensions</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Number of Risers</span>
            <span className={styles.resultValuePrimary}>{results.numSteps} risers</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Number of Treads</span>
            <span className={styles.resultValuePrimary}>{results.numTreads} treads</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Riser Height</span>
            <span className={styles.resultValuePrimary}>{results.riserHeight}"</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tread Depth</span>
            <span className={styles.resultValuePrimary}>{results.treadDepth}"</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Code Compliance</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Max Riser (7.75" code limit)</span>
            <span className={styles.resultValue} style={{ color: parseFloat(results.riserHeight) <= 7.75 ? '#4caf50' : '#f44336' }}>
              {parseFloat(results.riserHeight) <= 7.75 ? '✓ Compliant' : '✗ Exceeds limit'}
            </span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Min Tread (10" code limit)</span>
            <span className={styles.resultValue} style={{ color: parseFloat(results.treadDepth) >= 10 ? '#4caf50' : '#f44336' }}>
              {parseFloat(results.treadDepth) >= 10 ? '✓ Compliant' : '✗ Below minimum'}
            </span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Comfort Rule (2R + T = 24-25")</span>
            <span className={styles.resultValue} style={{ color: results.isComfortable ? '#4caf50' : '#ffaa00' }}>
              {results.comfortRule}" - {results.isComfortable ? '✓ Comfortable' : '⚠ Adjust if possible'}
            </span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Materials</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stringers (2×12)</span>
            <span className={styles.resultValue}>{results.numStringers} @ {results.minBoardLength}' minimum</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stringer Length</span>
            <span className={styles.resultValue}>{results.stringerLength}" ({(parseFloat(results.stringerLength) / 12).toFixed(2)} ft)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tread Boards (5.5" wide)</span>
            <span className={styles.resultValue}>{results.treadBoards} boards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Riser Boards (if enclosed)</span>
            <span className={styles.resultValue}>{results.riserBoards} boards</span>
          </div>

          <div className={styles.note}>
            <strong>Framing Square Setup:</strong> Set stair gauges to {results.riserHeight}" (rise) and {results.treadDepth}" (run).
            Mark and cut {results.numSteps - 1} notches for treads plus adjust bottom for tread thickness.
          </div>

          {!results.codeCompliant && (
            <div className={styles.warning}>
              <strong>Warning:</strong> These dimensions may not meet building codes. Adjust total rise measurement
              or consult local building department for variance requirements.
            </div>
          )}
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
