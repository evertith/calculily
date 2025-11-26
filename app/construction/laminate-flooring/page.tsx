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

type InputType = 'dimensions' | 'area';

export default function LaminateFlooringCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [totalArea, setTotalArea] = useState<string>('');
  const [plankWidth, setPlankWidth] = useState<string>('7.5');
  const [plankLength, setPlankLength] = useState<string>('48');
  const [sqFtPerBox, setSqFtPerBox] = useState<string>('20');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [includeUnderlayment, setIncludeUnderlayment] = useState<boolean>(true);
  const [pricePerBox, setPricePerBox] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const commonPlankSizes = [
    { label: '5 inch x 36 inch', width: '5', length: '36' },
    { label: '7.5 inch x 48 inch', width: '7.5', length: '48' },
    { label: '8 inch x 48 inch', width: '8', length: '48' },
    { label: '12 inch x 48 inch', width: '12', length: '48' }
  ];

  const handleCalculate = () => {
    const newErrors: string[] = [];
    let areaSqFt = 0;

    if (inputType === 'dimensions') {
      const l = parseFloat(length);
      const w = parseFloat(width);
      if (isNaN(l) || l <= 0) newErrors.push('Please enter a valid room length');
      if (isNaN(w) || w <= 0) newErrors.push('Please enter a valid room width');
      if (newErrors.length === 0) {
        areaSqFt = l * w;
      }
    } else {
      const area = parseFloat(totalArea);
      if (isNaN(area) || area <= 0) {
        newErrors.push('Please enter a valid total area');
      } else {
        areaSqFt = area;
      }
    }

    const boxSqFt = parseFloat(sqFtPerBox);
    if (isNaN(boxSqFt) || boxSqFt <= 0) {
      newErrors.push('Please enter valid square feet per box');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const waste = parseFloat(wasteFactor) || 10;
    const plankW = parseFloat(plankWidth);
    const plankL = parseFloat(plankLength);

    // Calculate with waste
    const areaWithWaste = areaSqFt * (1 + waste / 100);
    const totalSqFt = Math.ceil(areaWithWaste);

    // Boxes needed
    const boxesNeeded = Math.ceil(totalSqFt / boxSqFt);

    // Planks per box calculation
    const plankSqFt = (plankW * plankL) / 144;
    const planksPerBox = Math.round(boxSqFt / plankSqFt);
    const totalPlanks = boxesNeeded * planksPerBox;

    // Underlayment (rolls typically 100 sq ft)
    const underlaymentRolls = includeUnderlayment ? Math.ceil(totalSqFt / 100) : 0;

    // Transition strips and accessories
    const transitionStrips = Math.ceil(areaSqFt / 150);
    const baseboardFeet = Math.ceil(Math.sqrt(areaSqFt) * 4 * 1.1); // Perimeter estimate with waste

    // Cost calculation
    const price = parseFloat(pricePerBox) || 0;
    const flooringCost = price > 0 ? boxesNeeded * price : null;
    const underlaymentCost = includeUnderlayment ? underlaymentRolls * 30 : 0;
    const totalCost = flooringCost ? flooringCost + underlaymentCost : null;

    setResults({
      areaSqFt: areaSqFt.toFixed(1),
      areaWithWaste: totalSqFt,
      wasteFactor: waste,
      plankSize: `${plankW}" x ${plankL}"`,
      sqFtPerBox: boxSqFt,
      planksPerBox,
      boxesNeeded,
      totalPlanks,
      underlaymentRolls,
      transitionStrips,
      baseboardFeet,
      flooringCost: flooringCost ? flooringCost.toFixed(2) : null,
      underlaymentCost: underlaymentCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Laminate Flooring Calculator', {
      inputType,
      areaSqFt: areaSqFt.toFixed(1),
      boxesNeeded: boxesNeeded.toString()
    });
  };

  const faqItems = [
    {
      question: 'How many boxes of laminate flooring do I need?',
      answer: 'Divide your room square footage by the square feet per box (typically 20-25 sq ft), then add 10% for waste. Round up to the nearest whole box. Most boxes contain 8-10 planks.'
    },
    {
      question: 'What is the best direction to lay laminate flooring?',
      answer: 'Install planks parallel to the longest wall or main light source for the best visual effect. In hallways, planks should run lengthwise. Consider the transitions between rooms when planning direction.'
    },
    {
      question: 'Do I need underlayment for laminate flooring?',
      answer: 'Yes, underlayment is essential for laminate floors. It provides sound absorption, moisture protection, and helps smooth minor subfloor imperfections. Some laminate has underlayment pre-attached.'
    },
    {
      question: 'How thick should laminate flooring be?',
      answer: 'Standard laminate is 7-8mm thick, which works for most residential applications. Premium 10-12mm laminate feels more solid underfoot, provides better sound insulation, and typically has longer warranties.'
    },
    {
      question: 'Can laminate flooring be installed over tile?',
      answer: 'Yes, laminate can be installed over tile if the tile is flat, firmly attached, and free of cracks. You still need underlayment. Remove grout lines by applying self-leveling compound if needed.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Hardwood Flooring Calculator',
      link: '/construction/hardwood-flooring',
      description: 'Calculate hardwood flooring materials'
    },
    {
      title: 'Tile Calculator',
      link: '/construction/tile',
      description: 'Calculate tiles, grout, and thinset'
    },
    {
      title: 'Carpet Calculator',
      link: '/construction/carpet',
      description: 'Calculate carpet and padding needed'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Laminate flooring is sold in boxes, and calculating the right quantity prevents both shortages and excess inventory. Here's how to estimate accurately:",
      steps: [
        "Measure your room length and width in feet. For irregular rooms, divide into rectangles and sum the areas.",
        "Enter the square feet per box from the product packaging (typically 20-25 sq ft).",
        "Select your plank size to help estimate the number of planks included.",
        "Choose waste factor: 10% for rectangular rooms, 15% for complex layouts.",
        "Check if you need underlayment (required unless pre-attached to planks)."
      ]
    },
    whyMatters: {
      description: "Laminate flooring offers excellent value with the look of hardwood at a fraction of the cost. Accurate material estimates ensure you buy enough from the same lot to maintain color consistency, while avoiding wasteful overpurchasing. Most stores allow returns of unopened boxes, but color matching later can be problematic.",
      benefits: [
        "Calculate exact boxes needed with waste allowance",
        "Know plank quantities for planning cuts",
        "Include underlayment for floating installations",
        "Estimate transition strips and baseboards",
        "Budget accurately with total cost estimates"
      ]
    },
    examples: [
      {
        title: "Standard Bedroom",
        scenario: "A 12' x 14' bedroom using boxes with 20 sq ft each and 10% waste.",
        calculation: "168 sq ft + 10% waste = 185 sq ft / 20 sq ft per box = 9.25 boxes",
        result: "Order 10 boxes of laminate flooring."
      },
      {
        title: "Open Concept Living Area",
        scenario: "A 25' x 30' combined living/dining area with 15% waste for diagonal pattern.",
        calculation: "750 sq ft + 15% waste = 863 sq ft / 24 sq ft per box = 36 boxes",
        result: "Order 36 boxes plus 9 rolls of underlayment."
      },
      {
        title: "Multiple Room Installation",
        scenario: "Three bedrooms: 10x12, 11x13, and 12x14 with standard 10% waste.",
        calculation: "(120 + 143 + 168) = 431 sq ft + 10% = 475 sq ft / 20 = 24 boxes",
        result: "Order 24 boxes and 5 rolls of underlayment."
      }
    ],
    commonMistakes: [
      "Not checking square feet per box - this varies significantly between brands and products.",
      "Forgetting underlayment - it's required for floating laminate installations.",
      "Underestimating waste - complex room shapes and diagonal patterns need more material.",
      "Not acclimating planks - leave boxes in the room for 48 hours before installation.",
      "Ignoring expansion gaps - laminate needs 1/4 to 3/8 inch gap around all walls."
    ]
  };

  return (
    <CalculatorLayout
      title="Laminate Flooring Calculator"
      description="Calculate how many boxes of laminate flooring you need, plus underlayment and accessories. Includes waste factors and costs."
    >
      <CalculatorSchema
        name="Laminate Flooring Calculator"
        description="Free laminate flooring calculator to estimate boxes needed, underlayment, and total cost with waste factors."
        url="/construction/laminate-flooring"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Input Method</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${inputType === 'dimensions' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputType('dimensions')}
            >
              Room Dimensions
            </button>
            <button
              className={`${styles.buttonOption} ${inputType === 'area' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputType('area')}
            >
              Total Square Feet
            </button>
          </div>
        </div>

        {inputType === 'dimensions' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Room Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 15"
                step="0.1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Room Width (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g., 12"
                step="0.1"
              />
            </div>
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Area (square feet)</label>
            <input
              type="number"
              className={styles.input}
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="e.g., 250"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Common Plank Sizes</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {commonPlankSizes.map((size) => (
              <button
                key={size.label}
                className={styles.buttonOption}
                onClick={() => { setPlankWidth(size.width); setPlankLength(size.length); }}
                style={{
                  backgroundColor: plankWidth === size.width && plankLength === size.length ? '#4a9eff' : '#1a1a1a',
                  color: plankWidth === size.width && plankLength === size.length ? 'white' : '#e0e0e0',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem'
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Plank Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={plankWidth}
              onChange={(e) => setPlankWidth(e.target.value)}
              placeholder="e.g., 7.5"
              step="0.5"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Plank Length (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={plankLength}
              onChange={(e) => setPlankLength(e.target.value)}
              placeholder="e.g., 48"
              step="1"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Square Feet per Box</label>
          <input
            type="number"
            className={styles.input}
            value={sqFtPerBox}
            onChange={(e) => setSqFtPerBox(e.target.value)}
            placeholder="Check product packaging"
            step="0.1"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            Found on the product box (typically 18-25 sq ft)
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor</label>
          <select
            className={styles.select}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
          >
            <option value="10">10% - Rectangular room, straight layout</option>
            <option value="15">15% - Irregular room or diagonal layout</option>
            <option value="20">20% - Complex room or first-time installer</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeUnderlayment}
              onChange={(e) => setIncludeUnderlayment(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Underlayment (skip if planks have it pre-attached)
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Box (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerBox}
            onChange={(e) => setPricePerBox(e.target.value)}
            placeholder="e.g., 35.99"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Flooring
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Laminate Flooring Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Floor Area</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With {results.wasteFactor}% Waste</span>
            <span className={styles.resultValue}>{results.areaWithWaste} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Plank Size</span>
            <span className={styles.resultValue}>{results.plankSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Boxes Needed ({results.sqFtPerBox} sq ft/box)</span>
            <span className={styles.resultValuePrimary}>{results.boxesNeeded} boxes</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Planks (~{results.planksPerBox}/box)</span>
            <span className={styles.resultValue}>{results.totalPlanks} planks</span>
          </div>

          {results.underlaymentRolls > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Underlayment Rolls (100 sq ft each)</span>
              <span className={styles.resultValue}>{results.underlaymentRolls} rolls</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Transition Strips (estimated)</span>
            <span className={styles.resultValue}>{results.transitionStrips} strips</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Laminate Flooring</span>
                <span className={styles.resultValue}>${results.flooringCost}</span>
              </div>

              {results.underlaymentRolls > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Underlayment (~$30/roll)</span>
                  <span className={styles.resultValue}>${results.underlaymentCost}</span>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Material Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Installation Tips:</strong> Let planks acclimate 48 hours before installation. Leave 1/4 inch expansion gap around walls. Start installation from the straightest, most visible wall.
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
