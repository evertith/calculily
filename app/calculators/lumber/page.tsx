'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import AdUnit from '@/components/AdUnit';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

type CalculatorType = 'boardFeet' | 'studs' | 'joists' | 'deck';

export default function LumberCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('boardFeet');

  // Board feet inputs
  const [thickness, setThickness] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');

  // Studs inputs
  const [wallLength, setWallLength] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('8');
  const [studSpacing, setStudSpacing] = useState<string>('16');

  // Joists inputs
  const [spanLength, setSpanLength] = useState<string>('');
  const [buildingWidth, setBuildingWidth] = useState<string>('');
  const [joistSpacing, setJoistSpacing] = useState<string>('16');

  // Deck inputs
  const [deckLength, setDeckLength] = useState<string>('');
  const [deckWidth, setDeckWidth] = useState<string>('');
  const [boardWidth, setBoardWidth] = useState<string>('5.5');
  const [deckBoardSpacing, setDeckBoardSpacing] = useState<string>('0.25');

  // Common
  const [pricePerBoardFoot, setPricePerBoardFoot] = useState<string>('2.50');

  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculateBoardFeet = (t: number, w: number, l: number, q: number) => {
    return ((t * w * l) / 12) * q;
  };

  const calculateStuds = (wallLen: number, spacing: number, height: number) => {
    const wallInches = wallLen * 12;
    const numStuds = Math.ceil(wallInches / spacing) + 1;
    const plates = wallLen * 2;

    return {
      studs: numStuds,
      plates: plates.toFixed(1),
      studLength: height
    };
  };

  const calculateJoists = (span: number, width: number, spacing: number) => {
    const widthInches = width * 12;
    const numJoists = Math.ceil(widthInches / spacing) + 1;

    return {
      quantity: numJoists,
      lengthEach: span
    };
  };

  const calculateDeckMaterials = (len: number, wid: number, bWidth: number, spacing: number) => {
    const effectiveBoardWidth = bWidth + spacing;
    const numBoards = Math.ceil((wid * 12) / effectiveBoardWidth);
    const linearFeetPerBoard = len;

    const joists = calculateJoists(len, wid, 16);
    const rimJoists = (len * 2) + (wid * 2);

    return {
      deckingBoards: numBoards,
      linearFeetDecking: (numBoards * linearFeetPerBoard).toFixed(1),
      joists: joists.quantity,
      joistLength: joists.lengthEach,
      rimJoist: rimJoists.toFixed(1)
    };
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    if (calculatorType === 'boardFeet') {
      if (!thickness || parseFloat(thickness) <= 0) newErrors.push('Please enter a valid thickness');
      if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid width');
      if (!length || parseFloat(length) <= 0) newErrors.push('Please enter a valid length');
      if (!quantity || parseFloat(quantity) <= 0) newErrors.push('Please enter a valid quantity');
    } else if (calculatorType === 'studs') {
      if (!wallLength || parseFloat(wallLength) <= 0) newErrors.push('Please enter a valid wall length');
      if (!wallHeight || parseFloat(wallHeight) <= 0) newErrors.push('Please enter a valid wall height');
      if (!studSpacing || parseFloat(studSpacing) <= 0) newErrors.push('Please enter a valid stud spacing');
    } else if (calculatorType === 'joists') {
      if (!spanLength || parseFloat(spanLength) <= 0) newErrors.push('Please enter a valid span length');
      if (!buildingWidth || parseFloat(buildingWidth) <= 0) newErrors.push('Please enter a valid building width');
      if (!joistSpacing || parseFloat(joistSpacing) <= 0) newErrors.push('Please enter a valid joist spacing');
    } else if (calculatorType === 'deck') {
      if (!deckLength || parseFloat(deckLength) <= 0) newErrors.push('Please enter a valid deck length');
      if (!deckWidth || parseFloat(deckWidth) <= 0) newErrors.push('Please enter a valid deck width');
      if (!boardWidth || parseFloat(boardWidth) <= 0) newErrors.push('Please enter a valid board width');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    let calculatedResults: any = {};

    if (calculatorType === 'boardFeet') {
      const bf = calculateBoardFeet(
        parseFloat(thickness),
        parseFloat(width),
        parseFloat(length),
        parseFloat(quantity)
      );
      const cost = bf * parseFloat(pricePerBoardFoot);

      calculatedResults = {
        type: 'boardFeet',
        boardFeet: bf.toFixed(2),
        quantity: parseInt(quantity),
        cost: cost.toFixed(2),
        dimensions: `${thickness}" × ${width}" × ${length}"`
      };
    } else if (calculatorType === 'studs') {
      const studs = calculateStuds(
        parseFloat(wallLength),
        parseFloat(studSpacing),
        parseFloat(wallHeight)
      );

      calculatedResults = {
        type: 'studs',
        studs: studs.studs,
        plates: studs.plates,
        studSize: `2x4x${studs.studLength}'`,
        plateSize: `2x4x${wallLength}'`,
        totalLinearFeet: (studs.studs * studs.studLength + parseFloat(studs.plates)).toFixed(1)
      };
    } else if (calculatorType === 'joists') {
      const joists = calculateJoists(
        parseFloat(spanLength),
        parseFloat(buildingWidth),
        parseFloat(joistSpacing)
      );

      calculatedResults = {
        type: 'joists',
        quantity: joists.quantity,
        lengthEach: joists.lengthEach,
        joistSize: '2x8',
        totalLinearFeet: (joists.quantity * joists.lengthEach).toFixed(1)
      };
    } else if (calculatorType === 'deck') {
      const deck = calculateDeckMaterials(
        parseFloat(deckLength),
        parseFloat(deckWidth),
        parseFloat(boardWidth),
        parseFloat(deckBoardSpacing)
      );

      calculatedResults = {
        type: 'deck',
        deckingBoards: deck.deckingBoards,
        linearFeetDecking: deck.linearFeetDecking,
        joists: deck.joists,
        joistLength: deck.joistLength,
        rimJoist: deck.rimJoist
      };
    }

    setResults(calculatedResults);

    trackCalculatorUsage('Lumber Calculator', {
      calculatorType,
      resultType: calculatedResults.type
    });
  };

  const faqItems = [
    {
      question: 'How do you calculate board feet?',
      answer: 'Board feet = (Thickness in inches × Width in inches × Length in inches) ÷ 12. For example, a 2×6×8 board = (2 × 6 × 96) ÷ 12 = 96 board feet. Multiply by quantity for multiple boards.'
    },
    {
      question: 'What is standard stud spacing?',
      answer: '16 inches on center (OC) is most common for residential framing. 24 inches OC can be used for non-load bearing walls or with engineered lumber. Always check local building codes.'
    },
    {
      question: 'How many joists do I need for a deck?',
      answer: 'Joists are typically spaced 16 inches on center. Divide your deck width (in inches) by 16, then add 1. For example, a 12-foot wide deck: (144 ÷ 16) + 1 = 10 joists.'
    },
    {
      question: 'What size lumber should I use for joists?',
      answer: 'Joist size depends on span and spacing. For 16" OC: 2×6 up to 9ft span, 2×8 up to 12ft, 2×10 up to 16ft, 2×12 up to 18ft. Always consult span tables and local codes.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Deck Calculator',
      link: '/calculators/deck',
      description: 'Complete deck material calculator'
    },
    {
      title: 'Fence Calculator',
      link: '/calculators/fence',
      description: 'Calculate fence materials needed'
    },
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for footings'
    }
  ];

  return (
    <CalculatorLayout
      title="Lumber Calculator"
      description="Calculate board feet, framing materials, and lumber quantities for your construction project"
    >
      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Calculator Type</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${calculatorType === 'boardFeet' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculatorType('boardFeet')}
            >
              Board Feet
            </button>
            <button
              className={`${styles.buttonOption} ${calculatorType === 'studs' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculatorType('studs')}
            >
              Studs
            </button>
            <button
              className={`${styles.buttonOption} ${calculatorType === 'joists' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculatorType('joists')}
            >
              Joists
            </button>
            <button
              className={`${styles.buttonOption} ${calculatorType === 'deck' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculatorType('deck')}
            >
              Deck
            </button>
          </div>
        </div>

        {calculatorType === 'boardFeet' && (
          <>
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
              <label className={styles.label}>Length (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 96"
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
                placeholder="e.g., 10"
                step="1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Price per Board Foot ($)</label>
              <input
                type="number"
                className={styles.input}
                value={pricePerBoardFoot}
                onChange={(e) => setPricePerBoardFoot(e.target.value)}
                placeholder="e.g., 2.50"
                step="0.10"
              />
            </div>
          </>
        )}

        {calculatorType === 'studs' && (
          <>
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
              <input
                type="number"
                className={styles.input}
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value)}
                placeholder="e.g., 8"
                step="0.5"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Stud Spacing (inches OC)</label>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.buttonOption} ${studSpacing === '16' ? styles.buttonOptionActive : ''}`}
                  onClick={() => setStudSpacing('16')}
                >
                  16" OC
                </button>
                <button
                  className={`${styles.buttonOption} ${studSpacing === '24' ? styles.buttonOptionActive : ''}`}
                  onClick={() => setStudSpacing('24')}
                >
                  24" OC
                </button>
              </div>
            </div>
          </>
        )}

        {calculatorType === 'joists' && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Span Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={spanLength}
                onChange={(e) => setSpanLength(e.target.value)}
                placeholder="e.g., 12"
                step="0.5"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Building Width (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={buildingWidth}
                onChange={(e) => setBuildingWidth(e.target.value)}
                placeholder="e.g., 24"
                step="0.5"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Joist Spacing (inches OC)</label>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.buttonOption} ${joistSpacing === '16' ? styles.buttonOptionActive : ''}`}
                  onClick={() => setJoistSpacing('16')}
                >
                  16" OC
                </button>
                <button
                  className={`${styles.buttonOption} ${joistSpacing === '24' ? styles.buttonOptionActive : ''}`}
                  onClick={() => setJoistSpacing('24')}
                >
                  24" OC
                </button>
              </div>
            </div>
          </>
        )}

        {calculatorType === 'deck' && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Deck Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={deckLength}
                onChange={(e) => setDeckLength(e.target.value)}
                placeholder="e.g., 16"
                step="0.5"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Deck Width (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={deckWidth}
                onChange={(e) => setDeckWidth(e.target.value)}
                placeholder="e.g., 12"
                step="0.5"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Decking Board Width (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={boardWidth}
                onChange={(e) => setBoardWidth(e.target.value)}
                placeholder="e.g., 5.5"
                step="0.5"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Board Spacing (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={deckBoardSpacing}
                onChange={(e) => setDeckBoardSpacing(e.target.value)}
                placeholder="e.g., 0.25"
                step="0.125"
              />
            </div>
          </>
        )}

        <button className={styles.button} onClick={handleCalculate}>
          Calculate
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

      {results && results.type === 'boardFeet' && (
        <div className={styles.results}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Results</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Dimensions</span>
            <span className={styles.resultValue}>{results.dimensions}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Quantity</span>
            <span className={styles.resultValue}>{results.quantity} boards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Board Feet</span>
            <span className={styles.resultValuePrimary}>{results.boardFeet} bf</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Estimated Cost</span>
            <span className={styles.resultValue}>${results.cost}</span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> Board foot is a unit of volume used for lumber. One board foot = 144 cubic inches (1" × 12" × 12").
            Prices vary by wood type, grade, and market conditions.
          </div>
        </div>
      )}

      {results && results.type === 'studs' && (
        <div className={styles.results}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Materials Needed</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Studs Needed</span>
            <span className={styles.resultValuePrimary}>{results.studs} studs</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stud Size</span>
            <span className={styles.resultValue}>{results.studSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Top & Bottom Plates</span>
            <span className={styles.resultValue}>{results.plates} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Plate Size</span>
            <span className={styles.resultValue}>{results.plateSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Linear Feet</span>
            <span className={styles.resultValue}>{results.totalLinearFeet} ft</span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This calculation includes studs on center plus end studs, and top and bottom plates.
            Add extra studs for corners, door/window headers, and cripples as needed. Consider ordering 5-10% extra for waste.
          </div>
        </div>
      )}

      {results && results.type === 'joists' && (
        <div className={styles.results}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Joist Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joists Needed</span>
            <span className={styles.resultValuePrimary}>{results.quantity} joists</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Length per Joist</span>
            <span className={styles.resultValue}>{results.lengthEach} feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Size</span>
            <span className={styles.resultValue}>{results.joistSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Linear Feet</span>
            <span className={styles.resultValue}>{results.totalLinearFeet} ft</span>
          </div>

          <div className={styles.warning}>
            <strong>Important:</strong> The recommended joist size is approximate. Always consult span tables and local building codes
            to determine the proper joist size based on your specific span, spacing, load requirements, and wood species.
          </div>
        </div>
      )}

      {results && results.type === 'deck' && (
        <div className={styles.results}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Deck Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Decking Boards</span>
            <span className={styles.resultValuePrimary}>{results.deckingBoards} boards</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Linear Feet of Decking</span>
            <span className={styles.resultValue}>{results.linearFeetDecking} ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joists Needed</span>
            <span className={styles.resultValue}>{results.joists} joists</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joist Length</span>
            <span className={styles.resultValue}>{results.joistLength} feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rim Joist</span>
            <span className={styles.resultValue}>{results.rimJoist} linear feet</span>
          </div>

          <div className={styles.note}>
            <strong>Additional Materials Needed:</strong> Ledger board, posts and footings, beams, joist hangers, deck screws,
            and flashing. Consider railing materials if adding railings. Add 10% waste factor for decking boards.
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('lumber', 3)}
        calculatorName="Lumber Calculator"
      />

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
