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

export default function TileCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [totalArea, setTotalArea] = useState<string>('');
  const [tileLength, setTileLength] = useState<string>('12');
  const [tileWidth, setTileWidth] = useState<string>('12');
  const [groutWidth, setGroutWidth] = useState<string>('0.125');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [tilePrice, setTilePrice] = useState<string>('');
  const [tilePriceUnit, setTilePriceUnit] = useState<'per_tile' | 'per_sqft' | 'per_box'>('per_sqft');
  const [tilesPerBox, setTilesPerBox] = useState<string>('10');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Common tile sizes
  const commonSizes = [
    { label: '12×12', length: '12', width: '12' },
    { label: '12×24', length: '12', width: '24' },
    { label: '18×18', length: '18', width: '18' },
    { label: '24×24', length: '24', width: '24' },
    { label: '6×6', length: '6', width: '6' },
    { label: '6×24', length: '6', width: '24' },
    { label: '4×12', length: '4', width: '12' },
    { label: '3×6', length: '3', width: '6' }
  ];

  const handleQuickSelect = (size: { length: string; width: string }) => {
    setTileLength(size.length);
    setTileWidth(size.width);
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let areaSqFt = 0;

    if (inputType === 'dimensions') {
      if (!length || parseFloat(length) <= 0) newErrors.push('Please enter a valid room length');
      if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid room width');
      if (newErrors.length === 0) {
        areaSqFt = parseFloat(length) * parseFloat(width);
      }
    } else {
      if (!totalArea || parseFloat(totalArea) <= 0) {
        newErrors.push('Please enter a valid total area');
      } else {
        areaSqFt = parseFloat(totalArea);
      }
    }

    if (!tileLength || parseFloat(tileLength) <= 0) newErrors.push('Please enter a valid tile length');
    if (!tileWidth || parseFloat(tileWidth) <= 0) newErrors.push('Please enter a valid tile width');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const tileLengthIn = parseFloat(tileLength);
    const tileWidthIn = parseFloat(tileWidth);
    const groutIn = parseFloat(groutWidth) || 0;
    const waste = parseFloat(wasteFactor) || 10;

    // Tile area in square inches (including grout on two sides)
    const tileWithGroutLength = tileLengthIn + groutIn;
    const tileWithGroutWidth = tileWidthIn + groutIn;
    const tileAreaSqIn = tileWithGroutLength * tileWithGroutWidth;
    const tileAreaSqFt = tileAreaSqIn / 144;

    // Number of tiles needed (without waste)
    const tilesNeeded = areaSqFt / tileAreaSqFt;

    // Add waste factor
    const tilesWithWaste = tilesNeeded * (1 + waste / 100);
    const totalTiles = Math.ceil(tilesWithWaste);

    // Calculate boxes needed
    const tilesBox = parseInt(tilesPerBox) || 10;
    const boxesNeeded = Math.ceil(totalTiles / tilesBox);

    // Square footage per tile (for coverage reference)
    const sqFtPerTile = (tileLengthIn * tileWidthIn) / 144;
    const sqFtPerBox = sqFtPerTile * tilesBox;

    // Grout calculation (approximate)
    // Formula: (L + W) * D * J / (L * W) * Area * 1.1
    // Where L = tile length, W = tile width, D = tile depth (assume 3/8"), J = joint width
    const tileDepth = 0.375; // Standard tile depth
    const groutCoverage = ((tileLengthIn + tileWidthIn) * tileDepth * groutIn) / (tileLengthIn * tileWidthIn);
    const groutSqFtPerLb = 8; // Approximate coverage
    const groutNeededLbs = (areaSqFt * groutCoverage * 1.1) * groutSqFtPerLb;
    const groutBags25lb = Math.ceil(groutNeededLbs / 25);

    // Thinset calculation (approximately 50 sq ft per 50lb bag)
    const thinsetBags = Math.ceil((areaSqFt * (1 + waste / 100)) / 50);

    // Cost calculation
    let totalCost = null;
    const price = parseFloat(tilePrice) || 0;

    if (price > 0) {
      if (tilePriceUnit === 'per_tile') {
        totalCost = totalTiles * price;
      } else if (tilePriceUnit === 'per_sqft') {
        totalCost = areaSqFt * (1 + waste / 100) * price;
      } else if (tilePriceUnit === 'per_box') {
        totalCost = boxesNeeded * price;
      }
    }

    setResults({
      areaSqFt: areaSqFt.toFixed(1),
      areaWithWaste: (areaSqFt * (1 + waste / 100)).toFixed(1),
      tileSize: `${tileLengthIn}" × ${tileWidthIn}"`,
      sqFtPerTile: sqFtPerTile.toFixed(3),
      sqFtPerBox: sqFtPerBox.toFixed(2),
      tilesNeeded: Math.ceil(tilesNeeded),
      totalTiles,
      boxesNeeded,
      tilesPerBox: tilesBox,
      wasteFactor: waste,
      groutBags25lb,
      thinsetBags,
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Tile Calculator', {
      inputType,
      areaSqFt: areaSqFt.toFixed(1),
      tileSize: `${tileLengthIn}x${tileWidthIn}`,
      totalTiles: totalTiles.toString()
    });
  };

  const faqItems = [
    {
      question: 'How much extra tile should I buy?',
      answer: 'Plan for 10% extra for straight layouts, 15% for diagonal patterns, and 20% for complex patterns or first-time DIYers. Keep extra tiles for future repairs - matching tiles can be difficult to find years later.'
    },
    {
      question: 'How do I calculate tile for walls?',
      answer: 'Measure wall height × width for each wall. Subtract the area of windows and doors. Add all wall areas together. Use the same waste factor as floor tile.'
    },
    {
      question: 'What grout width should I use?',
      answer: 'Standard is 1/8" (0.125") for most floor tiles. Large format tiles (18"+ ) often use 1/16" to 1/8". Subway tile traditionally uses 1/16". Check tile manufacturer recommendations.'
    },
    {
      question: 'How much thinset do I need?',
      answer: 'A 50-pound bag of thinset typically covers 50-75 square feet depending on trowel size and tile type. Large format tiles require more thinset due to back-buttering requirements.'
    },
    {
      question: 'Should I buy tiles from the same lot?',
      answer: 'Yes! Tiles from different production lots may have slight color variations. Always buy all tiles from the same lot number, plus extras. Check lot numbers on the boxes before purchasing.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Hardwood Flooring Calculator',
      link: '/construction/hardwood-flooring',
      description: 'Calculate hardwood flooring materials'
    },
    {
      title: 'Laminate Flooring Calculator',
      link: '/construction/laminate-flooring',
      description: 'Calculate laminate flooring and underlayment'
    },
    {
      title: 'Gravel Calculator',
      link: '/construction/gravel',
      description: 'Calculate gravel for base preparation'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Getting the right tile count prevents costly delays and ensures you have matching tiles for repairs. Here's how to calculate accurately:",
      steps: [
        "Measure your room dimensions in feet. For irregular rooms, break them into rectangles and add the areas.",
        "Select your tile size from common options or enter custom dimensions in inches.",
        "Enter your grout joint width (1/8\" is standard for most floor tiles).",
        "Adjust the waste factor: 10% for simple layouts, 15-20% for diagonal or complex patterns.",
        "Enter pricing to estimate total material cost."
      ]
    },
    whyMatters: {
      description: "Tile installation is a significant investment, and running short mid-project can be disastrous. Tiles from different production lots often have color variations, so it's essential to order enough from the same lot. Overestimating wastes money, but underestimating costs even more due to project delays and mismatched tiles.",
      benefits: [
        "Calculate exact tile quantities including waste for cuts",
        "Know how many boxes to order from the same lot",
        "Estimate grout and thinset requirements",
        "Budget accurately with cost estimates",
        "Keep spare tiles for future repairs"
      ]
    },
    examples: [
      {
        title: "Standard Bathroom Floor",
        scenario: "A 8' × 10' bathroom with 12×12 tiles and 10% waste factor.",
        calculation: "80 sq ft ÷ 1 sq ft/tile = 80 tiles + 10% waste = 88 tiles",
        result: "Order 9 boxes (10 tiles per box). Keep extras for repairs."
      },
      {
        title: "Large Kitchen with Diagonal Layout",
        scenario: "A 15' × 20' kitchen using 18×18 tiles laid diagonally.",
        calculation: "300 sq ft ÷ 2.25 sq ft/tile = 134 tiles + 15% waste = 154 tiles",
        result: "Order 16 boxes. Diagonal layouts create more cuts and waste."
      },
      {
        title: "Subway Tile Backsplash",
        scenario: "A 3' × 15' backsplash area using 3×6 subway tiles.",
        calculation: "45 sq ft ÷ 0.125 sq ft/tile = 360 tiles + 10% waste = 396 tiles",
        result: "Order 40 boxes (10 per box). Small tiles require many more pieces."
      }
    ],
    commonMistakes: [
      "Not buying all tiles from the same lot - color variations between lots can be noticeable.",
      "Underestimating waste factor - cuts, breakage, and defects all add up.",
      "Forgetting to subtract for cabinets but not adding back for cuts - you still need tiles for the cuts.",
      "Not keeping spare tiles - finding matching tiles years later for repairs is often impossible.",
      "Measuring in inches instead of feet - double-check your units before ordering."
    ]
  };

  return (
    <CalculatorLayout
      title="Tile Calculator"
      description="Calculate how many tiles, boxes, grout, and thinset you need for floors and walls. Includes waste factor and cost estimates."
    >
      <CalculatorSchema
        name="Tile Calculator"
        description="Free tile calculator to estimate tiles, grout, and thinset needed. Calculate by room dimensions or area with waste factors."
        url="/construction/tile"
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
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Room Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 12"
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
                placeholder="e.g., 10"
                step="0.1"
              />
            </div>
          </>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Area (square feet)</label>
            <input
              type="number"
              className={styles.input}
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="e.g., 120"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Common Tile Sizes</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {commonSizes.map((size) => (
              <button
                key={size.label}
                className={styles.buttonOption}
                onClick={() => handleQuickSelect(size)}
                style={{
                  backgroundColor: tileLength === size.length && tileWidth === size.width ? '#4a9eff' : '#1a1a1a',
                  color: tileLength === size.length && tileWidth === size.width ? 'white' : '#e0e0e0',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem'
                }}
              >
                {size.label}"
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tile Length (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={tileLength}
              onChange={(e) => setTileLength(e.target.value)}
              placeholder="e.g., 12"
              step="0.5"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tile Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={tileWidth}
              onChange={(e) => setTileWidth(e.target.value)}
              placeholder="e.g., 12"
              step="0.5"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Grout Joint Width (inches)</label>
          <select
            className={styles.select}
            value={groutWidth}
            onChange={(e) => setGroutWidth(e.target.value)}
          >
            <option value="0.0625">1/16" - Minimal joint</option>
            <option value="0.125">1/8" - Standard</option>
            <option value="0.1875">3/16" - Wide joint</option>
            <option value="0.25">1/4" - Extra wide</option>
            <option value="0.375">3/8" - Rustic look</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor (%)</label>
          <select
            className={styles.select}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
          >
            <option value="10">10% - Simple straight layout</option>
            <option value="15">15% - Diagonal or offset pattern</option>
            <option value="20">20% - Complex pattern or beginner</option>
            <option value="25">25% - Very complex or many cuts</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tiles per Box</label>
          <input
            type="number"
            className={styles.input}
            value={tilesPerBox}
            onChange={(e) => setTilesPerBox(e.target.value)}
            placeholder="e.g., 10"
            step="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tile Price (optional)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              className={styles.input}
              value={tilePrice}
              onChange={(e) => setTilePrice(e.target.value)}
              placeholder="e.g., 5.00"
              step="0.01"
              style={{ flex: 1 }}
            />
            <select
              className={styles.select}
              value={tilePriceUnit}
              onChange={(e) => setTilePriceUnit(e.target.value as any)}
              style={{ width: '130px' }}
            >
              <option value="per_sqft">per sq ft</option>
              <option value="per_tile">per tile</option>
              <option value="per_box">per box</option>
            </select>
          </div>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Tiles
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Tile Materials Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Area to Tile</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tile Size</span>
            <span className={styles.resultValue}>{results.tileSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Coverage per Tile</span>
            <span className={styles.resultValue}>{results.sqFtPerTile} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tiles Needed (without waste)</span>
            <span className={styles.resultValue}>{results.tilesNeeded} tiles</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With {results.wasteFactor}% Waste</span>
            <span className={styles.resultValuePrimary}>{results.totalTiles} tiles</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Boxes Needed ({results.tilesPerBox}/box)</span>
            <span className={styles.resultValuePrimary}>{results.boxesNeeded} boxes</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Additional Materials</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Grout (25 lb bags)</span>
            <span className={styles.resultValue}>{results.groutBags25lb} bags</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Thinset (50 lb bags)</span>
            <span className={styles.resultValue}>{results.thinsetBags} bags</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Estimated Tile Cost</span>
                  <span className={styles.resultValuePrimary}>${results.totalCost}</span>
                </div>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tip:</strong> Buy all tiles from the same lot number to ensure color consistency.
            Keep extra tiles ({Math.ceil(results.totalTiles * 0.05)} pieces) for future repairs - matching tiles
            can be impossible to find later.
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
