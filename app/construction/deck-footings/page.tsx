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

export default function DeckFootingsCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [deckLength, setDeckLength] = useState<string>('');
  const [deckWidth, setDeckWidth] = useState<string>('');
  const [beamSpacing, setBeamSpacing] = useState<string>('8');
  const [footingDiameter, setFootingDiameter] = useState<string>('12');
  const [footingDepth, setFootingDepth] = useState<string>('42');
  const [frostDepth, setFrostDepth] = useState<string>('36');
  const [soilType, setSoilType] = useState<string>('average');
  const [ledgerMounted, setLedgerMounted] = useState<boolean>(true);
  const [concretePrice, setConcretePrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const length = parseFloat(deckLength);
    const width = parseFloat(deckWidth);
    const spacing = parseFloat(beamSpacing);
    const diameter = parseFloat(footingDiameter);
    const depth = parseFloat(footingDepth);

    if (isNaN(length) || length <= 0) newErrors.push('Please enter a valid deck length');
    if (isNaN(width) || width <= 0) newErrors.push('Please enter a valid deck width');
    if (isNaN(spacing) || spacing <= 0) newErrors.push('Please enter a valid beam spacing');
    if (isNaN(diameter) || diameter <= 0) newErrors.push('Please enter a valid footing diameter');
    if (isNaN(depth) || depth <= 0) newErrors.push('Please enter a valid footing depth');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // Calculate number of beam rows
    // If ledger mounted, one side is against the house
    const numBeamRows = ledgerMounted
      ? Math.ceil(length / spacing) + 1
      : Math.ceil(length / spacing) + 2;

    // Calculate posts per beam row (typically every 6-8 feet along the beam)
    const postSpacing = 6; // feet between posts
    const postsPerRow = Math.ceil(width / postSpacing) + 1;

    // Total footings needed
    const totalFootings = numBeamRows * postsPerRow;

    // Concrete volume per footing (cylinder)
    const radiusFt = (diameter / 12) / 2;
    const depthFt = depth / 12;
    const volumePerFootingCuFt = Math.PI * radiusFt * radiusFt * depthFt;

    // Total concrete
    const totalConcreteCuFt = volumePerFootingCuFt * totalFootings;
    const totalConcreteCuYd = totalConcreteCuFt / 27;

    // 80lb bags of concrete (0.6 cu ft per bag)
    const bags80lb = Math.ceil(totalConcreteCuFt / 0.6);

    // 60lb bags (0.45 cu ft per bag)
    const bags60lb = Math.ceil(totalConcreteCuFt / 0.45);

    // Sono tubes needed
    const sonoTubesNeeded = totalFootings;

    // Post anchors (J-bolts or post bases)
    const postAnchors = totalFootings;

    // Soil load capacity adjustment
    const soilFactors: Record<string, number> = {
      poor: 0.8,
      average: 1.0,
      good: 1.2
    };
    const soilFactor = soilFactors[soilType] || 1.0;

    // Recommended minimum footing size based on load and soil
    const deckArea = length * width;
    const loadPerFooting = (deckArea * 50) / totalFootings; // 50 psf typical deck load
    const minFootingArea = loadPerFooting / (1500 * soilFactor); // 1500 psf base bearing
    const minFootingDiameter = Math.ceil(Math.sqrt(minFootingArea / Math.PI) * 2 * 12);

    // Cost calculations
    const price = parseFloat(concretePrice) || 0;
    const concreteCost = price > 0 ? bags80lb * price : null;
    const sonoTubeCost = sonoTubesNeeded * 15; // ~$15 per 12" tube
    const anchorCost = postAnchors * 12; // ~$12 per post base
    const totalCost = concreteCost ? concreteCost + sonoTubeCost + anchorCost : null;

    setResults({
      deckArea: (length * width).toFixed(0),
      numBeamRows,
      postsPerRow,
      totalFootings,
      footingDiameter: diameter,
      footingDepth: depth,
      volumePerFootingCuFt: volumePerFootingCuFt.toFixed(2),
      totalConcreteCuFt: totalConcreteCuFt.toFixed(2),
      totalConcreteCuYd: totalConcreteCuYd.toFixed(2),
      bags80lb,
      bags60lb,
      sonoTubesNeeded,
      postAnchors,
      minFootingDiameter,
      recommendedDiameter: Math.max(diameter, minFootingDiameter),
      concreteCost: concreteCost ? concreteCost.toFixed(2) : null,
      sonoTubeCost: sonoTubeCost.toFixed(2),
      anchorCost: anchorCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Deck Footings Calculator', {
      deckLength: length.toString(),
      deckWidth: width.toString(),
      totalFootings: totalFootings.toString()
    });
  };

  const faqItems = [
    {
      question: 'How deep should deck footings be?',
      answer: 'Deck footings must extend below the frost line to prevent heaving. Frost depth varies by location: 12 inches in the South, 36-48 inches in the Midwest and Northeast, and up to 72 inches in northern climates. Check your local building code for specific requirements.'
    },
    {
      question: 'What size footings do I need for a deck?',
      answer: 'Most residential decks use 12-inch diameter footings, which support about 4,000 lbs in average soil. Larger decks, hot tubs, or poor soil conditions may require 16-inch or larger footings. Your local building code specifies minimum requirements.'
    },
    {
      question: 'How many footings does a deck need?',
      answer: 'The number of footings depends on deck size, joist span, and beam span. Typically, you need footings every 6-8 feet along each beam, with beams spaced 6-8 feet apart. A 12x16 deck typically needs 6-9 footings.'
    },
    {
      question: 'Can I use concrete deck blocks instead of footings?',
      answer: 'Precast deck blocks (surface footings) work for freestanding, ground-level decks in areas without frost. For elevated decks, ledger-attached decks, or frost-prone areas, poured concrete footings extending below the frost line are required by code.'
    },
    {
      question: 'Should I use sono tubes for deck footings?',
      answer: 'Sono tubes (cardboard form tubes) are recommended for most deck footings. They provide a clean, consistent diameter and can be cut to exact length. Remove the above-grade portion after the concrete sets for a clean finish.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for various projects'
    },
    {
      title: 'Deck Joists Calculator',
      link: '/construction/deck-joists',
      description: 'Calculate joists and framing'
    },
    {
      title: 'Deck Boards Calculator',
      link: '/construction/deck-boards',
      description: 'Calculate decking boards needed'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Proper footings are the foundation of a safe, long-lasting deck. This calculator helps you determine the number of footings needed and the concrete required for your project.",
      steps: [
        "Enter your deck dimensions in feet (length from house, width parallel to house).",
        "Specify beam spacing - typically 6-8 feet depending on joist size and span tables.",
        "Enter footing diameter (12 inch is standard residential, larger for heavy loads).",
        "Enter footing depth - must be below your local frost line.",
        "Indicate if the deck attaches to the house (ledger mounted) or is freestanding."
      ]
    },
    whyMatters: {
      description: "Deck footings transfer the entire weight of your deck - including furniture, people, and snow loads - to the ground. Undersized or improperly placed footings can lead to deck settling, structural failure, or frost heave damage. Most building codes have specific requirements for footing size, depth, and spacing.",
      benefits: [
        "Calculate the correct number of footings for your deck size",
        "Determine concrete quantities for budgeting",
        "Check if footing size is adequate for soil conditions",
        "Plan sono tube and anchor hardware needs",
        "Estimate complete footing material costs"
      ]
    },
    examples: [
      {
        title: "Standard 12x16 Deck",
        scenario: "A 12' x 16' deck attached to house with 8-foot beam spacing.",
        calculation: "3 beam rows x 3 posts each = 9 footings (12\" x 42\" deep)",
        result: "9 footings, 8 bags concrete (80 lb), 9 sono tubes, 9 post anchors."
      },
      {
        title: "Large Freestanding Deck",
        scenario: "A 16' x 20' freestanding deck with 6-foot beam spacing.",
        calculation: "5 beam rows x 4 posts each = 20 footings (12\" x 36\" deep)",
        result: "20 footings, 15 bags concrete, 20 sono tubes, 20 post anchors."
      },
      {
        title: "Deck with Hot Tub",
        scenario: "A 14' x 18' deck with hot tub area requiring larger footings.",
        calculation: "Additional footings under hot tub with 16\" diameter",
        result: "12 standard footings + 4 large footings, 20 bags total concrete."
      }
    ],
    commonMistakes: [
      "Not digging below the frost line - causes heaving and structural damage.",
      "Footings too small for the load - leads to settling and structural problems.",
      "Incorrect spacing - too few footings overloads each one, too many wastes money.",
      "Not using sono tubes - makes it hard to get consistent diameter and clean edges.",
      "Forgetting post anchors - posts must be mechanically connected to concrete."
    ]
  };

  return (
    <CalculatorLayout
      title="Deck Footings Calculator"
      description="Calculate the number of footings, concrete, sono tubes, and post anchors needed for your deck. Includes frost depth and soil considerations."
    >
      <CalculatorSchema
        name="Deck Footings Calculator"
        description="Free deck footings calculator to estimate footings needed, concrete quantities, and hardware for deck construction."
        url="/construction/deck-footings"
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
              Distance from house outward
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
              Parallel to house
            </small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Beam Spacing (feet)</label>
          <select
            className={styles.select}
            value={beamSpacing}
            onChange={(e) => setBeamSpacing(e.target.value)}
          >
            <option value="6">6 feet (stronger, more footings)</option>
            <option value="8">8 feet (typical residential)</option>
            <option value="10">10 feet (requires larger beams)</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Footing Diameter (inches)</label>
            <select
              className={styles.select}
              value={footingDiameter}
              onChange={(e) => setFootingDiameter(e.target.value)}
            >
              <option value="8">8 inches (light loads only)</option>
              <option value="10">10 inches</option>
              <option value="12">12 inches (standard residential)</option>
              <option value="16">16 inches (heavy loads)</option>
              <option value="18">18 inches (hot tubs, multi-story)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Footing Depth (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={footingDepth}
              onChange={(e) => setFootingDepth(e.target.value)}
              placeholder="e.g., 42"
              step="6"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Local Frost Depth (inches)</label>
          <select
            className={styles.select}
            value={frostDepth}
            onChange={(e) => setFrostDepth(e.target.value)}
          >
            <option value="12">12 inches (Southern US)</option>
            <option value="24">24 inches (Mid-Atlantic)</option>
            <option value="36">36 inches (Midwest)</option>
            <option value="42">42 inches (Northern states)</option>
            <option value="48">48 inches (Upper Midwest)</option>
            <option value="60">60+ inches (Alaska, northern Canada)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Soil Type</label>
          <select
            className={styles.select}
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
          >
            <option value="poor">Poor (soft clay, wet, sandy)</option>
            <option value="average">Average (mixed, firm clay)</option>
            <option value="good">Good (compacted gravel, rock)</option>
          </select>
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
          <label className={styles.label}>Price per 80 lb Concrete Bag (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={concretePrice}
            onChange={(e) => setConcretePrice(e.target.value)}
            placeholder="e.g., 6.50"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Footings
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Deck Footing Requirements</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Deck Area</span>
            <span className={styles.resultValue}>{results.deckArea} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Beam Rows</span>
            <span className={styles.resultValue}>{results.numBeamRows} rows</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Posts per Row</span>
            <span className={styles.resultValue}>{results.postsPerRow} posts</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Footings Needed</span>
            <span className={styles.resultValuePrimary}>{results.totalFootings} footings</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Footing Specifications</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Footing Size</span>
            <span className={styles.resultValue}>{results.footingDiameter}" diameter x {results.footingDepth}" deep</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Concrete per Footing</span>
            <span className={styles.resultValue}>{results.volumePerFootingCuFt} cu ft</span>
          </div>

          {results.minFootingDiameter > results.footingDiameter && (
            <div className={styles.warning}>
              <strong>Warning:</strong> Based on soil conditions, recommended minimum footing diameter is {results.recommendedDiameter} inches.
            </div>
          )}

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Materials Needed</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Concrete</span>
            <span className={styles.resultValue}>{results.totalConcreteCuFt} cu ft ({results.totalConcreteCuYd} cu yd)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>80 lb Bags</span>
            <span className={styles.resultValuePrimary}>{results.bags80lb} bags</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Or 60 lb Bags</span>
            <span className={styles.resultValue}>{results.bags60lb} bags</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Sono Tubes ({results.footingDiameter}" diameter)</span>
            <span className={styles.resultValue}>{results.sonoTubesNeeded} tubes</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Post Anchors/Bases</span>
            <span className={styles.resultValue}>{results.postAnchors} pieces</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Concrete</span>
                <span className={styles.resultValue}>${results.concreteCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Sono Tubes (~$15 each)</span>
                <span className={styles.resultValue}>${results.sonoTubeCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Post Anchors (~$12 each)</span>
                <span className={styles.resultValue}>${results.anchorCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Footing Materials</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Set J-bolts or post bases in wet concrete for proper anchor placement. Allow concrete to cure 48-72 hours before loading. Verify frost depth requirements with your local building department.
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
