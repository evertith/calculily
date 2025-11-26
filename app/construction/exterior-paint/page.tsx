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

type InputMethod = 'perimeter' | 'dimensions';

export default function ExteriorPaintCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputMethod, setInputMethod] = useState<InputMethod>('dimensions');
  const [houseLength, setHouseLength] = useState<string>('');
  const [houseWidth, setHouseWidth] = useState<string>('');
  const [perimeter, setPerimeter] = useState<string>('');
  const [stories, setStories] = useState<string>('1');
  const [wallHeight, setWallHeight] = useState<string>('9');
  const [numDoors, setNumDoors] = useState<string>('2');
  const [numWindows, setNumWindows] = useState<string>('8');
  const [avgWindowSize, setAvgWindowSize] = useState<string>('15');
  const [hasGables, setHasGables] = useState<boolean>(true);
  const [gableCount, setGableCount] = useState<string>('2');
  const [surfaceType, setSurfaceType] = useState<string>('smooth');
  const [coats, setCoats] = useState<string>('2');
  const [includePrimer, setIncludePrimer] = useState<boolean>(true);
  const [paintPrice, setPaintPrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let perimeterFt = 0;
    if (inputMethod === 'dimensions') {
      const l = parseFloat(houseLength);
      const w = parseFloat(houseWidth);
      if (isNaN(l) || l <= 0) newErrors.push('Please enter a valid house length');
      if (isNaN(w) || w <= 0) newErrors.push('Please enter a valid house width');
      if (newErrors.length === 0) {
        perimeterFt = 2 * (l + w);
      }
    } else {
      const p = parseFloat(perimeter);
      if (isNaN(p) || p <= 0) newErrors.push('Please enter a valid perimeter');
      else perimeterFt = p;
    }

    const height = parseFloat(wallHeight);
    if (isNaN(height) || height <= 0) newErrors.push('Please enter a valid wall height');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const numStories = parseInt(stories) || 1;
    const doors = parseInt(numDoors) || 0;
    const windows = parseInt(numWindows) || 0;
    const windowSize = parseFloat(avgWindowSize) || 15;
    const numCoats = parseInt(coats) || 2;

    // Calculate wall area
    const totalHeight = height * numStories;
    let wallArea = perimeterFt * totalHeight;

    // Add gable area if applicable
    let gableArea = 0;
    if (hasGables) {
      const gables = parseInt(gableCount) || 0;
      // Estimate gable as triangle: base = house width, height = 1/3 of base
      const gableBase = inputMethod === 'dimensions' ? parseFloat(houseWidth) || 0 : perimeterFt / 4;
      const gableHeight = gableBase / 3;
      gableArea = (gableBase * gableHeight / 2) * gables;
      wallArea += gableArea;
    }

    // Subtract openings
    const doorArea = doors * 21; // Standard door ~21 sq ft (3x7)
    const windowArea = windows * windowSize;
    const openingsArea = doorArea + windowArea;

    const paintableSidingArea = wallArea - openingsArea;

    // Trim calculation (doors, windows, fascia, corners)
    const doorTrim = doors * 20; // Perimeter of door
    const windowTrim = windows * 12; // Average window perimeter
    const fasciaSoffit = perimeterFt * 2; // Rough estimate
    const corners = numStories * 8 * 4; // 4 corners, 8ft each per story
    const trimLinearFt = doorTrim + windowTrim + fasciaSoffit + corners;
    const trimArea = trimLinearFt * 0.5; // Average trim width ~6 inches

    // Coverage rates (sq ft per gallon)
    const coverageRates: Record<string, number> = {
      smooth: 400,
      textured: 300,
      rough: 250,
      brick: 200,
      stucco: 150
    };
    const coverage = coverageRates[surfaceType] || 350;

    // Calculate gallons needed
    const sidingGallonsPerCoat = paintableSidingArea / coverage;
    const sidingGallons = Math.ceil(sidingGallonsPerCoat * numCoats);

    const trimGallonsPerCoat = trimArea / 400; // Trim typically smooth
    const trimGallons = Math.ceil(trimGallonsPerCoat * numCoats);

    const primerGallons = includePrimer ? Math.ceil((paintableSidingArea + trimArea) / 300) : 0;

    const totalGallons = sidingGallons + trimGallons + primerGallons;

    // Cost calculation
    const price = parseFloat(paintPrice) || 0;
    const paintCost = price > 0 ? (sidingGallons + trimGallons) * price : null;
    const primerCost = includePrimer ? primerGallons * (price * 0.6) : 0; // Primer typically cheaper
    const totalCost = paintCost ? paintCost + primerCost : null;

    setResults({
      perimeterFt: perimeterFt.toFixed(0),
      wallArea: wallArea.toFixed(0),
      gableArea: gableArea.toFixed(0),
      openingsArea: openingsArea.toFixed(0),
      paintableSidingArea: paintableSidingArea.toFixed(0),
      trimArea: trimArea.toFixed(0),
      coverage,
      numCoats,
      sidingGallons,
      trimGallons,
      primerGallons,
      totalGallons,
      paintCost: paintCost ? paintCost.toFixed(2) : null,
      primerCost: primerCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Exterior Paint Calculator', {
      inputMethod,
      wallArea: wallArea.toFixed(0),
      totalGallons: totalGallons.toString()
    });
  };

  const faqItems = [
    {
      question: 'How many gallons of exterior paint do I need?',
      answer: 'Calculate your total paintable square footage (wall area minus windows and doors), then divide by the paint coverage rate (typically 350-400 sq ft per gallon for smooth surfaces). Multiply by number of coats. Most exteriors need 2 coats.'
    },
    {
      question: 'How much does it cost to paint a house exterior?',
      answer: 'DIY painting costs $500-1,500 in materials for an average house. Professional painting costs $2,500-6,000+ depending on house size, height, surface condition, and local labor rates. The biggest factor is usually labor, not paint.'
    },
    {
      question: 'Do I need to prime before exterior painting?',
      answer: 'Primer is recommended when: painting bare wood, covering dark colors with light ones, painting over stains or repairs, or if the existing paint is chalky. Quality exterior paints often include primer, but separate primer provides better adhesion.'
    },
    {
      question: 'How long does exterior paint last?',
      answer: 'Quality exterior paint lasts 5-10 years on siding, with proper preparation. Trim and high-wear areas may need repainting sooner. Factors affecting longevity include sun exposure, climate, surface prep, and paint quality.'
    },
    {
      question: 'What is the best weather to paint exterior?',
      answer: 'Ideal conditions are 50-85°F with low humidity and no rain expected for 24-48 hours. Avoid painting in direct sunlight, early morning dew, or when temperatures will drop below 50°F at night. Spring and fall are typically best.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Interior Paint Calculator',
      link: '/calculators/paint',
      description: 'Calculate interior wall paint needs'
    },
    {
      title: 'Siding Calculator',
      link: '/construction/siding',
      description: 'Calculate siding materials needed'
    },
    {
      title: 'Drywall Calculator',
      link: '/calculators/drywall',
      description: 'Calculate drywall sheets and materials'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Painting your home's exterior is a significant project that requires careful planning. Accurate paint estimates prevent costly overages and frustrating mid-project supply runs.",
      steps: [
        "Enter your house dimensions or perimeter. For complex shapes, measure the perimeter by walking around the house.",
        "Specify the number of stories and wall height per story (typically 8-10 feet).",
        "Enter the number of doors and windows - these are subtracted from the paintable area.",
        "Indicate if you have gables (triangular sections at roof peaks) to add that area.",
        "Select your surface type - rougher surfaces need more paint per square foot."
      ]
    },
    whyMatters: {
      description: "Exterior paint provides crucial protection against weather, UV damage, and moisture intrusion. Beyond aesthetics, a quality paint job prevents wood rot, protects against pests, and can significantly impact your home's value. Proper estimation ensures you buy enough paint from the same batch for color consistency.",
      benefits: [
        "Calculate siding and trim paint separately",
        "Account for surface texture and coverage rates",
        "Include primer quantities for proper preparation",
        "Estimate costs for budget planning",
        "Ensure color consistency with accurate quantities"
      ]
    },
    examples: [
      {
        title: "Single-Story Ranch",
        scenario: "A 50' x 30' ranch home with 8-foot walls, 2 doors, 10 windows, and smooth siding.",
        calculation: "160 ft perimeter x 8 ft = 1,280 sq ft - openings = ~1,100 sq ft x 2 coats",
        result: "6 gallons siding paint, 2 gallons trim paint, 4 gallons primer."
      },
      {
        title: "Two-Story Colonial",
        scenario: "A 40' x 35' colonial with 9-foot ceilings, 3 doors, 16 windows, and textured siding.",
        calculation: "150 ft perimeter x 18 ft total height + gables - openings",
        result: "14 gallons siding paint, 4 gallons trim paint, 8 gallons primer."
      },
      {
        title: "Victorian with Details",
        scenario: "A 45' x 25' Victorian with complex trim, 2 stories, and multiple gables.",
        calculation: "Extensive trim and detail work doubles typical trim paint needs",
        result: "8 gallons body paint, 6 gallons trim paint, 5 gallons primer."
      }
    ],
    commonMistakes: [
      "Underestimating by forgetting gables, dormers, and architectural details.",
      "Using interior paint coverage rates - exterior surfaces often need more paint.",
      "Skipping primer on bare wood or major color changes.",
      "Not accounting for multiple coats - two coats is standard for durability.",
      "Buying from different batches - color can vary between production runs."
    ]
  };

  return (
    <CalculatorLayout
      title="Exterior Paint Calculator"
      description="Calculate how many gallons of exterior paint you need for siding, trim, and primer. Includes surface type adjustments and cost estimates."
    >
      <CalculatorSchema
        name="Exterior Paint Calculator"
        description="Free exterior paint calculator to estimate gallons needed for house siding, trim, and primer with cost estimates."
        url="/construction/exterior-paint"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Input Method</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${inputMethod === 'dimensions' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputMethod('dimensions')}
            >
              House Dimensions
            </button>
            <button
              className={`${styles.buttonOption} ${inputMethod === 'perimeter' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputMethod('perimeter')}
            >
              Perimeter
            </button>
          </div>
        </div>

        {inputMethod === 'dimensions' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>House Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={houseLength}
                onChange={(e) => setHouseLength(e.target.value)}
                placeholder="e.g., 50"
                step="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>House Width (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={houseWidth}
                onChange={(e) => setHouseWidth(e.target.value)}
                placeholder="e.g., 30"
                step="1"
              />
            </div>
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>House Perimeter (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={perimeter}
              onChange={(e) => setPerimeter(e.target.value)}
              placeholder="e.g., 160"
              step="1"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Walk around your house measuring each wall section
            </small>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Stories</label>
            <select
              className={styles.select}
              value={stories}
              onChange={(e) => setStories(e.target.value)}
            >
              <option value="1">1 Story</option>
              <option value="1.5">1.5 Stories (Cape Cod)</option>
              <option value="2">2 Stories</option>
              <option value="3">3 Stories</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Wall Height per Story (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={wallHeight}
              onChange={(e) => setWallHeight(e.target.value)}
              placeholder="e.g., 9"
              step="0.5"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Doors</label>
            <input
              type="number"
              className={styles.input}
              value={numDoors}
              onChange={(e) => setNumDoors(e.target.value)}
              placeholder="e.g., 2"
              min="0"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Windows</label>
            <input
              type="number"
              className={styles.input}
              value={numWindows}
              onChange={(e) => setNumWindows(e.target.value)}
              placeholder="e.g., 8"
              min="0"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Avg Window Size (sq ft)</label>
            <input
              type="number"
              className={styles.input}
              value={avgWindowSize}
              onChange={(e) => setAvgWindowSize(e.target.value)}
              placeholder="e.g., 15"
              step="1"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={hasGables}
              onChange={(e) => setHasGables(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            House has gables (triangular sections at roof peaks)
          </label>
        </div>

        {hasGables && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Gables</label>
            <input
              type="number"
              className={styles.input}
              value={gableCount}
              onChange={(e) => setGableCount(e.target.value)}
              placeholder="e.g., 2"
              min="0"
              step="1"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Siding Surface Type</label>
          <select
            className={styles.select}
            value={surfaceType}
            onChange={(e) => setSurfaceType(e.target.value)}
          >
            <option value="smooth">Smooth (vinyl, aluminum, smooth wood)</option>
            <option value="textured">Textured (wood grain, T1-11)</option>
            <option value="rough">Rough (cedar shakes, rough-sawn)</option>
            <option value="brick">Brick</option>
            <option value="stucco">Stucco</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Coats</label>
            <select
              className={styles.select}
              value={coats}
              onChange={(e) => setCoats(e.target.value)}
            >
              <option value="1">1 Coat (touch-up only)</option>
              <option value="2">2 Coats (standard)</option>
              <option value="3">3 Coats (color change)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={includePrimer}
                onChange={(e) => setIncludePrimer(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Include Primer
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Paint Price per Gallon (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={paintPrice}
            onChange={(e) => setPaintPrice(e.target.value)}
            placeholder="e.g., 45.00"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Paint Needed
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Exterior Paint Estimate</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>House Perimeter</span>
            <span className={styles.resultValue}>{results.perimeterFt} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Wall Area</span>
            <span className={styles.resultValue}>{results.wallArea} sq ft</span>
          </div>

          {parseFloat(results.gableArea) > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Gable Area (included)</span>
              <span className={styles.resultValue}>{results.gableArea} sq ft</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Doors/Windows (subtracted)</span>
            <span className={styles.resultValue}>{results.openingsArea} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Paintable Siding Area</span>
            <span className={styles.resultValue}>{results.paintableSidingArea} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Trim Area (estimated)</span>
            <span className={styles.resultValue}>{results.trimArea} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Coverage Rate</span>
            <span className={styles.resultValue}>{results.coverage} sq ft/gallon</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Paint Required ({results.numCoats} coats)</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Siding Paint</span>
            <span className={styles.resultValuePrimary}>{results.sidingGallons} gallons</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Trim Paint</span>
            <span className={styles.resultValue}>{results.trimGallons} gallons</span>
          </div>

          {results.primerGallons > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Primer</span>
              <span className={styles.resultValue}>{results.primerGallons} gallons</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Paint + Primer</span>
            <span className={styles.resultValuePrimary}>{results.totalGallons} gallons</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Paint Cost</span>
                <span className={styles.resultValue}>${results.paintCost}</span>
              </div>

              {parseFloat(results.primerCost) > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Primer Cost (~60% of paint price)</span>
                  <span className={styles.resultValue}>${results.primerCost}</span>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Material Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Buy all paint from the same batch for color consistency. Add 10% extra for touch-ups and future maintenance. Store leftover paint properly for touch-ups.
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
