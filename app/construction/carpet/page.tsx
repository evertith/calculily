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

export default function CarpetCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputType, setInputType] = useState<InputType>('dimensions');
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, name: 'Room 1', length: '', width: '' }]);
  const [totalArea, setTotalArea] = useState<string>('');
  const [carpetWidth, setCarpetWidth] = useState<string>('12');
  const [includePadding, setIncludePadding] = useState<boolean>(true);
  const [paddingThickness, setPaddingThickness] = useState<string>('7/16');
  const [carpetPricePerSqYd, setCarpetPricePerSqYd] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

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
    let totalSqFt = 0;
    const roomDetails: { name: string; sqFt: number; sqYd: number }[] = [];

    if (inputType === 'dimensions') {
      rooms.forEach((room) => {
        const l = parseFloat(room.length);
        const w = parseFloat(room.width);
        if (isNaN(l) || l <= 0 || isNaN(w) || w <= 0) {
          newErrors.push(`Please enter valid dimensions for ${room.name}`);
        } else {
          const sqFt = l * w;
          totalSqFt += sqFt;
          roomDetails.push({
            name: room.name,
            sqFt,
            sqYd: sqFt / 9
          });
        }
      });
    } else {
      const area = parseFloat(totalArea);
      if (isNaN(area) || area <= 0) {
        newErrors.push('Please enter a valid total area');
      } else {
        totalSqFt = area;
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const carpetWidthFt = parseFloat(carpetWidth);

    // Carpet is sold by square yard
    const totalSqYd = totalSqFt / 9;

    // Calculate linear feet of carpet needed
    // This is more complex because carpet comes in fixed widths (usually 12 or 15 ft)
    // and you need to minimize seams while accounting for room layouts
    // Simplified: assume efficient layout
    const carpetLinearFt = Math.ceil(totalSqFt / carpetWidthFt);

    // Actual carpet needed (width x linear feet, converted to sq yd)
    const actualCarpetSqFt = carpetLinearFt * carpetWidthFt;
    const actualCarpetSqYd = actualCarpetSqFt / 9;

    // Add 10% for waste, seams, and pattern matching
    const carpetWithWaste = Math.ceil(actualCarpetSqYd * 1.10);

    // Padding (same square footage as carpet)
    const paddingSqYd = includePadding ? carpetWithWaste : 0;

    // Tack strips (perimeter of rooms)
    // Estimate perimeter as 4 * sqrt(area) for each room
    let totalPerimeter = 0;
    if (inputType === 'dimensions') {
      rooms.forEach((room) => {
        const l = parseFloat(room.length) || 0;
        const w = parseFloat(room.width) || 0;
        totalPerimeter += 2 * (l + w);
      });
    } else {
      // Estimate perimeter
      totalPerimeter = 4 * Math.sqrt(totalSqFt);
    }
    const tackStripFt = Math.ceil(totalPerimeter);

    // Seam tape (estimate based on carpet width and room dimensions)
    const seamTapeFt = Math.ceil(carpetLinearFt * 0.2); // Rough estimate

    // Cost calculations
    const pricePerSqYd = parseFloat(carpetPricePerSqYd) || 0;
    const carpetCost = pricePerSqYd > 0 ? carpetWithWaste * pricePerSqYd : null;
    const paddingCost = includePadding ? paddingSqYd * 3.50 : 0; // ~$3.50/sq yd average
    const tackStripCost = tackStripFt * 0.50; // ~$0.50/linear ft
    const seamTapeCost = seamTapeFt * 0.75; // ~$0.75/linear ft
    const totalCost = carpetCost ? carpetCost + paddingCost + tackStripCost + seamTapeCost : null;

    setResults({
      totalSqFt: totalSqFt.toFixed(1),
      totalSqYd: totalSqYd.toFixed(1),
      carpetWidthFt,
      carpetLinearFt,
      actualCarpetSqYd: actualCarpetSqYd.toFixed(1),
      carpetWithWaste,
      paddingSqYd,
      paddingThickness,
      tackStripFt,
      seamTapeFt,
      roomDetails,
      carpetCost: carpetCost ? carpetCost.toFixed(2) : null,
      paddingCost: paddingCost.toFixed(2),
      installCost: (totalSqYd * 4).toFixed(2), // ~$4/sq yd labor estimate
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Carpet Calculator', {
      inputType,
      totalSqFt: totalSqFt.toFixed(0),
      carpetSqYd: carpetWithWaste.toString()
    });
  };

  const faqItems = [
    {
      question: 'How is carpet measured and sold?',
      answer: 'Carpet is measured in square yards (not square feet) and typically comes in 12-foot or 15-foot widths. To convert square feet to square yards, divide by 9. The fixed width means you may need more carpet than your exact room size to minimize seams.'
    },
    {
      question: 'How much carpet padding do I need?',
      answer: 'You need the same square yardage of padding as carpet. Standard residential padding is 7/16 inch thick with 6-8 lb density. Higher density padding (8-10 lb) is recommended for high-traffic areas and extends carpet life.'
    },
    {
      question: 'How much extra carpet should I order?',
      answer: 'Order 10% extra for waste, seam matching, and future repairs. Pattern carpets may need 15-20% extra for pattern matching. Keep leftover carpet for patching and stairs.'
    },
    {
      question: 'What is the cost to install carpet?',
      answer: 'Carpet installation typically costs $3-6 per square yard for labor. This includes removing old carpet, installing tack strips and padding, stretching the new carpet, and seaming. Furniture moving and stairs are usually extra.'
    },
    {
      question: 'How long does carpet last?',
      answer: 'Quality carpet lasts 10-15 years with proper care. Factors affecting lifespan include foot traffic, padding quality, regular vacuuming, and professional cleaning every 12-18 months. Higher face weight (40+ oz) indicates more durable carpet.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Hardwood Flooring Calculator',
      link: '/construction/hardwood-flooring',
      description: 'Calculate hardwood flooring materials'
    },
    {
      title: 'Laminate Flooring Calculator',
      link: '/construction/laminate-flooring',
      description: 'Calculate laminate and underlayment'
    },
    {
      title: 'Tile Calculator',
      link: '/construction/tile',
      description: 'Calculate tiles and installation materials'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Carpet ordering requires careful calculation because carpet is sold by the square yard and comes in fixed widths. Getting the right amount prevents both shortages and costly overages.",
      steps: [
        "Measure each room's length and width at the longest/widest points in feet.",
        "Add all rooms that will receive the same carpet - ordering together reduces waste.",
        "Select the carpet width (12-foot is most common, 15-foot reduces seams in larger rooms).",
        "Include padding unless your carpet has it attached or you're recarpeting over existing pad.",
        "Enter your carpet price per square yard for cost estimates."
      ]
    },
    whyMatters: {
      description: "Carpet significantly impacts a home's comfort, acoustics, and appearance. Accurate estimation ensures you order enough from the same dye lot (color can vary between lots) while minimizing waste. Because carpet comes in fixed widths, a professional installer can often calculate more efficient layouts that reduce your total cost.",
      benefits: [
        "Calculate square yards from room dimensions",
        "Account for carpet width and seam placement",
        "Include padding requirements",
        "Estimate tack strips and seam tape needed",
        "Budget for materials and installation"
      ]
    },
    examples: [
      {
        title: "Master Bedroom",
        scenario: "A 15' x 18' master bedroom with 12-foot wide carpet.",
        calculation: "270 sq ft / 9 = 30 sq yd + 10% waste = 33 sq yd",
        result: "Order 33 square yards carpet and padding, minimal seaming needed."
      },
      {
        title: "Whole House Installation",
        scenario: "Three bedrooms (12x14, 11x12, 10x11) plus hallway (4x25).",
        calculation: "(168 + 132 + 110 + 100) = 510 sq ft / 9 = 57 sq yd + waste",
        result: "Order 65 square yards to allow for seams and doorway transitions."
      },
      {
        title: "Large Living Room",
        scenario: "A 20' x 24' living room with 15-foot wide carpet.",
        calculation: "480 sq ft / 9 = 53 sq yd + 10% = 58 sq yd",
        result: "15-foot width reduces seaming; order 58 square yards."
      }
    ],
    commonMistakes: [
      "Confusing square feet with square yards - carpet is priced and sold by the square yard.",
      "Not accounting for carpet width - fixed widths mean you often need more than exact room area.",
      "Forgetting about seam placement - seams in high-traffic or visible areas affect appearance.",
      "Skipping quality padding - cheap padding wears out carpet faster and reduces comfort.",
      "Not ordering from the same dye lot - color variations between lots can be noticeable."
    ]
  };

  return (
    <CalculatorLayout
      title="Carpet Calculator"
      description="Calculate carpet in square yards, plus padding, tack strips, and installation materials. Includes cost estimates for carpet and installation."
    >
      <CalculatorSchema
        name="Carpet Calculator"
        description="Free carpet calculator to estimate square yards needed, padding, and installation costs. Convert square feet to square yards easily."
        url="/construction/carpet"
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
            {rooms.map((room) => (
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
                      step="0.5"
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
                      step="0.5"
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
          <label className={styles.label}>Carpet Roll Width</label>
          <select
            className={styles.select}
            value={carpetWidth}
            onChange={(e) => setCarpetWidth(e.target.value)}
          >
            <option value="12">12 feet (most common)</option>
            <option value="15">15 feet (fewer seams)</option>
            <option value="13.5">13.5 feet</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includePadding}
              onChange={(e) => setIncludePadding(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Carpet Padding
          </label>
        </div>

        {includePadding && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Padding Thickness</label>
            <select
              className={styles.select}
              value={paddingThickness}
              onChange={(e) => setPaddingThickness(e.target.value)}
            >
              <option value="3/8">3/8 inch (budget, low traffic)</option>
              <option value="7/16">7/16 inch (standard residential)</option>
              <option value="1/2">1/2 inch (premium comfort)</option>
              <option value="5/8">5/8 inch (luxury, low traffic only)</option>
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Carpet Price per Square Yard (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={carpetPricePerSqYd}
            onChange={(e) => setCarpetPricePerSqYd(e.target.value)}
            placeholder="e.g., 25.00"
            step="0.01"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            Carpet is priced per square yard, not square foot
          </small>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Carpet
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Carpet Materials Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Floor Area</span>
            <span className={styles.resultValue}>{results.totalSqFt} sq ft ({results.totalSqYd} sq yd)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Carpet Width</span>
            <span className={styles.resultValue}>{results.carpetWidthFt} feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Carpet Linear Feet</span>
            <span className={styles.resultValue}>{results.carpetLinearFt} linear feet</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Order Quantities</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Carpet (with 10% waste)</span>
            <span className={styles.resultValuePrimary}>{results.carpetWithWaste} square yards</span>
          </div>

          {results.paddingSqYd > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Padding ({results.paddingThickness} inch)</span>
              <span className={styles.resultValue}>{results.paddingSqYd} square yards</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tack Strips</span>
            <span className={styles.resultValue}>{results.tackStripFt} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Seam Tape (estimated)</span>
            <span className={styles.resultValue}>{results.seamTapeFt} linear feet</span>
          </div>

          {results.roomDetails && results.roomDetails.length > 1 && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Room Breakdown</h3>
              </div>
              {results.roomDetails.map((room: any, index: number) => (
                <div key={index} className={styles.resultItem}>
                  <span className={styles.resultLabel}>{room.name}</span>
                  <span className={styles.resultValue}>{room.sqFt.toFixed(1)} sq ft ({room.sqYd.toFixed(1)} sq yd)</span>
                </div>
              ))}
            </>
          )}

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Carpet</span>
                <span className={styles.resultValue}>${results.carpetCost}</span>
              </div>

              {parseFloat(results.paddingCost) > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Padding (~$3.50/sq yd)</span>
                  <span className={styles.resultValue}>${results.paddingCost}</span>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Installation Labor (~$4/sq yd)</span>
                <span className={styles.resultValue}>${results.installCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Estimated Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Order all carpet from the same dye lot. Higher face weight (40+ oz) means more durable carpet. Quality padding extends carpet life and improves comfort.
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
