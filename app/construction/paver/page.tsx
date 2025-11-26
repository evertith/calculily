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

export default function PaverCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [totalArea, setTotalArea] = useState<string>('');
  const [paverLength, setPaverLength] = useState<string>('8');
  const [paverWidth, setPaverWidth] = useState<string>('4');
  const [pattern, setPattern] = useState<string>('running');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [baseDepth, setBaseDepth] = useState<string>('4');
  const [sandDepth, setSandDepth] = useState<string>('1');
  const [paverPrice, setPaverPrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const paverPresets = [
    { label: 'Standard (8x4)', length: '8', width: '4' },
    { label: 'Holland (8x4)', length: '8', width: '4' },
    { label: 'Large (12x12)', length: '12', width: '12' },
    { label: 'Medium (6x6)', length: '6', width: '6' },
    { label: 'Rectangle (12x6)', length: '12', width: '6' }
  ];

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let areaSqFt = 0;

    if (inputType === 'dimensions') {
      const l = parseFloat(length);
      const w = parseFloat(width);
      if (isNaN(l) || l <= 0) newErrors.push('Please enter a valid length');
      if (isNaN(w) || w <= 0) newErrors.push('Please enter a valid width');
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

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const pLength = parseFloat(paverLength);
    const pWidth = parseFloat(paverWidth);
    const waste = parseFloat(wasteFactor) || 10;
    const baseDepthIn = parseFloat(baseDepth) || 4;
    const sandDepthIn = parseFloat(sandDepth) || 1;

    // Pattern waste factors
    const patternWaste: Record<string, number> = {
      running: 0,
      herringbone: 10,
      basketweave: 5,
      diagonal: 15
    };

    const totalWaste = waste + (patternWaste[pattern] || 0);

    // Pavers per square foot
    const paverAreaSqIn = pLength * pWidth;
    const paverAreaSqFt = paverAreaSqIn / 144;
    const paversPerSqFt = 1 / paverAreaSqFt;

    // Total pavers needed
    const paversNeeded = Math.ceil(areaSqFt * paversPerSqFt);
    const paversWithWaste = Math.ceil(paversNeeded * (1 + totalWaste / 100));

    // Base material (gravel/crusite)
    const baseDepthFt = baseDepthIn / 12;
    const baseCuFt = areaSqFt * baseDepthFt;
    const baseCuYd = baseCuFt / 27;
    const baseTons = baseCuYd * 1.4; // Gravel ~1.4 tons per cu yd

    // Sand bedding
    const sandDepthFt = sandDepthIn / 12;
    const sandCuFt = areaSqFt * sandDepthFt;
    const sandCuYd = sandCuFt / 27;
    const sandTons = sandCuYd * 1.4;

    // Polymeric sand for joints (approximately 50 lb per 75 sq ft)
    const polymeticSandBags = Math.ceil(areaSqFt / 75);

    // Edge restraint (perimeter)
    const perimeter = inputType === 'dimensions'
      ? 2 * (parseFloat(length) + parseFloat(width))
      : 4 * Math.sqrt(areaSqFt);
    const edgeRestraintFt = Math.ceil(perimeter * 1.1);

    // Spikes for edge restraint (1 per foot)
    const edgeSpikes = Math.ceil(edgeRestraintFt);

    // Cost calculations
    const price = parseFloat(paverPrice) || 0;
    const paverCost = price > 0 ? paversWithWaste * price : null;
    const baseCost = baseTons * 45; // ~$45 per ton
    const sandCost = sandTons * 50; // ~$50 per ton
    const polymeticCost = polymeticSandBags * 25; // ~$25 per bag
    const edgeCost = (edgeRestraintFt / 8) * 8; // ~$8 per 8ft section
    const totalCost = paverCost ? paverCost + baseCost + sandCost + polymeticCost + edgeCost : null;

    setResults({
      areaSqFt: areaSqFt.toFixed(1),
      paverSize: `${pLength}" x ${pWidth}"`,
      pattern,
      paversPerSqFt: paversPerSqFt.toFixed(2),
      paversNeeded,
      paversWithWaste,
      wasteFactor: totalWaste,
      baseCuYd: baseCuYd.toFixed(2),
      baseTons: baseTons.toFixed(2),
      sandCuYd: sandCuYd.toFixed(2),
      sandTons: sandTons.toFixed(2),
      polymeticSandBags,
      edgeRestraintFt,
      edgeSpikes,
      paverCost: paverCost ? paverCost.toFixed(2) : null,
      baseCost: baseCost.toFixed(2),
      sandCost: sandCost.toFixed(2),
      polymeticCost: polymeticCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Paver Calculator', {
      inputType,
      areaSqFt: areaSqFt.toFixed(0),
      paversWithWaste: paversWithWaste.toString()
    });
  };

  const faqItems = [
    {
      question: 'How many pavers do I need per square foot?',
      answer: 'It depends on paver size. Standard 4x8 inch pavers require about 4.5 per square foot. 12x12 inch pavers need 1 per square foot. 6x6 inch pavers require about 4 per square foot. Always add 10% for waste.'
    },
    {
      question: 'How deep should the base be for a paver patio?',
      answer: 'For pedestrian traffic only (patios, walkways), use 4 inches of compacted gravel base. For driveways or areas with vehicles, use 6-8 inches minimum. Poor soil conditions may require deeper bases.'
    },
    {
      question: 'What kind of sand goes under pavers?',
      answer: 'Use coarse concrete sand (not play sand or beach sand) for the 1-inch bedding layer. After laying pavers, use polymeric sand for joints - it hardens when wet and prevents weeds and ant hills.'
    },
    {
      question: 'Do I need edge restraints for pavers?',
      answer: 'Yes! Edge restraints are essential to prevent pavers from shifting and spreading over time. Use plastic or aluminum paver edging secured with 10-inch spikes every 12 inches, especially along edges without borders.'
    },
    {
      question: 'Which paver pattern is best for beginners?',
      answer: 'Running bond (staggered rows like bricks) is easiest as it minimizes cuts and allows for adjustment. Herringbone is more difficult but provides excellent interlock for driveways. Diagonal patterns require the most cuts.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Brick Calculator',
      link: '/construction/brick',
      description: 'Calculate bricks for walls and patios'
    },
    {
      title: 'Gravel Calculator',
      link: '/construction/gravel',
      description: 'Calculate gravel for base material'
    },
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for borders and footings'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "A paver patio or walkway requires careful material estimation. Beyond the pavers themselves, you need base material, bedding sand, joint sand, and edge restraints. This calculator helps you plan for all components.",
      steps: [
        "Enter the area dimensions or total square footage.",
        "Select your paver size from common options or enter custom dimensions.",
        "Choose your laying pattern - this affects waste calculations.",
        "Specify base depth (4\" for patios, 6\"+ for driveways).",
        "Enter paver price for cost estimates."
      ]
    },
    whyMatters: {
      description: "A properly installed paver patio or driveway can last 25-50 years with minimal maintenance. Success depends on adequate base preparation, proper materials, and correct installation techniques. Accurate material estimation ensures you have enough pavers from the same lot (color matching) and sufficient base materials.",
      benefits: [
        "Calculate exact paver quantities with waste allowance",
        "Determine gravel base material needed",
        "Include bedding and joint sand quantities",
        "Plan edge restraints and hardware",
        "Budget for complete installation costs"
      ]
    },
    examples: [
      {
        title: "Backyard Patio",
        scenario: "A 12' x 16' patio with 4x8 pavers in running bond pattern.",
        calculation: "192 sq ft x 4.5 pavers/sq ft = 864 + 10% waste = 950 pavers",
        result: "950 pavers, 0.6 tons gravel, 0.2 tons sand, 3 bags polymeric."
      },
      {
        title: "Curved Walkway",
        scenario: "A 4' x 25' walkway with curves using 6x6 pavers.",
        calculation: "100 sq ft x 4 pavers/sq ft = 400 + 20% for curves = 480 pavers",
        result: "480 pavers, extra waste for cutting curves."
      },
      {
        title: "Driveway Extension",
        scenario: "A 10' x 20' driveway area with 4x8 pavers in herringbone pattern.",
        calculation: "200 sq ft x 4.5 = 900 pavers + 20% (herringbone) = 1,080 pavers",
        result: "1,080 pavers, 1.5 tons gravel (6\" base), heavier-duty installation."
      }
    ],
    commonMistakes: [
      "Insufficient base depth - skimping on gravel causes settling and shifting.",
      "Using wrong sand type - play sand or fine sand creates unstable base.",
      "Forgetting edge restraints - pavers will spread and joints will open.",
      "Not compacting base layers - each layer must be compacted thoroughly.",
      "Underestimating waste - complex patterns and curves need extra pavers."
    ]
  };

  return (
    <CalculatorLayout
      title="Paver Calculator"
      description="Calculate pavers, base material, sand, and edge restraints for patios and walkways. Includes multiple pattern options."
    >
      <CalculatorSchema
        name="Paver Calculator"
        description="Free paver calculator to estimate pavers, gravel base, sand, and edge restraints for patios, walkways, and driveways."
        url="/construction/paver"
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
              Dimensions
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
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Area (square feet)</label>
            <input
              type="number"
              className={styles.input}
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="e.g., 200"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Common Paver Sizes</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {paverPresets.map((preset) => (
              <button
                key={preset.label}
                className={styles.buttonOption}
                onClick={() => { setPaverLength(preset.length); setPaverWidth(preset.width); }}
                style={{
                  backgroundColor: paverLength === preset.length && paverWidth === preset.width ? '#4a9eff' : '#1a1a1a',
                  color: paverLength === preset.length && paverWidth === preset.width ? 'white' : '#e0e0e0',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Paver Length (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={paverLength}
              onChange={(e) => setPaverLength(e.target.value)}
              placeholder="e.g., 8"
              step="0.5"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Paver Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={paverWidth}
              onChange={(e) => setPaverWidth(e.target.value)}
              placeholder="e.g., 4"
              step="0.5"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Laying Pattern</label>
          <select
            className={styles.select}
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          >
            <option value="running">Running Bond (easiest)</option>
            <option value="basketweave">Basket Weave</option>
            <option value="herringbone">Herringbone (best interlock)</option>
            <option value="diagonal">Diagonal (most cuts)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Base Waste Factor</label>
          <select
            className={styles.select}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
          >
            <option value="10">10% - Rectangular area</option>
            <option value="15">15% - Some curves or angles</option>
            <option value="20">20% - Complex shape</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Base Depth (inches)</label>
            <select
              className={styles.select}
              value={baseDepth}
              onChange={(e) => setBaseDepth(e.target.value)}
            >
              <option value="4">4 inches (patios/walkways)</option>
              <option value="6">6 inches (light vehicles)</option>
              <option value="8">8 inches (driveways)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Sand Depth (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={sandDepth}
              onChange={(e) => setSandDepth(e.target.value)}
              placeholder="e.g., 1"
              step="0.25"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Paver Price Each (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={paverPrice}
            onChange={(e) => setPaverPrice(e.target.value)}
            placeholder="e.g., 0.50"
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Paver Materials Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Project Area</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Paver Size</span>
            <span className={styles.resultValue}>{results.paverSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Pattern</span>
            <span className={styles.resultValue}>{results.pattern.charAt(0).toUpperCase() + results.pattern.slice(1)}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Pavers per Sq Ft</span>
            <span className={styles.resultValue}>{results.paversPerSqFt}</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Pavers</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Pavers Needed (exact)</span>
            <span className={styles.resultValue}>{results.paversNeeded} pavers</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With {results.wasteFactor}% Waste</span>
            <span className={styles.resultValuePrimary}>{results.paversWithWaste} pavers</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Base Materials</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Gravel Base</span>
            <span className={styles.resultValue}>{results.baseCuYd} cu yd ({results.baseTons} tons)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Bedding Sand</span>
            <span className={styles.resultValue}>{results.sandCuYd} cu yd ({results.sandTons} tons)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Polymeric Sand (50 lb bags)</span>
            <span className={styles.resultValue}>{results.polymeticSandBags} bags</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Edge Restraint</span>
            <span className={styles.resultValue}>{results.edgeRestraintFt} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Edge Spikes</span>
            <span className={styles.resultValue}>{results.edgeSpikes} spikes</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Pavers</span>
                <span className={styles.resultValue}>${results.paverCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Gravel (~$45/ton)</span>
                <span className={styles.resultValue}>${results.baseCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Sand (~$50/ton)</span>
                <span className={styles.resultValue}>${results.sandCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Polymeric Sand (~$25/bag)</span>
                <span className={styles.resultValue}>${results.polymeticCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Material Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Installation Tips:</strong> Compact base in 2-inch lifts. Screed sand to exactly 1 inch before compacting pavers. Sweep polymeric sand into joints and mist with water to activate.
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
