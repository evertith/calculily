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

type ProjectType = 'wall' | 'patio' | 'veneer';

export default function BrickCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [projectType, setProjectType] = useState<ProjectType>('wall');
  const [length, setLength] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [brickSize, setBrickSize] = useState<string>('standard');
  const [brickLength, setBrickLength] = useState<string>('8');
  const [brickHeight, setBrickHeight] = useState<string>('2.25');
  const [brickWidth, setBrickWidth] = useState<string>('4');
  const [mortarJoint, setMortarJoint] = useState<string>('0.375');
  const [wasteFactor, setWasteFactor] = useState<string>('5');
  const [numDoors, setNumDoors] = useState<string>('0');
  const [numWindows, setNumWindows] = useState<string>('0');
  const [brickPrice, setBrickPrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const brickPresets: Record<string, { length: string; height: string; width: string; perSqFt: number }> = {
    standard: { length: '8', height: '2.25', width: '4', perSqFt: 6.86 },
    modular: { length: '7.625', height: '2.25', width: '3.625', perSqFt: 6.86 },
    queen: { length: '7.625', height: '2.75', width: '3', perSqFt: 5.76 },
    king: { length: '9.625', height: '2.625', width: '2.75', perSqFt: 4.61 },
    closure: { length: '7.625', height: '3.625', width: '3.625', perSqFt: 4.50 },
    roman: { length: '11.625', height: '1.625', width: '3.625', perSqFt: 6.00 },
    paver: { length: '8', height: '2.25', width: '4', perSqFt: 4.50 } // Laid flat
  };

  const handleBrickSizeChange = (size: string) => {
    setBrickSize(size);
    if (brickPresets[size]) {
      setBrickLength(brickPresets[size].length);
      setBrickHeight(brickPresets[size].height);
      setBrickWidth(brickPresets[size].width);
    }
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const l = parseFloat(length);
    const h = parseFloat(height);
    const w = parseFloat(width);

    if (isNaN(l) || l <= 0) newErrors.push('Please enter a valid length');
    if (projectType !== 'patio' && (isNaN(h) || h <= 0)) newErrors.push('Please enter a valid height');
    if (projectType === 'patio' && (isNaN(w) || w <= 0)) newErrors.push('Please enter a valid width');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const blkLength = parseFloat(brickLength);
    const blkHeight = parseFloat(brickHeight);
    const blkWidth = parseFloat(brickWidth);
    const jointSize = parseFloat(mortarJoint);
    const waste = parseFloat(wasteFactor) || 5;

    let areaSqFt = 0;
    let bricksPerSqFt = 0;

    if (projectType === 'patio') {
      // Patio - bricks laid flat
      areaSqFt = l * w;
      const brickFaceArea = (blkLength * blkWidth) / 144; // sq ft per brick
      bricksPerSqFt = 1 / brickFaceArea;
    } else {
      // Wall or veneer
      areaSqFt = l * h;

      // Subtract openings
      const doors = parseInt(numDoors) || 0;
      const windows = parseInt(numWindows) || 0;
      const doorArea = doors * 21; // 3x7 standard door
      const windowArea = windows * 15; // Average window
      areaSqFt -= (doorArea + windowArea);

      // Bricks per sq ft calculation (with mortar joint)
      const brickWithJointLength = blkLength + jointSize;
      const brickWithJointHeight = blkHeight + jointSize;
      const brickFaceArea = (brickWithJointLength * brickWithJointHeight) / 144;
      bricksPerSqFt = 1 / brickFaceArea;
    }

    // Total bricks needed
    const bricksNeeded = Math.ceil(areaSqFt * bricksPerSqFt);
    const bricksWithWaste = Math.ceil(bricksNeeded * (1 + waste / 100));

    // Mortar calculation (for walls - not patios which use sand)
    let mortarBags = 0;
    let sandCubicFt = 0;

    if (projectType !== 'patio') {
      // Approximately 7 bags of mortar per 1000 bricks
      mortarBags = Math.ceil((bricksWithWaste / 1000) * 7);
      // Sand: approximately 1 cubic foot per 100 bricks
      sandCubicFt = Math.ceil(bricksWithWaste / 100);
    } else {
      // Patio uses sand bedding (1 inch deep) and polymeric sand for joints
      const sandDepthFt = 1 / 12; // 1 inch
      const beddingSandCuFt = areaSqFt * sandDepthFt;
      sandCubicFt = Math.ceil(beddingSandCuFt * 1.5); // Add extra for joints
    }

    // Wall ties for veneer (approximately 1 per 2.67 sq ft)
    const wallTies = projectType === 'veneer' ? Math.ceil(areaSqFt / 2.67) : 0;

    // Cost calculation
    const price = parseFloat(brickPrice) || 0;
    const brickCost = price > 0 ? bricksWithWaste * price : null;
    const mortarCost = mortarBags * 12; // ~$12 per bag
    const sandCost = (sandCubicFt / 27) * 45; // ~$45 per cubic yard
    const totalCost = brickCost ? brickCost + mortarCost + sandCost : null;

    setResults({
      projectType,
      areaSqFt: areaSqFt.toFixed(1),
      brickSize: `${blkLength}" x ${blkHeight}" x ${blkWidth}"`,
      bricksPerSqFt: bricksPerSqFt.toFixed(2),
      bricksNeeded,
      bricksWithWaste,
      wasteFactor: waste,
      mortarBags,
      sandCubicFt,
      sandCubicYards: (sandCubicFt / 27).toFixed(2),
      wallTies,
      brickCost: brickCost ? brickCost.toFixed(2) : null,
      mortarCost: mortarCost.toFixed(2),
      sandCost: sandCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Brick Calculator', {
      projectType,
      areaSqFt: areaSqFt.toFixed(0),
      bricksWithWaste: bricksWithWaste.toString()
    });
  };

  const faqItems = [
    {
      question: 'How many bricks do I need per square foot?',
      answer: 'Standard modular bricks require approximately 7 bricks per square foot of wall area when laid with 3/8-inch mortar joints. Larger bricks need fewer per square foot. Pavers laid flat use about 4.5 per square foot.'
    },
    {
      question: 'How much mortar do I need for brick?',
      answer: 'Plan for approximately 7 bags (80 lb) of mortar mix per 1,000 bricks for standard joints. This can vary based on joint size and brick texture. Pre-mixed mortar is convenient; mixing your own from Portland cement and sand is more economical for large projects.'
    },
    {
      question: 'What is the difference between brick veneer and structural brick?',
      answer: 'Structural brick walls bear weight and are typically 8 inches thick (two wythes). Brick veneer is a single layer attached to a frame wall, providing the appearance of brick without structural function. Veneer requires wall ties to secure it to the structure.'
    },
    {
      question: 'Can I lay brick pavers myself?',
      answer: 'Yes, brick paver patios are a good DIY project. Key steps include proper base preparation (4-6 inches of compacted gravel), a 1-inch sand setting bed, careful pattern laying, and polymeric sand in the joints. Edge restraints are essential to prevent spreading.'
    },
    {
      question: 'How much do bricks cost?',
      answer: 'Standard bricks cost $0.50-1.50 each, with specialty or reclaimed bricks costing $2-5+. A pallet typically contains 500-510 bricks and costs $250-800. Factor in delivery costs, which can add $50-200 per pallet.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for footings and slabs'
    },
    {
      title: 'Paver Calculator',
      link: '/construction/paver',
      description: 'Calculate pavers for patios and walkways'
    },
    {
      title: 'Retaining Wall Calculator',
      link: '/construction/retaining-wall',
      description: 'Calculate retaining wall blocks'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Brick projects require careful material estimation. Bricks come in various sizes, and your mortar needs depend on joint width and brick type. This calculator helps you estimate materials for walls, patios, and veneer projects.",
      steps: [
        "Select your project type: wall (structural), patio (laid flat), or veneer (decorative facing).",
        "Enter dimensions in feet - length and height for walls, length and width for patios.",
        "Choose your brick size from common options or enter custom dimensions.",
        "Select mortar joint width (3/8 inch is standard for most applications).",
        "For walls with openings, enter the number of doors and windows."
      ]
    },
    whyMatters: {
      description: "Brick is one of the most durable building materials, with properly built brick structures lasting centuries. Accurate material estimation ensures you order enough from the same production lot (avoiding color variations) while minimizing expensive surplus. Brick is heavy and delivery costs are significant, making accurate calculations especially important.",
      benefits: [
        "Calculate exact brick quantities with waste allowance",
        "Determine mortar and sand requirements",
        "Account for doors, windows, and other openings",
        "Include wall ties for veneer applications",
        "Estimate complete project costs"
      ]
    },
    examples: [
      {
        title: "Brick Patio",
        scenario: "A 12' x 16' patio using standard pavers in herringbone pattern.",
        calculation: "192 sq ft x 4.5 bricks/sq ft = 864 + 10% waste = 950 bricks",
        result: "Order 2 pallets (1,000 bricks), plus base and joint sand."
      },
      {
        title: "Garden Wall",
        scenario: "A 20' long, 4' tall garden wall with standard modular bricks.",
        calculation: "80 sq ft x 7 bricks/sq ft = 560 + 5% = 588 bricks",
        result: "Order 600 bricks, 4 bags mortar, 6 cubic feet sand."
      },
      {
        title: "House Veneer",
        scenario: "A 40' x 9' front elevation with 2 windows and 1 door.",
        calculation: "(360 - 21 - 30) = 309 sq ft x 7 = 2,163 + 5% = 2,271 bricks",
        result: "Order 2,300 bricks, 16 bags mortar, 860 wall ties."
      }
    ],
    commonMistakes: [
      "Not accounting for mortar joints - this significantly affects brick count.",
      "Forgetting waste allowance - cutting and breakage require extra bricks.",
      "Underestimating mortar needs - joints use more mortar than expected.",
      "Ordering from multiple lots - color can vary between production batches.",
      "Skipping proper base preparation - especially critical for paver patios."
    ]
  };

  return (
    <CalculatorLayout
      title="Brick Calculator"
      description="Calculate how many bricks you need for walls, patios, and veneer. Includes mortar, sand, and cost estimates."
    >
      <CalculatorSchema
        name="Brick Calculator"
        description="Free brick calculator to estimate bricks, mortar, and sand needed for walls, patios, and veneer projects."
        url="/construction/brick"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Type</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${projectType === 'wall' ? styles.buttonOptionActive : ''}`}
              onClick={() => setProjectType('wall')}
            >
              Wall
            </button>
            <button
              className={`${styles.buttonOption} ${projectType === 'patio' ? styles.buttonOptionActive : ''}`}
              onClick={() => setProjectType('patio')}
            >
              Patio/Walkway
            </button>
            <button
              className={`${styles.buttonOption} ${projectType === 'veneer' ? styles.buttonOptionActive : ''}`}
              onClick={() => setProjectType('veneer')}
            >
              Veneer
            </button>
          </div>
        </div>

        {projectType === 'patio' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 16"
                step="0.5"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Width (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g., 12"
                step="0.5"
              />
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Wall Length (feet)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g., 20"
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Number of Doors</label>
                <input
                  type="number"
                  className={styles.input}
                  value={numDoors}
                  onChange={(e) => setNumDoors(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Number of Windows</label>
                <input
                  type="number"
                  className={styles.input}
                  value={numWindows}
                  onChange={(e) => setNumWindows(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Brick Size</label>
          <select
            className={styles.select}
            value={brickSize}
            onChange={(e) => handleBrickSizeChange(e.target.value)}
          >
            <option value="standard">Standard (8 x 2.25 x 4 inches)</option>
            <option value="modular">Modular (7.625 x 2.25 x 3.625 inches)</option>
            <option value="queen">Queen (7.625 x 2.75 x 3 inches)</option>
            <option value="king">King (9.625 x 2.625 x 2.75 inches)</option>
            <option value="roman">Roman (11.625 x 1.625 x 3.625 inches)</option>
            {projectType === 'patio' && <option value="paver">Paver (8 x 4 face, 2.25 thick)</option>}
            <option value="custom">Custom Dimensions</option>
          </select>
        </div>

        {brickSize === 'custom' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Brick Length (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={brickLength}
                onChange={(e) => setBrickLength(e.target.value)}
                placeholder="e.g., 8"
                step="0.125"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Brick Height (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={brickHeight}
                onChange={(e) => setBrickHeight(e.target.value)}
                placeholder="e.g., 2.25"
                step="0.125"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Brick Width (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={brickWidth}
                onChange={(e) => setBrickWidth(e.target.value)}
                placeholder="e.g., 4"
                step="0.125"
              />
            </div>
          </div>
        )}

        {projectType !== 'patio' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Mortar Joint Width</label>
            <select
              className={styles.select}
              value={mortarJoint}
              onChange={(e) => setMortarJoint(e.target.value)}
            >
              <option value="0.25">1/4 inch (tight joint)</option>
              <option value="0.375">3/8 inch (standard)</option>
              <option value="0.5">1/2 inch (rustic)</option>
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor</label>
          <select
            className={styles.select}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
          >
            <option value="5">5% - Simple project</option>
            <option value="10">10% - Standard (recommended)</option>
            <option value="15">15% - Complex patterns or cuts</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Brick Price Each (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={brickPrice}
            onChange={(e) => setBrickPrice(e.target.value)}
            placeholder="e.g., 0.75"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Bricks
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Brick Materials Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Project Type</span>
            <span className={styles.resultValue}>{results.projectType.charAt(0).toUpperCase() + results.projectType.slice(1)}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Area</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Brick Size</span>
            <span className={styles.resultValue}>{results.brickSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Bricks per Square Foot</span>
            <span className={styles.resultValue}>{results.bricksPerSqFt}</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Materials Required</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Bricks Needed</span>
            <span className={styles.resultValue}>{results.bricksNeeded} bricks</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With {results.wasteFactor}% Waste</span>
            <span className={styles.resultValuePrimary}>{results.bricksWithWaste} bricks</span>
          </div>

          {results.mortarBags > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Mortar (80 lb bags)</span>
              <span className={styles.resultValue}>{results.mortarBags} bags</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Sand</span>
            <span className={styles.resultValue}>{results.sandCubicFt} cu ft ({results.sandCubicYards} cu yd)</span>
          </div>

          {results.wallTies > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Wall Ties (for veneer)</span>
              <span className={styles.resultValue}>{results.wallTies} ties</span>
            </div>
          )}

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Bricks</span>
                <span className={styles.resultValue}>${results.brickCost}</span>
              </div>

              {parseFloat(results.mortarCost) > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Mortar (~$12/bag)</span>
                  <span className={styles.resultValue}>${results.mortarCost}</span>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Sand (~$45/cu yd)</span>
                <span className={styles.resultValue}>${results.sandCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Material Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Order all bricks from the same lot for color consistency. Standard pallets contain 500-510 bricks. Allow for delivery lead times, especially for specialty bricks.
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
