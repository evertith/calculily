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

export default function ConcreteSlabCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('4');
  const [slabType, setSlabType] = useState('patio');
  const [addRebar, setAddRebar] = useState(true);
  const [result, setResult] = useState<{
    cubicYards: number;
    cubicFeet: number;
    bags60lb: number;
    bags80lb: number;
    squareFeet: number;
    rebarNeeded: { lengthBars: number; widthBars: number; totalFeet: number };
    meshSheets: number;
    gravelTons: number;
    formBoardFeet: number;
    estimatedCost: number;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const len = parseFloat(length);
    const wid = parseFloat(width);
    const thick = parseFloat(thickness);

    if (isNaN(len) || len <= 0 || isNaN(wid) || wid <= 0) {
      setError('Please enter valid length and width');
      setResult(null);
      return;
    }

    // Calculate volume
    const squareFeet = len * wid;
    const cubicFeet = squareFeet * (thick / 12);
    const cubicYards = cubicFeet / 27;

    // Add 10% waste for ready-mix
    const cubicYardsWithWaste = cubicYards * 1.10;

    // Bag concrete calculations (if small project)
    // 60lb bag = 0.45 cu ft, 80lb bag = 0.60 cu ft
    const bags60lb = Math.ceil(cubicFeet * 1.1 / 0.45);
    const bags80lb = Math.ceil(cubicFeet * 1.1 / 0.60);

    // Rebar calculations (if needed)
    // Standard 12" on center grid
    const rebarSpacing = 12; // inches
    const lengthBars = Math.ceil(wid * 12 / rebarSpacing) + 1;
    const widthBars = Math.ceil(len * 12 / rebarSpacing) + 1;
    const rebarTotalFeet = (lengthBars * len) + (widthBars * wid);

    // Wire mesh (6x6 W1.4/W1.4) - sheets are typically 5' x 150' rolls or 5x10 sheets
    const meshSheets = Math.ceil(squareFeet / 50) * 1.1; // 10% overlap

    // Gravel base (4" typical) - about 1.35 tons per cubic yard
    const gravelCubicYards = (squareFeet * (4 / 12)) / 27;
    const gravelTons = gravelCubicYards * 1.35;

    // Form boards - perimeter
    const perimeter = 2 * (len + wid);
    const formBoardFeet = perimeter * (thick / 12); // Board feet for forms

    // Cost estimate
    // Ready mix ~$150/yard, bags ~$5-6 each, rebar ~$1/ft, gravel ~$30/ton
    let estimatedCost = 0;
    if (cubicYards > 1) {
      estimatedCost = cubicYardsWithWaste * 150; // Ready mix
    } else {
      estimatedCost = bags80lb * 5.50; // Bags for small projects
    }
    estimatedCost += gravelTons * 30; // Gravel
    if (addRebar) {
      estimatedCost += rebarTotalFeet * 1; // Rebar
    }
    estimatedCost += perimeter * 3; // Form lumber

    const recommendations: string[] = [];

    // Thickness recommendations by use
    if (slabType === 'patio' && thick < 4) {
      recommendations.push('⚠ Patios should be minimum 4" thick');
    }
    if (slabType === 'driveway' && thick < 6) {
      recommendations.push('⚠ Driveways should be minimum 6" thick');
    }
    if (slabType === 'garage' && thick < 4) {
      recommendations.push('⚠ Garage slabs should be minimum 4" thick');
    }
    if (slabType === 'heavyLoad' && thick < 6) {
      recommendations.push('⚠ Heavy load slabs need minimum 6" with rebar');
    }

    // Size-based recommendations
    if (cubicYards > 1) {
      recommendations.push('✓ Order ready-mix concrete for this size project');
    } else {
      recommendations.push('✓ Bag concrete suitable for this small pour');
    }

    if (squareFeet > 100 && !addRebar) {
      recommendations.push('⚠ Consider adding rebar or wire mesh for slabs over 100 sq ft');
    }

    if (slabType === 'driveway' || slabType === 'heavyLoad') {
      recommendations.push('✓ Use 4000 PSI concrete minimum for vehicle traffic');
    } else {
      recommendations.push('✓ 3000 PSI concrete adequate for pedestrian use');
    }

    recommendations.push('✓ Pour on compacted gravel base (4" minimum)');
    recommendations.push('✓ Install control joints every 8-10 feet');

    setResult({
      cubicYards: cubicYardsWithWaste,
      cubicFeet,
      bags60lb,
      bags80lb,
      squareFeet,
      rebarNeeded: { lengthBars, widthBars, totalFeet: rebarTotalFeet },
      meshSheets,
      gravelTons,
      formBoardFeet,
      estimatedCost,
      recommendations
    });
    setError('');
    trackCalculatorUsage('concrete-slab');
  };

  const faqItems = [
    {
      question: 'How thick should a concrete slab be?',
      answer: 'Thickness depends on use: sidewalks and patios need 4 inches minimum, driveways for passenger vehicles need 5-6 inches, and areas with heavy trucks or equipment need 6+ inches with rebar reinforcement. Residential garage slabs are typically 4 inches with wire mesh.'
    },
    {
      question: 'Do I need rebar or wire mesh in a concrete slab?',
      answer: 'Wire mesh (6x6 W1.4/W1.4) is adequate for most residential slabs under 4 inches thick with light foot traffic. Use #4 rebar on 12-18 inch centers for driveways, garage floors, and any slab over 4 inches thick. Rebar provides significantly more crack resistance than wire mesh.'
    },
    {
      question: 'How much does concrete cost per cubic yard?',
      answer: 'Ready-mix concrete costs $120-180 per cubic yard delivered, depending on location and mix strength. This typically includes delivery for a minimum order (usually 1-3 yards). Bag concrete costs more per volume (~$4-6 per 80lb bag, about $180/cubic yard) but is practical for small projects under 1 cubic yard.'
    },
    {
      question: 'What is a control joint and why do I need them?',
      answer: 'Control joints (also called contraction joints) are grooves cut into the slab that create weak points where cracks will form in a straight line rather than randomly. They should be cut 1/4 of the slab depth and placed every 8-10 feet, or in a grid pattern for larger slabs. Cut within 4-12 hours of pouring.'
    },
    {
      question: 'Do I need a gravel base under a concrete slab?',
      answer: 'Yes, a compacted gravel base is essential. Use 4-6 inches of crushed gravel or road base, compacted in 2-inch lifts. The gravel provides drainage, prevents frost heave, and ensures the slab has uniform support. Pour directly on dirt leads to settlement cracks.'
    }
  ];

  const relatedCalculators = [
    { title: 'Footing Calculator', link: '/construction/footing', description: 'Calculate foundation footing materials' },
    { title: 'Concrete Steps Calculator', link: '/construction/concrete-steps', description: 'Calculate concrete for steps' },
    { title: 'Rebar Calculator', link: '/construction/rebar', description: 'Calculate rebar requirements' }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate concrete slab materials accurately:",
      steps: [
        "Enter the length and width of your slab in feet",
        "Select thickness based on intended use (4 inch patio, 6 inch driveway)",
        "Choose the slab application type for appropriate recommendations",
        "Check rebar option if you want reinforcement calculations",
        "Review concrete volume, bag count, gravel, and rebar needs"
      ]
    },
    whyMatters: {
      description: "Accurate concrete slab calculations prevent costly mistakes. Ordering too little means a cold joint if the truck leaves and returns, while ordering too much wastes expensive material. Understanding thickness requirements prevents premature failure.",
      benefits: [
        "Calculate cubic yards with 10% overage built in",
        "Get bag count alternatives for small projects",
        "Know rebar and wire mesh requirements",
        "Estimate gravel base and form board needs"
      ]
    },
    examples: [
      {
        title: "12×20 Foot Patio Slab",
        scenario: "4 inch thick patio with wire mesh reinforcement",
        calculation: "12 × 20 × (4/12) = 80 cu ft = 2.96 cu yards",
        result: "3.3 cu yards (with overage), 5 mesh sheets, 1.2 tons gravel"
      },
      {
        title: "Driveway Slab",
        scenario: "10×20 foot driveway, 6 inches thick with rebar",
        calculation: "10 × 20 × (6/12) = 100 cu ft = 3.7 cu yards",
        result: "4.1 cu yards, #4 rebar at 12 inch centers, 1.5 tons gravel"
      }
    ],
    commonMistakes: [
      "Underestimating material needs (always add 10% overage)",
      "Not compacting gravel base (causes settlement)",
      "Forgetting to slope for drainage (1/8 inch per foot minimum)",
      "Removing forms too soon (wait 24-48 hours)",
      "Setting rebar on ground instead of supporting mid-slab with chairs"
    ]
  };

  return (
    <CalculatorLayout
      title="Concrete Slab Calculator"
      description="Calculate concrete volume in cubic yards, bags needed, rebar requirements, and gravel base for your patio, driveway, or garage floor slab."
    >
      <CalculatorSchema
        name="Concrete Slab Calculator"
        description="Calculate concrete slab materials including cubic yards, bags, rebar, wire mesh, and gravel base requirements"
        url="/construction/concrete-slab"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="length">Length (feet)</label>
          <input
            type="number"
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="e.g., 20"
            min="1"
            step="0.5"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="width">Width (feet)</label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g., 10"
            min="1"
            step="0.5"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="thickness">Thickness (inches)</label>
          <select
            id="thickness"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
          >
            <option value="3">3" (Light Duty)</option>
            <option value="4">4" (Standard - Patios, Walkways)</option>
            <option value="5">5" (Medium Duty)</option>
            <option value="6">6" (Driveways, Garage)</option>
            <option value="8">8" (Heavy Equipment)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="slabType">Slab Application</label>
          <select
            id="slabType"
            value={slabType}
            onChange={(e) => setSlabType(e.target.value)}
          >
            <option value="sidewalk">Sidewalk / Path</option>
            <option value="patio">Patio / Porch</option>
            <option value="garage">Garage Floor</option>
            <option value="driveway">Driveway</option>
            <option value="shed">Shed Pad</option>
            <option value="heavyLoad">Heavy Equipment Pad</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={addRebar}
              onChange={(e) => setAddRebar(e.target.checked)}
            />
            Include rebar reinforcement calculations
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Materials
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Concrete Slab Materials</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Concrete (with 10% overage):</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff', fontSize: '1.25rem' }}>{result.cubicYards.toFixed(2)} cubic yards</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Slab Area:</span>
                <span className={styles.resultValue}>{result.squareFeet.toFixed(0)} sq ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Volume:</span>
                <span className={styles.resultValue}>{result.cubicFeet.toFixed(1)} cu ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>OR Bag Mix (80lb):</span>
                <span className={styles.resultValue}>{result.bags80lb} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>OR Bag Mix (60lb):</span>
                <span className={styles.resultValue}>{result.bags60lb} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Gravel Base (4"):</span>
                <span className={styles.resultValue}>{result.gravelTons.toFixed(2)} tons</span>
              </div>
              {addRebar && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Rebar (#4 @ 12" OC):</span>
                  <span className={styles.resultValue}>{result.rebarNeeded.totalFeet.toFixed(0)} linear ft</span>
                </div>
              )}
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Wire Mesh (5×10 sheets):</span>
                <span className={styles.resultValue}>{Math.ceil(result.meshSheets)} sheets</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Material Cost:</span>
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
