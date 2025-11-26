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

export default function StudCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [wallLength, setWallLength] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('8');
  const [studSpacing, setStudSpacing] = useState<'16' | '24'>('16');
  const [corners, setCorners] = useState<string>('0');
  const [doorways, setDoorways] = useState<string>('0');
  const [doorWidth, setDoorWidth] = useState<string>('36');
  const [windows, setWindows] = useState<string>('0');
  const [windowWidth, setWindowWidth] = useState<string>('36');
  const [studSize, setStudSize] = useState<'2x4' | '2x6'>('2x4');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    if (!wallLength || parseFloat(wallLength) <= 0) newErrors.push('Please enter a valid wall length');
    if (!wallHeight || parseFloat(wallHeight) <= 0) newErrors.push('Please enter a valid wall height');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);
    const spacing = parseInt(studSpacing);
    const numCorners = parseInt(corners) || 0;
    const numDoors = parseInt(doorways) || 0;
    const doorW = parseFloat(doorWidth) / 12 || 3; // Convert to feet
    const numWindows = parseInt(windows) || 0;
    const windowW = parseFloat(windowWidth) / 12 || 3; // Convert to feet

    // Calculate effective length (subtract openings)
    const totalDoorWidth = numDoors * doorW;
    const totalWindowWidth = numWindows * windowW;

    // Base stud count: length in inches / spacing + 1
    const lengthInches = length * 12;
    const baseStuds = Math.ceil(lengthInches / spacing) + 1;

    // Corner studs (typically 3-4 studs per corner for proper nailing surface)
    const cornerStuds = numCorners * 3;

    // Door king studs (2 per door) - these replace studs at door locations
    const doorKingStuds = numDoors * 2;

    // Door jack studs (2 per door, support the header)
    const doorJackStuds = numDoors * 2;

    // Door cripple studs above header (estimate based on spacing)
    const headerHeight = 7; // feet (typical 80" door + header)
    const crippleSpaceAboveDoor = height - headerHeight;
    const doorCripples = crippleSpaceAboveDoor > 0 ? numDoors * Math.ceil((doorW * 12) / spacing) : 0;

    // Window king studs (2 per window)
    const windowKingStuds = numWindows * 2;

    // Window jack/trimmer studs (2 per window)
    const windowJackStuds = numWindows * 2;

    // Window cripples (above and below)
    const windowCripples = numWindows * Math.ceil((windowW * 12) / spacing) * 2; // Above and below

    // Total studs
    const totalStuds = baseStuds + cornerStuds + doorKingStuds + doorJackStuds + doorCripples +
                       windowKingStuds + windowJackStuds + windowCripples;

    // Plates: top plate (doubled) and bottom plate
    const topPlateLength = length * 2; // Double top plate
    const bottomPlateLength = length - totalDoorWidth; // Subtract door openings
    const totalPlateLength = topPlateLength + bottomPlateLength;

    // Convert to number of standard length boards (typically 8', 10', 12', 16')
    const plateBoards8ft = Math.ceil(totalPlateLength / 8);
    const plateBoards12ft = Math.ceil(totalPlateLength / 12);
    const plateBoards16ft = Math.ceil(totalPlateLength / 16);

    // Headers for doors (typically doubled 2x lumber, width depends on span)
    // For spans under 4', use 2x4; 4'-6' use 2x6; 6'-8' use 2x8; 8'-10' use 2x10; 10'-12' use 2x12
    let headerSize = '2x4';
    if (doorW > 4) headerSize = '2x6';
    if (doorW > 6) headerSize = '2x8';
    if (doorW > 8) headerSize = '2x10';
    if (doorW > 10) headerSize = '2x12';

    const doorHeaderLength = numDoors * (doorW + 0.25); // Add 3" for bearing on each side
    const windowHeaderLength = numWindows * (windowW + 0.25);
    const totalHeaderLength = (doorHeaderLength + windowHeaderLength) * 2; // Doubled headers

    // Calculate stud length needed
    let studLength = 8;
    if (height <= 8) studLength = 8;
    else if (height <= 9) studLength = 92.625 / 12; // 92-5/8" precut studs
    else if (height <= 10) studLength = 10;
    else studLength = Math.ceil(height);

    // Add waste factor (10%)
    const totalStudsWithWaste = Math.ceil(totalStuds * 1.1);

    setResults({
      wallLength: length.toFixed(1),
      wallHeight: height.toFixed(1),
      spacing: spacing,
      studSize: studSize,
      baseStuds,
      cornerStuds,
      doorStuds: doorKingStuds + doorJackStuds + doorCripples,
      windowStuds: windowKingStuds + windowJackStuds + windowCripples,
      totalStuds,
      totalStudsWithWaste,
      studLength,
      topPlateLength: topPlateLength.toFixed(1),
      bottomPlateLength: bottomPlateLength.toFixed(1),
      totalPlateLength: totalPlateLength.toFixed(1),
      plateBoards8ft,
      plateBoards12ft,
      plateBoards16ft,
      headerSize,
      totalHeaderLength: totalHeaderLength.toFixed(1),
      numDoors,
      numWindows,
      numCorners
    });

    trackCalculatorUsage('Stud Calculator', {
      wallLength: length.toString(),
      wallHeight: height.toString(),
      spacing: spacing.toString(),
      studSize,
      totalStuds: totalStuds.toString()
    });
  };

  const faqItems = [
    {
      question: 'Should I use 16" or 24" stud spacing?',
      answer: '16" on center (OC) is standard for load-bearing walls and most building codes. 24" OC is acceptable for non-load-bearing interior walls and can save materials. Always check local building codes.'
    },
    {
      question: 'How many studs do I need for a corner?',
      answer: 'Standard corner framing uses 3 studs to create a nailing surface for drywall on both walls. Some methods use 2 studs with blocking or drywall clips for better insulation.'
    },
    {
      question: 'What length studs should I use?',
      answer: 'For standard 8-foot ceilings, use 92-5/8" precut studs (sold as 8-foot studs). For 9-foot ceilings, use 104-5/8" studs. For 10-foot ceilings, use 116-5/8" studs or cut full-length lumber.'
    },
    {
      question: 'When should I use 2x6 studs instead of 2x4?',
      answer: 'Use 2x6 studs for exterior walls in cold climates (allows more insulation), for walls over 10 feet tall, or as required by local building codes for structural reasons.'
    },
    {
      question: 'What size header do I need for a door?',
      answer: 'Header size depends on span: up to 4 feet use 2x4, 4-6 feet use 2x6, 6-8 feet use 2x8, 8-10 feet use 2x10, 10-12 feet use 2x12. Always verify with an engineer for load-bearing walls.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate lumber for complete framing projects'
    },
    {
      title: 'Board Feet Calculator',
      link: '/construction/board-feet',
      description: 'Calculate board feet for lumber orders'
    },
    {
      title: 'Drywall Calculator',
      link: '/calculators/drywall',
      description: 'Calculate drywall sheets for your walls'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Accurate stud counts prevent multiple trips to the lumber yard and ensure your walls are properly framed. Here's how to calculate:",
      steps: [
        "Enter the total wall length in feet. For multiple walls, calculate each separately or add the lengths together.",
        "Enter the wall height (standard is 8 feet for most residential construction).",
        "Select stud spacing: 16\" OC for load-bearing walls, 24\" OC for non-load-bearing interior walls.",
        "Enter the number of corners, doors, and windows to account for additional framing.",
        "Click 'Calculate' to see total studs needed plus plates and headers."
      ]
    },
    whyMatters: {
      description: "Wall framing is the skeleton of your building - get it wrong and you'll have structural problems, crooked walls, or insufficient support for finishes. Calculating materials accurately also helps with budgeting and prevents costly mid-project delays.",
      benefits: [
        "Know exact stud counts including corners, doors, and windows",
        "Calculate plate lumber needed for top and bottom plates",
        "Determine header sizes for door and window openings",
        "Account for king studs, jack studs, and cripples",
        "Include waste factor for cuts and defects"
      ]
    },
    examples: [
      {
        title: "Simple Interior Wall",
        scenario: "A 12-foot interior wall, 8 feet tall, with one 32\" door, 16\" OC spacing.",
        calculation: "Base studs: (144\" ÷ 16) + 1 = 10 studs. Door adds 4 studs (2 king, 2 jack). Total: 14 studs.",
        result: "Order 16 studs (with 10% waste), plus 36 linear feet of plate lumber."
      },
      {
        title: "Exterior Wall with Windows",
        scenario: "A 20-foot exterior wall, 8 feet tall, with two 36\" windows, 2x6 studs at 16\" OC.",
        calculation: "Base studs: (240\" ÷ 16) + 1 = 16 studs. Windows add 16 studs (king, jack, cripples). Total: 32 studs.",
        result: "Order 36 studs (with 10% waste), 60 linear feet of 2x6 plates, and header material."
      },
      {
        title: "Room with Corner",
        scenario: "Two 10-foot walls meeting at a corner, 9-foot ceiling, one 36\" door.",
        calculation: "20 linear feet total. Base studs: 16. Corner: 3 studs. Door: 6 studs (king, jack, cripples).",
        result: "Order 28 studs at 92-5/8\" length, plus plates and a 2x6 header for the door."
      }
    ],
    commonMistakes: [
      "Forgetting to add studs for corners - you need 3-4 studs per corner for proper drywall backing.",
      "Not accounting for king studs and jack studs at openings - doors and windows require additional framing.",
      "Using wrong stud spacing - 24\" OC is not acceptable for load-bearing walls in most codes.",
      "Ordering wrong length studs - precut studs are sized for specific ceiling heights with plates.",
      "Undersizing headers - always verify header size with span tables for load-bearing walls."
    ]
  };

  return (
    <CalculatorLayout
      title="Stud Calculator"
      description="Calculate wall studs, plates, and headers for framing. Includes corners, door and window openings with 16-inch or 24-inch on center spacing."
    >
      <CalculatorSchema
        name="Stud Calculator"
        description="Free wall stud calculator for framing. Calculate studs, top and bottom plates, headers, and account for doors, windows, and corners."
        url="/construction/stud"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Wall Length (feet)</label>
          <input
            type="number"
            className={styles.input}
            value={wallLength}
            onChange={(e) => setWallLength(e.target.value)}
            placeholder="e.g., 20"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Wall Height (feet)</label>
          <select
            className={styles.select}
            value={wallHeight}
            onChange={(e) => setWallHeight(e.target.value)}
          >
            <option value="8">8 feet (standard)</option>
            <option value="9">9 feet</option>
            <option value="10">10 feet</option>
            <option value="12">12 feet</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stud Spacing</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${studSpacing === '16' ? styles.buttonOptionActive : ''}`}
              onClick={() => setStudSpacing('16')}
            >
              16" OC (Standard)
            </button>
            <button
              className={`${styles.buttonOption} ${studSpacing === '24' ? styles.buttonOptionActive : ''}`}
              onClick={() => setStudSpacing('24')}
            >
              24" OC (Economy)
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stud Size</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${studSize === '2x4' ? styles.buttonOptionActive : ''}`}
              onClick={() => setStudSize('2x4')}
            >
              2×4 (Interior)
            </button>
            <button
              className={`${styles.buttonOption} ${studSize === '2x6' ? styles.buttonOptionActive : ''}`}
              onClick={() => setStudSize('2x6')}
            >
              2×6 (Exterior)
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Number of Corners</label>
          <input
            type="number"
            className={styles.input}
            value={corners}
            onChange={(e) => setCorners(e.target.value)}
            placeholder="e.g., 2"
            min="0"
            step="1"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Doors</label>
            <input
              type="number"
              className={styles.input}
              value={doorways}
              onChange={(e) => setDoorways(e.target.value)}
              placeholder="e.g., 1"
              min="0"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Door Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={doorWidth}
              onChange={(e) => setDoorWidth(e.target.value)}
              placeholder="e.g., 36"
              step="1"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Windows</label>
            <input
              type="number"
              className={styles.input}
              value={windows}
              onChange={(e) => setWindows(e.target.value)}
              placeholder="e.g., 2"
              min="0"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Window Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={windowWidth}
              onChange={(e) => setWindowWidth(e.target.value)}
              placeholder="e.g., 36"
              step="1"
            />
          </div>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Studs
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Framing Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Wall Dimensions</span>
            <span className={styles.resultValue}>{results.wallLength}' × {results.wallHeight}'</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stud Spacing</span>
            <span className={styles.resultValue}>{results.spacing}" on center</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Studs ({results.studSize})</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Base Wall Studs</span>
            <span className={styles.resultValue}>{results.baseStuds}</span>
          </div>

          {results.cornerStuds > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Corner Studs ({results.numCorners} corners)</span>
              <span className={styles.resultValue}>{results.cornerStuds}</span>
            </div>
          )}

          {results.doorStuds > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Door Framing ({results.numDoors} doors)</span>
              <span className={styles.resultValue}>{results.doorStuds}</span>
            </div>
          )}

          {results.windowStuds > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Window Framing ({results.numWindows} windows)</span>
              <span className={styles.resultValue}>{results.windowStuds}</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Studs (with 10% waste)</span>
            <span className={styles.resultValuePrimary}>{results.totalStudsWithWaste} studs</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stud Length Needed</span>
            <span className={styles.resultValue}>{results.studLength === 8 ? '92-5/8" (precut)' : results.studLength + ' feet'}</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Plates ({results.studSize})</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Top Plate (doubled)</span>
            <span className={styles.resultValue}>{results.topPlateLength} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Bottom Plate</span>
            <span className={styles.resultValue}>{results.bottomPlateLength} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Plate Boards (8')</span>
            <span className={styles.resultValue}>{results.plateBoards8ft} boards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Plate Boards (12')</span>
            <span className={styles.resultValue}>{results.plateBoards12ft} boards</span>
          </div>

          {(results.numDoors > 0 || results.numWindows > 0) && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Headers</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Recommended Header Size</span>
                <span className={styles.resultValue}>{results.headerSize} (doubled)</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Header Length</span>
                <span className={styles.resultValue}>{results.totalHeaderLength} linear feet</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Note:</strong> Header size is based on standard spans. For load-bearing walls or spans over 6 feet,
            consult span tables or a structural engineer. Always verify with local building codes.
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
