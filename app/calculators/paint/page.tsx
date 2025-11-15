'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import styles from '@/styles/Calculator.module.css';

export default function PaintCalculator() {
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

  const relatedCalculators = [
    {
      title: 'Drywall Calculator',
      link: '/calculators/drywall',
      description: 'Calculate drywall sheets and materials'
    },
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for floors and slabs'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate framing and trim materials'
    }
  ];

  return (
    <CalculatorLayout
      title="Paint Calculator"
      description="Calculate how much paint you need for walls and ceilings based on room dimensions"
    >
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

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
