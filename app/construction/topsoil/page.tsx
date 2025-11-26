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

export default function TopsoilCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [totalArea, setTotalArea] = useState<string>('');
  const [depth, setDepth] = useState<string>('4');
  const [soilType, setSoilType] = useState<string>('screened');
  const [pricePerYard, setPricePerYard] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Soil types with density
  const soilTypes: { [key: string]: { name: string; density: number; description: string } } = {
    'screened': { name: 'Screened Topsoil', density: 1.1, description: 'Filtered, weed-free, ideal for gardens' },
    'unscreened': { name: 'Unscreened Topsoil', density: 1.2, description: 'May contain debris, cheaper option' },
    'garden-mix': { name: 'Garden Mix', density: 1.0, description: 'Topsoil + compost blend for planting' },
    'compost': { name: 'Compost', density: 0.6, description: 'Pure organic matter for soil amendment' },
    'fill-dirt': { name: 'Fill Dirt', density: 1.4, description: 'For grading, not for planting' },
    'loam': { name: 'Sandy Loam', density: 1.1, description: 'Balanced sand/silt/clay, excellent drainage' }
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

    // Get soil info
    const soil = soilTypes[soilType] || soilTypes['screened'];
    const tons = cubicYards * soil.density;

    // Standard bags are typically 1 cubic foot or 40 lbs
    const bags1CuFt = Math.ceil(cubicFeet);
    const bags40lb = Math.ceil((tons * 2000) / 40);

    // Cost calculation
    const price = parseFloat(pricePerYard) || 0;
    const totalCost = price > 0 ? cubicYards * price : null;

    // Truck load info
    const truckLoads = cubicYards > 10 ? Math.ceil(cubicYards / 12) : 0;

    // Coverage at different depths
    const coverage = {
      '1in': (cubicYards * 324).toFixed(0),
      '2in': (cubicYards * 162).toFixed(0),
      '4in': (cubicYards * 81).toFixed(0),
      '6in': (cubicYards * 54).toFixed(0)
    };

    setResults({
      areaSqFt: areaSqFt.toFixed(0),
      depthInches: parseFloat(depth).toFixed(1),
      cubicFeet: cubicFeet.toFixed(1),
      cubicYards: cubicYards.toFixed(2),
      tons: tons.toFixed(2),
      bags1CuFt,
      bags40lb,
      soilName: soil.name,
      soilDescription: soil.description,
      density: soil.density,
      truckLoads,
      totalCost: totalCost ? totalCost.toFixed(2) : null,
      coverage
    });

    trackCalculatorUsage('Topsoil Calculator', {
      inputType,
      areaSqFt: areaSqFt.toFixed(0),
      depth,
      soilType,
      cubicYards: cubicYards.toFixed(2)
    });
  };

  const faqItems = [
    {
      question: 'How deep should topsoil be for a new lawn?',
      answer: 'For a healthy lawn, apply 4-6 inches of topsoil. Grass roots typically grow 4-6 inches deep. For overseeding existing lawns, 1-2 inches is sufficient to improve soil quality.'
    },
    {
      question: 'How much topsoil do I need for a raised garden bed?',
      answer: 'Fill raised beds with 8-12 inches of soil for vegetables and flowers. A 4×8 raised bed at 10 inches deep needs about 1 cubic yard. Use a garden mix (topsoil + compost) for best results.'
    },
    {
      question: 'What is the difference between topsoil and garden soil?',
      answer: 'Topsoil is the natural top layer of earth. Garden soil/mix is topsoil blended with compost and other amendments for improved drainage and nutrients. Garden mix is better for planting; topsoil is cheaper for filling and grading.'
    },
    {
      question: 'How much does a cubic yard of topsoil weigh?',
      answer: 'Screened topsoil weighs about 2,200 pounds (1.1 tons) per cubic yard. Wet topsoil can weigh up to 2,700 pounds. Compost is lighter at about 1,200 pounds per cubic yard.'
    },
    {
      question: 'Should I buy bagged or bulk topsoil?',
      answer: 'Bulk is much cheaper for areas over 100 square feet. Bulk costs $25-50 per cubic yard; bags cost $5-8 per cubic foot ($135-216 per cubic yard equivalent). Bags are convenient for small projects and easier to transport.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Mulch Calculator',
      link: '/construction/mulch',
      description: 'Calculate mulch for landscaping'
    },
    {
      title: 'Sod Calculator',
      link: '/construction/sod',
      description: 'Calculate sod for new lawns'
    },
    {
      title: 'Gravel Calculator',
      link: '/construction/gravel',
      description: 'Calculate gravel for paths and driveways'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Getting the right amount of topsoil ensures healthy plants without overspending. Here's how to calculate your needs:",
      steps: [
        "Measure your area dimensions in feet, or calculate the total square footage for irregular shapes.",
        "Determine the depth needed: 4-6 inches for new lawns, 8-12 inches for raised beds, 1-2 inches for top-dressing.",
        "Select your soil type based on the project - screened topsoil for lawns, garden mix for planting beds.",
        "Enter local bulk pricing to estimate costs and compare to bagged options.",
        "Click 'Calculate' to see cubic yards, bags, and tons needed."
      ]
    },
    whyMatters: {
      description: "Quality topsoil is the foundation for healthy plants. Too little soil leads to poor root development and stressed plants. Too much is a waste of money. Knowing the exact quantity also helps you choose between bulk delivery and bags - bulk is typically 60-70% cheaper for larger projects.",
      benefits: [
        "Calculate exact cubic yards for bulk ordering",
        "Know bag counts if bulk isn't practical",
        "Compare bulk vs bag pricing to save money",
        "Ensure proper depth for your specific project",
        "Plan for delivery needs (truck capacity)"
      ]
    },
    examples: [
      {
        title: "New Lawn Installation",
        scenario: "A 2,000 sq ft front yard needs 4 inches of topsoil before seeding.",
        calculation: "2,000 sq ft × (4/12) ft = 667 cu ft = 24.7 cubic yards",
        result: "Order 25 cubic yards bulk (~27.5 tons). At $35/yard, expect ~$875 plus delivery."
      },
      {
        title: "Raised Garden Beds",
        scenario: "Four 4×8 raised beds, 10 inches deep each.",
        calculation: "4 beds × 32 sq ft × (10/12) ft = 107 cu ft = 4 cubic yards",
        result: "Order 4 cubic yards of garden mix. This is borderline for bulk delivery - check minimums."
      },
      {
        title: "Top-Dressing Existing Lawn",
        scenario: "1,500 sq ft lawn needs 1 inch of compost for improvement.",
        calculation: "1,500 sq ft × (1/12) ft = 125 cu ft = 4.6 cubic yards",
        result: "Order 5 cubic yards of compost. At 0.6 tons/yard, this weighs only ~3 tons."
      }
    ],
    commonMistakes: [
      "Ordering the wrong type - fill dirt is for grading only, not planting. Use screened topsoil or garden mix for plants.",
      "Underestimating depth for new lawns - 4-6 inches minimum for healthy root development.",
      "Buying bags when bulk is cheaper - for 3+ cubic yards, bulk delivery usually saves 60-70%.",
      "Not accounting for settling - fresh topsoil settles 10-15%. Order slightly more than calculated.",
      "Ignoring soil quality - cheap unscreened topsoil may contain weed seeds, rocks, and debris."
    ]
  };

  return (
    <CalculatorLayout
      title="Topsoil Calculator"
      description="Calculate cubic yards and tons of topsoil needed for lawns, gardens, and raised beds. Compare bulk vs bagged pricing."
    >
      <CalculatorSchema
        name="Topsoil Calculator"
        description="Free topsoil calculator to estimate cubic yards for lawns, gardens, and landscaping. Calculate by area and depth with cost estimates."
        url="/construction/topsoil"
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
                placeholder="e.g., 40"
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
              placeholder="e.g., 2000"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Depth (inches)</label>
          <select
            className={styles.select}
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          >
            <option value="1">1 inch - Light top-dressing</option>
            <option value="2">2 inches - Lawn overseeding</option>
            <option value="4">4 inches - New lawn minimum</option>
            <option value="6">6 inches - New lawn standard</option>
            <option value="8">8 inches - Raised bed minimum</option>
            <option value="10">10 inches - Raised bed standard</option>
            <option value="12">12 inches - Deep raised bed</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Soil Type</label>
          <select
            className={styles.select}
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
          >
            {Object.entries(soilTypes).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            {soilTypes[soilType]?.description}
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Cubic Yard ($) - Optional</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerYard}
            onChange={(e) => setPricePerYard(e.target.value)}
            placeholder="e.g., 35"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Topsoil
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Topsoil Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Area to Cover</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Depth</span>
            <span className={styles.resultValue}>{results.depthInches} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Soil Type</span>
            <span className={styles.resultValue}>{results.soilName}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cubic Yards</span>
            <span className={styles.resultValuePrimary}>{results.cubicYards} yards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Weight (at {results.density} tons/yd)</span>
            <span className={styles.resultValue}>{results.tons} tons</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Bagged Equivalent</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>1 Cubic Foot Bags</span>
            <span className={styles.resultValue}>{results.bags1CuFt} bags</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>40 lb Bags</span>
            <span className={styles.resultValue}>{results.bags40lb} bags</span>
          </div>

          {results.truckLoads > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Dump Truck Loads (~12 yd)</span>
              <span className={styles.resultValue}>{results.truckLoads} loads</span>
            </div>
          )}

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Bulk Cost Estimate</span>
                  <span className={styles.resultValuePrimary}>${results.totalCost}</span>
                </div>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Coverage Reference:</strong> {results.cubicYards} cubic yards covers:
            <br />• {results.coverage['1in']} sq ft at 1" deep
            <br />• {results.coverage['2in']} sq ft at 2" deep
            <br />• {results.coverage['4in']} sq ft at 4" deep
          </div>

          {parseFloat(results.cubicYards) > 3 && (
            <div className={styles.note}>
              <strong>Bulk Savings:</strong> At {results.cubicYards} cubic yards, bulk delivery saves 60-70% compared to bags.
              Bags would cost approximately ${(results.bags1CuFt * 5).toFixed(0)}-${(results.bags1CuFt * 7).toFixed(0)}.
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
