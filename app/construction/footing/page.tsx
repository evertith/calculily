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

export default function FootingCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [footingType, setFootingType] = useState('continuous');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('12');
  const [numberOfFootings, setNumberOfFootings] = useState('1');
  const [wallThickness, setWallThickness] = useState('8');
  const [result, setResult] = useState<{
    cubicYards: number;
    cubicFeet: number;
    bags80lb: number;
    bags60lb: number;
    rebarFeet: number;
    rebarCount: number;
    estimatedCost: number;
    loadCapacity: number;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const len = parseFloat(length);
    const wid = parseFloat(width);
    const dep = parseFloat(depth);
    const count = parseInt(numberOfFootings);
    const wallThick = parseFloat(wallThickness);

    if (isNaN(len) || len <= 0) {
      setError('Please enter a valid length');
      setResult(null);
      return;
    }
    if (isNaN(wid) || wid <= 0) {
      setError('Please enter a valid width');
      setResult(null);
      return;
    }

    let cubicFeet = 0;
    let rebarFeet = 0;
    let rebarCount = 0;
    const recommendations: string[] = [];

    if (footingType === 'continuous') {
      // Continuous/strip footing (for walls)
      cubicFeet = len * (wid / 12) * (dep / 12);

      // Rebar: 2 continuous #4 bars lengthwise + ties every 2 feet
      rebarFeet = len * 2; // Two horizontal bars
      rebarCount = Math.ceil(len / 2) + 2; // Tie bars every 2'

      // Width should be 2x wall thickness minimum
      if (wid < wallThick * 2) {
        recommendations.push(`⚠ Footing width should be at least ${wallThick * 2}" (2× wall thickness)`);
      } else {
        recommendations.push('✓ Footing width adequate for wall load');
      }
    } else if (footingType === 'square') {
      // Square/pad footing (for posts/columns)
      cubicFeet = (wid / 12) * (wid / 12) * (dep / 12) * count;

      // Rebar: grid pattern with #4 bars
      const barsPerSide = Math.ceil((wid - 6) / 12) + 2;
      rebarFeet = barsPerSide * 2 * (wid / 12) * count;
      rebarCount = barsPerSide * 2 * count;

      recommendations.push('✓ Square footings suitable for point loads');
    } else if (footingType === 'round') {
      // Round pier footing
      const radius = wid / 2 / 12;
      cubicFeet = Math.PI * radius * radius * (dep / 12) * count;

      // Rebar: 3-4 vertical #4 bars per pier
      rebarFeet = (dep / 12 + 1) * 4 * count; // 4 bars per pier, 1' into footing
      rebarCount = 4 * count;

      recommendations.push('✓ Round piers ideal for deck/porch posts');
    }

    const cubicYards = cubicFeet / 27;
    const cubicYardsWithWaste = cubicYards * 1.1;

    // Bag calculations
    const bags80lb = Math.ceil(cubicFeet * 1.1 / 0.60);
    const bags60lb = Math.ceil(cubicFeet * 1.1 / 0.45);

    // Load capacity estimation (rough - depends on soil)
    // Assume 2000 PSF soil bearing capacity (average)
    const footingArea = footingType === 'round'
      ? Math.PI * Math.pow(wid / 2, 2) * count
      : footingType === 'continuous'
        ? len * wid
        : wid * wid * count;
    const loadCapacity = (footingArea / 144) * 2000; // Convert to sq ft, multiply by soil capacity

    // Cost estimate
    const concreteCost = cubicYards > 1 ? cubicYardsWithWaste * 150 : bags80lb * 5.50;
    const rebarCost = rebarFeet * 1;
    const estimatedCost = concreteCost + rebarCost;

    // Additional recommendations
    if (dep < 12) {
      recommendations.push('⚠ Minimum footing depth is typically 12"');
    }

    if (dep < 36) {
      recommendations.push('⚠ Check local frost line - footings must be below frost depth');
    } else {
      recommendations.push('✓ Depth adequate for most frost lines');
    }

    recommendations.push('✓ Use 3000 PSI concrete minimum for footings');
    recommendations.push('✓ Pour on undisturbed or compacted soil');

    setResult({
      cubicYards: cubicYardsWithWaste,
      cubicFeet,
      bags80lb,
      bags60lb,
      rebarFeet,
      rebarCount,
      estimatedCost,
      loadCapacity,
      recommendations
    });
    setError('');
    trackCalculatorUsage('footing');
  };

  const faqItems = [
    {
      question: 'How deep should footings be?',
      answer: 'Footings must extend below the frost line in your area to prevent heaving. Frost depth ranges from 0" in southern states to 48"+ in northern regions. Minimum footing depth is typically 12" in non-frost areas. Check your local building code for specific requirements.'
    },
    {
      question: 'How wide should a footing be for a foundation wall?',
      answer: 'The standard rule is footing width should be twice the wall thickness. An 8-inch concrete block wall needs a 16-inch wide footing minimum. For heavier loads or poor soil, footings may need to be wider. The depth should equal the wall thickness (8" wall = 8" deep footing minimum).'
    },
    {
      question: 'Do footings need rebar?',
      answer: 'Yes, footings should have rebar reinforcement. Continuous footings typically need two #4 horizontal bars running the length. Pad footings need a grid of #4 bars. Pier footings need 3-4 vertical #4 bars extending into the column above. Rebar should have 3" of concrete cover.'
    },
    {
      question: 'What is the difference between a footing and a foundation?',
      answer: 'A footing is the bottom portion that distributes weight to the soil - it is wider than the wall it supports. The foundation wall sits on top of the footing and transfers loads down to it. Think of footings as the shoes of your building - they spread the weight over a larger area.'
    },
    {
      question: 'Can I pour footings and foundation walls at the same time?',
      answer: 'Monolithic pours (footings and walls together) are common for residential construction using forms, but separate pours are more traditional. If pouring separately, install vertical rebar dowels in the footing to tie into the wall. The footing should cure 24-48 hours before wall forms are set.'
    }
  ];

  const relatedCalculators = [
    { title: 'Concrete Slab Calculator', link: '/construction/concrete-slab', description: 'Calculate concrete for slabs' },
    { title: 'Deck Footings Calculator', link: '/construction/deck-footings', description: 'Calculate deck post footings' },
    { title: 'Rebar Calculator', link: '/construction/rebar', description: 'Calculate rebar requirements' }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate concrete footing requirements:",
      steps: [
        "Select footing type: continuous (walls), square (posts), or round (piers)",
        "Enter dimensions - length and width for continuous, size for pads",
        "Select depth based on your frost line requirements",
        "Specify quantity for multiple pad or pier footings",
        "Enter wall thickness for continuous footings to check sizing"
      ]
    },
    whyMatters: {
      description: "Properly sized footings are critical for structural integrity. Undersized footings can settle unevenly, causing cracks in walls, doors that stick, and even structural failure. Footings must bear on undisturbed soil below the frost line.",
      benefits: [
        "Calculate concrete volume for any footing type",
        "Determine rebar requirements and placement",
        "Verify footing width meets load requirements",
        "Estimate load capacity based on soil bearing"
      ]
    },
    examples: [
      {
        title: "Continuous Foundation Footing",
        scenario: "40 foot wall, 8 inch block, 16 inch wide, 8 inch deep",
        calculation: "40 × (16/12) × (8/12) = 35.5 cu ft = 1.3 cu yards",
        result: "1.3 cu yards concrete, 80 ft of #4 rebar"
      },
      {
        title: "Deck Post Pad Footings",
        scenario: "Four 24×24×12 inch pad footings",
        calculation: "4 cu ft each × 4 = 16 cu ft = 0.59 cu yards",
        result: "13 bags (80lb), 32 ft rebar in grid pattern"
      }
    ],
    commonMistakes: [
      "Not digging below frost line (causes heaving)",
      "Pouring on loose fill instead of undisturbed soil",
      "Making footings too narrow for the load",
      "Not providing 3 inch minimum concrete cover over rebar",
      "Forgetting vertical rebar dowels for wall tie-in"
    ]
  };

  return (
    <CalculatorLayout
      title="Footing Calculator"
      description="Calculate concrete footing dimensions and materials for foundation walls, deck posts, and column piers. Includes rebar, volume, and load capacity estimates."
    >
      <CalculatorSchema
        name="Footing Calculator"
        description="Calculate concrete footing materials including volume, rebar, and load capacity for continuous, pad, and pier footings"
        url="/construction/footing"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="footingType">Footing Type</label>
          <select
            id="footingType"
            value={footingType}
            onChange={(e) => setFootingType(e.target.value)}
          >
            <option value="continuous">Continuous (Strip) - For Walls</option>
            <option value="square">Square (Pad) - For Posts/Columns</option>
            <option value="round">Round (Pier) - For Deck Posts</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="length">
            {footingType === 'continuous' ? 'Footing Length (feet)' : 'Not Used for This Type'}
          </label>
          <input
            type="number"
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="e.g., 40"
            min="1"
            step="0.5"
            disabled={footingType !== 'continuous'}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="width">
            {footingType === 'continuous' ? 'Footing Width (inches)' :
              footingType === 'square' ? 'Footing Size (inches)' :
                'Pier Diameter (inches)'}
          </label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder={footingType === 'round' ? 'e.g., 12' : 'e.g., 16'}
            min="1"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="depth">Depth (inches)</label>
          <select
            id="depth"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          >
            <option value="8">8" (Minimum)</option>
            <option value="12">12" (Standard)</option>
            <option value="18">18" (Light Frost)</option>
            <option value="24">24" (Moderate Frost)</option>
            <option value="36">36" (Northern Frost)</option>
            <option value="42">42" (Deep Frost)</option>
            <option value="48">48" (Extreme Frost)</option>
          </select>
        </div>

        {footingType === 'continuous' && (
          <div className={styles.inputGroup}>
            <label htmlFor="wallThickness">Wall Thickness (inches)</label>
            <select
              id="wallThickness"
              value={wallThickness}
              onChange={(e) => setWallThickness(e.target.value)}
            >
              <option value="6">6" (Concrete)</option>
              <option value="8">8" (Standard Block)</option>
              <option value="10">10" (Heavy Block)</option>
              <option value="12">12" (Commercial)</option>
            </select>
          </div>
        )}

        {(footingType === 'square' || footingType === 'round') && (
          <div className={styles.inputGroup}>
            <label htmlFor="numberOfFootings">Number of Footings</label>
            <input
              type="number"
              id="numberOfFootings"
              value={numberOfFootings}
              onChange={(e) => setNumberOfFootings(e.target.value)}
              placeholder="e.g., 4"
              min="1"
              step="1"
            />
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Footing
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Footing Requirements</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Concrete (with 10% overage):</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff', fontSize: '1.25rem' }}>{result.cubicYards.toFixed(2)} cubic yards</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Volume:</span>
                <span className={styles.resultValue}>{result.cubicFeet.toFixed(1)} cu ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>OR 80lb Bags:</span>
                <span className={styles.resultValue}>{result.bags80lb} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>OR 60lb Bags:</span>
                <span className={styles.resultValue}>{result.bags60lb} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Rebar (#4):</span>
                <span className={styles.resultValue}>{result.rebarFeet.toFixed(0)} linear ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Load Capacity:</span>
                <span className={styles.resultValue}>{(result.loadCapacity / 1000).toFixed(1)} kips</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Cost:</span>
                <span className={styles.resultValue}>${result.estimatedCost.toFixed(0)}</span>
              </div>
            </div>

            <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Recommendations</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.9rem' }}>
              {result.recommendations.map((rec, index) => (
                <li key={index} style={{
                  padding: '0.25rem 0',
                  color: rec.startsWith('✓') ? '#4CAF50' : '#FFC107'
                }}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <CalculatorContent {...contentData} />

      <FAQ items={faqItems} />

      <RelatedCalculators calculators={relatedCalculators} />

      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
