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

export default function BoardFeetCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [thickness, setThickness] = useState<string>('1');
  const [width, setWidth] = useState<string>('6');
  const [length, setLength] = useState<string>('8');
  const [quantity, setQuantity] = useState<string>('1');
  const [pricePerBoardFoot, setPricePerBoardFoot] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Common lumber dimensions for quick selection
  const commonSizes = [
    { label: '1×4', thickness: '1', width: '4' },
    { label: '1×6', thickness: '1', width: '6' },
    { label: '1×8', thickness: '1', width: '8' },
    { label: '1×10', thickness: '1', width: '10' },
    { label: '1×12', thickness: '1', width: '12' },
    { label: '2×4', thickness: '2', width: '4' },
    { label: '2×6', thickness: '2', width: '6' },
    { label: '2×8', thickness: '2', width: '8' },
    { label: '2×10', thickness: '2', width: '10' },
    { label: '2×12', thickness: '2', width: '12' },
    { label: '4×4', thickness: '4', width: '4' },
    { label: '6×6', thickness: '6', width: '6' }
  ];

  const handleQuickSelect = (size: { thickness: string; width: string }) => {
    setThickness(size.thickness);
    setWidth(size.width);
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    if (!thickness || parseFloat(thickness) <= 0) newErrors.push('Please enter a valid thickness');
    if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid width');
    if (!length || parseFloat(length) <= 0) newErrors.push('Please enter a valid length');
    if (!quantity || parseFloat(quantity) <= 0) newErrors.push('Please enter a valid quantity');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const t = parseFloat(thickness);
    const w = parseFloat(width);
    const l = parseFloat(length);
    const q = parseFloat(quantity);

    // Board feet = (Thickness × Width × Length) / 144
    // When thickness and width are in inches, length in feet
    const boardFeetPerPiece = (t * w * l) / 12;
    const totalBoardFeet = boardFeetPerPiece * q;

    // Calculate linear feet
    const linearFeetPerPiece = l;
    const totalLinearFeet = linearFeetPerPiece * q;

    // Calculate square feet (surface area)
    const squareFeetPerPiece = (w / 12) * l;
    const totalSquareFeet = squareFeetPerPiece * q;

    // Cost calculation if price provided
    const price = parseFloat(pricePerBoardFoot) || 0;
    const totalCost = price > 0 ? totalBoardFeet * price : null;

    setResults({
      thickness: t,
      width: w,
      length: l,
      quantity: q,
      boardFeetPerPiece: boardFeetPerPiece.toFixed(2),
      totalBoardFeet: totalBoardFeet.toFixed(2),
      linearFeetPerPiece: linearFeetPerPiece.toFixed(1),
      totalLinearFeet: totalLinearFeet.toFixed(1),
      squareFeetPerPiece: squareFeetPerPiece.toFixed(2),
      totalSquareFeet: totalSquareFeet.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null,
      pricePerBoardFoot: price
    });

    trackCalculatorUsage('Board Feet Calculator', {
      thickness: t.toString(),
      width: w.toString(),
      length: l.toString(),
      quantity: q.toString(),
      totalBoardFeet: totalBoardFeet.toFixed(2)
    });
  };

  const faqItems = [
    {
      question: 'What is a board foot?',
      answer: 'A board foot is a unit of lumber volume equal to 144 cubic inches, or a piece of wood 1 inch thick × 12 inches wide × 12 inches long (1 foot). It is the standard unit for pricing and selling hardwood lumber.'
    },
    {
      question: 'How do I calculate board feet?',
      answer: 'Board feet = (Thickness in inches × Width in inches × Length in feet) ÷ 12. For example, a 2×6×8 board: (2 × 6 × 8) ÷ 12 = 8 board feet.'
    },
    {
      question: 'Are dimensional lumber sizes actual sizes?',
      answer: 'No, dimensional lumber (like 2×4s) uses nominal sizes. A "2×4" actually measures 1.5" × 3.5" after drying and planing. However, board feet are calculated using nominal dimensions for pricing purposes.'
    },
    {
      question: 'Why is hardwood sold by the board foot?',
      answer: 'Hardwood comes in random widths and lengths from the log, unlike dimensional softwood lumber. Board feet provides a consistent way to price wood regardless of the specific dimensions of each piece.'
    },
    {
      question: 'How do I convert linear feet to board feet?',
      answer: 'Multiply linear feet by the cross-sectional area in square inches, then divide by 12. For a 2×6: Linear feet × (2 × 6) ÷ 12 = Board feet. So 10 linear feet of 2×6 = 10 × 12 ÷ 12 = 10 board feet.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate lumber for framing projects'
    },
    {
      title: 'Stud Calculator',
      link: '/construction/stud',
      description: 'Calculate wall studs and framing'
    },
    {
      title: 'Deck Board Calculator',
      link: '/construction/deck-boards',
      description: 'Calculate decking materials'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Board feet is the standard measurement for hardwood lumber pricing. Here's how to calculate your lumber needs:",
      steps: [
        "Enter the thickness and width in inches. Use the quick-select buttons for common lumber sizes.",
        "Enter the length of each board in feet.",
        "Enter the quantity of boards you need.",
        "Optionally enter the price per board foot to calculate total cost.",
        "Click 'Calculate' to see board feet, linear feet, and square feet."
      ]
    },
    whyMatters: {
      description: "Understanding board feet is essential when buying hardwood lumber, as most lumber yards price by the board foot. Unlike dimensional softwood (sold by the piece), hardwood prices vary by species, grade, and the total board footage you're purchasing.",
      benefits: [
        "Calculate exact lumber costs before visiting the lumber yard",
        "Compare prices between different suppliers accurately",
        "Convert between board feet, linear feet, and square feet",
        "Estimate material costs for woodworking projects",
        "Avoid over-buying expensive hardwoods"
      ]
    },
    examples: [
      {
        title: "Hardwood Table Top",
        scenario: "You need 5 pieces of 8/4 (2-inch thick) walnut, 6 inches wide, 6 feet long.",
        calculation: "(2 × 6 × 6) ÷ 12 = 6 board feet per piece × 5 pieces = 30 board feet",
        result: "At $12/board foot for walnut, total cost is $360."
      },
      {
        title: "Cabinet Sides",
        scenario: "You need 8 pieces of 4/4 (1-inch thick) maple, 12 inches wide, 4 feet long.",
        calculation: "(1 × 12 × 4) ÷ 12 = 4 board feet per piece × 8 pieces = 32 board feet",
        result: "At $6/board foot for maple, total cost is $192."
      },
      {
        title: "2×6 Lumber Comparison",
        scenario: "A lumberyard sells 2×6×12 boards at $9.50 each. What's the per-board-foot cost?",
        calculation: "(2 × 6 × 12) ÷ 12 = 12 board feet per board",
        result: "$9.50 ÷ 12 board feet = $0.79 per board foot."
      }
    ],
    commonMistakes: [
      "Confusing nominal vs actual dimensions - remember that a 2×4 is actually 1.5×3.5 inches. Board feet use nominal dimensions.",
      "Mixing up the formula - thickness and width are in inches, but length is in feet.",
      "Forgetting waste factor - add 15-20% for cuts, defects, and mistakes when ordering hardwood.",
      "Not accounting for rough vs surfaced - rough lumber may need 1/8\" to 1/4\" removed per face during surfacing.",
      "Assuming board feet equals square feet - they're only equal for 1-inch thick material."
    ]
  };

  return (
    <CalculatorLayout
      title="Board Feet Calculator"
      description="Calculate board feet for lumber and hardwood. Convert between board feet, linear feet, and square feet with cost estimates."
    >
      <CalculatorSchema
        name="Board Feet Calculator"
        description="Free board feet calculator for lumber and hardwood. Calculate board feet from dimensions and get cost estimates for your woodworking projects."
        url="/construction/board-feet"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Quick Select Common Sizes</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {commonSizes.map((size) => (
              <button
                key={size.label}
                className={styles.buttonOption}
                onClick={() => handleQuickSelect(size)}
                style={{
                  backgroundColor: thickness === size.thickness && width === size.width ? '#4a9eff' : '#1a1a1a',
                  color: thickness === size.thickness && width === size.width ? 'white' : '#e0e0e0',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem'
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Thickness (inches)</label>
          <input
            type="number"
            className={styles.input}
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            placeholder="e.g., 2"
            step="0.25"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            Use nominal thickness (e.g., 2 for a 2×4)
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Width (inches)</label>
          <input
            type="number"
            className={styles.input}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g., 6"
            step="0.25"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Length (feet)</label>
          <input
            type="number"
            className={styles.input}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="e.g., 8"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Quantity (number of boards)</label>
          <input
            type="number"
            className={styles.input}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 10"
            step="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Board Foot ($) - Optional</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerBoardFoot}
            onChange={(e) => setPricePerBoardFoot(e.target.value)}
            placeholder="e.g., 5.50"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Board Feet
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Results</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Board Size</span>
            <span className={styles.resultValue}>{results.thickness}" × {results.width}" × {results.length}'</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Quantity</span>
            <span className={styles.resultValue}>{results.quantity} boards</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Per Board</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Board Feet per Piece</span>
            <span className={styles.resultValue}>{results.boardFeetPerPiece} BF</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Linear Feet per Piece</span>
            <span className={styles.resultValue}>{results.linearFeetPerPiece} LF</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Square Feet per Piece</span>
            <span className={styles.resultValue}>{results.squareFeetPerPiece} sq ft</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Total ({results.quantity} boards)</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Board Feet</span>
            <span className={styles.resultValuePrimary}>{results.totalBoardFeet} BF</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Linear Feet</span>
            <span className={styles.resultValue}>{results.totalLinearFeet} LF</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Square Feet</span>
            <span className={styles.resultValue}>{results.totalSquareFeet} sq ft</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Price per Board Foot</span>
                  <span className={styles.resultValue}>${results.pricePerBoardFoot.toFixed(2)}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Total Cost</span>
                  <span className={styles.resultValuePrimary}>${results.totalCost}</span>
                </div>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Board Feet Formula:</strong> (Thickness × Width × Length) ÷ 12, where thickness and width are in inches, length is in feet.
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
