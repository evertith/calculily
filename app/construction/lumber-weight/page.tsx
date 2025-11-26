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

export default function LumberWeightCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [species, setSpecies] = useState<string>('pine-southern');
  const [dimension, setDimension] = useState<string>('2x4');
  const [length, setLength] = useState<string>('8');
  const [quantity, setQuantity] = useState<string>('1');
  const [moistureContent, setMoistureContent] = useState<string>('dry');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Weight in lbs per cubic foot at 12% moisture content
  const speciesWeights: Record<string, { name: string; dry: number; green: number }> = {
    'pine-southern': { name: 'Southern Pine', dry: 36, green: 55 },
    'pine-white': { name: 'White Pine', dry: 25, green: 45 },
    'pine-ponderosa': { name: 'Ponderosa Pine', dry: 28, green: 48 },
    'fir-douglas': { name: 'Douglas Fir', dry: 34, green: 50 },
    'spruce': { name: 'Spruce (SPF)', dry: 27, green: 45 },
    'cedar-western': { name: 'Western Red Cedar', dry: 23, green: 35 },
    'cedar-northern': { name: 'Northern White Cedar', dry: 22, green: 32 },
    'redwood': { name: 'Redwood', dry: 28, green: 50 },
    'oak-red': { name: 'Red Oak', dry: 44, green: 65 },
    'oak-white': { name: 'White Oak', dry: 47, green: 68 },
    'maple-hard': { name: 'Hard Maple', dry: 44, green: 60 },
    'maple-soft': { name: 'Soft Maple', dry: 38, green: 55 },
    'ash': { name: 'Ash', dry: 41, green: 58 },
    'cherry': { name: 'Cherry', dry: 35, green: 52 },
    'walnut': { name: 'Black Walnut', dry: 38, green: 58 },
    'poplar': { name: 'Poplar', dry: 28, green: 50 },
    'pt-lumber': { name: 'Pressure Treated (SYP)', dry: 45, green: 65 }
  };

  // Actual dimensions (nominal vs actual)
  const actualDimensions: Record<string, { width: number; height: number }> = {
    '1x2': { width: 0.75, height: 1.5 },
    '1x3': { width: 0.75, height: 2.5 },
    '1x4': { width: 0.75, height: 3.5 },
    '1x6': { width: 0.75, height: 5.5 },
    '1x8': { width: 0.75, height: 7.25 },
    '1x10': { width: 0.75, height: 9.25 },
    '1x12': { width: 0.75, height: 11.25 },
    '2x2': { width: 1.5, height: 1.5 },
    '2x3': { width: 1.5, height: 2.5 },
    '2x4': { width: 1.5, height: 3.5 },
    '2x6': { width: 1.5, height: 5.5 },
    '2x8': { width: 1.5, height: 7.25 },
    '2x10': { width: 1.5, height: 9.25 },
    '2x12': { width: 1.5, height: 11.25 },
    '4x4': { width: 3.5, height: 3.5 },
    '4x6': { width: 3.5, height: 5.5 },
    '6x6': { width: 5.5, height: 5.5 },
    '6x8': { width: 5.5, height: 7.5 },
    '8x8': { width: 7.5, height: 7.5 }
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const len = parseFloat(length);
    const qty = parseInt(quantity);

    if (isNaN(len) || len <= 0) newErrors.push('Please enter a valid length');
    if (isNaN(qty) || qty <= 0) newErrors.push('Please enter a valid quantity');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const dims = actualDimensions[dimension];
    const speciesData = speciesWeights[species];

    // Calculate volume in cubic feet
    // (width in inches * height in inches * length in feet) / 144 = cubic feet
    const volumeCuFt = (dims.width * dims.height * len) / 144;

    // Get weight per cubic foot based on moisture content
    const weightPerCuFt = moistureContent === 'green' ? speciesData.green : speciesData.dry;

    // Calculate weight per piece
    const weightPerPiece = volumeCuFt * weightPerCuFt;

    // Total weight for quantity
    const totalWeight = weightPerPiece * qty;

    // Board feet calculation
    const boardFeet = (dims.width * dims.height * len) / 12;
    const totalBoardFeet = boardFeet * qty;

    // Linear feet
    const totalLinearFt = len * qty;

    setResults({
      species: speciesData.name,
      dimension,
      actualDimensions: `${dims.width}" x ${dims.height}"`,
      length: len,
      quantity: qty,
      moistureContent: moistureContent === 'green' ? 'Green (fresh cut)' : 'Kiln Dried (12% MC)',
      volumeCuFt: volumeCuFt.toFixed(4),
      weightPerCuFt,
      weightPerPiece: weightPerPiece.toFixed(2),
      totalWeight: totalWeight.toFixed(2),
      boardFeetPerPiece: boardFeet.toFixed(2),
      totalBoardFeet: totalBoardFeet.toFixed(2),
      totalLinearFt
    });

    trackCalculatorUsage('Lumber Weight Calculator', {
      species,
      dimension,
      length: len.toString(),
      totalWeight: totalWeight.toFixed(2)
    });
  };

  const faqItems = [
    {
      question: 'How much does a 2x4x8 weigh?',
      answer: 'A dry (kiln-dried) Southern Pine 2x4x8 weighs approximately 9-11 lbs. Pressure-treated 2x4x8 weighs 13-15 lbs when new due to moisture from treatment. Douglas Fir weighs about 9 lbs, while lighter species like SPF weigh around 7-8 lbs.'
    },
    {
      question: 'Why does lumber weight vary so much?',
      answer: 'Lumber weight depends on species (density), moisture content, and treatment. Fresh-cut "green" lumber can weigh 50-80% more than kiln-dried. Pressure-treated lumber absorbs chemicals and water, increasing weight significantly.'
    },
    {
      question: 'How much does pressure-treated lumber weigh?',
      answer: 'Freshly pressure-treated Southern Pine weighs about 4.5 lbs per board foot, compared to 3 lbs dry. A wet PT 2x6x16 can weigh 35+ lbs. After drying several months, PT lumber loses about 30% of that extra weight.'
    },
    {
      question: 'What is the lightest structural lumber?',
      answer: 'Western Red Cedar and Northern White Cedar are among the lightest structural softwoods at 22-23 lbs per cubic foot dry. SPF (Spruce-Pine-Fir) is also relatively light at 27 lbs per cubic foot while being structural grade.'
    },
    {
      question: 'How do I calculate lumber weight for shipping?',
      answer: 'Calculate the total board feet, then multiply by weight per board foot for your species. For rough estimates: softwoods average 2.5-3.5 lbs/BF dry; hardwoods average 3.5-5 lbs/BF. Always add 10% for moisture variation.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Board Feet Calculator',
      link: '/construction/board-feet',
      description: 'Calculate lumber board feet'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate framing lumber needs'
    },
    {
      title: 'Deck Boards Calculator',
      link: '/construction/deck-boards',
      description: 'Calculate decking materials'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Knowing lumber weight is essential for transportation, structural calculations, and handling safety. This calculator provides accurate weight estimates based on species, size, and moisture content.",
      steps: [
        "Select the wood species - this determines the density.",
        "Choose the lumber dimension (2x4, 2x6, 4x4, etc.).",
        "Enter the length in feet.",
        "Specify quantity if calculating for multiple pieces.",
        "Select moisture content: dry for kiln-dried, green for fresh-cut."
      ]
    },
    whyMatters: {
      description: "Lumber weight affects transportation costs, vehicle load limits, crane capacity requirements, and worker safety. A single 2x10x20 might be manageable, but a pallet of them could exceed truck limits. Understanding weight also helps with structural design, as dead load calculations require accurate material weights.",
      benefits: [
        "Calculate weight for transportation planning",
        "Determine lifting and handling requirements",
        "Estimate dead loads for structural design",
        "Compare species for weight-sensitive applications",
        "Plan for moisture loss as lumber dries"
      ]
    },
    examples: [
      {
        title: "Deck Framing Order",
        scenario: "50 pieces of 2x10x16 pressure-treated lumber.",
        calculation: "Each piece ~35 lbs wet = 1,750 lbs total",
        result: "Nearly one ton - verify truck capacity."
      },
      {
        title: "Roof Truss Materials",
        scenario: "200 2x4x12 Douglas Fir for truss building.",
        calculation: "Each piece ~12 lbs = 2,400 lbs total",
        result: "Just over one ton of framing lumber."
      },
      {
        title: "Heavy Timber Posts",
        scenario: "8 6x6x10 cedar posts for pergola.",
        calculation: "Each piece ~35 lbs = 280 lbs total",
        result: "Manageable load, but posts require two people to handle."
      }
    ],
    commonMistakes: [
      "Using nominal instead of actual dimensions - a 2x4 is actually 1.5\" x 3.5\".",
      "Ignoring moisture content - green or PT lumber weighs significantly more.",
      "Forgetting species variation - oak weighs nearly twice as much as cedar.",
      "Not accounting for treatment chemicals - PT lumber is denser.",
      "Underestimating total loads - individual pieces add up quickly."
    ]
  };

  return (
    <CalculatorLayout
      title="Lumber Weight Calculator"
      description="Calculate the weight of lumber by species, dimension, and moisture content. Includes board feet conversion."
    >
      <CalculatorSchema
        name="Lumber Weight Calculator"
        description="Free lumber weight calculator to estimate wood weight by species, size, and moisture content for transportation and structural planning."
        url="/construction/lumber-weight"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Wood Species</label>
          <select
            className={styles.select}
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          >
            <optgroup label="Softwoods">
              <option value="pine-southern">Southern Pine (SYP)</option>
              <option value="pine-white">White Pine</option>
              <option value="pine-ponderosa">Ponderosa Pine</option>
              <option value="fir-douglas">Douglas Fir</option>
              <option value="spruce">Spruce-Pine-Fir (SPF)</option>
              <option value="cedar-western">Western Red Cedar</option>
              <option value="cedar-northern">Northern White Cedar</option>
              <option value="redwood">Redwood</option>
              <option value="pt-lumber">Pressure Treated (SYP)</option>
            </optgroup>
            <optgroup label="Hardwoods">
              <option value="oak-red">Red Oak</option>
              <option value="oak-white">White Oak</option>
              <option value="maple-hard">Hard Maple</option>
              <option value="maple-soft">Soft Maple</option>
              <option value="ash">Ash</option>
              <option value="cherry">Cherry</option>
              <option value="walnut">Black Walnut</option>
              <option value="poplar">Poplar</option>
            </optgroup>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Lumber Dimension</label>
          <select
            className={styles.select}
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
          >
            <optgroup label="1-inch (Boards)">
              <option value="1x2">1x2</option>
              <option value="1x3">1x3</option>
              <option value="1x4">1x4</option>
              <option value="1x6">1x6</option>
              <option value="1x8">1x8</option>
              <option value="1x10">1x10</option>
              <option value="1x12">1x12</option>
            </optgroup>
            <optgroup label="2-inch (Dimension)">
              <option value="2x2">2x2</option>
              <option value="2x3">2x3</option>
              <option value="2x4">2x4</option>
              <option value="2x6">2x6</option>
              <option value="2x8">2x8</option>
              <option value="2x10">2x10</option>
              <option value="2x12">2x12</option>
            </optgroup>
            <optgroup label="Timbers">
              <option value="4x4">4x4</option>
              <option value="4x6">4x6</option>
              <option value="6x6">6x6</option>
              <option value="6x8">6x8</option>
              <option value="8x8">8x8</option>
            </optgroup>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Length (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="e.g., 8"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Quantity</label>
            <input
              type="number"
              className={styles.input}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 1"
              min="1"
              step="1"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Moisture Content</label>
          <select
            className={styles.select}
            value={moistureContent}
            onChange={(e) => setMoistureContent(e.target.value)}
          >
            <option value="dry">Kiln Dried (~12% MC)</option>
            <option value="green">Green / Fresh Cut (~50%+ MC)</option>
          </select>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Weight
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Lumber Weight Results</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Wood Species</span>
            <span className={styles.resultValue}>{results.species}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Nominal Size</span>
            <span className={styles.resultValue}>{results.dimension}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Actual Dimensions</span>
            <span className={styles.resultValue}>{results.actualDimensions}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Length</span>
            <span className={styles.resultValue}>{results.length} feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Moisture Content</span>
            <span className={styles.resultValue}>{results.moistureContent}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Density</span>
            <span className={styles.resultValue}>{results.weightPerCuFt} lbs/cu ft</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Weight</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Weight per Piece</span>
            <span className={styles.resultValuePrimary}>{results.weightPerPiece} lbs</span>
          </div>

          {results.quantity > 1 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Weight ({results.quantity} pieces)</span>
              <span className={styles.resultValuePrimary}>{results.totalWeight} lbs</span>
            </div>
          )}

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Volume</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Volume per Piece</span>
            <span className={styles.resultValue}>{results.volumeCuFt} cu ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Board Feet per Piece</span>
            <span className={styles.resultValue}>{results.boardFeetPerPiece} BF</span>
          </div>

          {results.quantity > 1 && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Board Feet</span>
                <span className={styles.resultValue}>{results.totalBoardFeet} BF</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Linear Feet</span>
                <span className={styles.resultValue}>{results.totalLinearFt} LF</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Note:</strong> Weights are estimates based on typical species density. Actual weight can vary 10-20% based on growing conditions, exact moisture content, and natural variation within species.
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
