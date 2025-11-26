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

export default function DeckBoardCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [deckLength, setDeckLength] = useState<string>('');
  const [deckWidth, setDeckWidth] = useState<string>('');
  const [boardWidth, setBoardWidth] = useState<string>('5.5');
  const [boardLength, setBoardLength] = useState<string>('16');
  const [gapWidth, setGapWidth] = useState<string>('0.125');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [deckingType, setDeckingType] = useState<string>('pressure-treated');
  const [pricePerBoard, setPricePerBoard] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Decking types
  const deckingTypes: { [key: string]: { name: string; widths: string[] } } = {
    'pressure-treated': { name: 'Pressure Treated', widths: ['5.5', '3.5'] },
    'cedar': { name: 'Cedar', widths: ['5.5', '3.5'] },
    'composite': { name: 'Composite', widths: ['5.5', '7.25'] },
    'ipe': { name: 'Ipe/Hardwood', widths: ['5.5', '3.5'] },
    'pvc': { name: 'PVC', widths: ['5.5', '7.25'] }
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    if (!deckLength || parseFloat(deckLength) <= 0) newErrors.push('Please enter a valid deck length');
    if (!deckWidth || parseFloat(deckWidth) <= 0) newErrors.push('Please enter a valid deck width');
    if (!boardWidth || parseFloat(boardWidth) <= 0) newErrors.push('Please enter a valid board width');
    if (!boardLength || parseFloat(boardLength) <= 0) newErrors.push('Please enter a valid board length');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const dLength = parseFloat(deckLength);
    const dWidth = parseFloat(deckWidth);
    const bWidth = parseFloat(boardWidth);
    const bLength = parseFloat(boardLength);
    const gap = parseFloat(gapWidth) || 0.125;
    const waste = parseFloat(wasteFactor) || 10;

    // Calculate boards running perpendicular to joists (typically along deck width)
    // Board coverage = board width + gap
    const boardCoverage = (bWidth + gap) / 12; // Convert to feet
    const boardsNeeded = Math.ceil(dLength / boardCoverage);

    // Calculate linear feet needed
    const linearFeetPerBoard = dWidth;
    const totalLinearFeet = boardsNeeded * linearFeetPerBoard;

    // Calculate how many standard length boards are needed
    // Try to optimize cuts
    const boardsPerDeckWidth = Math.ceil(dWidth / bLength);
    const totalBoardsBase = boardsNeeded * boardsPerDeckWidth;

    // Add waste factor
    const totalBoardsWithWaste = Math.ceil(totalBoardsBase * (1 + waste / 100));

    // Calculate square footage
    const deckSqFt = dLength * dWidth;

    // Calculate screws needed (approximately 2 screws per board end, per joist)
    // Assuming 16" joist spacing
    const joistsAcrossWidth = Math.ceil((dWidth * 12) / 16) + 1;
    const screwsPerBoard = joistsAcrossWidth * 2;
    const totalScrews = boardsNeeded * screwsPerBoard;
    const screwBoxes = Math.ceil(totalScrews / 100); // 100 screws per box typical

    // Cost calculation
    const price = parseFloat(pricePerBoard) || 0;
    const totalCost = price > 0 ? totalBoardsWithWaste * price : null;

    // Alternative board length options
    const altLengths = [8, 10, 12, 16, 20];
    const boardOptions = altLengths.map(len => {
      const boardsPerWidth = Math.ceil(dWidth / len);
      const totalBoards = Math.ceil(boardsNeeded * boardsPerWidth * (1 + waste / 100));
      const wastePercent = ((boardsPerWidth * len - dWidth) / (boardsPerWidth * len)) * 100;
      return { length: len, boards: totalBoards, waste: wastePercent.toFixed(1) };
    });

    setResults({
      deckLength: dLength.toFixed(1),
      deckWidth: dWidth.toFixed(1),
      deckSqFt: deckSqFt.toFixed(0),
      boardWidth: bWidth,
      boardLength: bLength,
      boardsNeeded,
      linearFeetPerBoard: linearFeetPerBoard.toFixed(1),
      totalLinearFeet: totalLinearFeet.toFixed(0),
      totalBoardsBase,
      totalBoardsWithWaste,
      wasteFactor: waste,
      totalScrews,
      screwBoxes,
      totalCost: totalCost ? totalCost.toFixed(2) : null,
      boardOptions,
      deckingType: deckingTypes[deckingType]?.name || 'Standard'
    });

    trackCalculatorUsage('Deck Board Calculator', {
      deckLength: dLength.toString(),
      deckWidth: dWidth.toString(),
      boardLength: bLength.toString(),
      totalBoards: totalBoardsWithWaste.toString()
    });
  };

  const faqItems = [
    {
      question: 'What length deck boards should I use?',
      answer: 'Choose board lengths that minimize waste. If your deck is 14 feet wide, using 16-foot boards wastes less than 14% per board. If possible, use boards that span the full width to avoid seams. For wider decks, plan seams to fall on joists.'
    },
    {
      question: 'How much gap should I leave between deck boards?',
      answer: 'Leave 1/8" to 1/4" gap for wood decking to allow for expansion and water drainage. Composite decking often requires 3/16" to 1/4" gaps. Check manufacturer specifications for your decking material.'
    },
    {
      question: 'How do I calculate deck boards for a diagonal pattern?',
      answer: 'Diagonal patterns require 15-20% more material than straight patterns due to angle cuts at the edges. Add 15% waste for 45-degree diagonals, 20% for herringbone or chevron patterns.'
    },
    {
      question: 'How many screws do I need for deck boards?',
      answer: 'Plan for 2 screws per board at each joist intersection. With 16" on-center joists, a 16-foot deck width needs about 13 joists × 2 screws = 26 screws per board. Hidden fastener systems vary by manufacturer.'
    },
    {
      question: 'Should seams be staggered on a deck?',
      answer: 'Yes, stagger seams by at least 2 feet for structural strength and appearance. Never align seams on adjacent boards. All seams must fall on joist centers for proper support.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Deck Calculator',
      link: '/calculators/deck',
      description: 'Calculate complete deck materials'
    },
    {
      title: 'Deck Stair Calculator',
      link: '/construction/deck-stairs',
      description: 'Calculate stair stringers and treads'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate lumber for framing'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Getting the right number of deck boards prevents costly mid-project trips to the lumber yard. Here's how to calculate accurately:",
      steps: [
        "Enter your deck dimensions. Length is the direction boards will run; width is across the boards.",
        "Select your board width (5.5\" is standard for 2×6 decking after milling).",
        "Choose the board length that best fits your deck width to minimize waste and seams.",
        "Adjust the waste factor based on your pattern (10% straight, 15-20% diagonal).",
        "Click 'Calculate' to see boards needed and compare different board lengths."
      ]
    },
    whyMatters: {
      description: "Deck boards are a significant expense, and improper planning leads to wasted material or frustrating trips back to the store. Choosing the optimal board length for your deck width can save 10-20% on materials. Understanding where seams fall helps plan a professional-looking installation.",
      benefits: [
        "Calculate exact board counts with waste factor",
        "Compare different board lengths to minimize waste",
        "Know how many screws and fasteners you need",
        "Estimate total project cost accurately",
        "Plan seam locations before you start"
      ]
    },
    examples: [
      {
        title: "Standard Rectangular Deck",
        scenario: "A 12' × 16' deck using 5.5\" wide boards running the 16' length.",
        calculation: "12' ÷ (5.625\" / 12) = 26 rows. Each row needs one 16' board. 26 boards + 10% waste = 29 boards.",
        result: "Order 29 boards (16' lengths). Full-span boards mean no seams."
      },
      {
        title: "Wide Deck with Seams",
        scenario: "A 20' × 24' deck using 12' boards.",
        calculation: "20' ÷ (5.625\" / 12) = 43 rows. Each row needs 2 boards (12' each). 86 boards + 10% waste = 95 boards.",
        result: "Order 95 boards. Plan seams to stagger and fall on joists."
      },
      {
        title: "Diagonal Pattern",
        scenario: "A 14' × 14' deck with 45-degree diagonal boards.",
        calculation: "196 sq ft deck. Standard would need ~42 boards. Diagonal adds 15% waste = 49 boards.",
        result: "Order 50+ boards. Diagonal cuts waste more material at edges."
      }
    ],
    commonMistakes: [
      "Not accounting for the actual board width - a '2×6' is only 5.5\" wide after milling.",
      "Forgetting the gap between boards - gaps reduce coverage per row.",
      "Using board lengths that create excessive waste - match board length to deck width when possible.",
      "Not planning seam locations - seams must fall on joist centers.",
      "Underestimating waste for diagonal patterns - diagonals waste 15-20% more than straight layouts."
    ]
  };

  return (
    <CalculatorLayout
      title="Deck Board Calculator"
      description="Calculate how many deck boards you need with optimized layouts to minimize waste. Includes screws and cost estimates."
    >
      <CalculatorSchema
        name="Deck Board Calculator"
        description="Free deck board calculator to estimate boards, screws, and costs. Compare board lengths to minimize waste for your deck project."
        url="/construction/deck-boards"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Deck Length (feet) - Direction boards run</label>
          <input
            type="number"
            className={styles.input}
            value={deckLength}
            onChange={(e) => setDeckLength(e.target.value)}
            placeholder="e.g., 20"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Deck Width (feet) - Across the boards</label>
          <input
            type="number"
            className={styles.input}
            value={deckWidth}
            onChange={(e) => setDeckWidth(e.target.value)}
            placeholder="e.g., 16"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Decking Type</label>
          <select
            className={styles.select}
            value={deckingType}
            onChange={(e) => setDeckingType(e.target.value)}
          >
            {Object.entries(deckingTypes).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Board Width (inches)</label>
          <select
            className={styles.select}
            value={boardWidth}
            onChange={(e) => setBoardWidth(e.target.value)}
          >
            <option value="5.5">5.5" (Standard 2×6)</option>
            <option value="3.5">3.5" (2×4)</option>
            <option value="7.25">7.25" (2×8 or wide composite)</option>
            <option value="1.5">1.5" (Narrow boards)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Board Length (feet)</label>
          <select
            className={styles.select}
            value={boardLength}
            onChange={(e) => setBoardLength(e.target.value)}
          >
            <option value="8">8 feet</option>
            <option value="10">10 feet</option>
            <option value="12">12 feet</option>
            <option value="16">16 feet</option>
            <option value="20">20 feet</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Gap Between Boards (inches)</label>
          <select
            className={styles.select}
            value={gapWidth}
            onChange={(e) => setGapWidth(e.target.value)}
          >
            <option value="0.0625">1/16" - Tight (some composite)</option>
            <option value="0.125">1/8" - Standard wood</option>
            <option value="0.1875">3/16" - Composite standard</option>
            <option value="0.25">1/4" - Wide gap</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor (%)</label>
          <select
            className={styles.select}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
          >
            <option value="10">10% - Straight pattern</option>
            <option value="15">15% - Diagonal pattern</option>
            <option value="20">20% - Complex pattern</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Board ($) - Optional</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerBoard}
            onChange={(e) => setPricePerBoard(e.target.value)}
            placeholder="e.g., 15.00"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Deck Boards
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Deck Board Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Deck Dimensions</span>
            <span className={styles.resultValue}>{results.deckLength}' × {results.deckWidth}'</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Deck Area</span>
            <span className={styles.resultValue}>{results.deckSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Board Size</span>
            <span className={styles.resultValue}>{results.boardWidth}" × {results.boardLength}'</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rows of Boards</span>
            <span className={styles.resultValue}>{results.boardsNeeded} rows</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Boards (without waste)</span>
            <span className={styles.resultValue}>{results.totalBoardsBase} boards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>With {results.wasteFactor}% Waste</span>
            <span className={styles.resultValuePrimary}>{results.totalBoardsWithWaste} boards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Linear Feet</span>
            <span className={styles.resultValue}>{results.totalLinearFeet} LF</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Fasteners</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Deck Screws Needed</span>
            <span className={styles.resultValue}>~{results.totalScrews} screws</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Screw Boxes (100/box)</span>
            <span className={styles.resultValue}>{results.screwBoxes} boxes</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Estimated Board Cost</span>
                  <span className={styles.resultValuePrimary}>${results.totalCost}</span>
                </div>
              </div>
            </>
          )}

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Board Length Comparison</h3>
            <small style={{ color: '#888', display: 'block', marginBottom: '1rem' }}>
              Compare different board lengths to find the best value:
            </small>
          </div>

          {results.boardOptions.map((opt: any) => (
            <div key={opt.length} className={styles.resultItem} style={{
              backgroundColor: opt.length === parseFloat(results.boardLength) ? '#1a3a5a' : 'transparent',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              <span className={styles.resultLabel}>{opt.length}' boards</span>
              <span className={styles.resultValue}>
                {opt.boards} boards ({opt.waste}% cut waste)
              </span>
            </div>
          ))}

          <div className={styles.note}>
            <strong>Pro Tip:</strong> If your deck width is close to a standard board length (8', 12', 16', 20'),
            using that length eliminates seams and reduces waste. Seams should always fall on joist centers.
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
