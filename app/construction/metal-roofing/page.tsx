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

type InputMethod = 'dimensions' | 'squares';

export default function MetalRoofingCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [inputMethod, setInputMethod] = useState<InputMethod>('dimensions');
  const [roofLength, setRoofLength] = useState<string>('');
  const [roofWidth, setRoofWidth] = useState<string>('');
  const [roofSquares, setRoofSquares] = useState<string>('');
  const [roofPitch, setRoofPitch] = useState<string>('4');
  const [panelType, setPanelType] = useState<string>('standing-seam');
  const [panelWidth, setPanelWidth] = useState<string>('16');
  const [panelLength, setPanelLength] = useState<string>('');
  const [overlapWidth, setOverlapWidth] = useState<string>('1');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [numHips, setNumHips] = useState<string>('0');
  const [numValleys, setNumValleys] = useState<string>('0');
  const [ridgeLength, setRidgeLength] = useState<string>('');
  const [panelPrice, setPanelPrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Pitch multipliers for converting horizontal area to actual roof area
  const pitchMultipliers: Record<string, number> = {
    '2': 1.02,
    '3': 1.03,
    '4': 1.05,
    '5': 1.08,
    '6': 1.12,
    '7': 1.16,
    '8': 1.20,
    '9': 1.25,
    '10': 1.30,
    '11': 1.36,
    '12': 1.41
  };

  const panelPresets: Record<string, { width: string; overlap: string; coverage: string }> = {
    'standing-seam': { width: '16', overlap: '0', coverage: '16' },
    'corrugated': { width: '26', overlap: '2', coverage: '24' },
    'r-panel': { width: '36', overlap: '1.5', coverage: '34.5' },
    'pbu': { width: '36', overlap: '1.5', coverage: '34.5' },
    '5v-crimp': { width: '26', overlap: '2', coverage: '24' }
  };

  const handlePanelTypeChange = (type: string) => {
    setPanelType(type);
    if (panelPresets[type]) {
      setPanelWidth(panelPresets[type].width);
      setOverlapWidth(panelPresets[type].overlap);
    }
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    let roofAreaSqFt = 0;
    let actualRoofArea = 0;

    if (inputMethod === 'dimensions') {
      const length = parseFloat(roofLength);
      const width = parseFloat(roofWidth);
      if (isNaN(length) || length <= 0) newErrors.push('Please enter a valid roof length');
      if (isNaN(width) || width <= 0) newErrors.push('Please enter a valid roof width');
      if (newErrors.length === 0) {
        roofAreaSqFt = length * width;
      }
    } else {
      const squares = parseFloat(roofSquares);
      if (isNaN(squares) || squares <= 0) newErrors.push('Please enter valid roof squares');
      else roofAreaSqFt = squares * 100;
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const pitch = roofPitch;
    const pitchMultiplier = pitchMultipliers[pitch] || 1.0;
    actualRoofArea = roofAreaSqFt * pitchMultiplier;

    const panelW = parseFloat(panelWidth);
    const overlap = parseFloat(overlapWidth);
    const coverageWidth = panelW - overlap;
    const waste = parseFloat(wasteFactor) || 10;

    // Panel length (use roof width if not specified, assuming panels run from ridge to eave)
    const pLength = parseFloat(panelLength) || parseFloat(roofWidth) || Math.sqrt(roofAreaSqFt);

    // Number of panels needed
    const roofLengthFt = inputMethod === 'dimensions' ? parseFloat(roofLength) : Math.sqrt(roofAreaSqFt);
    const panelsPerSide = Math.ceil((roofLengthFt * 12) / coverageWidth);
    const totalPanels = panelsPerSide * 2; // Both sides of roof

    // Total panel square footage (with waste)
    const panelAreaWithWaste = actualRoofArea * (1 + waste / 100);

    // Screws (approximately 80 per square for metal roofing)
    const squares = actualRoofArea / 100;
    const screws = Math.ceil(squares * 80 * 1.1); // 10% extra

    // Closures (foam or rubber strips at ridge and eave)
    const ridgeLen = parseFloat(ridgeLength) || roofLengthFt;
    const closureFt = (ridgeLen * 2) + (roofLengthFt * 2); // Ridge + both eaves

    // Ridge cap
    const ridgeCapFt = Math.ceil(ridgeLen * 1.1); // 10% overlap

    // Hip and valley flashing
    const hips = parseInt(numHips) || 0;
    const valleys = parseInt(numValleys) || 0;
    const avgHipValleyLength = Math.sqrt(Math.pow(pLength, 2) + Math.pow(pLength / 2, 2));
    const hipFlashingFt = Math.ceil(hips * avgHipValleyLength * 1.1);
    const valleyFlashingFt = Math.ceil(valleys * avgHipValleyLength * 1.1);

    // Drip edge/eave trim
    const dripEdgeFt = Math.ceil(roofLengthFt * 2 * 1.1); // Both eaves

    // Gable trim
    const gableTrimFt = Math.ceil(pLength * 4 * 1.1); // 4 gable edges typically

    // Underlayment (synthetic recommended for metal)
    const underlaymentSqFt = Math.ceil(actualRoofArea * 1.1);
    const underlaymentRolls = Math.ceil(underlaymentSqFt / 1000); // 1000 sq ft per roll typical

    // Cost calculations
    const price = parseFloat(panelPrice) || 0;
    const panelCost = price > 0 ? panelAreaWithWaste * price : null;
    const screwsCost = (screws / 250) * 45; // ~$45 per 250 screws
    const ridgeCapCost = ridgeCapFt * 8; // ~$8 per linear foot
    const trimCost = (dripEdgeFt + gableTrimFt + hipFlashingFt + valleyFlashingFt) * 3; // ~$3/LF
    const underlaymentCost = underlaymentRolls * 150; // ~$150 per roll
    const totalCost = panelCost ? panelCost + screwsCost + ridgeCapCost + trimCost + underlaymentCost : null;

    setResults({
      flatRoofArea: roofAreaSqFt.toFixed(0),
      actualRoofArea: actualRoofArea.toFixed(0),
      roofSquares: (actualRoofArea / 100).toFixed(1),
      pitchMultiplier: pitchMultiplier.toFixed(2),
      panelType,
      panelWidth: panelW,
      coverageWidth,
      panelsPerSide,
      totalPanels,
      panelAreaWithWaste: panelAreaWithWaste.toFixed(0),
      screws,
      ridgeCapFt,
      hipFlashingFt,
      valleyFlashingFt,
      dripEdgeFt,
      gableTrimFt,
      closureFt: closureFt.toFixed(0),
      underlaymentRolls,
      panelCost: panelCost ? panelCost.toFixed(2) : null,
      screwsCost: screwsCost.toFixed(2),
      trimCost: trimCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Metal Roofing Calculator', {
      inputMethod,
      actualRoofArea: actualRoofArea.toFixed(0),
      panelType,
      totalPanels: totalPanels.toString()
    });
  };

  const faqItems = [
    {
      question: 'How do I calculate metal roofing panels needed?',
      answer: 'Measure roof length and width, multiply by the pitch factor to get actual area, then divide by panel coverage width (panel width minus overlap). Add 10-15% for waste. Most panels run from ridge to eave, so panel length equals rafter length.'
    },
    {
      question: 'What is the difference between standing seam and corrugated metal roofing?',
      answer: 'Standing seam has raised seams with hidden fasteners, providing a clean look and superior weather resistance. Corrugated metal has exposed fasteners and overlapping ribs. Standing seam costs more but lasts longer and requires less maintenance.'
    },
    {
      question: 'How long does metal roofing last?',
      answer: 'Quality metal roofing lasts 40-70 years, with standing seam typically lasting longer than exposed fastener systems. Proper installation, ventilation, and occasional maintenance extend lifespan. Most metal roofs come with 30-50 year warranties.'
    },
    {
      question: 'Do I need underlayment under metal roofing?',
      answer: 'Yes, underlayment is required under metal roofing. Synthetic underlayment is preferred over felt because it does not absorb moisture and withstands high temperatures. Self-adhering membrane is recommended in valleys and at eaves in cold climates.'
    },
    {
      question: 'How many screws do I need for metal roofing?',
      answer: 'Plan for approximately 80 screws per 100 square feet (one roofing square). Screws are placed at every rib or panel edge, typically 12-24 inches apart. Use screws with EPDM washers designed for metal roofing.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Roofing Calculator',
      link: '/construction/roofing',
      description: 'Calculate shingles and asphalt roofing'
    },
    {
      title: 'Roof Pitch Calculator',
      link: '/construction/roof-pitch',
      description: 'Calculate roof pitch and area multiplier'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate framing lumber needs'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Metal roofing calculation requires understanding panel widths, overlaps, and accessories. This calculator helps you estimate panels, screws, trim, and all the components needed for a complete metal roof installation.",
      steps: [
        "Enter roof dimensions or total squares (1 square = 100 sq ft).",
        "Select your roof pitch - this affects the actual surface area to cover.",
        "Choose your panel type - standing seam, corrugated, R-panel, etc.",
        "Enter the number of hips and valleys for trim calculations.",
        "Specify ridge length if different from roof length."
      ]
    },
    whyMatters: {
      description: "Metal roofing is a significant investment that pays off with longevity, energy efficiency, and low maintenance. Accurate material estimation prevents costly mid-project orders and ensures you have matching panels from the same production run. Unlike shingles, metal panels come in various widths and profiles that significantly affect coverage calculations.",
      benefits: [
        "Calculate panels based on coverage width, not nominal width",
        "Account for roof pitch in area calculations",
        "Include all trim and accessories",
        "Estimate screws and closure strips",
        "Budget for complete installation costs"
      ]
    },
    examples: [
      {
        title: "Simple Gable Roof",
        scenario: "A 30' x 40' roof area with 4/12 pitch using standing seam panels.",
        calculation: "1,200 sq ft x 1.05 (pitch) = 1,260 sq ft actual area",
        result: "80 panels (16\" coverage), 1,000 screws, 30 ft ridge cap."
      },
      {
        title: "Hip Roof with Valleys",
        scenario: "A 2,500 sq ft home footprint, 6/12 pitch, 4 hips, 2 valleys.",
        calculation: "2,500 x 1.12 (pitch) = 2,800 sq ft + hip/valley trim",
        result: "175 panels, 2,200 screws, extensive hip and valley flashing."
      },
      {
        title: "Corrugated Metal Barn",
        scenario: "A 40' x 60' barn with low slope (3/12) using corrugated panels.",
        calculation: "2,400 sq ft x 1.03 = 2,472 sq ft with 24\" coverage panels",
        result: "104 panels, 2,000 screws, minimal trim requirements."
      }
    ],
    commonMistakes: [
      "Using nominal panel width instead of coverage width - overlap reduces coverage.",
      "Forgetting pitch multiplier - steeper roofs have significantly more surface area.",
      "Underestimating trim and accessories - these add significant cost.",
      "Not ordering from same lot - color can vary between production runs.",
      "Skipping underlayment - moisture barriers are essential under metal."
    ]
  };

  return (
    <CalculatorLayout
      title="Metal Roofing Calculator"
      description="Calculate metal roofing panels, screws, ridge caps, trim, and accessories. Includes standing seam, corrugated, and R-panel options."
    >
      <CalculatorSchema
        name="Metal Roofing Calculator"
        description="Free metal roofing calculator to estimate panels, screws, trim, and accessories for standing seam, corrugated, and other metal roof types."
        url="/construction/metal-roofing"
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
              Roof Dimensions
            </button>
            <button
              className={`${styles.buttonOption} ${inputMethod === 'squares' ? styles.buttonOptionActive : ''}`}
              onClick={() => setInputMethod('squares')}
            >
              Roof Squares
            </button>
          </div>
        </div>

        {inputMethod === 'dimensions' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Roof Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={roofLength}
                onChange={(e) => setRoofLength(e.target.value)}
                placeholder="e.g., 40"
                step="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Roof Width/Rafter Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={roofWidth}
                onChange={(e) => setRoofWidth(e.target.value)}
                placeholder="e.g., 15"
                step="1"
              />
            </div>
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>Roof Squares (1 square = 100 sq ft)</label>
            <input
              type="number"
              className={styles.input}
              value={roofSquares}
              onChange={(e) => setRoofSquares(e.target.value)}
              placeholder="e.g., 25"
              step="0.5"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Roof Pitch (rise per 12 inches run)</label>
          <select
            className={styles.select}
            value={roofPitch}
            onChange={(e) => setRoofPitch(e.target.value)}
          >
            {Object.keys(pitchMultipliers).map(pitch => (
              <option key={pitch} value={pitch}>{pitch}/12 (x{pitchMultipliers[pitch].toFixed(2)} area)</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Panel Type</label>
          <select
            className={styles.select}
            value={panelType}
            onChange={(e) => handlePanelTypeChange(e.target.value)}
          >
            <option value="standing-seam">Standing Seam (16" coverage)</option>
            <option value="corrugated">Corrugated (24" coverage)</option>
            <option value="r-panel">R-Panel/PBR (34.5" coverage)</option>
            <option value="pbu">PBU Panel (34.5" coverage)</option>
            <option value="5v-crimp">5V Crimp (24" coverage)</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Panel Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={panelWidth}
              onChange={(e) => setPanelWidth(e.target.value)}
              placeholder="e.g., 16"
              step="0.5"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Overlap Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={overlapWidth}
              onChange={(e) => setOverlapWidth(e.target.value)}
              placeholder="e.g., 1"
              step="0.5"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor</label>
          <select
            className={styles.select}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
          >
            <option value="10">10% - Simple gable roof</option>
            <option value="15">15% - Moderate complexity</option>
            <option value="20">20% - Complex with hips/valleys</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Hips</label>
            <input
              type="number"
              className={styles.input}
              value={numHips}
              onChange={(e) => setNumHips(e.target.value)}
              placeholder="0"
              min="0"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Valleys</label>
            <input
              type="number"
              className={styles.input}
              value={numValleys}
              onChange={(e) => setNumValleys(e.target.value)}
              placeholder="0"
              min="0"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ridge Length (ft)</label>
            <input
              type="number"
              className={styles.input}
              value={ridgeLength}
              onChange={(e) => setRidgeLength(e.target.value)}
              placeholder="Auto"
              step="1"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Panel Price per Sq Ft (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={panelPrice}
            onChange={(e) => setPanelPrice(e.target.value)}
            placeholder="e.g., 3.50"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Metal Roofing
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Metal Roofing Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Flat Roof Area</span>
            <span className={styles.resultValue}>{results.flatRoofArea} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Pitch Multiplier</span>
            <span className={styles.resultValue}>{results.pitchMultiplier}x</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Actual Roof Area</span>
            <span className={styles.resultValuePrimary}>{results.actualRoofArea} sq ft ({results.roofSquares} squares)</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Panels ({results.panelType})</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Panel Width / Coverage</span>
            <span className={styles.resultValue}>{results.panelWidth}" / {results.coverageWidth}" coverage</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Panels per Side</span>
            <span className={styles.resultValue}>{results.panelsPerSide} panels</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Panels (both sides)</span>
            <span className={styles.resultValuePrimary}>{results.totalPanels} panels</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Panel Area with Waste</span>
            <span className={styles.resultValue}>{results.panelAreaWithWaste} sq ft</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Accessories & Hardware</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Screws (with EPDM washers)</span>
            <span className={styles.resultValue}>{results.screws} screws</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Ridge Cap</span>
            <span className={styles.resultValue}>{results.ridgeCapFt} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Drip Edge / Eave Trim</span>
            <span className={styles.resultValue}>{results.dripEdgeFt} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Gable Trim</span>
            <span className={styles.resultValue}>{results.gableTrimFt} linear feet</span>
          </div>

          {results.hipFlashingFt > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Hip Flashing</span>
              <span className={styles.resultValue}>{results.hipFlashingFt} linear feet</span>
            </div>
          )}

          {results.valleyFlashingFt > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Valley Flashing</span>
              <span className={styles.resultValue}>{results.valleyFlashingFt} linear feet</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Closure Strips</span>
            <span className={styles.resultValue}>{results.closureFt} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Underlayment Rolls</span>
            <span className={styles.resultValue}>{results.underlaymentRolls} rolls</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Panels</span>
                <span className={styles.resultValue}>${results.panelCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Screws</span>
                <span className={styles.resultValue}>${results.screwsCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Trim & Flashing</span>
                <span className={styles.resultValue}>${results.trimCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Material Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Order panels cut to exact length to minimize waste. Use screws rated for your panel type. Install panels with the lapped edge away from prevailing winds.
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
