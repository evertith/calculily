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

export default function PaintCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [doors, setDoors] = useState<string>('1');
  const [windows, setWindows] = useState<string>('2');
  const [coats, setCoats] = useState<string>('2');
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [ceilingCoats, setCeilingCoats] = useState<string>('1');
  const [coverage, setCoverage] = useState<string>('350');
  const [pricePerGallon, setPricePerGallon] = useState<string>('35');
  const [needPrimer, setNeedPrimer] = useState<boolean>(false);

  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculatePaintForWalls = (
    len: number,
    wid: number,
    hgt: number,
    numDoors: number,
    numWindows: number,
    numCoats: number,
    cov: number
  ) => {
    const wallArea = 2 * (len * hgt) + 2 * (wid * hgt);
    const doorArea = numDoors * 20;
    const windowArea = numWindows * 15;
    const paintableArea = wallArea - doorArea - windowArea;
    const gallonsPerCoat = paintableArea / cov;
    const totalGallons = gallonsPerCoat * numCoats;

    return {
      paintableArea: paintableArea.toFixed(0),
      gallonsNeeded: totalGallons,
      quartsNeeded: Math.ceil(totalGallons * 4)
    };
  };

  const calculatePaintForCeiling = (len: number, wid: number, numCoats: number, cov: number) => {
    const ceilingArea = len * wid;
    const gallons = (ceilingArea / cov) * numCoats;

    return {
      ceilingArea: ceilingArea.toFixed(0),
      gallonsNeeded: gallons
    };
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    if (!length || parseFloat(length) <= 0) newErrors.push('Please enter a valid room length');
    if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid room width');
    if (!height || parseFloat(height) <= 0) newErrors.push('Please enter a valid wall height');
    if (!doors || parseFloat(doors) < 0) newErrors.push('Please enter a valid number of doors');
    if (!windows || parseFloat(windows) < 0) newErrors.push('Please enter a valid number of windows');
    if (!coats || parseFloat(coats) <= 0) newErrors.push('Please enter a valid number of coats');
    if (!coverage || parseFloat(coverage) <= 0) newErrors.push('Please enter a valid coverage rate');
    if (!pricePerGallon || parseFloat(pricePerGallon) < 0) newErrors.push('Please enter a valid price');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const wallPaint = calculatePaintForWalls(
      parseFloat(length),
      parseFloat(width),
      parseFloat(height),
      parseFloat(doors),
      parseFloat(windows),
      parseFloat(coats),
      parseFloat(coverage)
    );

    let ceilingPaint = null;
    if (includeCeiling) {
      ceilingPaint = calculatePaintForCeiling(
        parseFloat(length),
        parseFloat(width),
        parseFloat(ceilingCoats),
        parseFloat(coverage)
      );
    }

    const totalGallons = wallPaint.gallonsNeeded + (ceilingPaint ? ceilingPaint.gallonsNeeded : 0);
    const totalGallonsRounded = Math.ceil(totalGallons);
    const totalQuarts = Math.ceil(totalGallons * 4);
    const totalCost = totalGallonsRounded * parseFloat(pricePerGallon);

    let primerGallons = 0;
    if (needPrimer) {
      const totalArea = parseFloat(wallPaint.paintableArea) + (ceilingPaint ? parseFloat(ceilingPaint.ceilingArea) : 0);
      primerGallons = Math.ceil(totalArea / 300);
    }

    setResults({
      wallArea: wallPaint.paintableArea,
      wallGallons: wallPaint.gallonsNeeded.toFixed(2),
      ceilingArea: ceilingPaint ? ceilingPaint.ceilingArea : null,
      ceilingGallons: ceilingPaint ? ceilingPaint.gallonsNeeded.toFixed(2) : null,
      totalGallons: totalGallons.toFixed(2),
      totalGallonsRounded,
      totalQuarts,
      totalCost: totalCost.toFixed(2),
      primerGallons: needPrimer ? primerGallons : null,
      coats: parseInt(coats)
    });

    trackCalculatorUsage('Paint Calculator', {
      wallArea: wallPaint.paintableArea,
      includeCeiling: includeCeiling.toString(),
      totalGallons: totalGallons.toFixed(2)
    });
  };

  const faqItems = [
    {
      question: 'How much area does a gallon of paint cover?',
      answer: 'Most paints cover approximately 350-400 square feet per gallon. However, coverage varies based on surface texture, paint quality, and application method. Rough or porous surfaces may require more paint.'
    },
    {
      question: 'How many coats of paint should I apply?',
      answer: 'Two coats are standard for most painting projects. The first coat provides coverage, and the second ensures even color and durability. Dark colors over light (or vice versa) may require a third coat or primer.'
    },
    {
      question: 'Do I need to deduct doors and windows?',
      answer: 'Yes, deducting doors and windows gives a more accurate estimate. A standard door is about 20 sq ft, and a window is about 15 sq ft. However, some painters skip this for extra paint as a buffer.'
    },
    {
      question: 'Should I use primer before painting?',
      answer: 'Use primer when painting over dark colors, covering stains, painting new drywall, or switching from oil to latex paint. Primer ensures better adhesion and color coverage, especially for dramatic color changes.'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate exactly how much paint you need to avoid multiple store trips or wasteful over-buying:",
      steps: [
        "Measure the height and width of each wall you plan to paint.",
        "Enter the room dimensions or total wall area in square feet.",
        "Subtract areas for windows and doors (or use our default estimates).",
        "Select whether you need one or two coats (two is recommended for most color changes).",
        "Click 'Calculate' to see gallons needed based on standard coverage of 350-400 sq ft per gallon."
      ]
    },
    whyMatters: {
      description: "Paint is sold by the gallon, and getting the quantity wrong is frustrating either way. Too little means a mid-project trip to the store and potential color matching issues with different batches. Too much means wasted money on paint that will eventually dry out. Proper calculation also helps you budget accurately - quality paint runs $30-70 per gallon, so errors add up quickly on larger projects.",
      benefits: [
        "Avoid mid-project store runs and color batch variations",
        "Save money by not over-buying paint that will go to waste",
        "Budget accurately before starting your painting project",
        "Account for multiple coats needed for dramatic color changes",
        "Plan primer needs separately from finish coat requirements"
      ]
    },
    examples: [
      {
        title: "Standard Bedroom",
        scenario: "12' x 14' room with 8' ceilings, one door, two windows. Two coats of new color.",
        calculation: "Wall area: 416 sq ft - 37 sq ft (openings) = 379 sq ft | × 2 coats = 758 sq ft",
        result: "Need 2 gallons (each covers 350-400 sq ft). Buy 2 gallons with a little left for touch-ups."
      },
      {
        title: "Living Room",
        scenario: "18' x 20' great room with 10' ceilings, multiple windows. One coat refresh.",
        calculation: "Wall area: 760 sq ft - 80 sq ft (openings) = 680 sq ft | One coat",
        result: "Need 2 gallons minimum. Buy 2 gallons for coverage, third gallon if walls are textured."
      },
      {
        title: "Accent Wall",
        scenario: "Single 14' wide × 9' tall accent wall, dark color over light.",
        calculation: "126 sq ft × 2 coats = 252 sq ft",
        result: "One gallon is sufficient with paint left over for future touch-ups."
      }
    ],
    commonMistakes: [
      "Forgetting that two coats are usually needed - especially for color changes or covering dark colors.",
      "Not accounting for textured walls - they can require 20-30% more paint than smooth surfaces.",
      "Using ceiling paint coverage rates for walls - ceiling paint is thinner and covers more area.",
      "Forgetting primer when needed - dramatic color changes or new drywall need separate primer.",
      "Not keeping some extra paint for touch-ups - buy a quart extra for future repairs."
    ]
  };

  const relatedCalculators = [
    {
      title: "Drywall Calculator",
      link: "/calculators/drywall",
      description: "Calculate drywall sheets and materials"
    },
    {
      title: "Deck Calculator",
      link: "/calculators/deck",
      description: "Estimate deck materials and costs"
    },
    {
      title: "Concrete Calculator",
      link: "/calculators/concrete",
      description: "Calculate concrete for your project"
    }
  ];

  return (
    <CalculatorLayout
      title="Paint Calculator"
      description="Calculate how many gallons of paint you need for walls and rooms. Enter dimensions to estimate coverage with adjustments for doors, windows, and multiple coats."
    >
      <CalculatorSchema
        name="Paint Calculator"
        description="Free paint calculator to estimate gallons needed for your project. Calculate wall coverage, account for doors and windows, and plan for multiple coats."
        url="/calculators/paint"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Room Length (feet)</label>
          <input
            type="number"
            className={styles.input}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="e.g., 12"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Room Width (feet)</label>
          <input
            type="number"
            className={styles.input}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g., 10"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Wall Height (feet)</label>
          <input
            type="number"
            className={styles.input}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g., 8"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Number of Doors</label>
          <input
            type="number"
            className={styles.input}
            value={doors}
            onChange={(e) => setDoors(e.target.value)}
            placeholder="e.g., 1"
            step="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Number of Windows</label>
          <input
            type="number"
            className={styles.input}
            value={windows}
            onChange={(e) => setWindows(e.target.value)}
            placeholder="e.g., 2"
            step="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Number of Coats (walls)</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${coats === '1' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCoats('1')}
            >
              1 Coat
            </button>
            <button
              className={`${styles.buttonOption} ${coats === '2' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCoats('2')}
            >
              2 Coats
            </button>
            <button
              className={`${styles.buttonOption} ${coats === '3' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCoats('3')}
            >
              3 Coats
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={includeCeiling}
              onChange={(e) => setIncludeCeiling(e.target.checked)}
              style={{ width: 'auto' }}
            />
            Include Ceiling
          </label>
        </div>

        {includeCeiling && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Ceiling Coats</label>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.buttonOption} ${ceilingCoats === '1' ? styles.buttonOptionActive : ''}`}
                onClick={() => setCeilingCoats('1')}
              >
                1 Coat
              </button>
              <button
                className={`${styles.buttonOption} ${ceilingCoats === '2' ? styles.buttonOptionActive : ''}`}
                onClick={() => setCeilingCoats('2')}
              >
                2 Coats
              </button>
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Paint Coverage (sq ft per gallon)</label>
          <input
            type="number"
            className={styles.input}
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            placeholder="e.g., 350"
            step="10"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={needPrimer}
              onChange={(e) => setNeedPrimer(e.target.checked)}
              style={{ width: 'auto' }}
            />
            Need Primer?
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Gallon ($)</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerGallon}
            onChange={(e) => setPricePerGallon(e.target.value)}
            placeholder="e.g., 35"
            step="1"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Paint Needed
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Paint Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Wall Area</span>
            <span className={styles.resultValue}>{results.wallArea} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Paint for Walls ({results.coats} coats)</span>
            <span className={styles.resultValue}>{results.wallGallons} gallons</span>
          </div>

          {results.ceilingArea && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Ceiling Area</span>
                <span className={styles.resultValue}>{results.ceilingArea} sq ft</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Paint for Ceiling</span>
                <span className={styles.resultValue}>{results.ceilingGallons} gallons</span>
              </div>
            </>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Paint Needed</span>
            <span className={styles.resultValuePrimary}>{results.totalGallonsRounded} gallons</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Or in Quarts</span>
            <span className={styles.resultValue}>{results.totalQuarts} quarts</span>
          </div>

          {results.primerGallons !== null && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Primer Needed</span>
              <span className={styles.resultValue}>{results.primerGallons} gallons</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Estimated Cost (paint only)</span>
            <span className={styles.resultValue}>${results.totalCost}</span>
          </div>

          <div className={styles.note}>
            <strong>Tip:</strong> Buy paint in gallons rather than quarts for better value. One gallon = four quarts.
            For small touch-up jobs under 1 gallon, quarts are more practical. Always buy all the paint you need at once
            to ensure color consistency between batches.
          </div>

          {parseFloat(results.totalGallons) < 1 && (
            <div className={styles.note}>
              <strong>Small Project:</strong> For projects requiring less than 1 gallon, consider buying quarts.
              You need approximately {results.totalQuarts} quarts for this project.
            </div>
          )}

          {results.primerGallons && (
            <div className={styles.note}>
              <strong>Primer Note:</strong> Primer typically covers about 300 sq ft per gallon (less than finish paint).
              Apply primer before your finish coats for best results, especially on new surfaces or dramatic color changes.
            </div>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('paint', 3)}
        calculatorName="Paint Calculator"
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
