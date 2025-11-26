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

export default function DeckJoistsCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [deckLength, setDeckLength] = useState<string>('');
  const [deckWidth, setDeckWidth] = useState<string>('');
  const [joistSize, setJoistSize] = useState<string>('2x8');
  const [joistSpacing, setJoistSpacing] = useState<string>('16');
  const [ledgerMounted, setLedgerMounted] = useState<boolean>(true);
  const [includeBlocking, setIncludeBlocking] = useState<boolean>(true);
  const [lumberPrice, setLumberPrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const joistSizes = ['2x6', '2x8', '2x10', '2x12'];
  const spacingOptions = ['12', '16', '24'];

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const length = parseFloat(deckLength);
    const width = parseFloat(deckWidth);
    const spacing = parseFloat(joistSpacing);

    if (isNaN(length) || length <= 0) newErrors.push('Please enter a valid deck length');
    if (isNaN(width) || width <= 0) newErrors.push('Please enter a valid deck width');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // Joists run perpendicular to the deck length (across the width)
    // Number of joists = (length / spacing) + 1
    const numJoists = Math.ceil((length * 12) / spacing) + 1;

    // Joist length = deck width
    const joistLength = width;

    // Total lineal feet of joists
    const totalJoistLF = numJoists * joistLength;

    // Rim/band joists (2 for freestanding, 1 for ledger-mounted)
    const rimJoists = ledgerMounted ? 1 : 2;
    const rimJoistLF = rimJoists * length;

    // End caps (perpendicular to rim, same as deck width)
    const endCaps = 2;
    const endCapLF = endCaps * width;

    // Blocking (mid-span support, one row every 8 feet typically)
    let blockingPieces = 0;
    let blockingLF = 0;
    if (includeBlocking) {
      const blockingRows = Math.floor(joistLength / 8);
      blockingPieces = blockingRows * (numJoists - 1);
      const blockingLength = (spacing - 1.5) / 12; // Actual space between joists minus joist thickness
      blockingLF = blockingPieces * blockingLength;
    }

    // Total lumber (round up to standard lengths)
    const totalLF = totalJoistLF + rimJoistLF + endCapLF + blockingLF;

    // Convert to board feet for pricing
    const joistDimension = joistSize.split('x');
    const thickness = parseFloat(joistDimension[0]);
    const widthInches = parseFloat(joistDimension[1]);
    const boardFeet = (thickness * widthInches * totalLF) / 12;

    // Joist hangers
    const joistHangers = numJoists;

    // Hurricane ties (optional but recommended)
    const hurricaneTies = numJoists;

    // Ledger lag bolts (approximately every 16 inches)
    const lagBolts = ledgerMounted ? Math.ceil((length * 12) / 16) * 2 : 0; // 2 rows of bolts

    // Flashing for ledger
    const flashingLF = ledgerMounted ? length : 0;

    // Nails/screws estimate (3 per joist hanger, 2 per blocking)
    const screwsNails = joistHangers * 10 + blockingPieces * 4;

    // Cost calculations
    const price = parseFloat(lumberPrice) || 0;
    const lumberCost = price > 0 ? totalLF * price : null;
    const hangerCost = joistHangers * 2.50; // ~$2.50 per hanger
    const hardwareCost = lagBolts * 1.50 + hurricaneTies * 1.75;
    const totalCost = lumberCost ? lumberCost + hangerCost + hardwareCost : null;

    setResults({
      deckArea: (length * width).toFixed(0),
      joistSize,
      joistSpacing: spacing,
      numJoists,
      joistLength: joistLength.toFixed(1),
      totalJoistLF: totalJoistLF.toFixed(1),
      rimJoists,
      rimJoistLF: rimJoistLF.toFixed(1),
      endCapLF: endCapLF.toFixed(1),
      blockingPieces,
      blockingLF: blockingLF.toFixed(1),
      totalLF: totalLF.toFixed(1),
      boardFeet: boardFeet.toFixed(1),
      joistHangers,
      hurricaneTies,
      lagBolts,
      flashingLF: flashingLF.toFixed(1),
      lumberCost: lumberCost ? lumberCost.toFixed(2) : null,
      hangerCost: hangerCost.toFixed(2),
      hardwareCost: hardwareCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Deck Joists Calculator', {
      deckLength: length.toString(),
      deckWidth: width.toString(),
      numJoists: numJoists.toString(),
      joistSize
    });
  };

  const faqItems = [
    {
      question: 'What size joists do I need for a deck?',
      answer: '2x8 joists can span up to 10 feet, 2x10 up to 13 feet, and 2x12 up to 16 feet (at 16 inch spacing with Southern Pine). Always check local codes and span tables for your specific lumber species and spacing requirements.'
    },
    {
      question: 'How far apart should deck joists be?',
      answer: 'Standard spacing is 16 inches on center for most decking materials. Use 12-inch spacing for diagonal decking patterns or composite decking that requires closer support. 24-inch spacing is only for light-duty applications with thick decking.'
    },
    {
      question: 'Do deck joists need hangers?',
      answer: 'Yes, joist hangers are required by code in most areas. They provide stronger connections than toe-nailing and help prevent joists from pulling away from the ledger or rim board. Use hangers rated for the joist size.'
    },
    {
      question: 'What is blocking and when do I need it?',
      answer: 'Blocking consists of short pieces of lumber installed between joists to prevent twisting and add rigidity. It is required at mid-span for joists over 8 feet long and often at the rim joist connection. It also provides support for decking seams.'
    },
    {
      question: 'Do I need a ledger board?',
      answer: 'A ledger board attached to the house provides strong support and keeps the deck level with the door threshold. Freestanding decks without ledgers require an additional beam and row of footings near the house.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Deck Footings Calculator',
      link: '/construction/deck-footings',
      description: 'Calculate footings and concrete'
    },
    {
      title: 'Deck Boards Calculator',
      link: '/construction/deck-boards',
      description: 'Calculate decking boards needed'
    },
    {
      title: 'Joist Span Calculator',
      link: '/construction/joist-span',
      description: 'Find maximum joist spans'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "The joist system is the structural backbone of your deck. Proper sizing and spacing ensures a solid, code-compliant platform. This calculator helps you determine all framing materials needed.",
      steps: [
        "Enter deck length (distance from house) and width (parallel to house).",
        "Select joist size based on your span requirements (check span tables).",
        "Choose joist spacing - 16 inches is standard for most applications.",
        "Indicate if the deck attaches to the house via a ledger board.",
        "Enable blocking calculation for spans over 8 feet."
      ]
    },
    whyMatters: {
      description: "Deck framing must support live loads (people, furniture) and dead loads (the deck itself) safely. Undersized joists or excessive spans can cause bouncy decks, sagging, or structural failure. Proper hardware connections are equally important - most deck collapses occur at the ledger connection.",
      benefits: [
        "Calculate exact joist quantities and lengths",
        "Include rim boards and end caps",
        "Account for blocking requirements",
        "Estimate joist hangers and hardware",
        "Plan ledger connection materials"
      ]
    },
    examples: [
      {
        title: "Standard 12x16 Deck",
        scenario: "A 12' x 16' deck with 2x8 joists at 16 inch spacing, ledger-mounted.",
        calculation: "10 joists @ 16' + rim + blocking = ~175 linear feet of 2x8",
        result: "10 joists, 1 rim board, blocking, 10 joist hangers."
      },
      {
        title: "Large Freestanding Deck",
        scenario: "A 16' x 24' freestanding deck with 2x10 joists at 16 inch spacing.",
        calculation: "19 joists @ 24' + 2 rim boards + end caps + blocking",
        result: "19 joists, 2 rim boards, 36+ blocking pieces, 19 hangers per side."
      },
      {
        title: "Composite Deck with Close Spacing",
        scenario: "A 14' x 18' deck with 12-inch joist spacing for composite decking.",
        calculation: "15 joists @ 18' + rim + blocking at closer spacing",
        result: "15 joists (more due to 12\" spacing), additional blocking rows."
      }
    ],
    commonMistakes: [
      "Using joists that are too small for the span - always consult span tables.",
      "Spacing joists too far apart - especially problematic with composite decking.",
      "Skipping joist hangers - toe-nailing alone is not code-compliant.",
      "Forgetting blocking - required for spans over 8 feet and adds rigidity.",
      "Improper ledger attachment - use lag bolts or through-bolts, never nails alone."
    ]
  };

  return (
    <CalculatorLayout
      title="Deck Joists Calculator"
      description="Calculate deck joists, rim boards, blocking, joist hangers, and hardware needed for deck framing."
    >
      <CalculatorSchema
        name="Deck Joists Calculator"
        description="Free deck joists calculator to estimate joists, rim boards, blocking, and hardware for deck construction."
        url="/construction/deck-joists"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Deck Length (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={deckLength}
              onChange={(e) => setDeckLength(e.target.value)}
              placeholder="e.g., 16"
              step="1"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Distance from house (joist direction)
            </small>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Deck Width (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={deckWidth}
              onChange={(e) => setDeckWidth(e.target.value)}
              placeholder="e.g., 12"
              step="1"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Parallel to house (joist length)
            </small>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Joist Size</label>
            <select
              className={styles.select}
              value={joistSize}
              onChange={(e) => setJoistSize(e.target.value)}
            >
              {joistSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Joist Spacing (inches on center)</label>
            <select
              className={styles.select}
              value={joistSpacing}
              onChange={(e) => setJoistSpacing(e.target.value)}
            >
              <option value="12">12 inches (composite/diagonal)</option>
              <option value="16">16 inches (standard)</option>
              <option value="24">24 inches (light duty)</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={ledgerMounted}
              onChange={(e) => setLedgerMounted(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Deck attaches to house (ledger board)
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeBlocking}
              onChange={(e) => setIncludeBlocking(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include mid-span blocking (recommended for spans over 8 feet)
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Lumber Price per Linear Foot (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={lumberPrice}
            onChange={(e) => setLumberPrice(e.target.value)}
            placeholder="e.g., 1.25"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Joists
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Deck Joist Framing</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Deck Area</span>
            <span className={styles.resultValue}>{results.deckArea} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joist Size</span>
            <span className={styles.resultValue}>{results.joistSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joist Spacing</span>
            <span className={styles.resultValue}>{results.joistSpacing} inches on center</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Lumber Required ({results.joistSize})</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joists ({results.joistLength} ft each)</span>
            <span className={styles.resultValuePrimary}>{results.numJoists} pieces</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joist Linear Feet</span>
            <span className={styles.resultValue}>{results.totalJoistLF} LF</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rim/Band Joists</span>
            <span className={styles.resultValue}>{results.rimJoists} pieces ({results.rimJoistLF} LF)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>End Caps</span>
            <span className={styles.resultValue}>2 pieces ({results.endCapLF} LF)</span>
          </div>

          {results.blockingPieces > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Blocking Pieces</span>
              <span className={styles.resultValue}>{results.blockingPieces} pieces ({results.blockingLF} LF)</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Lumber</span>
            <span className={styles.resultValuePrimary}>{results.totalLF} linear feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Board Feet</span>
            <span className={styles.resultValue}>{results.boardFeet} BF</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Hardware Required</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joist Hangers</span>
            <span className={styles.resultValue}>{results.joistHangers} hangers</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Hurricane Ties (recommended)</span>
            <span className={styles.resultValue}>{results.hurricaneTies} ties</span>
          </div>

          {results.lagBolts > 0 && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Ledger Lag Bolts</span>
                <span className={styles.resultValue}>{results.lagBolts} bolts</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Ledger Flashing</span>
                <span className={styles.resultValue}>{results.flashingLF} linear feet</span>
              </div>
            </>
          )}

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Lumber</span>
                <span className={styles.resultValue}>${results.lumberCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Joist Hangers (~$2.50 each)</span>
                <span className={styles.resultValue}>${results.hangerCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Other Hardware</span>
                <span className={styles.resultValue}>${results.hardwareCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Framing Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Crown all joists up (bow facing up). Use pressure-treated lumber rated for ground contact (UC4A) for rim joists. Install flashing behind the ledger board to prevent water damage.
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
