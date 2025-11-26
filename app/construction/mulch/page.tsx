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

type InputType = 'area' | 'dimensions';

export default function MulchCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [totalArea, setTotalArea] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [depth, setDepth] = useState<string>('3');
  const [mulchType, setMulchType] = useState<string>('hardwood');
  const [pricePerYard, setPricePerYard] = useState<string>('35');
  const [pricePerBag, setPricePerBag] = useState<string>('4');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Mulch types with typical weights per cubic yard
  const mulchTypes: { [key: string]: { name: string; weightPerYard: number } } = {
    'hardwood': { name: 'Hardwood Bark', weightPerYard: 500 },
    'cedar': { name: 'Cedar Mulch', weightPerYard: 450 },
    'pine-bark': { name: 'Pine Bark', weightPerYard: 400 },
    'pine-straw': { name: 'Pine Straw', weightPerYard: 300 },
    'cypress': { name: 'Cypress Mulch', weightPerYard: 500 },
    'rubber': { name: 'Rubber Mulch', weightPerYard: 800 },
    'dyed-black': { name: 'Dyed Black', weightPerYard: 500 },
    'dyed-red': { name: 'Dyed Red', weightPerYard: 500 },
    'playground': { name: 'Playground Mulch', weightPerYard: 450 }
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let areaSqFt = 0;

    if (inputType === 'area') {
      if (!totalArea || parseFloat(totalArea) <= 0) {
        newErrors.push('Please enter a valid total area');
      } else {
        areaSqFt = parseFloat(totalArea);
      }
    } else {
      if (!length || parseFloat(length) <= 0) newErrors.push('Please enter a valid length');
      if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid width');
      if (newErrors.length === 0) {
        areaSqFt = parseFloat(length) * parseFloat(width);
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

    // Standard 2 cubic foot bags
    const bagsNeeded = Math.ceil(cubicFeet / 2);

    // Weight calculation
    const mulchInfo = mulchTypes[mulchType] || mulchTypes['hardwood'];
    const weightLbs = cubicYards * mulchInfo.weightPerYard;
    const weightTons = weightLbs / 2000;

    // Cost calculations
    const bulkCost = cubicYards * parseFloat(pricePerYard || '35');
    const bagCost = bagsNeeded * parseFloat(pricePerBag || '4');

    // Coverage per bag (2 cu ft per bag)
    // At 3" depth: 2 cu ft covers 8 sq ft
    // At 2" depth: 2 cu ft covers 12 sq ft
    const coveragePerBag = (2 / depthFeet);

    setResults({
      areaSqFt: areaSqFt.toFixed(0),
      depthInches: parseFloat(depth).toFixed(1),
      cubicFeet: cubicFeet.toFixed(1),
      cubicYards: cubicYards.toFixed(2),
      bagsNeeded,
      weightLbs: weightLbs.toFixed(0),
      weightTons: weightTons.toFixed(2),
      bulkCost: bulkCost.toFixed(2),
      bagCost: bagCost.toFixed(2),
      savings: (bagCost - bulkCost).toFixed(2),
      mulchType: mulchInfo.name,
      coveragePerBag: coveragePerBag.toFixed(1)
    });

    trackCalculatorUsage('Mulch Calculator', {
      inputType,
      areaSqFt: areaSqFt.toFixed(0),
      depth,
      mulchType,
      cubicYards: cubicYards.toFixed(2)
    });
  };

  const faqItems = [
    {
      question: 'How deep should mulch be?',
      answer: '2-4 inches is ideal for most applications. Use 2-3 inches around plants and trees (keep it away from trunks), and 3-4 inches for pathways and play areas. Deeper mulch can prevent water from reaching plant roots and may encourage pests.'
    },
    {
      question: 'How many bags of mulch do I need?',
      answer: 'A standard 2 cubic foot bag covers about 8 square feet at 3 inches deep, or 12 square feet at 2 inches deep. For larger areas (over 10 cubic yards), buying bulk mulch by the cubic yard is usually more economical.'
    },
    {
      question: 'What is the best type of mulch?',
      answer: 'Hardwood bark mulch is popular for flower beds as it decomposes slowly and enriches soil. Cedar and cypress naturally repel insects. Pine bark is acidic, good for acid-loving plants. Rubber mulch is long-lasting for playgrounds but does not improve soil.'
    },
    {
      question: 'How often should mulch be replaced?',
      answer: 'Most organic mulches should be topped off annually. Completely replace mulch every 2-3 years, or when it becomes compacted and water-repellent. Rubber and stone mulches can last 10+ years with occasional cleaning.'
    },
    {
      question: 'Bulk vs bagged mulch - which is cheaper?',
      answer: 'Bulk mulch is almost always cheaper for large areas (3+ cubic yards). You can save 30-50% buying bulk. However, bagged mulch is more convenient for small areas, easier to transport in a car, and stores well for future use.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Gravel Calculator',
      link: '/construction/gravel',
      description: 'Calculate gravel for driveways and paths'
    },
    {
      title: 'Topsoil Calculator',
      link: '/construction/topsoil',
      description: 'Calculate topsoil for gardens and lawns'
    },
    {
      title: 'Sod Calculator',
      link: '/construction/sod',
      description: 'Calculate sod for lawn installation'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Getting the right amount of mulch saves money and multiple trips to the garden center. Here's how to calculate accurately:",
      steps: [
        "Measure your garden beds, tree rings, or landscaped areas. For irregular shapes, break them into rectangles and add the areas together.",
        "Choose your desired mulch depth. 2-3 inches is standard for beds, 3-4 inches for pathways.",
        "Select your mulch type to get accurate weight estimates for delivery planning.",
        "Enter local pricing to compare bulk vs bagged costs.",
        "Click 'Calculate' to see cubic yards, number of bags, and cost comparison."
      ]
    },
    whyMatters: {
      description: "Mulch is one of the most important landscape materials - it conserves moisture, suppresses weeds, regulates soil temperature, and improves appearance. But too little mulch doesn't provide these benefits, and too much can harm plants by smothering roots and trapping excessive moisture.",
      benefits: [
        "Calculate exactly how much mulch you need - no more guessing",
        "Compare bulk vs bagged costs to find the best value",
        "Know the weight for planning delivery or pickup",
        "Avoid over-mulching which can harm plants",
        "Plan your budget accurately before purchasing"
      ]
    },
    examples: [
      {
        title: "Small Flower Bed",
        scenario: "A 6' × 10' flower bed at 3 inches of mulch depth.",
        calculation: "60 sq ft × (3/12) ft = 15 cubic feet ÷ 27 = 0.56 cubic yards",
        result: "You need 8 bags (2 cu ft each) or about half a cubic yard bulk."
      },
      {
        title: "Large Landscape Area",
        scenario: "500 square feet of beds around the house at 3 inches deep.",
        calculation: "500 sq ft × 0.25 ft = 125 cubic feet ÷ 27 = 4.6 cubic yards",
        result: "Order 5 cubic yards bulk. This would require 63 bags - bulk is much more economical."
      },
      {
        title: "Tree Rings",
        scenario: "5 tree rings, each approximately 6 feet diameter at 4 inches deep.",
        calculation: "5 × (π × 3² sq ft) × (4/12 ft) = 47 cubic feet = 1.74 cubic yards",
        result: "Order 2 cubic yards bulk or 24 bags. Keep mulch 6 inches away from tree trunks."
      }
    ],
    commonMistakes: [
      "Piling mulch against tree trunks ('volcano mulching') - this causes rot and pest problems. Keep mulch 6 inches away from trunks.",
      "Applying mulch too deep - more than 4 inches can prevent water from reaching roots and harbor pests.",
      "Not removing old, compacted mulch before adding new - turn or remove old mulch that's become water-repellent.",
      "Buying bags when bulk is cheaper - for 3+ cubic yards, bulk delivery often saves 30-50%.",
      "Forgetting to account for irregular shapes - break complex beds into rectangles for accurate measurement."
    ]
  };

  return (
    <CalculatorLayout
      title="Mulch Calculator"
      description="Calculate cubic yards and bags of mulch needed for your landscape beds, tree rings, and garden areas. Compare bulk vs bagged pricing."
    >
      <CalculatorSchema
        name="Mulch Calculator"
        description="Free mulch calculator to estimate cubic yards and bags needed. Calculate coverage at different depths and compare bulk vs bagged costs."
        url="/construction/mulch"
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
                placeholder="e.g., 20"
                step="0.1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Width (feet)</label>
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
              placeholder="e.g., 200"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Mulch Depth (inches)</label>
          <select
            className={styles.select}
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          >
            <option value="1">1 inch - Light topping</option>
            <option value="2">2 inches - Minimum recommended</option>
            <option value="3">3 inches - Standard depth</option>
            <option value="4">4 inches - Pathways/play areas</option>
            <option value="6">6 inches - Heavy coverage</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Mulch Type</label>
          <select
            className={styles.select}
            value={mulchType}
            onChange={(e) => setMulchType(e.target.value)}
          >
            <option value="hardwood">Hardwood Bark Mulch</option>
            <option value="cedar">Cedar Mulch</option>
            <option value="pine-bark">Pine Bark Mulch</option>
            <option value="pine-straw">Pine Straw/Needles</option>
            <option value="cypress">Cypress Mulch</option>
            <option value="dyed-black">Dyed Black Mulch</option>
            <option value="dyed-red">Dyed Red Mulch</option>
            <option value="rubber">Rubber Mulch</option>
            <option value="playground">Playground Mulch</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Cubic Yard (bulk) $</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerYard}
            onChange={(e) => setPricePerYard(e.target.value)}
            placeholder="e.g., 35"
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per 2 Cu Ft Bag $</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerBag}
            onChange={(e) => setPricePerBag(e.target.value)}
            placeholder="e.g., 4"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Mulch
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Mulch Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Area to Cover</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Depth</span>
            <span className={styles.resultValue}>{results.depthInches} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Mulch Type</span>
            <span className={styles.resultValue}>{results.mulchType}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cubic Yards Needed</span>
            <span className={styles.resultValuePrimary}>{results.cubicYards} yards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>2 Cu Ft Bags Needed</span>
            <span className={styles.resultValuePrimary}>{results.bagsNeeded} bags</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Approximate Weight</span>
            <span className={styles.resultValue}>{results.weightLbs} lbs ({results.weightTons} tons)</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Comparison</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Bulk Cost ({results.cubicYards} yards)</span>
            <span className={styles.resultValue}>${results.bulkCost}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Bagged Cost ({results.bagsNeeded} bags)</span>
            <span className={styles.resultValue}>${results.bagCost}</span>
          </div>

          {parseFloat(results.savings) > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Savings with Bulk</span>
              <span className={styles.resultValuePrimary} style={{ color: '#4caf50' }}>${results.savings}</span>
            </div>
          )}

          <div className={styles.note}>
            <strong>Coverage Tip:</strong> At {results.depthInches}" depth, each 2 cu ft bag covers approximately {results.coveragePerBag} sq ft.
            For areas over 3 cubic yards, bulk delivery is usually more economical.
          </div>

          {parseFloat(results.cubicYards) > 5 && (
            <div className={styles.note}>
              <strong>Large Order:</strong> For {results.cubicYards} cubic yards, consider delivery.
              This amount weighs approximately {results.weightTons} tons and would require multiple trips in a pickup truck.
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
