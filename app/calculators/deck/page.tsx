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
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

export default function DeckCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [boardWidth, setBoardWidth] = useState<string>('5.5');
  const [boardLength, setBoardLength] = useState<string>('12');
  const [joistSpacing, setJoistSpacing] = useState<string>('16');
  const [postSpacing, setPostSpacing] = useState<string>('6');
  const [includeRailing, setIncludeRailing] = useState<boolean>(true);
  const [includeStairs, setIncludeStairs] = useState<boolean>(false);
  const [result, setResult] = useState<{
    deckingBoards: number;
    deckingLinearFeet: number;
    joists: number;
    joistLength: number;
    ledgerBoard: number;
    rimJoist: number;
    posts: number;
    footings: number;
    railingPosts: number;
    railingLinearFeet: number;
    balusters: number;
    estimatedCost: number;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const faqItems = [
    {
      question: "What size joists do I need for my deck?",
      answer: "Joist size depends on span and spacing. For 16\" on-center: 2x6 joists span up to 9'9\", 2x8 up to 12'10\", 2x10 up to 16'5\". For 24\" on-center, reduce spans by about 20%. Always check local building codes. Southern pine and Douglas fir are stronger than SPF. Use joist hangers at all connections."
    },
    {
      question: "How deep should deck footings be?",
      answer: "Footings must extend below the frost line in your area. In cold climates, this can be 36-48 inches deep. In warm climates, 12 inches may suffice. Typical deck footings are 12 inches in diameter with a 4x4 post. Use concrete form tubes and always check local codes for your area's requirements."
    },
    {
      question: "What's the best decking material?",
      answer: "Pressure-treated pine is most economical ($2-3/sq ft). Cedar and redwood resist rot naturally ($4-6/sq ft) and look better but cost more. Composite decking ($5-10/sq ft) never needs staining and lasts longer, but initial cost is higher. PVC decking is most expensive but virtually maintenance-free."
    },
    {
      question: "Do I need a permit to build a deck?",
      answer: "Most jurisdictions require permits for decks over 30 inches high or attached to your home. Permits ensure your deck meets safety codes for footings, railings, and structural support. Check with your local building department. Failing to get required permits can cause issues when selling your home."
    }
  ];

  const relatedCalculators = [
    {
      title: "Concrete Calculator",
      link: "/calculators/concrete",
      description: "Calculate concrete for footings"
    },
    {
      title: "Lumber Calculator",
      link: "/calculators/lumber",
      description: "Calculate board feet and framing"
    },
    {
      title: "Fence Calculator",
      link: "/calculators/fence",
      description: "Estimate fence materials"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Plan your deck build with accurate material estimates for framing, decking, and hardware:",
      steps: [
        "Enter the deck dimensions (length and width in feet).",
        "Select the decking material (pressure-treated wood, cedar, or composite).",
        "Choose joist spacing (16\" for most applications, 12\" for diagonal decking or heavy loads).",
        "Click 'Calculate' to see complete material lists including decking, framing, posts, and hardware."
      ]
    },
    whyMatters: {
      description: "Deck projects involve many different materials - decking boards, joists, beams, posts, concrete for footings, and hundreds of fasteners. Missing any component can delay your project while you wait for materials. A comprehensive estimate helps you order everything at once, compare material costs between wood and composite options, and create an accurate budget before breaking ground.",
      benefits: [
        "Get complete material lists in one calculation",
        "Compare costs between different decking materials",
        "Plan concrete footings with proper spacing",
        "Estimate fastener quantities (often overlooked)",
        "Budget accurately before starting construction"
      ]
    },
    examples: [
      {
        title: "Standard Deck",
        scenario: "12' × 16' deck, 16\" joist spacing, pressure-treated lumber.",
        calculation: "192 sq ft decking + 11 joists (2×10×12') + 2 beams + 6 posts + 6 footings",
        result: "Approximately $2,500-3,500 in materials for pressure-treated, $4,000-6,000 for composite."
      },
      {
        title: "Small Entry Deck",
        scenario: "6' × 8' entry deck at back door, composite decking.",
        calculation: "48 sq ft | 5 joists + rim + 4 posts + 4 footings",
        result: "Compact project - materials around $800-1,200 for composite with hidden fasteners."
      },
      {
        title: "Large Entertainment Deck",
        scenario: "16' × 24' deck for outdoor living space, cedar decking.",
        calculation: "384 sq ft decking + 18 joists + beams + 9+ footings",
        result: "Significant project - budget $6,000-10,000+ for materials depending on cedar grade."
      }
    ],
    commonMistakes: [
      "Forgetting concrete for post footings - each footing needs 1-2 bags of concrete minimum.",
      "Underestimating fastener quantities - you need hundreds of screws for a typical deck.",
      "Not accounting for the 5-10% waste factor on decking boards.",
      "Using wrong joist spacing for the decking type - composite often requires 12\" spacing.",
      "Forgetting ledger board, flashing, and attachment hardware for house-attached decks."
    ]
  };

  const calculateDeck = () => {
    const len = parseFloat(length);
    const wid = parseFloat(width);
    const boardW = parseFloat(boardWidth);
    const boardL = parseFloat(boardLength);
    const spacing = parseFloat(joistSpacing);
    const postSpace = parseFloat(postSpacing);

    const newErrors: string[] = [];

    if (!length || len <= 0) {
      newErrors.push("Please enter a valid deck length");
    }
    if (!width || wid <= 0) {
      newErrors.push("Please enter a valid deck width");
    }
    if (len > 30 || wid > 30) {
      newErrors.push("For decks larger than 30 feet, consult a structural engineer");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    // Calculate decking boards
    const gap = 0.25; // 1/4 inch gap between boards
    const effectiveWidth = boardW + gap;
    const widthInches = wid * 12;
    const numBoardsWidth = Math.ceil(widthInches / effectiveWidth);
    const boardsPerRow = Math.ceil(len / boardL);
    const deckingBoards = numBoardsWidth * boardsPerRow;
    const deckingLinearFeet = numBoardsWidth * len;

    // Calculate joists
    const widthInchesForJoists = wid * 12;
    const joists = Math.ceil(widthInchesForJoists / spacing) + 1;
    const joistLength = len;

    // Calculate ledger board and rim joists
    const ledgerBoard = len; // Attached to house
    const rimJoist = (len * 2) + wid; // Three sides

    // Calculate posts and footings
    const posts = Math.ceil(len / postSpace) + 1;
    const footings = posts;

    // Calculate railing materials
    let railingPosts = 0;
    let railingLinearFeet = 0;
    let balusters = 0;

    if (includeRailing) {
      const perimeter = len + (wid * 2); // Three sides (not house side)
      railingPosts = Math.ceil(perimeter / 5); // Post every 5 feet
      railingLinearFeet = perimeter * 2; // Top and bottom rails
      balusters = Math.ceil((perimeter * 12) / 4); // Baluster every 4 inches
    }

    // Estimated cost (rough estimate)
    const deckingCost = (len * wid) * 3.50; // ~$3.50/sq ft for PT decking
    const joistCost = joists * (len * 1.20); // ~$1.20/linear ft for 2x8
    const framingCost = (ledgerBoard + rimJoist) * 1.20;
    const postsCost = posts * 25; // ~$25 per 6x6 post
    const footingsCost = footings * 15; // ~$15 per footing in concrete
    const railingCost = includeRailing ? railingLinearFeet * 8 : 0; // ~$8/linear ft
    const hardwareCost = 150; // Screws, hangers, bolts
    const estimatedCost = deckingCost + joistCost + framingCost + postsCost + footingsCost + railingCost + hardwareCost;

    setResult({
      deckingBoards,
      deckingLinearFeet,
      joists,
      joistLength,
      ledgerBoard,
      rimJoist,
      posts,
      footings,
      railingPosts,
      railingLinearFeet,
      balusters,
      estimatedCost
    });

    trackCalculatorUsage('Deck Calculator', {
      deckSize: (len * wid).toString(),
      deckingBoards: deckingBoards.toString(),
      includeRailing: includeRailing.toString()
    });
  };

  return (
    <CalculatorLayout
      title="Deck Calculator"
      description="Calculate deck materials including decking, framing, posts, and footings. Get complete material lists and cost estimates for your deck building project."
    >
      <CalculatorSchema
        name="Deck Calculator"
        description="Free deck calculator to estimate materials and costs. Calculate decking, joists, posts, footings, and fasteners for your deck building project."
        url="/calculators/deck"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateDeck(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="length" className={styles.label}>
            Deck Length (feet)
          </label>
          <input
            id="length"
            type="number"
            className={styles.input}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Enter deck length"
            step="0.5"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="width" className={styles.label}>
            Deck Width (feet)
          </label>
          <input
            id="width"
            type="number"
            className={styles.input}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Enter deck width"
            step="0.5"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="boardWidth" className={styles.label}>
            Decking Board Width (inches)
          </label>
          <select
            id="boardWidth"
            className={styles.select}
            value={boardWidth}
            onChange={(e) => setBoardWidth(e.target.value)}
          >
            <option value="3.5">2x4 (3.5")</option>
            <option value="5.5">2x6 (5.5")</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="boardLength" className={styles.label}>
            Decking Board Length (feet)
          </label>
          <select
            id="boardLength"
            className={styles.select}
            value={boardLength}
            onChange={(e) => setBoardLength(e.target.value)}
          >
            <option value="8">8 feet</option>
            <option value="10">10 feet</option>
            <option value="12">12 feet</option>
            <option value="16">16 feet</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="joistSpacing" className={styles.label}>
            Joist Spacing (inches on center)
          </label>
          <select
            id="joistSpacing"
            className={styles.select}
            value={joistSpacing}
            onChange={(e) => setJoistSpacing(e.target.value)}
          >
            <option value="12">12" OC</option>
            <option value="16">16" OC (standard)</option>
            <option value="24">24" OC</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="postSpacing" className={styles.label}>
            Post Spacing (feet)
          </label>
          <select
            id="postSpacing"
            className={styles.select}
            value={postSpacing}
            onChange={(e) => setPostSpacing(e.target.value)}
          >
            <option value="4">4 feet</option>
            <option value="6">6 feet (typical)</option>
            <option value="8">8 feet</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeRailing}
              onChange={(e) => setIncludeRailing(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Include Railing
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeStairs}
              onChange={(e) => setIncludeStairs(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Include Stairs
          </label>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Deck Materials
        </button>
      </form>

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((error, index) => (
            <div key={index} className={styles.error}>
              {error}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Deck Size</span>
            <span className={styles.resultValuePrimary}>{parseFloat(length) * parseFloat(width)} sq ft</span>
          </div>

          <div className={styles.note}>
            <strong>Decking Materials:</strong>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Decking Boards</span>
            <span className={styles.resultValue}>{result.deckingBoards} boards</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Linear Feet of Decking</span>
            <span className={styles.resultValue}>{result.deckingLinearFeet.toFixed(0)} ft</span>
          </div>

          <div className={styles.note}>
            <strong>Framing Materials:</strong>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joists (2x8 or 2x10)</span>
            <span className={styles.resultValue}>{result.joists} @ {result.joistLength}' each</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Ledger Board</span>
            <span className={styles.resultValue}>{result.ledgerBoard.toFixed(0)} ft</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rim Joist</span>
            <span className={styles.resultValue}>{result.rimJoist.toFixed(0)} ft</span>
          </div>

          <div className={styles.note}>
            <strong>Support Structure:</strong>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Posts (6x6)</span>
            <span className={styles.resultValue}>{result.posts}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Concrete Footings</span>
            <span className={styles.resultValue}>{result.footings}</span>
          </div>

          {includeRailing && (
            <>
              <div className={styles.note}>
                <strong>Railing Materials:</strong>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Railing Posts</span>
                <span className={styles.resultValue}>{result.railingPosts}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Rail Linear Feet</span>
                <span className={styles.resultValue}>{result.railingLinearFeet} ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Balusters</span>
                <span className={styles.resultValue}>{result.balusters}</span>
              </div>
            </>
          )}

          {includeStairs && (
            <div className={styles.note}>
              <strong>Stairs:</strong> Add materials for stringers, treads, and risers based on your specific height and design. Typically 3 stringers (2x12), treads (2x6), and matching railing.
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Estimated Total Cost</span>
            <span className={styles.resultValuePrimary}>${result.estimatedCost.toFixed(2)}</span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This estimate is for pressure-treated lumber. Cedar or composite decking will cost more. Prices vary by location and lumber market. Don't forget joist hangers, lag bolts, deck screws, and post anchors. Always check local building codes for requirements.
          </div>

          <div className={styles.warning}>
            <strong>Important:</strong> This calculator provides material estimates. Deck construction requires proper knowledge of building codes, structural engineering, and safety. Consider hiring a professional or consulting with your local building department, especially for elevated decks.
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('concrete', 3)}
        calculatorName="Deck Calculator"
      />

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      <CalculatorContent
        howToUse={contentData.howToUse}
        whyMatters={contentData.whyMatters}
        examples={contentData.examples}
        commonMistakes={contentData.commonMistakes}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
