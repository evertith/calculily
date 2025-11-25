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
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

export default function DrywallCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [sheetSize, setSheetSize] = useState<string>('4x8');
  const [wasteFactor, setWasteFactor] = useState<string>('15');
  const [result, setResult] = useState<{
    wallArea: number;
    ceilingArea: number;
    totalArea: number;
    sheetsForWalls: number;
    sheetsForCeiling: number;
    totalSheets: number;
    sheetsWithWaste: number;
    jointCompound: number;
    tapeLinearFeet: number;
    tapeRolls: number;
    screwsPounds: number;
    estimatedCost: number;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const faqItems = [
    {
      question: "Should I use 4x8 or 4x12 drywall sheets?",
      answer: "For standard 8-foot ceilings, 4x8 sheets are most common and easier to handle. For 9 or 10-foot ceilings, 4x12 sheets reduce seams and can save time, but they're heavier and harder to work with. Consider using 4x12 horizontally on walls to minimize butt joints. If working alone, stick with 4x8 sheets."
    },
    {
      question: "How much joint compound do I need?",
      answer: "Plan on about 1 gallon of joint compound (mud) per 8-10 sheets of drywall for three coats. This covers taping, filling screw holes, and finishing. First-timers should get extra. A 4.5-gallon bucket covers about 40-50 sheets. Pre-mixed compound is easier for DIYers than powder."
    },
    {
      question: "What thickness drywall should I use?",
      answer: "1/2 inch is standard for walls and ceilings with 16-inch on-center framing. Use 5/8 inch for ceilings with 24-inch on-center joists, fire-rated walls, or better soundproofing. 1/4 inch is for covering existing walls. Use moisture-resistant (green board) or cement board in bathrooms."
    },
    {
      question: "How do I calculate waste factor?",
      answer: "A 15% waste factor is standard for rooms with average complexity. Add more for rooms with lots of windows, doors, or angles (20-25%). Waste accounts for cuts, damaged pieces, and odd-shaped areas. It's better to have extra than to run short mid-project."
    }
  ];

  const relatedCalculators = [
    {
      title: "Paint Calculator",
      link: "/calculators/paint",
      description: "Calculate paint needed for walls"
    },
    {
      title: "Insulation Calculator",
      link: "/calculators/insulation",
      description: "Calculate insulation requirements"
    },
    {
      title: "Lumber Calculator",
      link: "/calculators/lumber",
      description: "Estimate framing materials"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Estimate drywall materials accurately for your renovation or new construction project:",
      steps: [
        "Measure the total wall and ceiling area in square feet.",
        "Select the drywall sheet size you plan to use (4'×8' is most common).",
        "Add a waste factor (10-15% for standard rooms, more for complex layouts).",
        "Click 'Calculate' to see sheets needed, plus estimates for tape, mud, and screws."
      ]
    },
    whyMatters: {
      description: "Drywall comes in large, heavy sheets that are a pain to return, so accurate ordering matters. You need enough sheets plus materials like joint compound (mud), tape, and screws. Running short mid-project is frustrating, but over-ordering means storing or disposing of bulky materials. Getting it right the first time saves money and multiple trips to the store.",
      benefits: [
        "Order the right number of sheets to avoid shortages or waste",
        "Calculate all associated materials (tape, mud, screws) together",
        "Plan for proper waste factor based on room complexity",
        "Estimate costs before starting your project",
        "Compare costs between different sheet sizes"
      ]
    },
    examples: [
      {
        title: "Single Room Addition",
        scenario: "12' × 14' room with 8' ceilings. Walls and ceiling need drywall.",
        calculation: "Walls: 416 sq ft + Ceiling: 168 sq ft = 584 sq ft | 584 ÷ 32 (4'×8' sheet) = 18.25 sheets",
        result: "Order 21 sheets (4'×8') to allow for waste and cuts around openings."
      },
      {
        title: "Basement Finishing",
        scenario: "600 sq ft basement, walls only (existing ceiling), some columns and angles.",
        calculation: "600 sq ft ÷ 32 = 18.75 sheets + 15% waste for complex layout",
        result: "Order 22 sheets plus extra mud and tape for multiple joints and corners."
      },
      {
        title: "Garage Conversion",
        scenario: "20' × 20' garage, 9' ceilings, walls and ceiling. Using 4'×12' sheets for fewer joints.",
        calculation: "Walls: 720 sq ft + Ceiling: 400 sq ft = 1,120 sq ft ÷ 48 (4'×12') = 23.3 sheets",
        result: "Order 27 sheets (4'×12') plus appropriate joint compound and tape."
      }
    ],
    commonMistakes: [
      "Not adding waste factor - cuts around windows, doors, and outlets create unusable pieces.",
      "Forgetting about ceiling drywall if applicable - it adds significantly to material needs.",
      "Using wrong sheet size for the space - 12' sheets mean fewer joints but are harder to handle.",
      "Underestimating joint compound needs - you'll need more than you think, especially for beginners.",
      "Not ordering corner bead for outside corners - an easily forgotten but essential material."
    ]
  };

  const calculateDrywall = () => {
    const len = parseFloat(length);
    const wid = parseFloat(width);
    const hgt = parseFloat(height);
    const waste = parseFloat(wasteFactor);

    const newErrors: string[] = [];

    if (!length || len <= 0) {
      newErrors.push("Please enter a valid room length");
    }
    if (!width || wid <= 0) {
      newErrors.push("Please enter a valid room width");
    }
    if (!height || hgt <= 0) {
      newErrors.push("Please enter a valid wall height");
    }
    if (waste < 0 || waste > 50) {
      newErrors.push("Waste factor should be between 0% and 50%");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    // Get sheet dimensions
    const [sheetWidth, sheetHeight] = sheetSize.split('x').map(s => parseFloat(s));
    const sheetArea = sheetWidth * sheetHeight;

    // Calculate wall area
    const wallArea = 2 * (len * hgt) + 2 * (wid * hgt);
    const sheetsForWalls = Math.ceil(wallArea / sheetArea);

    // Calculate ceiling area if included
    const ceilingArea = includeCeiling ? len * wid : 0;
    const sheetsForCeiling = includeCeiling ? Math.ceil(ceilingArea / sheetArea) : 0;

    // Total sheets
    const totalArea = wallArea + ceilingArea;
    const totalSheets = sheetsForWalls + sheetsForCeiling;
    const sheetsWithWaste = Math.ceil(totalSheets * (1 + waste / 100));

    // Joint compound - approximately 1 gallon per 9 sheets
    const jointCompound = Math.ceil(sheetsWithWaste / 9);

    // Drywall tape - estimate linear feet of joints
    const tapeLinearFeet = Math.ceil((len + wid) * 4 + (len * 2) + (wid * 2));
    const tapeRolls = Math.ceil(tapeLinearFeet / 250); // 250 ft per roll

    // Screws - approximately 1 lb per 5 sheets
    const screwsPounds = Math.ceil(sheetsWithWaste / 5);

    // Estimated cost (rough estimate)
    const sheetCost = sheetsWithWaste * 12; // ~$12 per 4x8 sheet
    const mudCost = jointCompound * 15; // ~$15 per gallon
    const tapeCost = tapeRolls * 8; // ~$8 per roll
    const screwsCost = screwsPounds * 7; // ~$7 per lb
    const estimatedCost = sheetCost + mudCost + tapeCost + screwsCost;

    setResult({
      wallArea,
      ceilingArea,
      totalArea,
      sheetsForWalls,
      sheetsForCeiling,
      totalSheets,
      sheetsWithWaste,
      jointCompound,
      tapeLinearFeet,
      tapeRolls,
      screwsPounds,
      estimatedCost
    });

    trackCalculatorUsage('Drywall Calculator', {
      totalArea: totalArea.toString(),
      sheetsWithWaste: sheetsWithWaste.toString(),
      includeCeiling: includeCeiling.toString()
    });
  };

  return (
    <CalculatorLayout
      title="Drywall Calculator"
      description="Calculate drywall sheets, joint compound, tape, and screws needed for your project. Enter square footage to estimate all materials with waste factor."
    >
      <CalculatorSchema
        name="Drywall Calculator"
        description="Free drywall calculator to estimate sheets, tape, mud, and screws needed. Calculate materials for walls and ceilings with waste factor included."
        url="/calculators/drywall"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateDrywall(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="length" className={styles.label}>
            Room Length (feet)
          </label>
          <input
            id="length"
            type="number"
            className={styles.input}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Enter room length"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="width" className={styles.label}>
            Room Width (feet)
          </label>
          <input
            id="width"
            type="number"
            className={styles.input}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Enter room width"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="height" className={styles.label}>
            Wall Height (feet)
          </label>
          <input
            id="height"
            type="number"
            className={styles.input}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter wall height"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeCeiling}
              onChange={(e) => setIncludeCeiling(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Include Ceiling
          </label>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sheetSize" className={styles.label}>
            Sheet Size
          </label>
          <select
            id="sheetSize"
            className={styles.select}
            value={sheetSize}
            onChange={(e) => setSheetSize(e.target.value)}
          >
            <option value="4x8">4' × 8' (32 sq ft)</option>
            <option value="4x10">4' × 10' (40 sq ft)</option>
            <option value="4x12">4' × 12' (48 sq ft)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="wasteFactor" className={styles.label}>
            Waste Factor (%)
          </label>
          <input
            id="wasteFactor"
            type="number"
            className={styles.input}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
            placeholder="Enter waste factor"
            step="1"
            min="0"
            max="50"
          />
        </div>

        <button type="submit" className={styles.button}>
          Calculate Drywall
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
            <span className={styles.resultLabel}>Total Drywall Sheets</span>
            <span className={styles.resultValuePrimary}>{result.sheetsWithWaste}</span>
          </div>

          <div className={styles.note}>
            <strong>Material Breakdown:</strong>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Wall Area</span>
            <span className={styles.resultValue}>{result.wallArea.toFixed(0)} sq ft</span>
          </div>
          {result.ceilingArea > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Ceiling Area</span>
              <span className={styles.resultValue}>{result.ceilingArea.toFixed(0)} sq ft</span>
            </div>
          )}
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Sheets for Walls</span>
            <span className={styles.resultValue}>{result.sheetsForWalls}</span>
          </div>
          {result.sheetsForCeiling > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Sheets for Ceiling</span>
              <span className={styles.resultValue}>{result.sheetsForCeiling}</span>
            </div>
          )}
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Sheets Before Waste</span>
            <span className={styles.resultValue}>{result.totalSheets}</span>
          </div>

          <div className={styles.note}>
            <strong>Additional Materials Needed:</strong>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joint Compound</span>
            <span className={styles.resultValue}>{result.jointCompound} gallon{result.jointCompound !== 1 ? 's' : ''}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Drywall Tape</span>
            <span className={styles.resultValue}>{result.tapeLinearFeet} ft ({result.tapeRolls} roll{result.tapeRolls !== 1 ? 's' : ''})</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Drywall Screws</span>
            <span className={styles.resultValue}>{result.screwsPounds} lb{result.screwsPounds !== 1 ? 's' : ''}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Estimated Total Cost</span>
            <span className={styles.resultValue}>${result.estimatedCost.toFixed(2)}</span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This calculation includes a {wasteFactor}% waste factor. Cost estimates are approximate and vary by location and material quality. Don't forget corner bead, primer, and tools!
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('concrete', 3)}
        calculatorName="Drywall Calculator"
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
