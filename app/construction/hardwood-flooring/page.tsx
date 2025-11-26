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

interface Room {
  id: number;
  name: string;
  length: string;
  width: string;
}

export default function HardwoodFlooringCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, name: 'Room 1', length: '', width: '' }]);
  const [totalArea, setTotalArea] = useState<string>('');
  const [boardWidth, setBoardWidth] = useState<string>('3.25');
  const [boardLength, setBoardLength] = useState<string>('random');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [includeUnderlayment, setIncludeUnderlayment] = useState<boolean>(true);
  const [includeVaporBarrier, setIncludeVaporBarrier] = useState<boolean>(true);
  const [pricePerSqFt, setPricePerSqFt] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const boardWidthOptions = [
    { label: '2-1/4 inch', value: '2.25' },
    { label: '3-1/4 inch', value: '3.25' },
    { label: '4 inch', value: '4' },
    { label: '5 inch', value: '5' },
    { label: '6 inch', value: '6' },
    { label: '7 inch', value: '7' }
  ];

  const addRoom = () => {
    const newId = Math.max(...rooms.map(r => r.id)) + 1;
    setRooms([...rooms, { id: newId, name: `Room ${newId}`, length: '', width: '' }]);
  };

  const removeRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const updateRoom = (id: number, field: keyof Room, value: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];
    let areaSqFt = 0;

    if (inputType === 'dimensions') {
      rooms.forEach((room, index) => {
        const l = parseFloat(room.length);
        const w = parseFloat(room.width);
        if (isNaN(l) || l <= 0 || isNaN(w) || w <= 0) {
          newErrors.push(`Please enter valid dimensions for ${room.name || `Room ${index + 1}`}`);
        } else {
          areaSqFt += l * w;
        }
      });
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

    const waste = parseFloat(wasteFactor) || 10;
    const boardWidthInches = parseFloat(boardWidth);

    // Calculate square footage with waste
    const areaWithWaste = areaSqFt * (1 + waste / 100);
    const totalSqFt = Math.ceil(areaWithWaste);

    // Cartons typically contain 20-25 sq ft
    const sqFtPerCarton = 20;
    const cartonsNeeded = Math.ceil(totalSqFt / sqFtPerCarton);

    // Underlayment calculation (rolls typically 100 sq ft)
    const underlaymentRolls = includeUnderlayment ? Math.ceil(totalSqFt / 100) : 0;

    // Vapor barrier calculation (rolls typically 500 sq ft)
    const vaporBarrierRolls = includeVaporBarrier ? Math.ceil(totalSqFt / 500) : 0;

    // Transition strips (estimate based on doorways - roughly 1 per 150 sq ft)
    const transitionStrips = Math.ceil(areaSqFt / 150);

    // Calculate cost
    const price = parseFloat(pricePerSqFt) || 0;
    const flooringCost = price > 0 ? totalSqFt * price : null;
    const underlaymentCost = includeUnderlayment ? underlaymentRolls * 35 : 0;
    const vaporBarrierCost = includeVaporBarrier ? vaporBarrierRolls * 45 : 0;
    const totalCost = flooringCost ? flooringCost + underlaymentCost + vaporBarrierCost : null;

    setResults({
      areaSqFt: areaSqFt.toFixed(1),
      areaWithWaste: totalSqFt,
      wasteFactor: waste,
      boardWidth: boardWidthInches,
      sqFtPerCarton,
      cartonsNeeded,
      underlaymentRolls,
      vaporBarrierRolls,
      transitionStrips,
      flooringCost: flooringCost ? flooringCost.toFixed(2) : null,
      underlaymentCost: underlaymentCost.toFixed(2),
      vaporBarrierCost: vaporBarrierCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Hardwood Flooring Calculator', {
      inputType,
      areaSqFt: areaSqFt.toFixed(1),
      boardWidth: boardWidthInches.toString(),
      cartonsNeeded: cartonsNeeded.toString()
    });
  };

  const faqItems = [
    {
      question: 'How much extra hardwood flooring should I order?',
      answer: 'Order 10% extra for straight installations, 15% for diagonal patterns, and 20% for herringbone or complex patterns. If you have many rooms with doorways, angled walls, or are a beginner, add an additional 5%.'
    },
    {
      question: 'What is the difference between solid and engineered hardwood?',
      answer: 'Solid hardwood is milled from a single piece of wood (typically 3/4" thick) and can be refinished multiple times. Engineered hardwood has a real wood veneer over plywood layers, is more stable in humid conditions, and can be installed over concrete.'
    },
    {
      question: 'Do I need underlayment for hardwood floors?',
      answer: 'For floating engineered floors, underlayment is essential for sound reduction, moisture protection, and comfort. Nail-down solid hardwood typically does not need underlayment but may use roofing felt as a moisture barrier.'
    },
    {
      question: 'How wide should hardwood planks be for my room?',
      answer: 'Narrow planks (2-1/4" to 3-1/4") work well in smaller rooms and traditional spaces. Wide planks (5" to 7") make rooms appear larger and suit modern or rustic designs. Consider your room size and style preferences.'
    },
    {
      question: 'How long should hardwood acclimate before installation?',
      answer: 'Hardwood flooring should acclimate in the installation space for 3-5 days minimum, with some manufacturers recommending up to 2 weeks. Keep boxes open and stacked with spacers to allow air circulation.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Laminate Flooring Calculator',
      link: '/construction/laminate-flooring',
      description: 'Calculate laminate flooring and underlayment'
    },
    {
      title: 'Tile Calculator',
      link: '/construction/tile',
      description: 'Calculate tiles, grout, and thinset'
    },
    {
      title: 'Carpet Calculator',
      link: '/construction/carpet',
      description: 'Calculate carpet and padding needed'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Accurately calculating hardwood flooring prevents costly overage or the frustration of running short. Here's how to get your estimate right:",
      steps: [
        "Measure each room's length and width in feet. For L-shaped rooms, divide into rectangles and measure each separately.",
        "Select your preferred board width - wider planks require fewer boards but may have more waste on narrow rooms.",
        "Choose your waste factor based on layout complexity and room shape (10% for simple, 15% for diagonal).",
        "Indicate if you need underlayment and vapor barrier for floating installations.",
        "Enter the price per square foot to calculate your total material cost."
      ]
    },
    whyMatters: {
      description: "Hardwood flooring is a significant investment, typically costing $3-15 per square foot for materials alone. Accurate calculations ensure you order enough from the same production run (avoiding color variations) while minimizing expensive overages. Running short mid-project can delay completion by weeks while waiting for new shipments.",
      benefits: [
        "Calculate exact square footage including waste allowance",
        "Determine cartons needed for ordering",
        "Include underlayment and vapor barrier quantities",
        "Estimate transition strips for doorways",
        "Budget accurately with comprehensive cost estimates"
      ]
    },
    examples: [
      {
        title: "Living Room Installation",
        scenario: "A 20' x 15' living room with 3-1/4 inch wide planks and 10% waste.",
        calculation: "300 sq ft + 10% waste = 330 sq ft needed",
        result: "Order 17 cartons (at 20 sq ft each), 4 rolls of underlayment."
      },
      {
        title: "Whole House Project",
        scenario: "Three rooms totaling 850 sq ft with diagonal installation pattern.",
        calculation: "850 sq ft + 15% waste = 978 sq ft needed",
        result: "Order 49 cartons, 10 rolls underlayment, 2 rolls vapor barrier."
      },
      {
        title: "Master Bedroom with Closet",
        scenario: "14' x 16' bedroom plus 6' x 8' walk-in closet.",
        calculation: "(224 + 48) = 272 sq ft + 10% = 300 sq ft needed",
        result: "Order 15 cartons, account for transitions at doorways."
      }
    ],
    commonMistakes: [
      "Not ordering all flooring from the same lot - color variations between lots can be noticeable.",
      "Forgetting to add waste factor - cuts, damaged boards, and mistakes add up quickly.",
      "Measuring rooms incorrectly - always measure at the widest and longest points.",
      "Skipping acclimation - flooring must adjust to your home's humidity before installation.",
      "Underestimating transitions - every doorway and floor transition needs a proper strip."
    ]
  };

  return (
    <CalculatorLayout
      title="Hardwood Flooring Calculator"
      description="Calculate how much hardwood flooring, underlayment, and vapor barrier you need. Includes waste factors and cost estimates."
    >
      <CalculatorSchema
        name="Hardwood Flooring Calculator"
        description="Free hardwood flooring calculator to estimate materials needed including cartons, underlayment, and vapor barrier with waste factors."
        url="/construction/hardwood-flooring"
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
              Room Dimensions
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
            {rooms.map((room, index) => (
              <div key={room.id} style={{ border: '1px solid #333', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className={styles.input}
                    value={room.name}
                    onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                    style={{ width: '150px', fontSize: '0.9rem' }}
                  />
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(room.id)}
                      style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Length (feet)</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={room.length}
                      onChange={(e) => updateRoom(room.id, 'length', e.target.value)}
                      placeholder="e.g., 15"
                      step="0.1"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Width (feet)</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={room.width}
                      onChange={(e) => updateRoom(room.id, 'width', e.target.value)}
                      placeholder="e.g., 12"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addRoom}
              style={{ background: '#2a2a2a', color: '#4a9eff', border: '1px solid #4a9eff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' }}
            >
              + Add Another Room
            </button>
          </>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Area (square feet)</label>
            <input
              type="number"
              className={styles.input}
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="e.g., 500"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Board Width</label>
          <select
            className={styles.select}
            value={boardWidth}
            onChange={(e) => setBoardWidth(e.target.value)}
          >
            {boardWidthOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor</label>
          <select
            className={styles.select}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
          >
            <option value="10">10% - Straight layout, rectangular rooms</option>
            <option value="15">15% - Diagonal layout or irregular rooms</option>
            <option value="20">20% - Herringbone or complex patterns</option>
            <option value="25">25% - Very complex or first-time installer</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeUnderlayment}
              onChange={(e) => setIncludeUnderlayment(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Underlayment (for floating floors)
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeVaporBarrier}
              onChange={(e) => setIncludeVaporBarrier(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Vapor Barrier (for concrete subfloors)
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Square Foot (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerSqFt}
            onChange={(e) => setPricePerSqFt(e.target.value)}
            placeholder="e.g., 5.99"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Flooring
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Hardwood Flooring Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Floor Area</span>
            <span className={styles.resultValue}>{results.areaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With {results.wasteFactor}% Waste</span>
            <span className={styles.resultValuePrimary}>{results.areaWithWaste} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Board Width</span>
            <span className={styles.resultValue}>{results.boardWidth} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cartons Needed (~{results.sqFtPerCarton} sq ft each)</span>
            <span className={styles.resultValuePrimary}>{results.cartonsNeeded} cartons</span>
          </div>

          {results.underlaymentRolls > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Underlayment Rolls (100 sq ft each)</span>
              <span className={styles.resultValue}>{results.underlaymentRolls} rolls</span>
            </div>
          )}

          {results.vaporBarrierRolls > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Vapor Barrier Rolls (500 sq ft each)</span>
              <span className={styles.resultValue}>{results.vaporBarrierRolls} rolls</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Transition Strips (estimated)</span>
            <span className={styles.resultValue}>{results.transitionStrips} strips</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Hardwood Flooring</span>
                <span className={styles.resultValue}>${results.flooringCost}</span>
              </div>

              {results.underlaymentRolls > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Underlayment (~$35/roll)</span>
                  <span className={styles.resultValue}>${results.underlaymentCost}</span>
                </div>
              )}

              {results.vaporBarrierRolls > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Vapor Barrier (~$45/roll)</span>
                  <span className={styles.resultValue}>${results.vaporBarrierCost}</span>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Material Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Let flooring acclimate 3-5 days before installation. Order all materials from the same lot number. Keep 1-2 extra cartons for future repairs.
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
