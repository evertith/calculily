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

export default function GravelCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [totalArea, setTotalArea] = useState<string>('');
  const [depth, setDepth] = useState<string>('4');
  const [gravelType, setGravelType] = useState<string>('pea');
  const [pricePerTon, setPricePerTon] = useState<string>('');
  const [pricePerYard, setPricePerYard] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Gravel types with density (tons per cubic yard)
  const gravelTypes: { [key: string]: { name: string; density: number; description: string } } = {
    'pea': { name: 'Pea Gravel', density: 1.4, description: 'Small, rounded stones for paths and landscaping' },
    'crushed-stone': { name: 'Crushed Stone', density: 1.4, description: 'Angular stones, good for driveways' },
    'river-rock': { name: 'River Rock', density: 1.35, description: 'Smooth, rounded decorative stones' },
    'decomposed-granite': { name: 'Decomposed Granite', density: 1.5, description: 'Fine material, compacts well for paths' },
    'limestone': { name: 'Limestone', density: 1.5, description: 'White/gray crushed stone, driveways and bases' },
    'granite': { name: 'Granite Gravel', density: 1.45, description: 'Durable, various colors available' },
    'road-base': { name: 'Road Base/Class 5', density: 1.6, description: 'Mix of stone and fines, compacts hard' },
    'lava-rock': { name: 'Lava Rock', density: 0.75, description: 'Lightweight, red/black decorative stone' },
    'marble-chips': { name: 'Marble Chips', density: 1.5, description: 'White decorative chips for landscaping' }
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let areaSqFt = 0;

    if (inputType === 'dimensions') {
      if (!length || parseFloat(length) <= 0) newErrors.push('Please enter a valid length');
      if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid width');
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

    if (!depth || parseFloat(depth) <= 0) newErrors.push('Please enter a valid depth');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const depthFeet = parseFloat(depth) / 12;
    const cubicFeet = areaSqFt * depthFeet;
    const cubicYards = cubicFeet / 27;

    // Get gravel density
    const gravel = gravelTypes[gravelType] || gravelTypes['pea'];
    const tons = cubicYards * gravel.density;

    // Standard dump truck holds 10-14 cubic yards or 15-20 tons
    const truckLoads = cubicYards > 10 ? Math.ceil(cubicYards / 12) : 0;

    // Cost calculations
    const costByTon = parseFloat(pricePerTon) ? tons * parseFloat(pricePerTon) : null;
    const costByYard = parseFloat(pricePerYard) ? cubicYards * parseFloat(pricePerYard) : null;

    // Coverage reference (at common depths)
    const coverage2in = cubicYards * 162; // sq ft per cubic yard at 2"
    const coverage4in = cubicYards * 81;  // sq ft per cubic yard at 4"

    setResults({
      areaSqFt: areaSqFt.toFixed(0),
      depthInches: parseFloat(depth).toFixed(1),
      cubicFeet: cubicFeet.toFixed(1),
      cubicYards: cubicYards.toFixed(2),
      tons: tons.toFixed(2),
      gravelName: gravel.name,
      gravelDescription: gravel.description,
      density: gravel.density,
      truckLoads,
      costByTon: costByTon ? costByTon.toFixed(2) : null,
      costByYard: costByYard ? costByYard.toFixed(2) : null,
      coverage2in,
      coverage4in
    });

    trackCalculatorUsage('Gravel Calculator', {
      inputType,
      areaSqFt: areaSqFt.toFixed(0),
      depth,
      gravelType,
      cubicYards: cubicYards.toFixed(2),
      tons: tons.toFixed(2)
    });
  };

  const faqItems = [
    {
      question: 'How deep should gravel be for a driveway?',
      answer: 'A gravel driveway typically needs 4-6 inches of gravel over a compacted base. For heavy traffic or soft soil, use 6-8 inches. The base layer should be larger crushed stone (1-2"), topped with smaller gravel for a smooth surface.'
    },
    {
      question: 'How many tons of gravel per cubic yard?',
      answer: 'It varies by gravel type: Pea gravel and crushed stone = ~1.4 tons/yard. Limestone and granite = ~1.5 tons/yard. Road base = ~1.6 tons/yard. Lava rock = only ~0.75 tons/yard due to its porous nature.'
    },
    {
      question: 'How much does a dump truck of gravel cost?',
      answer: 'Gravel typically costs $15-75 per ton or $25-100 per cubic yard, depending on type and location. A standard dump truck (10-12 cubic yards) of pea gravel costs $250-800 including delivery.'
    },
    {
      question: 'What type of gravel is best for driveways?',
      answer: 'Crushed stone or road base (Class 5) is best for driveways because it compacts well and provides a stable surface. Start with larger stone at the bottom (2-3") and top with smaller stone (1/2"-1") or decomposed granite.'
    },
    {
      question: 'How much area does a cubic yard of gravel cover?',
      answer: 'One cubic yard covers approximately: 162 sq ft at 2" deep, 108 sq ft at 3" deep, 81 sq ft at 4" deep, and 54 sq ft at 6" deep.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Mulch Calculator',
      link: '/construction/mulch',
      description: 'Calculate mulch for landscaping'
    },
    {
      title: 'Topsoil Calculator',
      link: '/construction/topsoil',
      description: 'Calculate topsoil for gardens'
    },
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for slabs and footings'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Ordering the right amount of gravel saves money and prevents multiple deliveries. Here's how to calculate your needs:",
      steps: [
        "Measure your area dimensions in feet, or enter the total square footage directly.",
        "Select the desired depth. Driveways need 4-6 inches, paths 2-3 inches, base layers 4 inches minimum.",
        "Choose your gravel type - this affects the weight calculation (tons) for ordering.",
        "Enter local pricing per ton or per cubic yard to estimate costs.",
        "Click 'Calculate' to see cubic yards and tons needed."
      ]
    },
    whyMatters: {
      description: "Gravel is typically sold by the ton or cubic yard, and the conversion between them varies significantly by gravel type. Lightweight lava rock weighs half as much as dense road base for the same volume. Getting this wrong means either expensive extra deliveries or paying for material you don't need.",
      benefits: [
        "Calculate both cubic yards and tons for accurate ordering",
        "Account for different gravel densities automatically",
        "Know if you need a full dump truck or partial load",
        "Compare costs between pricing methods (per ton vs per yard)",
        "Plan for proper depth based on your application"
      ]
    },
    examples: [
      {
        title: "Gravel Driveway",
        scenario: "A 12' × 50' driveway with 4 inches of crushed stone.",
        calculation: "600 sq ft × (4/12) ft = 200 cu ft = 7.4 cubic yards × 1.4 tons/yard = 10.4 tons",
        result: "Order 11 tons of crushed stone. At $45/ton, expect to pay ~$500 plus delivery."
      },
      {
        title: "Pea Gravel Patio",
        scenario: "A 15' × 20' patio area with 3 inches of pea gravel.",
        calculation: "300 sq ft × (3/12) ft = 75 cu ft = 2.8 cubic yards × 1.4 tons/yard = 3.9 tons",
        result: "Order 4 tons of pea gravel. Consider landscape fabric underneath to prevent sinking."
      },
      {
        title: "Decorative River Rock",
        scenario: "A 10' × 30' landscaping bed with 2 inches of river rock.",
        calculation: "300 sq ft × (2/12) ft = 50 cu ft = 1.85 cubic yards × 1.35 tons/yard = 2.5 tons",
        result: "Order 2.5-3 tons. River rock is decorative - you may need weed barrier underneath."
      }
    ],
    commonMistakes: [
      "Assuming all gravel weighs the same - lava rock is half the weight of road base for the same volume.",
      "Not compacting between layers - gravel settles significantly; compact each 2-inch layer.",
      "Skipping the base layer - proper driveways need larger stone at the bottom for drainage and stability.",
      "Ordering just cubic yards without knowing tons - many suppliers price and deliver by weight.",
      "Not accounting for settling - order 10-15% extra for areas that will be compacted."
    ]
  };

  return (
    <CalculatorLayout
      title="Gravel Calculator"
      description="Calculate cubic yards and tons of gravel needed for driveways, paths, and landscaping. Includes different gravel types and cost estimates."
    >
      <CalculatorSchema
        name="Gravel Calculator"
        description="Free gravel calculator to estimate cubic yards and tons for driveways, paths, and landscaping. Calculate by area and depth with cost estimates."
        url="/construction/gravel"
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
              Length × Width
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
              <label className={styles.label}>Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 50"
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
          </>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Area (square feet)</label>
            <input
              type="number"
              className={styles.input}
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="e.g., 600"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Gravel Depth (inches)</label>
          <select
            className={styles.select}
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          >
            <option value="1">1 inch - Light topping</option>
            <option value="2">2 inches - Decorative/paths</option>
            <option value="3">3 inches - Walkways</option>
            <option value="4">4 inches - Standard driveway</option>
            <option value="6">6 inches - Heavy duty driveway</option>
            <option value="8">8 inches - Commercial/base layer</option>
            <option value="12">12 inches - Heavy base/parking</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Gravel Type</label>
          <select
            className={styles.select}
            value={gravelType}
            onChange={(e) => setGravelType(e.target.value)}
          >
            {Object.entries(gravelTypes).map(([key, value]) => (
              <option key={key} value={key}>{value.name} (~{value.density} tons/yd)</option>
            ))}
          </select>
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            {gravelTypes[gravelType]?.description}
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Ton ($) - Optional</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerTon}
            onChange={(e) => setPricePerTon(e.target.value)}
            placeholder="e.g., 45"
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Cubic Yard ($) - Optional</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerYard}
            onChange={(e) => setPricePerYard(e.target.value)}
            placeholder="e.g., 55"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Gravel
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Gravel Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Area to Cover</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Depth</span>
            <span className={styles.resultValue}>{results.depthInches} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Gravel Type</span>
            <span className={styles.resultValue}>{results.gravelName}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cubic Yards</span>
            <span className={styles.resultValuePrimary}>{results.cubicYards} yards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Weight (at {results.density} tons/yd)</span>
            <span className={styles.resultValuePrimary}>{results.tons} tons</span>
          </div>

          {results.truckLoads > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Dump Truck Loads (~12 yd)</span>
              <span className={styles.resultValue}>{results.truckLoads} loads</span>
            </div>
          )}

          {(results.costByTon || results.costByYard) && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimates</h3>
              </div>

              {results.costByTon && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Cost by Weight</span>
                  <span className={styles.resultValue}>${results.costByTon}</span>
                </div>
              )}

              {results.costByYard && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Cost by Volume</span>
                  <span className={styles.resultValue}>${results.costByYard}</span>
                </div>
              )}
            </>
          )}

          <div className={styles.note}>
            <strong>Coverage Reference:</strong> At {results.depthInches}" depth, 1 cubic yard covers approximately {Math.round(27 / (parseFloat(results.depthInches) / 12))} square feet.
          </div>

          {parseFloat(results.cubicYards) > 3 && (
            <div className={styles.note}>
              <strong>Delivery Tip:</strong> For {results.cubicYards} cubic yards, bulk delivery is recommended.
              A standard dump truck holds 10-14 cubic yards. Most suppliers offer delivery for orders over 3 yards.
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
