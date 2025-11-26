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

type RoofType = 'simple' | 'dimensions';

export default function RoofingCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [roofType, setRoofType] = useState<RoofType>('simple');
  const [totalSquareFeet, setTotalSquareFeet] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [pitch, setPitch] = useState<string>('4');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [shingleType, setShingleType] = useState<'3tab' | 'architectural' | 'premium'>('architectural');
  const [includeUnderlayment, setIncludeUnderlayment] = useState<boolean>(true);
  const [includeDripEdge, setIncludeDripEdge] = useState<boolean>(true);
  const [pricePerBundle, setPricePerBundle] = useState<string>('35');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Pitch multipliers for common roof pitches (rise:12 run)
  const pitchMultipliers: { [key: string]: number } = {
    '0': 1.000,   // Flat
    '1': 1.003,
    '2': 1.014,
    '3': 1.031,
    '4': 1.054,   // Common low slope
    '5': 1.083,
    '6': 1.118,   // Common
    '7': 1.158,
    '8': 1.202,   // Common
    '9': 1.250,
    '10': 1.302,
    '11': 1.357,
    '12': 1.414,  // 45 degrees
    '14': 1.537,
    '16': 1.667,
    '18': 1.803
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let baseSqFt = 0;

    if (roofType === 'simple') {
      if (!totalSquareFeet || parseFloat(totalSquareFeet) <= 0) {
        newErrors.push('Please enter a valid total square footage');
      } else {
        baseSqFt = parseFloat(totalSquareFeet);
      }
    } else {
      if (!length || parseFloat(length) <= 0) newErrors.push('Please enter a valid length');
      if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid width');
      if (newErrors.length === 0) {
        baseSqFt = parseFloat(length) * parseFloat(width);
      }
    }

    if (!pitch || !pitchMultipliers[pitch]) newErrors.push('Please select a valid roof pitch');
    if (!wasteFactor || parseFloat(wasteFactor) < 0) newErrors.push('Please enter a valid waste factor');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // Apply pitch multiplier
    const multiplier = pitchMultipliers[pitch];
    const actualRoofArea = baseSqFt * multiplier;

    // Apply waste factor
    const waste = parseFloat(wasteFactor);
    const totalWithWaste = actualRoofArea * (1 + waste / 100);

    // Calculate roofing squares (1 square = 100 sq ft)
    const roofingSquares = totalWithWaste / 100;

    // Shingles: 3 bundles per square (standard)
    const bundlesNeeded = Math.ceil(roofingSquares * 3);

    // Underlayment: typically comes in rolls covering 400 sq ft
    const underlaymentRolls = includeUnderlayment ? Math.ceil(totalWithWaste / 400) : 0;

    // Starter shingles: perimeter of roof / 100 (linear feet per bundle varies, ~100 lf typical)
    // Estimate perimeter from area (rough approximation)
    const estimatedPerimeter = Math.sqrt(baseSqFt) * 4 * 1.2; // Add 20% for complexity
    const starterBundles = Math.ceil(estimatedPerimeter / 100);

    // Ridge cap: estimate ridge length as roughly 1/3 of perimeter for a simple gable
    const ridgeLength = estimatedPerimeter / 3;
    const ridgeCapBundles = Math.ceil(ridgeLength / 20); // ~20 lf per bundle

    // Drip edge: perimeter length, typically 10-foot pieces
    const dripEdgePieces = includeDripEdge ? Math.ceil(estimatedPerimeter / 10) : 0;

    // Roofing nails: approximately 4 nails per shingle, 26 shingles per bundle
    const nailsNeeded = bundlesNeeded * 26 * 4;
    const nailPounds = Math.ceil(nailsNeeded / 320); // ~320 nails per pound

    // Cost estimate
    const bundleCost = parseFloat(pricePerBundle) || 35;
    const totalCost = bundlesNeeded * bundleCost;

    // Calculate pitch angle in degrees
    const pitchAngle = Math.atan(parseFloat(pitch) / 12) * (180 / Math.PI);

    setResults({
      baseSqFt: baseSqFt.toFixed(0),
      actualRoofArea: actualRoofArea.toFixed(0),
      totalWithWaste: totalWithWaste.toFixed(0),
      roofingSquares: roofingSquares.toFixed(2),
      bundlesNeeded,
      underlaymentRolls,
      starterBundles,
      ridgeCapBundles,
      dripEdgePieces,
      nailPounds,
      totalCost: totalCost.toFixed(2),
      pitchMultiplier: multiplier.toFixed(3),
      pitchAngle: pitchAngle.toFixed(1),
      wasteFactor: waste
    });

    trackCalculatorUsage('Roofing Calculator', {
      roofType,
      baseSqFt: baseSqFt.toFixed(0),
      pitch,
      shingleType,
      roofingSquares: roofingSquares.toFixed(2)
    });
  };

  const faqItems = [
    {
      question: 'What is a roofing square?',
      answer: 'A roofing square is a unit of measurement equal to 100 square feet of roof area. When contractors quote roofing jobs, they typically price by the square. Most bundles of shingles cover about 1/3 of a square, so you need 3 bundles per square.'
    },
    {
      question: 'How do I measure my roof without going on it?',
      answer: 'Measure the footprint of your home (length × width) and multiply by the pitch factor. You can also use satellite imagery from Google Maps or county tax records which often list roof square footage. For complex roofs, break it into rectangles and triangles.'
    },
    {
      question: 'What waste factor should I use for roofing?',
      answer: 'Use 10% for simple gable roofs, 15% for roofs with multiple valleys, hips, or dormers. Complex roofs with many angles may need 20% waste factor. First-time DIYers should add an extra 5%.'
    },
    {
      question: 'How much does a bundle of shingles weigh?',
      answer: '3-tab shingles weigh about 50-65 lbs per bundle. Architectural shingles weigh 65-80 lbs per bundle. Premium or designer shingles can weigh 80-100+ lbs per bundle. A full square (3 bundles) of architectural shingles weighs about 200-240 lbs.'
    },
    {
      question: 'How long do different types of shingles last?',
      answer: '3-tab shingles typically last 15-20 years. Architectural shingles last 25-30 years. Premium or designer shingles can last 30-50 years. These are manufacturer estimates; actual lifespan depends on climate, ventilation, and installation quality.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Roof Pitch Calculator',
      link: '/construction/roof-pitch',
      description: 'Calculate roof pitch and angle from measurements'
    },
    {
      title: 'Metal Roofing Calculator',
      link: '/construction/metal-roofing',
      description: 'Calculate materials for metal roof installations'
    },
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for footings and slabs'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Accurately estimating roofing materials prevents costly mid-project supply runs and excess material waste. Here's how to get it right:",
      steps: [
        "Choose your input method: enter total roof square footage directly, or enter length and width dimensions.",
        "Select your roof pitch. If you don't know it, measure the rise (vertical height) for every 12 inches of horizontal run.",
        "Adjust the waste factor based on roof complexity. Simple gable roofs need 10%, complex roofs with valleys and dormers need 15-20%.",
        "Select your shingle type and enter local pricing to get cost estimates.",
        "Click 'Calculate' to see bundles, underlayment, starter strips, and all materials needed."
      ]
    },
    whyMatters: {
      description: "Roofing materials are expensive, and running short means emergency trips to the supplier while your roof is exposed. Ordering too much wastes money on non-returnable materials. The pitch of your roof significantly affects the actual surface area - a 12/12 pitch roof has 41% more area than a flat roof of the same footprint.",
      benefits: [
        "Calculate exact bundles needed with pitch-adjusted square footage",
        "Account for waste from cuts around vents, valleys, and edges",
        "Estimate all accessories: underlayment, drip edge, starter strips, ridge caps",
        "Get accurate cost estimates before starting your project",
        "Avoid running short on materials mid-installation"
      ]
    },
    examples: [
      {
        title: "Simple Gable Roof",
        scenario: "A 30' × 40' home with a 6/12 pitch roof.",
        calculation: "1,200 sq ft × 1.118 (pitch factor) = 1,342 sq ft actual roof area + 10% waste = 1,476 sq ft",
        result: "Order 15 squares (45 bundles) of shingles, 4 rolls of underlayment, and 60 feet of drip edge."
      },
      {
        title: "Complex Roof with Dormers",
        scenario: "2,000 sq ft roof area with an 8/12 pitch and multiple dormers.",
        calculation: "2,000 sq ft × 1.202 (pitch factor) = 2,404 sq ft + 15% waste = 2,765 sq ft",
        result: "Order 28 squares (84 bundles), 7 rolls underlayment. The extra waste accounts for dormers."
      },
      {
        title: "Steep Roof",
        scenario: "1,500 sq ft footprint with a steep 12/12 pitch (45 degrees).",
        calculation: "1,500 sq ft × 1.414 (pitch factor) = 2,121 sq ft + 10% waste = 2,333 sq ft",
        result: "Order 24 squares (72 bundles). Note: Steep roofs require special safety equipment."
      }
    ],
    commonMistakes: [
      "Forgetting to apply the pitch multiplier - a steeper roof needs significantly more material than the footprint suggests.",
      "Using house square footage instead of roof area - roof overhangs add 1-2 feet on each side.",
      "Not accounting for waste - valleys, hips, and cuts around vents all create waste.",
      "Ordering by the bundle instead of by the square - remember, 3 bundles = 1 square.",
      "Forgetting accessories - underlayment, starter strips, ridge caps, and nails add up."
    ]
  };

  return (
    <CalculatorLayout
      title="Roofing Calculator"
      description="Calculate roofing squares, shingles, underlayment, and materials needed for your roof. Includes pitch factor, waste allowance, and cost estimates."
    >
      <CalculatorSchema
        name="Roofing Calculator"
        description="Free roofing calculator to estimate shingles, underlayment, and materials. Calculate by roof pitch and square footage with waste factors."
        url="/construction/roofing"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Input Method</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${roofType === 'simple' ? styles.buttonOptionActive : ''}`}
              onClick={() => setRoofType('simple')}
            >
              Total Square Feet
            </button>
            <button
              className={`${styles.buttonOption} ${roofType === 'dimensions' ? styles.buttonOptionActive : ''}`}
              onClick={() => setRoofType('dimensions')}
            >
              Length × Width
            </button>
          </div>
        </div>

        {roofType === 'simple' ? (
          <div className={styles.formGroup}>
            <label className={styles.label}>Roof Square Footage (footprint)</label>
            <input
              type="number"
              className={styles.input}
              value={totalSquareFeet}
              onChange={(e) => setTotalSquareFeet(e.target.value)}
              placeholder="e.g., 1500"
              step="1"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              This is the flat area before pitch adjustment
            </small>
          </div>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Roof Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 40"
                step="0.1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Roof Width (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g., 30"
                step="0.1"
              />
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Roof Pitch (rise per 12" run)</label>
          <select
            className={styles.select}
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
          >
            <option value="0">Flat (0/12)</option>
            <option value="1">1/12 - Very Low</option>
            <option value="2">2/12 - Low Slope</option>
            <option value="3">3/12 - Low Slope</option>
            <option value="4">4/12 - Standard Low</option>
            <option value="5">5/12 - Medium</option>
            <option value="6">6/12 - Standard</option>
            <option value="7">7/12 - Medium Steep</option>
            <option value="8">8/12 - Steep</option>
            <option value="9">9/12 - Steep</option>
            <option value="10">10/12 - Very Steep</option>
            <option value="11">11/12 - Very Steep</option>
            <option value="12">12/12 - 45 Degrees</option>
            <option value="14">14/12 - Extreme</option>
            <option value="16">16/12 - Extreme</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Shingle Type</label>
          <select
            className={styles.select}
            value={shingleType}
            onChange={(e) => setShingleType(e.target.value as any)}
          >
            <option value="3tab">3-Tab (Economy)</option>
            <option value="architectural">Architectural (Standard)</option>
            <option value="premium">Premium/Designer</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor (%)</label>
          <input
            type="number"
            className={styles.input}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
            placeholder="e.g., 10"
            step="1"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            10% for simple roofs, 15-20% for complex roofs with valleys/dormers
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Bundle ($)</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerBundle}
            onChange={(e) => setPricePerBundle(e.target.value)}
            placeholder="e.g., 35"
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Include Accessories</label>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e0e0e0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeUnderlayment}
                onChange={(e) => setIncludeUnderlayment(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              Underlayment
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e0e0e0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeDripEdge}
                onChange={(e) => setIncludeDripEdge(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              Drip Edge
            </label>
          </div>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Roofing Materials
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Roofing Materials Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Base Area (footprint)</span>
            <span className={styles.resultValue}>{results.baseSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Pitch Multiplier ({pitch}/12 = {results.pitchAngle}°)</span>
            <span className={styles.resultValue}>×{results.pitchMultiplier}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Actual Roof Area</span>
            <span className={styles.resultValue}>{results.actualRoofArea} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With {results.wasteFactor}% Waste</span>
            <span className={styles.resultValue}>{results.totalWithWaste} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Roofing Squares</span>
            <span className={styles.resultValuePrimary}>{results.roofingSquares} squares</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Materials List</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Shingle Bundles</span>
            <span className={styles.resultValuePrimary}>{results.bundlesNeeded} bundles</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Starter Strip Bundles</span>
            <span className={styles.resultValue}>{results.starterBundles} bundles</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Ridge Cap Bundles</span>
            <span className={styles.resultValue}>{results.ridgeCapBundles} bundles</span>
          </div>

          {includeUnderlayment && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Underlayment Rolls</span>
              <span className={styles.resultValue}>{results.underlaymentRolls} rolls</span>
            </div>
          )}

          {includeDripEdge && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Drip Edge (10' pieces)</span>
              <span className={styles.resultValue}>{results.dripEdgePieces} pieces</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Roofing Nails</span>
            <span className={styles.resultValue}>{results.nailPounds} lbs</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Estimated Shingle Cost</span>
              <span className={styles.resultValuePrimary}>${results.totalCost}</span>
            </div>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This estimate covers main roofing materials. You may also need: step flashing, valley metal,
            pipe boots, ridge vents, and ice/water shield for cold climates. Consult a roofing professional for complex roofs.
          </div>

          {parseFloat(pitch) >= 8 && (
            <div className={styles.warning}>
              <strong>Safety Warning:</strong> Roof pitches of 8/12 or steeper require special safety equipment including
              roof jacks, harnesses, and toe boards. Consider hiring professionals for steep roofs.
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
