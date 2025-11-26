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

export default function SodCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [totalArea, setTotalArea] = useState<string>('');
  const [wasteFactor, setWasteFactor] = useState<string>('5');
  const [sodType, setSodType] = useState<string>('bermuda');
  const [pricePerSqFt, setPricePerSqFt] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Sod types with info
  const sodTypes: { [key: string]: { name: string; priceRange: string; climate: string } } = {
    'bermuda': { name: 'Bermuda Grass', priceRange: '$0.30-0.50', climate: 'Warm (South)' },
    'kentucky-blue': { name: 'Kentucky Bluegrass', priceRange: '$0.35-0.60', climate: 'Cool (North)' },
    'fescue': { name: 'Tall Fescue', priceRange: '$0.30-0.50', climate: 'Transitional' },
    'st-augustine': { name: 'St. Augustine', priceRange: '$0.35-0.55', climate: 'Warm (South)' },
    'zoysia': { name: 'Zoysia', priceRange: '$0.40-0.70', climate: 'Warm to Transitional' },
    'centipede': { name: 'Centipede', priceRange: '$0.30-0.45', climate: 'Warm (Southeast)' },
    'bahia': { name: 'Bahia', priceRange: '$0.25-0.40', climate: 'Warm (Florida)' }
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

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const waste = parseFloat(wasteFactor) || 5;
    const areaWithWaste = areaSqFt * (1 + waste / 100);

    // Sod pallet sizes vary by region, typically 450-500 sq ft per pallet
    const palletSqFt = 450; // Conservative estimate
    const palletsNeeded = Math.ceil(areaWithWaste / palletSqFt);

    // Individual rolls/pieces (typically 2' x 5' = 10 sq ft each)
    const rollSqFt = 10;
    const rollsNeeded = Math.ceil(areaWithWaste / rollSqFt);

    // Cost calculation
    const price = parseFloat(pricePerSqFt) || 0;
    const totalCost = price > 0 ? areaWithWaste * price : null;

    // Topsoil recommendation (4" prep layer)
    const topsoilCubicYards = (areaSqFt * (4 / 12)) / 27;

    // Starter fertilizer (about 1 lb per 1000 sq ft)
    const fertilizerLbs = Math.ceil(areaWithWaste / 1000);

    const sod = sodTypes[sodType] || sodTypes['bermuda'];

    setResults({
      areaSqFt: areaSqFt.toFixed(0),
      areaWithWaste: areaWithWaste.toFixed(0),
      wasteFactor: waste,
      palletsNeeded,
      palletSqFt,
      rollsNeeded,
      rollSqFt,
      sodName: sod.name,
      sodPriceRange: sod.priceRange,
      sodClimate: sod.climate,
      topsoilCubicYards: topsoilCubicYards.toFixed(2),
      fertilizerLbs,
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Sod Calculator', {
      inputType,
      areaSqFt: areaSqFt.toFixed(0),
      sodType,
      palletsNeeded: palletsNeeded.toString()
    });
  };

  const faqItems = [
    {
      question: 'How much does a pallet of sod cover?',
      answer: 'A standard pallet covers 450-500 square feet, depending on the supplier and grass type. Sod pieces are typically 16" × 24" (2.67 sq ft) or 2\' × 5\' rolls (10 sq ft). Always confirm coverage with your supplier.'
    },
    {
      question: 'How much extra sod should I order?',
      answer: 'Order 5-10% extra for waste from cutting around edges, curves, and obstacles. For irregular shaped lawns or first-time installers, order 10%. Leftover sod can be used to patch damaged areas.'
    },
    {
      question: 'When is the best time to install sod?',
      answer: 'Spring and fall are ideal in most climates. Avoid extreme heat (over 90°F) or cold (below 40°F). Warm-season grasses (Bermuda, St. Augustine) establish best in late spring. Cool-season grasses (Kentucky Bluegrass, Fescue) prefer early fall.'
    },
    {
      question: 'How do I prepare the ground for sod?',
      answer: 'Remove old grass/weeds, till soil 4-6 inches deep, add 2-4 inches of topsoil if needed, level the area, apply starter fertilizer, and water lightly before laying sod. The finished grade should be 1 inch below sidewalks/driveways.'
    },
    {
      question: 'How long does sod take to root?',
      answer: 'Sod typically roots in 2-3 weeks with proper watering. Avoid heavy foot traffic for 3-4 weeks. You can mow after 2-3 weeks when roots are established - gently tug a corner to check. Full establishment takes 6-8 weeks.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Topsoil Calculator',
      link: '/construction/topsoil',
      description: 'Calculate topsoil for lawn prep'
    },
    {
      title: 'Mulch Calculator',
      link: '/construction/mulch',
      description: 'Calculate mulch for landscaping'
    },
    {
      title: 'Fence Calculator',
      link: '/calculators/fence',
      description: 'Calculate fence materials'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Ordering the right amount of sod ensures complete coverage without wasting money on excess. Here's how to calculate your needs:",
      steps: [
        "Measure your lawn area in feet. For irregular shapes, break into rectangles and triangles, then add the areas together.",
        "Select your grass type based on your climate zone and sun exposure.",
        "Add a waste factor: 5% for simple rectangles, 10% for curves and obstacles.",
        "Enter local pricing if known to estimate total cost.",
        "Click 'Calculate' to see pallets, rolls, and preparation materials needed."
      ]
    },
    whyMatters: {
      description: "Fresh sod must be installed within 24-48 hours of delivery, so ordering the right amount is critical. Too little means an incomplete lawn and a second delivery. Too much means wasted money on sod that dies before you can use it. Accurate calculations ensure one efficient installation.",
      benefits: [
        "Calculate exact coverage including waste for cuts",
        "Know how many pallets to order for delivery",
        "Estimate topsoil and fertilizer needs for proper prep",
        "Budget accurately with cost estimates",
        "Choose the right grass type for your climate"
      ]
    },
    examples: [
      {
        title: "Rectangular Front Yard",
        scenario: "A 40' × 30' front yard with Bermuda grass.",
        calculation: "1,200 sq ft + 5% waste = 1,260 sq ft needed",
        result: "Order 3 pallets (450 sq ft each). At $0.35/sq ft, expect ~$440 for sod."
      },
      {
        title: "Backyard with Pool",
        scenario: "A 50' × 60' backyard minus a 15' × 30' pool area.",
        calculation: "3,000 - 450 = 2,550 sq ft + 10% waste (curves) = 2,805 sq ft",
        result: "Order 6-7 pallets. Extra waste factor for curves around pool."
      },
      {
        title: "Small Side Yard",
        scenario: "A 10' × 40' side yard with Kentucky Bluegrass.",
        calculation: "400 sq ft + 5% = 420 sq ft = about 1 pallet",
        result: "1 pallet covers this with extra for repairs. Some suppliers sell by the roll for small areas."
      }
    ],
    commonMistakes: [
      "Not preparing the soil properly - poor prep leads to sod that doesn't root and dies.",
      "Ordering exact square footage without waste - always add 5-10% for cuts and fitting.",
      "Installing sod in extreme weather - avoid very hot, cold, or dry conditions.",
      "Not watering immediately and frequently - new sod needs water daily for 2-3 weeks.",
      "Walking on new sod - avoid foot traffic for at least 3 weeks while roots establish."
    ]
  };

  return (
    <CalculatorLayout
      title="Sod Calculator"
      description="Calculate how many pallets and square feet of sod you need for your lawn. Includes waste factor, grass types, and cost estimates."
    >
      <CalculatorSchema
        name="Sod Calculator"
        description="Free sod calculator to estimate pallets and square feet for lawn installation. Calculate by area with grass type selection and cost estimates."
        url="/construction/sod"
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
                placeholder="e.g., 30"
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
              placeholder="e.g., 1500"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Grass Type</label>
          <select
            className={styles.select}
            value={sodType}
            onChange={(e) => setSodType(e.target.value)}
          >
            {Object.entries(sodTypes).map(([key, value]) => (
              <option key={key} value={key}>{value.name} - {value.climate}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor (%)</label>
          <select
            className={styles.select}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
          >
            <option value="5">5% - Simple rectangular area</option>
            <option value="10">10% - Curves or obstacles</option>
            <option value="15">15% - Complex shape</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Square Foot ($) - Optional</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerSqFt}
            onChange={(e) => setPricePerSqFt(e.target.value)}
            placeholder="e.g., 0.40"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Sod
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Sod Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Lawn Area</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With {results.wasteFactor}% Waste</span>
            <span className={styles.resultValue}>{results.areaWithWaste} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Grass Type</span>
            <span className={styles.resultValue}>{results.sodName}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Typical Price Range</span>
            <span className={styles.resultValue}>{results.sodPriceRange}/sq ft</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Sod Quantity</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Pallets ({results.palletSqFt} sq ft each)</span>
            <span className={styles.resultValuePrimary}>{results.palletsNeeded} pallets</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rolls/Pieces ({results.rollSqFt} sq ft each)</span>
            <span className={styles.resultValue}>{results.rollsNeeded} pieces</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Preparation Materials</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Topsoil (4" prep layer)</span>
            <span className={styles.resultValue}>{results.topsoilCubicYards} cubic yards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Starter Fertilizer</span>
            <span className={styles.resultValue}>{results.fertilizerLbs} lbs</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Estimated Sod Cost</span>
                  <span className={styles.resultValuePrimary}>${results.totalCost}</span>
                </div>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Important:</strong> Install sod within 24-48 hours of delivery. Water immediately after installation
            and keep soil moist (not soggy) for 2-3 weeks while roots establish.
          </div>

          <div className={styles.note}>
            <strong>Climate Match:</strong> {results.sodName} is best suited for {results.sodClimate} climates.
            Consult local nurseries for the best grass type for your specific area.
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
