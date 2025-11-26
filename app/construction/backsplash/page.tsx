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

export default function BacksplashCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [totalLength, setTotalLength] = useState('');
  const [backsplashHeight, setBacksplashHeight] = useState('18');
  const [windowWidth, setWindowWidth] = useState('0');
  const [windowHeight, setWindowHeight] = useState('0');
  const [hasRangeHood, setHasRangeHood] = useState(false);
  const [tileSize, setTileSize] = useState('3x6');
  const [result, setResult] = useState<{
    grossSquareFeet: number;
    netSquareFeet: number;
    tilesNeeded: number;
    tilesPerBox: number;
    boxesNeeded: number;
    thinsetBags: number;
    groutBags: number;
    estimatedCost: number;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const length = parseFloat(totalLength);
    const height = parseFloat(backsplashHeight);
    const winW = parseFloat(windowWidth) || 0;
    const winH = parseFloat(windowHeight) || 0;

    if (isNaN(length) || length <= 0) {
      setError('Please enter a valid backsplash length');
      setResult(null);
      return;
    }

    // Calculate gross area
    const grossSquareFeet = (length * height) / 144; // Convert sq inches to sq feet

    // Subtract window area
    const windowArea = (winW * winH) / 144;

    // Range hood area (typically 30" wide × 12" high where tile stops)
    const rangeHoodArea = hasRangeHood ? (30 * 12) / 144 : 0;

    const netSquareFeet = grossSquareFeet - windowArea - rangeHoodArea;

    // Parse tile size and get tiles per square foot
    let tileArea: number; // in square feet
    let tilesPerBox: number;

    switch (tileSize) {
      case '2x2': tileArea = 0.0278; tilesPerBox = 100; break;
      case '3x6': tileArea = 0.125; tilesPerBox = 80; break; // Subway
      case '4x4': tileArea = 0.111; tilesPerBox = 80; break;
      case '4x12': tileArea = 0.333; tilesPerBox = 40; break;
      case '6x6': tileArea = 0.25; tilesPerBox = 44; break;
      case '3x12': tileArea = 0.25; tilesPerBox = 40; break;
      case 'arabesque': tileArea = 0.08; tilesPerBox = 100; break;
      case 'hexagon': tileArea = 0.0867; tilesPerBox = 100; break; // 2" hex
      case 'penny': tileArea = 0.00545; tilesPerBox = 200; break; // Sheets
      default: tileArea = 0.125; tilesPerBox = 80;
    }

    // Calculate tiles needed with 15% waste (backsplashes have many cuts around outlets, corners)
    const tilesNeeded = Math.ceil((netSquareFeet / tileArea) * 1.15);
    const boxesNeeded = Math.ceil(tilesNeeded / tilesPerBox);

    // Thinset (50lb bag covers ~75-100 sq ft for wall tile)
    const thinsetBags = Math.ceil(netSquareFeet / 80);

    // Grout (sanded grout 25lb bag covers ~100 sq ft for standard tile)
    const groutBags = Math.max(1, Math.ceil(netSquareFeet / 100));

    // Cost estimate
    // Average backsplash tile: $10-25/sq ft, thinset: $15, grout: $15
    const tileCostPerSqFt = tileSize === 'arabesque' || tileSize === 'penny' ? 20 : 12;
    const tileCost = netSquareFeet * tileCostPerSqFt * 1.15; // Include waste
    const materialsCost = thinsetBags * 15 + groutBags * 15;
    const estimatedCost = tileCost + materialsCost;

    const recommendations: string[] = [];

    // Height recommendations
    if (height === 18) {
      recommendations.push('✓ Standard 18" height covers counter to upper cabinets');
    } else if (height === 4) {
      recommendations.push('✓ 4" splash guard is minimum code requirement');
    } else if (height > 24) {
      recommendations.push('✓ Full height backsplash creates dramatic effect');
    }

    // Tile-specific recommendations
    if (tileSize === '3x6') {
      recommendations.push('✓ Classic subway tile - timeless choice');
      recommendations.push('✓ Common patterns: running bond, herringbone, straight stack');
    }

    if (tileSize === 'penny' || tileSize === 'hexagon') {
      recommendations.push('✓ Small tiles come in mesh-backed sheets for easier install');
    }

    // General tips
    recommendations.push('✓ Seal natural stone and unglazed tile before grouting');
    recommendations.push('✓ Plan outlet cutouts - switch to horizontal orientation if needed');
    recommendations.push('✓ Use unsanded grout for joints 1/8" or smaller');
    recommendations.push('✓ Caulk (don\'t grout) where backsplash meets counter');

    setResult({
      grossSquareFeet,
      netSquareFeet,
      tilesNeeded,
      tilesPerBox,
      boxesNeeded,
      thinsetBags,
      groutBags,
      estimatedCost,
      recommendations
    });
    setError('');
    trackCalculatorUsage('backsplash');
  };

  const faqItems = [
    {
      question: 'What is the standard backsplash height?',
      answer: 'The most common backsplash height is 18 inches, which fills the space between standard 36-inch counters and 54-inch upper cabinets. A 4-inch splash guard is the minimum. Full-height backsplashes (to the ceiling or undersides of cabinets) are increasingly popular for a dramatic, easy-to-clean look.'
    },
    {
      question: 'How much extra tile should I order for a backsplash?',
      answer: 'Order 10-15% extra tile for backsplashes. The many cuts around outlets, corners, windows, and edges create significant waste. Complex patterns like herringbone can waste up to 20%. Keep extra tiles for future repairs since matching discontinued tile is difficult.'
    },
    {
      question: 'What is the best tile size for kitchen backsplash?',
      answer: 'Subway tiles (3"×6") remain the most popular choice due to their classic look, affordability, and DIY-friendliness. Larger tiles (4"×12" or 6"×12") mean fewer grout lines and faster installation. Small mosaic tiles create visual interest but have more grout to maintain.'
    },
    {
      question: 'Do I need to remove old backsplash before tiling?',
      answer: 'It depends on the old surface. Old tile should be removed for best results, though you can tile over existing tile if it is firmly adhered and level. Painted drywall works fine with proper prep (sand, clean, prime). The surface must be flat, clean, and securely attached to the wall.'
    },
    {
      question: 'Should I use mastic or thinset for backsplash?',
      answer: 'For most ceramic and porcelain backsplash tiles, premixed mastic (tile adhesive) is easiest - it is ready to use and grabs quickly. Use thinset mortar for natural stone, glass tiles, or areas that may get wet (behind stove, near sink). Thinset is stronger and required for glass tiles.'
    }
  ];

  const relatedCalculators = [
    { title: 'Shower Tile Calculator', link: '/construction/shower-tile', description: 'Calculate shower wall and floor tile' },
    { title: 'Tile Calculator', link: '/construction/tile', description: 'Calculate floor and wall tile materials' },
    { title: 'Drywall Mud Calculator', link: '/construction/drywall-mud', description: 'Calculate joint compound for drywall' }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate your kitchen backsplash tile needs accurately with these steps:",
      steps: [
        "Measure the total linear inches of your backsplash area (all sections that will be tiled)",
        "Select the height - standard is 18 inches from counter to upper cabinets",
        "Enter window dimensions if applicable to subtract from tile area",
        "Check the range hood box if you have one to subtract that area",
        "Choose your tile size to calculate tiles and boxes needed"
      ]
    },
    whyMatters: {
      description: "Backsplash calculations need precision because the small area magnifies waste from cuts around outlets, corners, and edges. Running short mid-project risks getting a different dye lot of tile. Since backsplash tile is highly visible, any color variation is noticeable.",
      benefits: [
        "Calculate exact tile quantities with proper waste factor",
        "Know how many boxes to order from the same lot",
        "Plan outlet cutouts and corner treatments",
        "Budget accurately with cost estimates"
      ]
    },
    examples: [
      {
        title: "L-Shaped Kitchen Backsplash",
        scenario: "120 inches total length, 18 inch height, no window",
        calculation: "120 × 18 = 2160 sq in = 15 sq ft, using 3×6 subway tile: 15 ÷ 0.125 = 120 tiles",
        result: "138 tiles (with 15% waste) = 2 boxes of 80"
      },
      {
        title: "Backsplash with Window",
        scenario: "96 inch backsplash with 24×24 inch window, 18 inch height",
        calculation: "Gross: 12 sq ft - Window: 4 sq ft = 8 sq ft net area",
        result: "28 tiles of 4×12 (with 15% waste)"
      }
    ],
    commonMistakes: [
      "Not planning outlet placement before starting layout",
      "Forgetting to tile the sides of window openings",
      "Starting tile layout from a corner instead of centering",
      "Using grout instead of caulk where backsplash meets counter",
      "Forgetting to turn off power when cutting around outlets"
    ]
  };

  return (
    <CalculatorLayout
      title="Backsplash Calculator"
      description="Calculate kitchen backsplash tile quantities including subway, mosaic, and specialty tiles. Includes thinset, grout, and material estimates."
    >
      <CalculatorSchema
        name="Backsplash Calculator"
        description="Calculate backsplash tile quantities, boxes needed, and setting materials for kitchen backsplash projects"
        url="/construction/backsplash"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="totalLength">Total Backsplash Length (inches)</label>
          <input
            type="number"
            id="totalLength"
            value={totalLength}
            onChange={(e) => setTotalLength(e.target.value)}
            placeholder="e.g., 120"
            min="12"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="backsplashHeight">Backsplash Height (inches)</label>
          <select
            id="backsplashHeight"
            value={backsplashHeight}
            onChange={(e) => setBacksplashHeight(e.target.value)}
          >
            <option value="4">4" (Splash Guard)</option>
            <option value="6">6" (Short)</option>
            <option value="12">12" (Half Height)</option>
            <option value="18">18" (Standard)</option>
            <option value="24">24" (Extended)</option>
            <option value="30">30" (To Cabinet Bottom)</option>
            <option value="36">36" (Full Wall)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="tileSize">Tile Size/Style</label>
          <select
            id="tileSize"
            value={tileSize}
            onChange={(e) => setTileSize(e.target.value)}
          >
            <option value="3x6">3" × 6" (Classic Subway)</option>
            <option value="4x12">4" × 12" (Long Subway)</option>
            <option value="3x12">3" × 12" (Slim Subway)</option>
            <option value="4x4">4" × 4" (Square)</option>
            <option value="6x6">6" × 6" (Large Square)</option>
            <option value="2x2">2" × 2" (Small Mosaic)</option>
            <option value="hexagon">2" Hexagon</option>
            <option value="penny">Penny Round</option>
            <option value="arabesque">Arabesque/Lantern</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="windowWidth">Window Width (inches, 0 if none)</label>
          <input
            type="number"
            id="windowWidth"
            value={windowWidth}
            onChange={(e) => setWindowWidth(e.target.value)}
            placeholder="e.g., 24"
            min="0"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="windowHeight">Window Height (inches, 0 if none)</label>
          <input
            type="number"
            id="windowHeight"
            value={windowHeight}
            onChange={(e) => setWindowHeight(e.target.value)}
            placeholder="e.g., 24"
            min="0"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={hasRangeHood}
              onChange={(e) => setHasRangeHood(e.target.checked)}
            />
            Has range hood (subtract ~2.5 sq ft)
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Tile Needed
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Backsplash Materials</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Gross Area:</span>
                <span className={styles.resultValue}>{result.grossSquareFeet.toFixed(1)} sq ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Net Tile Area:</span>
                <span className={styles.resultValue}>{result.netSquareFeet.toFixed(1)} sq ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Tiles Needed (with waste):</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff', fontSize: '1.25rem' }}>{result.tilesNeeded}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Tiles Per Box:</span>
                <span className={styles.resultValue}>{result.tilesPerBox}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Boxes to Order:</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff' }}>{result.boxesNeeded}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Thinset/Mastic:</span>
                <span className={styles.resultValue}>{result.thinsetBags} container(s)</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Grout:</span>
                <span className={styles.resultValue}>{result.groutBags} bag(s)</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Cost:</span>
                <span className={styles.resultValue}>${result.estimatedCost.toFixed(0)}</span>
              </div>
            </div>

            <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Tips & Recommendations</h4>
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
