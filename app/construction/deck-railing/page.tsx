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

export default function DeckRailingCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [totalLength, setTotalLength] = useState('');
  const [railingHeight, setRailingHeight] = useState('36');
  const [balusterStyle, setBalusterStyle] = useState('wood');
  const [postSpacing, setPostSpacing] = useState('6');
  const [stairs, setStairs] = useState('0');
  const [result, setResult] = useState<{
    posts: number;
    postCaps: number;
    topRailFeet: number;
    bottomRailFeet: number;
    balusters: number;
    balusterLength: number;
    screws: number;
    brackets: number;
    stairRailFeet: number;
    stairBalusters: number;
    materialCost: number;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const length = parseFloat(totalLength);
    const height = parseFloat(railingHeight);
    const spacing = parseFloat(postSpacing);
    const stairLength = parseFloat(stairs);

    if (isNaN(length) || length <= 0) {
      setError('Please enter a valid railing length');
      setResult(null);
      return;
    }

    // Post calculations - posts at each end plus intermediate posts
    const posts = Math.ceil(length / spacing) + 1;
    const postCaps = posts;

    // Rail calculations (top and bottom rails)
    const topRailFeet = length * 1.1; // 10% waste
    const bottomRailFeet = length * 1.1;

    // Baluster calculations
    // Code requires max 4" spacing between balusters
    // With 1.5" balusters: spacing = 3.5" center to center = 3.43 per foot
    // With 0.75" aluminum: spacing = 3.75" center to center = 3.2 per foot
    let balustersPerFoot: number;
    let balusterWidth: number;

    switch (balusterStyle) {
      case 'wood':
        balustersPerFoot = 3.43; // 1.5" square balusters
        balusterWidth = 1.5;
        break;
      case 'aluminum':
        balustersPerFoot = 3.2; // 0.75" round
        balusterWidth = 0.75;
        break;
      case 'composite':
        balustersPerFoot = 3.43; // Similar to wood
        balusterWidth = 1.5;
        break;
      case 'cable':
        balustersPerFoot = 0.33; // Cables every 3" (4 cables per foot)
        balusterWidth = 0.125;
        break;
      case 'glass':
        balustersPerFoot = 0.25; // Glass panels ~4' wide
        balusterWidth = 48;
        break;
      default:
        balustersPerFoot = 3.43;
        balusterWidth = 1.5;
    }

    const balusters = Math.ceil(length * balustersPerFoot * 1.05); // 5% waste

    // Baluster length (height minus top and bottom rails, typically 2-3")
    const balusterLength = height - 4;

    // Hardware
    const screws = posts * 8 + balusters * 2 + Math.ceil(length) * 4; // Rough estimate
    const brackets = posts * 2; // Post brackets top and bottom

    // Stair calculations if applicable
    let stairRailFeet = 0;
    let stairBalusters = 0;
    if (stairLength > 0) {
      // Stair rail length is longer due to angle (roughly 1.4x run)
      stairRailFeet = stairLength * 1.4 * 1.1; // Including waste
      stairBalusters = Math.ceil(stairLength * 1.4 * balustersPerFoot);
    }

    // Cost estimates (rough material costs)
    const woodPostCost = 15; // 4x4 post
    const compositePostCost = 45;
    const woodBalusterCost = 2;
    const aluminumBalusterCost = 4;
    const compositeBalusterCost = 5;
    const railCost = 3; // Per linear foot

    let materialCost = 0;
    if (balusterStyle === 'wood') {
      materialCost = posts * woodPostCost + balusters * woodBalusterCost + (topRailFeet + bottomRailFeet) * railCost;
    } else if (balusterStyle === 'aluminum') {
      materialCost = posts * woodPostCost + balusters * aluminumBalusterCost + (topRailFeet + bottomRailFeet) * railCost;
    } else if (balusterStyle === 'composite') {
      materialCost = posts * compositePostCost + balusters * compositeBalusterCost + (topRailFeet + bottomRailFeet) * 6;
    } else if (balusterStyle === 'cable') {
      materialCost = posts * woodPostCost + length * 15 + posts * 25; // Cable + fittings
    } else if (balusterStyle === 'glass') {
      materialCost = posts * woodPostCost + length * 45; // Glass panels expensive
    }

    const recommendations: string[] = [];

    // Height requirements
    if (height < 36) {
      recommendations.push('⚠ Minimum railing height is 36" for residential decks');
    } else if (height >= 42) {
      recommendations.push('✓ Height meets commercial code requirements (42")');
    } else {
      recommendations.push('✓ Height meets residential code (36" minimum)');
    }

    // Post spacing
    if (spacing > 6) {
      recommendations.push('⚠ Post spacing over 6\' may cause rail flex');
    } else {
      recommendations.push('✓ Post spacing adequate for structural support');
    }

    // Style-specific recommendations
    if (balusterStyle === 'cable') {
      recommendations.push('⚠ Cable railings may not be code-approved in all areas');
      recommendations.push('✓ Cable requires tensioning hardware at each post');
    }
    if (balusterStyle === 'glass') {
      recommendations.push('✓ Use tempered glass panels only');
      recommendations.push('⚠ Check local codes for glass railing approval');
    }

    recommendations.push('✓ Balusters must be spaced max 4" apart');
    recommendations.push('✓ Graspable handrail required on stairs');

    setResult({
      posts,
      postCaps,
      topRailFeet,
      bottomRailFeet,
      balusters,
      balusterLength,
      screws,
      brackets,
      stairRailFeet,
      stairBalusters,
      materialCost,
      recommendations
    });
    setError('');
    trackCalculatorUsage('deck-railing');
  };

  const faqItems = [
    {
      question: 'How high does a deck railing need to be?',
      answer: 'The IRC requires minimum 36-inch railing height for residential decks. If the deck is more than 30 inches above grade, a railing is mandatory. Commercial and multi-family buildings require 42-inch minimum height. Some localities have stricter requirements, so check local codes.'
    },
    {
      question: 'What is the maximum baluster spacing allowed by code?',
      answer: 'Balusters must be spaced so a 4-inch sphere cannot pass through. With standard 1.5-inch square balusters, this means approximately 3.5-inch gaps, requiring about 3.4 balusters per linear foot. This spacing prevents children from getting stuck between balusters.'
    },
    {
      question: 'How far apart should deck railing posts be?',
      answer: 'Most building codes allow post spacing up to 6 feet for residential railings, though 4-foot spacing provides more rigidity. Posts must be securely attached to the deck frame, not just the decking. For cable or glass railings, manufacturer specifications often require closer post spacing.'
    },
    {
      question: 'Do I need a railing on deck stairs?',
      answer: 'If your deck stairs have more than 2 risers (steps), you need a handrail. If the stairs are open on both sides and more than 30 inches above grade, you need full railings on both sides. A graspable handrail (1.25" to 2" diameter) is required for the full length of the stairs.'
    },
    {
      question: 'What materials are best for deck railings?',
      answer: 'Wood (cedar, redwood, pressure-treated) is economical but requires regular maintenance. Composite railings resist rot and insects but cost 2-3x more. Aluminum is durable and low-maintenance. Cable and glass provide modern looks and better views but may have code restrictions and higher costs.'
    }
  ];

  const relatedCalculators = [
    { title: 'Deck Footings Calculator', link: '/construction/deck-footings', description: 'Calculate deck post footings' },
    { title: 'Deck Joists Calculator', link: '/construction/deck-joists', description: 'Calculate deck joist materials' },
    { title: 'Stair Stringer Calculator', link: '/construction/stair-stringer', description: 'Calculate stair stringer dimensions' }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate deck railing materials with these steps:",
      steps: [
        "Enter the total linear feet of railing needed (all sides requiring railings)",
        "Select your railing height (36 inches residential minimum, 42 inches commercial)",
        "Choose your baluster/infill style (wood, aluminum, composite, cable, or glass)",
        "Specify post spacing (6 feet standard for wood, 4 feet for cable/glass)",
        "Add any stair run length if applicable"
      ]
    },
    whyMatters: {
      description: "Deck railings are a critical safety feature required by code for any deck surface more than 30 inches above grade. Improperly spaced balusters can trap children, while inadequate post anchoring can cause catastrophic failures.",
      benefits: [
        "Calculate exact post and baluster quantities",
        "Ensure code-compliant spacing (4 inch max between balusters)",
        "Account for stair rail length (angled = longer)",
        "Estimate material costs for different styles"
      ]
    },
    examples: [
      {
        title: "12x16 Deck - Wood Railing",
        scenario: "Railing on 3 sides, 36 inch height, 6 foot post spacing",
        calculation: "44 feet total length, 9 posts, 44 × 3.43 balusters",
        result: "9 posts, 48 ft rails (each), 151 balusters"
      },
      {
        title: "Cable Railing with Stairs",
        scenario: "40 feet perimeter + 8 foot stair run",
        calculation: "40 + (8 × 1.4) = 51.2 feet total length",
        result: "Posts at 4 foot centers, 4 horizontal cable rows"
      }
    ],
    commonMistakes: [
      "Attaching posts only to decking instead of bolting to joists",
      "Spacing balusters more than 4 inches apart (code violation)",
      "Using under-height railings (36 inches minimum)",
      "Forgetting stair rails are angled and need more length",
      "Overlooking graspable handrail requirement for stairs"
    ]
  };

  return (
    <CalculatorLayout
      title="Deck Railing Calculator"
      description="Calculate deck railing materials including posts, balusters, rails, and hardware for wood, composite, aluminum, cable, or glass railings."
    >
      <CalculatorSchema
        name="Deck Railing Calculator"
        description="Calculate deck railing material quantities for posts, balusters, rails, and hardware based on length and style"
        url="/construction/deck-railing"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="totalLength">Total Railing Length (feet)</label>
          <input
            type="number"
            id="totalLength"
            value={totalLength}
            onChange={(e) => setTotalLength(e.target.value)}
            placeholder="e.g., 44"
            min="1"
            step="0.5"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="railingHeight">Railing Height (inches)</label>
          <select
            id="railingHeight"
            value={railingHeight}
            onChange={(e) => setRailingHeight(e.target.value)}
          >
            <option value="36">36" (Residential Minimum)</option>
            <option value="38">38"</option>
            <option value="40">40"</option>
            <option value="42">42" (Commercial Minimum)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="balusterStyle">Baluster/Infill Style</label>
          <select
            id="balusterStyle"
            value={balusterStyle}
            onChange={(e) => setBalusterStyle(e.target.value)}
          >
            <option value="wood">Wood Balusters (1.5" square)</option>
            <option value="aluminum">Aluminum Balusters (round)</option>
            <option value="composite">Composite Balusters</option>
            <option value="cable">Horizontal Cable</option>
            <option value="glass">Glass Panels</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="postSpacing">Post Spacing (feet)</label>
          <select
            id="postSpacing"
            value={postSpacing}
            onChange={(e) => setPostSpacing(e.target.value)}
          >
            <option value="4">4 feet (Most Rigid)</option>
            <option value="5">5 feet</option>
            <option value="6">6 feet (Standard)</option>
            <option value="8">8 feet (Max for Cable/Glass)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="stairs">Stair Run Length (feet, 0 if none)</label>
          <input
            type="number"
            id="stairs"
            value={stairs}
            onChange={(e) => setStairs(e.target.value)}
            placeholder="e.g., 8"
            min="0"
            step="0.5"
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Railing Materials
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Railing Materials List</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Posts (4×4):</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff' }}>{result.posts}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Post Caps:</span>
                <span className={styles.resultValue}>{result.postCaps}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Top Rail:</span>
                <span className={styles.resultValue}>{result.topRailFeet.toFixed(1)} ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Bottom Rail:</span>
                <span className={styles.resultValue}>{result.bottomRailFeet.toFixed(1)} ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Balusters:</span>
                <span className={styles.resultValue}>{result.balusters}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Baluster Length:</span>
                <span className={styles.resultValue}>{result.balusterLength}"</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Post Brackets:</span>
                <span className={styles.resultValue}>{result.brackets}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Screws (approx):</span>
                <span className={styles.resultValue}>{result.screws}</span>
              </div>
              {result.stairRailFeet > 0 && (
                <>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Stair Rail:</span>
                    <span className={styles.resultValue}>{result.stairRailFeet.toFixed(1)} ft</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Stair Balusters:</span>
                    <span className={styles.resultValue}>{result.stairBalusters}</span>
                  </div>
                </>
              )}
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Material Cost:</span>
                <span className={styles.resultValue}>${result.materialCost.toFixed(0)}</span>
              </div>
            </div>

            <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Code Requirements</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.9rem' }}>
              {result.recommendations.map((rec, index) => (
                <li key={index} style={{
                  padding: '0.25rem 0',
                  color: rec.startsWith('✓') ? '#4CAF50' : '#FFC107'
                }}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <CalculatorContent {...contentData} />

      <FAQ items={faqItems} />

      <RelatedCalculators calculators={relatedCalculators} />

      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
