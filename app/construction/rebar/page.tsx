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

type ProjectType = 'slab' | 'footing' | 'wall';

export default function RebarCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [projectType, setProjectType] = useState<ProjectType>('slab');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [rebarSize, setRebarSize] = useState<string>('#4');
  const [spacingX, setSpacingX] = useState<string>('12');
  const [spacingY, setSpacingY] = useState<string>('12');
  const [layers, setLayers] = useState<string>('1');
  const [overlap, setOverlap] = useState<string>('24');
  const [rebarPrice, setRebarPrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const rebarSizes: Record<string, { diameter: number; weight: number }> = {
    '#3': { diameter: 0.375, weight: 0.376 },
    '#4': { diameter: 0.500, weight: 0.668 },
    '#5': { diameter: 0.625, weight: 1.043 },
    '#6': { diameter: 0.750, weight: 1.502 },
    '#7': { diameter: 0.875, weight: 2.044 },
    '#8': { diameter: 1.000, weight: 2.670 }
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (isNaN(l) || l <= 0) newErrors.push('Please enter a valid length');
    if (isNaN(w) || w <= 0) newErrors.push('Please enter a valid width');
    if (projectType === 'wall' && (isNaN(h) || h <= 0)) newErrors.push('Please enter a valid height');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const spaceX = parseFloat(spacingX);
    const spaceY = parseFloat(spacingY);
    const numLayers = parseInt(layers) || 1;
    const overlapIn = parseFloat(overlap) || 24;

    const rebarInfo = rebarSizes[rebarSize];

    // Calculate number of bars in each direction
    // Bars in X direction run along the length, spaced by Y spacing
    // Number of X bars = (width / spacingY) + 1
    const numBarsX = Math.ceil((w * 12) / spaceY) + 1;
    // Length of each X bar
    const lengthPerBarX = l;
    const totalLengthX = numBarsX * lengthPerBarX * numLayers;

    // Bars in Y direction run along the width, spaced by X spacing
    const numBarsY = Math.ceil((l * 12) / spaceX) + 1;
    const lengthPerBarY = w;
    const totalLengthY = numBarsY * lengthPerBarY * numLayers;

    // For walls, add vertical bars
    let verticalBars = 0;
    let verticalLength = 0;
    if (projectType === 'wall') {
      // Vertical bars spaced at X spacing
      verticalBars = Math.ceil((l * 12) / spaceX) + 1;
      verticalLength = verticalBars * h;
    }

    // Total linear feet of rebar
    const totalLinearFt = totalLengthX + totalLengthY + verticalLength;

    // Account for overlap (splices)
    // Number of splices = (total length / 20 ft standard bar) rounded up
    const standardBarLength = 20;
    const numBarsXNeeded = Math.ceil(totalLengthX / standardBarLength);
    const numBarsYNeeded = Math.ceil(totalLengthY / standardBarLength);
    const numVertBarsNeeded = Math.ceil(verticalLength / standardBarLength);

    const totalBarsNeeded = numBarsXNeeded + numBarsYNeeded + numVertBarsNeeded;

    // Splice overlap adds length
    const numSplices = totalBarsNeeded - numBarsX - numBarsY - verticalBars;
    const spliceLength = Math.max(0, numSplices) * (overlapIn / 12);

    const totalWithSplice = totalLinearFt + spliceLength;

    // Round up to standard 20 ft bars
    const bars20ft = Math.ceil(totalWithSplice / 20);

    // Calculate weight
    const totalWeight = totalWithSplice * rebarInfo.weight;

    // Tie wire (approximately 1 tie per intersection, 8" wire per tie)
    const intersections = numBarsX * numBarsY * numLayers;
    const tieWire = Math.ceil(intersections * (8 / 12)); // feet of wire
    const tieWireLbs = Math.ceil(tieWire / 50); // ~50 ft per lb for 16 gauge

    // Rebar chairs/supports (approximately 1 per 4 sq ft)
    const chairs = Math.ceil((l * w) / 4);

    // Cost calculations
    const price = parseFloat(rebarPrice) || 0;
    const rebarCost = price > 0 ? bars20ft * price : null;
    const tieWireCost = tieWireLbs * 3; // ~$3 per lb
    const chairCost = chairs * 0.50; // ~$0.50 per chair
    const totalCost = rebarCost ? rebarCost + tieWireCost + chairCost : null;

    setResults({
      projectType,
      length: l,
      width: w,
      height: projectType === 'wall' ? h : null,
      rebarSize,
      rebarDiameter: rebarInfo.diameter,
      spacingX: spaceX,
      spacingY: spaceY,
      numLayers,
      numBarsX,
      numBarsY,
      verticalBars,
      totalLinearFt: totalLinearFt.toFixed(1),
      totalWithSplice: totalWithSplice.toFixed(1),
      bars20ft,
      totalWeight: totalWeight.toFixed(1),
      intersections,
      tieWireLbs,
      chairs,
      rebarCost: rebarCost ? rebarCost.toFixed(2) : null,
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Rebar Calculator', {
      projectType,
      length: l.toString(),
      width: w.toString(),
      bars20ft: bars20ft.toString()
    });
  };

  const faqItems = [
    {
      question: 'What size rebar do I need for a concrete slab?',
      answer: '#4 rebar (1/2 inch diameter) is standard for residential slabs 4-6 inches thick. For driveways or heavy-load areas, use #5 rebar. Commercial applications often require #5 or #6 rebar per engineering specifications.'
    },
    {
      question: 'How far apart should rebar be spaced?',
      answer: 'Standard residential spacing is 12 inches on center in both directions. Heavy-duty applications use 8-inch spacing. The spacing depends on load requirements, slab thickness, and soil conditions.'
    },
    {
      question: 'How much should rebar overlap at splices?',
      answer: 'Minimum lap splice is 40 bar diameters. For #4 rebar (1/2"), that\'s 20 inches minimum. For #5 (5/8"), it\'s 25 inches. Most codes require 24 inches minimum for residential, and some jurisdictions require more.'
    },
    {
      question: 'Should I use rebar or wire mesh for a slab?',
      answer: 'Rebar provides superior strength and crack control, especially for driveways and areas with vehicle traffic. Wire mesh (6x6 W1.4/W1.4) is acceptable for light-duty slabs like patios. Rebar is required for footings and structural elements.'
    },
    {
      question: 'How high should rebar be positioned in a slab?',
      answer: 'Rebar should be positioned in the bottom third of the slab, typically 2 inches from the bottom. Use rebar chairs or dobies to maintain consistent height. For double-layer slabs, the second layer sits in the top third.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete volume'
    },
    {
      title: 'Concrete Steps Calculator',
      link: '/construction/concrete-steps',
      description: 'Calculate concrete for stairs'
    },
    {
      title: 'Footing Calculator',
      link: '/construction/footing',
      description: 'Calculate footing dimensions and concrete'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Rebar reinforcement strengthens concrete and prevents cracking. This calculator helps you determine the linear feet of rebar, number of standard bars, and accessories needed for your project.",
      steps: [
        "Select your project type: slab, footing, or wall.",
        "Enter dimensions in feet (length, width, and height for walls).",
        "Choose rebar size (#4 is standard residential, #5 for heavy duty).",
        "Specify spacing in inches on center (12\" is standard).",
        "Review quantities and remember to include chairs and tie wire."
      ]
    },
    whyMatters: {
      description: "Concrete is strong in compression but weak in tension. Rebar adds tensile strength, preventing cracks from spreading and maintaining structural integrity. Proper rebar placement and quantity is essential for footings, slabs subject to loads, and all structural concrete elements.",
      benefits: [
        "Calculate linear feet in both directions",
        "Account for splice overlap requirements",
        "Convert to standard 20-foot bars",
        "Include tie wire and chair estimates",
        "Budget for complete reinforcement"
      ]
    },
    examples: [
      {
        title: "Garage Slab",
        scenario: "A 24' x 24' garage slab with #4 rebar at 12-inch spacing.",
        calculation: "25 bars each direction at 24' = 1,200 LF total",
        result: "60 bars (20 ft), 625 ties, ~150 chairs needed."
      },
      {
        title: "Continuous Footing",
        scenario: "A 60' x 2' footing with #5 rebar, 3 bars continuous.",
        calculation: "3 bars x 60' + laps = approximately 200 LF",
        result: "10 bars (20 ft) with proper lap splices."
      },
      {
        title: "Retaining Wall",
        scenario: "An 8' tall x 20' long wall with #4 rebar at 12-inch spacing.",
        calculation: "Horizontal + vertical bars = approximately 400 LF",
        result: "20 bars (20 ft), double-check engineering requirements."
      }
    ],
    commonMistakes: [
      "Forgetting lap splices - bars must overlap adequately where they meet.",
      "Placing rebar too low - use chairs to maintain proper cover.",
      "Insufficient tie wire - every intersection should be tied.",
      "Wrong bar size for application - check structural requirements.",
      "Spacing too wide for load requirements - verify with local codes."
    ]
  };

  return (
    <CalculatorLayout
      title="Rebar Calculator"
      description="Calculate rebar quantities, linear feet, and standard bars needed. Includes tie wire and chair estimates."
    >
      <CalculatorSchema
        name="Rebar Calculator"
        description="Free rebar calculator to estimate linear feet, number of bars, and accessories for concrete reinforcement."
        url="/construction/rebar"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Type</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${projectType === 'slab' ? styles.buttonOptionActive : ''}`}
              onClick={() => setProjectType('slab')}
            >
              Slab
            </button>
            <button
              className={`${styles.buttonOption} ${projectType === 'footing' ? styles.buttonOptionActive : ''}`}
              onClick={() => setProjectType('footing')}
            >
              Footing
            </button>
            <button
              className={`${styles.buttonOption} ${projectType === 'wall' ? styles.buttonOptionActive : ''}`}
              onClick={() => setProjectType('wall')}
            >
              Wall
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: projectType === 'wall' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Length (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="e.g., 24"
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
              placeholder="e.g., 24"
              step="0.5"
            />
          </div>
          {projectType === 'wall' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Height (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 8"
                step="0.5"
              />
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Rebar Size</label>
          <select
            className={styles.select}
            value={rebarSize}
            onChange={(e) => setRebarSize(e.target.value)}
          >
            <option value="#3">#3 (3/8 inch) - Light duty</option>
            <option value="#4">#4 (1/2 inch) - Standard residential</option>
            <option value="#5">#5 (5/8 inch) - Heavy duty residential</option>
            <option value="#6">#6 (3/4 inch) - Commercial</option>
            <option value="#7">#7 (7/8 inch) - Structural</option>
            <option value="#8">#8 (1 inch) - Structural</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Spacing X Direction (inches)</label>
            <select
              className={styles.select}
              value={spacingX}
              onChange={(e) => setSpacingX(e.target.value)}
            >
              <option value="6">6 inches (heavy duty)</option>
              <option value="8">8 inches</option>
              <option value="12">12 inches (standard)</option>
              <option value="16">16 inches</option>
              <option value="18">18 inches</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Spacing Y Direction (inches)</label>
            <select
              className={styles.select}
              value={spacingY}
              onChange={(e) => setSpacingY(e.target.value)}
            >
              <option value="6">6 inches (heavy duty)</option>
              <option value="8">8 inches</option>
              <option value="12">12 inches (standard)</option>
              <option value="16">16 inches</option>
              <option value="18">18 inches</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Layers</label>
            <select
              className={styles.select}
              value={layers}
              onChange={(e) => setLayers(e.target.value)}
            >
              <option value="1">1 Layer (standard slabs)</option>
              <option value="2">2 Layers (thick slabs, footings)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Lap Splice Length (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={overlap}
              onChange={(e) => setOverlap(e.target.value)}
              placeholder="e.g., 24"
              step="1"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per 20-foot Bar (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={rebarPrice}
            onChange={(e) => setRebarPrice(e.target.value)}
            placeholder="e.g., 12.00"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Rebar
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Rebar Requirements</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Project Size</span>
            <span className={styles.resultValue}>
              {results.length} x {results.width} {results.height ? `x ${results.height}` : ''} feet
            </span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rebar Size</span>
            <span className={styles.resultValue}>{results.rebarSize} ({results.rebarDiameter}" diameter)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Spacing</span>
            <span className={styles.resultValue}>{results.spacingX}" x {results.spacingY}" on center</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Rebar Layout</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Bars Running Length (X)</span>
            <span className={styles.resultValue}>{results.numBarsX} bars</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Bars Running Width (Y)</span>
            <span className={styles.resultValue}>{results.numBarsY} bars</span>
          </div>

          {results.verticalBars > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Vertical Bars</span>
              <span className={styles.resultValue}>{results.verticalBars} bars</span>
            </div>
          )}

          {results.numLayers > 1 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Layers</span>
              <span className={styles.resultValue}>{results.numLayers}</span>
            </div>
          )}

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Materials Needed</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Linear Feet</span>
            <span className={styles.resultValue}>{results.totalLinearFt} LF</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With Lap Splices</span>
            <span className={styles.resultValue}>{results.totalWithSplice} LF</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>20-foot Bars Needed</span>
            <span className={styles.resultValuePrimary}>{results.bars20ft} bars</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Weight</span>
            <span className={styles.resultValue}>{results.totalWeight} lbs</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tie Wire</span>
            <span className={styles.resultValue}>{results.tieWireLbs} lbs (~{results.intersections} ties)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rebar Chairs</span>
            <span className={styles.resultValue}>{results.chairs} chairs</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Rebar</span>
                <span className={styles.resultValue}>${results.rebarCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Materials</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Position rebar 2 inches from bottom of slab. Tie every intersection. Stagger lap splices - do not align all in one row.
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
