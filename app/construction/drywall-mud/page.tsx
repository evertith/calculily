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

type InputType = 'sheets' | 'sqft';

export default function DrywallMudCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('sqft');
  const [squareFootage, setSquareFootage] = useState<string>('');
  const [numSheets4x8, setNumSheets4x8] = useState<string>('');
  const [numSheets4x12, setNumSheets4x12] = useState<string>('');
  const [finishLevel, setFinishLevel] = useState<string>('4');
  const [jointType, setJointType] = useState<string>('paper');
  const [includeCornerBead, setIncludeCornerBead] = useState<boolean>(true);
  const [cornerBeadFeet, setCornerBeadFeet] = useState<string>('');
  const [mudPrice, setMudPrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let totalSqFt = 0;
    let totalJointFeet = 0;

    if (inputType === 'sqft') {
      const sqFt = parseFloat(squareFootage);
      if (isNaN(sqFt) || sqFt <= 0) {
        newErrors.push('Please enter a valid square footage');
      } else {
        totalSqFt = sqFt;
        // Estimate joint linear feet: approximately 1 LF of joint per 3 sq ft
        totalJointFeet = sqFt / 3;
      }
    } else {
      const sheets4x8 = parseInt(numSheets4x8) || 0;
      const sheets4x12 = parseInt(numSheets4x12) || 0;

      if (sheets4x8 === 0 && sheets4x12 === 0) {
        newErrors.push('Please enter the number of drywall sheets');
      } else {
        totalSqFt = sheets4x8 * 32 + sheets4x12 * 48;
        // 4x8 has approximately 20 LF of joints, 4x12 has approximately 28 LF
        totalJointFeet = sheets4x8 * 20 + sheets4x12 * 28;
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const level = parseInt(finishLevel);
    const cornerBead = parseFloat(cornerBeadFeet) || 0;

    // Joint compound usage varies by finish level
    // Level 3: Tape + 2 coats at joints only
    // Level 4: Tape + 3 coats, light skim at fasteners (most common)
    // Level 5: Full skim coat over entire surface

    const mudMultipliers: Record<string, number> = {
      '3': 0.055, // gallons per sq ft
      '4': 0.07,
      '5': 0.12
    };

    const mudMultiplier = mudMultipliers[finishLevel] || 0.07;
    const baseMudGallons = totalSqFt * mudMultiplier;

    // Add extra for corner bead (more mud needed)
    const cornerBeadMud = cornerBead * 0.015; // gallons per LF

    const totalMudGallons = baseMudGallons + cornerBeadMud;

    // Convert to common container sizes
    const gallonsNeeded = Math.ceil(totalMudGallons);
    const buckets5Gal = Math.ceil(totalMudGallons / 4.5); // Pre-mixed is ~4.5 gal per bucket
    const boxes3_5Gal = Math.ceil(totalMudGallons / 3.5); // Standard box size

    // Tape calculation
    // Paper tape: approximately 500 ft per roll
    // Mesh tape: approximately 300 ft per roll
    const tapePerRoll = jointType === 'paper' ? 500 : 300;
    const tapeFeetNeeded = totalJointFeet + cornerBead;
    const tapeRolls = Math.ceil(tapeFeetNeeded / tapePerRoll);

    // Corner bead quantity
    const cornerBeadPieces = cornerBead > 0 ? Math.ceil(cornerBead / 8) : 0; // 8 ft pieces

    // Drywall screws (approximately 32 per 4x8 sheet)
    const screwsNeeded = Math.ceil(totalSqFt / 32 * 32);
    const screwBoxes = Math.ceil(screwsNeeded / 1000); // 1000 per box

    // Primer coverage
    const primerGallons = Math.ceil(totalSqFt / 300); // ~300 sq ft per gallon

    // Cost calculations
    const price = parseFloat(mudPrice) || 0;
    const mudCost = price > 0 ? buckets5Gal * price : null;
    const tapeCost = tapeRolls * 8; // ~$8 per roll
    const cornerBeadCost = cornerBeadPieces * 4; // ~$4 per piece
    const totalCost = mudCost ? mudCost + tapeCost + cornerBeadCost : null;

    setResults({
      totalSqFt,
      totalJointFeet: totalJointFeet.toFixed(0),
      finishLevel: level,
      jointType,
      totalMudGallons: totalMudGallons.toFixed(1),
      gallonsNeeded,
      buckets5Gal,
      boxes3_5Gal,
      tapeFeetNeeded: tapeFeetNeeded.toFixed(0),
      tapeRolls,
      cornerBeadPieces,
      screwsNeeded,
      screwBoxes,
      primerGallons,
      mudCost: mudCost ? mudCost.toFixed(2) : null,
      tapeCost: tapeCost.toFixed(2),
      cornerBeadCost: cornerBeadCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Drywall Mud Calculator', {
      inputType,
      totalSqFt: totalSqFt.toString(),
      finishLevel: level.toString(),
      mudGallons: totalMudGallons.toFixed(1)
    });
  };

  const faqItems = [
    {
      question: 'How much joint compound do I need per sheet of drywall?',
      answer: 'Plan for approximately 0.07 gallons (about 1 quart) of joint compound per square foot for Level 4 finish. A 4x8 sheet needs roughly 2.5 gallons. Level 5 finish requires nearly double this amount due to full skim coating.'
    },
    {
      question: 'What is the difference between drywall finish levels?',
      answer: 'Level 3 is tape and two coats at joints, suitable for areas receiving heavy texture. Level 4 adds a third coat and is the most common for painted surfaces. Level 5 includes a full skim coat for critical lighting or high-gloss paint applications.'
    },
    {
      question: 'Should I use paper or mesh tape?',
      answer: 'Paper tape is stronger at corners and factory seams, preferred by most professionals. Mesh tape is easier for beginners and works well with setting-type compound. Paper tape requires embedding in mud; mesh is self-adhesive.'
    },
    {
      question: 'How many coats of joint compound do I need?',
      answer: 'Most applications require 3 coats: a tape coat, a fill coat, and a finish coat. Each coat should be progressively wider (4", 8", 12") and sanded smooth between coats. Level 5 finish adds a skim coat over the entire surface.'
    },
    {
      question: 'What is the difference between all-purpose and setting compound?',
      answer: 'All-purpose (pre-mixed) is convenient and has long working time. Setting compound (hot mud) hardens chemically rather than by drying, allowing faster recoat times (20-90 minutes). Many pros use setting compound for tape coat and all-purpose for finish coats.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Drywall Calculator',
      link: '/calculators/drywall',
      description: 'Calculate drywall sheets needed'
    },
    {
      title: 'Paint Calculator',
      link: '/calculators/paint',
      description: 'Calculate paint for walls and ceilings'
    },
    {
      title: 'Stud Calculator',
      link: '/construction/stud',
      description: 'Calculate wall framing materials'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Joint compound (mud) estimation depends on the square footage, finish level, and number of joints. This calculator helps you determine how much mud, tape, and accessories you need for your drywall project.",
      steps: [
        "Enter total drywall square footage or number of sheets.",
        "Select the finish level required (Level 4 is most common for residential).",
        "Choose tape type - paper for best results, mesh for easier application.",
        "Enter corner bead linear feet if you have outside corners.",
        "Review quantities and adjust for your specific conditions."
      ]
    },
    whyMatters: {
      description: "Running out of joint compound mid-project causes delays and can result in visible seams if different batches have slight color variations. Having adequate supplies ensures consistent application and proper drying time between coats. The finish level you choose dramatically affects both material quantities and final appearance.",
      benefits: [
        "Calculate joint compound by finish level",
        "Determine tape quantities for all joints",
        "Include corner bead requirements",
        "Plan for primer after finishing",
        "Budget for complete finishing supplies"
      ]
    },
    examples: [
      {
        title: "Single Room",
        scenario: "A 12x14 bedroom with 8-foot ceilings (walls only) using 14 sheets of 4x8.",
        calculation: "448 sq ft at Level 4 = 31 gallons of joint compound",
        result: "7 buckets (5 gal), 1 roll paper tape, 1 gallon primer."
      },
      {
        title: "Basement Finishing",
        scenario: "1,200 sq ft of drywall including walls and ceiling, Level 4 finish.",
        calculation: "1,200 sq ft x 0.07 gal/sq ft = 84 gallons",
        result: "19 buckets (5 gal), 3 rolls tape, 4 gallons primer."
      },
      {
        title: "High-End Level 5",
        scenario: "500 sq ft dining room requiring Level 5 for glossy paint.",
        calculation: "500 sq ft x 0.12 gal/sq ft = 60 gallons",
        result: "14 buckets (5 gal), full skim coat required over entire surface."
      }
    ],
    commonMistakes: [
      "Underestimating for higher finish levels - Level 5 uses nearly double Level 4 amounts.",
      "Forgetting about screw and nail holes - these add significantly to compound usage.",
      "Not planning for corner bead - outside corners require extra material.",
      "Skipping primer - drywall compound must be primed before paint.",
      "Using wrong compound type - don't use all-purpose for first coat on mesh tape."
    ]
  };

  return (
    <CalculatorLayout
      title="Drywall Mud Calculator"
      description="Calculate joint compound, tape, and accessories for drywall finishing. Includes finish level 3, 4, and 5 estimates."
    >
      <CalculatorSchema
        name="Drywall Mud Calculator"
        description="Free drywall mud calculator to estimate joint compound, tape, and finishing supplies by finish level."
        url="/construction/drywall-mud"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Input Method</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${inputType === 'sqft' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputType('sqft')}
            >
              Square Footage
            </button>
            <button
              className={`${styles.buttonOption} ${inputType === 'sheets' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputType('sheets')}
            >
              Number of Sheets
            </button>
          </div>
        </div>

        {inputType === 'sqft' ? (
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Drywall Square Footage</label>
            <input
              type="number"
              className={styles.input}
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value)}
              placeholder="e.g., 500"
              step="10"
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>4x8 Sheets</label>
              <input
                type="number"
                className={styles.input}
                value={numSheets4x8}
                onChange={(e) => setNumSheets4x8(e.target.value)}
                placeholder="e.g., 20"
                min="0"
                step="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>4x12 Sheets</label>
              <input
                type="number"
                className={styles.input}
                value={numSheets4x12}
                onChange={(e) => setNumSheets4x12(e.target.value)}
                placeholder="e.g., 10"
                min="0"
                step="1"
              />
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Finish Level</label>
          <select
            className={styles.select}
            value={finishLevel}
            onChange={(e) => setFinishLevel(e.target.value)}
          >
            <option value="3">Level 3 - Tape + 2 coats (for heavy texture)</option>
            <option value="4">Level 4 - Tape + 3 coats (standard paint finish)</option>
            <option value="5">Level 5 - Full skim coat (critical lighting/gloss paint)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Joint Tape Type</label>
          <select
            className={styles.select}
            value={jointType}
            onChange={(e) => setJointType(e.target.value)}
          >
            <option value="paper">Paper Tape (professional standard)</option>
            <option value="mesh">Mesh Tape (easier for beginners)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeCornerBead}
              onChange={(e) => setIncludeCornerBead(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Corner Bead
          </label>
        </div>

        {includeCornerBead && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Corner Bead Linear Feet</label>
            <input
              type="number"
              className={styles.input}
              value={cornerBeadFeet}
              onChange={(e) => setCornerBeadFeet(e.target.value)}
              placeholder="e.g., 40"
              step="1"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Measure all outside corners (wall corners, window/door returns)
            </small>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Joint Compound Price per 5-gal Bucket (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={mudPrice}
            onChange={(e) => setMudPrice(e.target.value)}
            placeholder="e.g., 18.00"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Materials
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Drywall Finishing Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Drywall Area</span>
            <span className={styles.resultValue}>{results.totalSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Finish Level</span>
            <span className={styles.resultValue}>Level {results.finishLevel}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Estimated Joint Length</span>
            <span className={styles.resultValue}>{results.totalJointFeet} linear feet</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Joint Compound</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Volume Needed</span>
            <span className={styles.resultValue}>{results.totalMudGallons} gallons</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>5-Gallon Buckets</span>
            <span className={styles.resultValuePrimary}>{results.buckets5Gal} buckets</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Or 3.5-Gallon Boxes</span>
            <span className={styles.resultValue}>{results.boxes3_5Gal} boxes</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Tape & Accessories</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tape Needed ({results.jointType === 'paper' ? 'Paper' : 'Mesh'})</span>
            <span className={styles.resultValue}>{results.tapeFeetNeeded} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tape Rolls</span>
            <span className={styles.resultValuePrimary}>{results.tapeRolls} rolls</span>
          </div>

          {results.cornerBeadPieces > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Corner Bead (8 ft pieces)</span>
              <span className={styles.resultValue}>{results.cornerBeadPieces} pieces</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Drywall Screws</span>
            <span className={styles.resultValue}>{results.screwsNeeded} ({results.screwBoxes} boxes of 1000)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Primer (after finishing)</span>
            <span className={styles.resultValue}>{results.primerGallons} gallons</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Joint Compound</span>
                <span className={styles.resultValue}>${results.mudCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Tape (~$8/roll)</span>
                <span className={styles.resultValue}>${results.tapeCost}</span>
              </div>

              {parseFloat(results.cornerBeadCost) > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Corner Bead (~$4/piece)</span>
                  <span className={styles.resultValue}>${results.cornerBeadCost}</span>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Finishing Materials</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Allow 24 hours between coats for all-purpose compound. Sand with 120-150 grit between coats. Always prime before painting, even with "paint and primer in one" products.
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
