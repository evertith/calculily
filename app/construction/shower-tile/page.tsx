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

export default function ShowerTileCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [showerWidth, setShowerWidth] = useState('');
  const [showerDepth, setShowerDepth] = useState('');
  const [wallHeight, setWallHeight] = useState('84');
  const [hasNiche, setHasNiche] = useState(false);
  const [hasBench, setHasBench] = useState(false);
  const [tileSize, setTileSize] = useState('12x24');
  const [floorTileSize, setFloorTileSize] = useState('2x2');
  const [result, setResult] = useState<{
    wallSquareFeet: number;
    floorSquareFeet: number;
    wallTilesNeeded: number;
    floorTilesNeeded: number;
    nicheArea: number;
    benchArea: number;
    thinsetBags: number;
    groutBags: number;
    waterproofGallons: number;
    estimatedCost: number;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const width = parseFloat(showerWidth);
    const depth = parseFloat(showerDepth);
    const height = parseFloat(wallHeight);

    if (isNaN(width) || width <= 0 || isNaN(depth) || depth <= 0) {
      setError('Please enter valid shower dimensions');
      setResult(null);
      return;
    }

    // Calculate wall area (3 walls typically - back and two sides)
    // Subtract for door/opening on one side
    const backWall = width * (height / 12);
    const sideWalls = 2 * depth * (height / 12);
    let wallSquareFeet = backWall + sideWalls;

    // Niche area (standard 12"x24" niche has ~4 sq ft of tile inside)
    let nicheArea = 0;
    if (hasNiche) {
      nicheArea = 4; // Interior of niche
      wallSquareFeet += nicheArea;
    }

    // Bench area (typically 16" deep x width, plus front face)
    let benchArea = 0;
    if (hasBench) {
      benchArea = (width * 16 / 144) + (width * 18 / 144); // Top and front
      wallSquareFeet += benchArea;
    }

    // Floor area
    const floorSquareFeet = width * depth / 144;

    // Parse wall tile size
    let wallTileArea: number;
    switch (tileSize) {
      case '3x6': wallTileArea = 0.125; break; // Subway
      case '4x12': wallTileArea = 0.333; break;
      case '6x6': wallTileArea = 0.25; break;
      case '12x12': wallTileArea = 1; break;
      case '12x24': wallTileArea = 2; break;
      case '24x24': wallTileArea = 4; break;
      default: wallTileArea = 2;
    }

    // Parse floor tile size (usually smaller for slope/drainage)
    let floorTileArea: number;
    switch (floorTileSize) {
      case '1x1': floorTileArea = 0.00694; break; // Penny tile
      case '2x2': floorTileArea = 0.0278; break;
      case '4x4': floorTileArea = 0.111; break;
      case '6x6': floorTileArea = 0.25; break;
      case 'hex1': floorTileArea = 0.00866; break; // 1" hex
      case 'hex2': floorTileArea = 0.0346; break; // 2" hex
      default: floorTileArea = 0.0278;
    }

    // Calculate tiles needed with 15% waste for walls, 20% for floor (more cuts)
    const wallTilesNeeded = Math.ceil((wallSquareFeet / wallTileArea) * 1.15);
    const floorTilesNeeded = Math.ceil((floorSquareFeet / floorTileArea) * 1.20);

    // Thinset mortar (50lb bag covers ~50 sq ft for walls, ~40 for floor)
    const thinsetBags = Math.ceil(wallSquareFeet / 50 + floorSquareFeet / 40);

    // Grout (25lb bag covers ~75-100 sq ft depending on tile size)
    const groutCoverage = wallTileArea > 1 ? 100 : wallTileArea > 0.25 ? 75 : 50;
    const groutBags = Math.ceil((wallSquareFeet + floorSquareFeet) / groutCoverage);

    // Waterproofing membrane (1 gallon covers ~50 sq ft for 2 coats)
    const waterproofGallons = Math.ceil((wallSquareFeet + floorSquareFeet) / 50);

    // Cost estimate
    // Average tile: $5-15/sq ft, thinset: $15/bag, grout: $15/bag, waterproof: $50/gal
    const tileCost = (wallSquareFeet + floorSquareFeet) * 8;
    const materialsCost = thinsetBags * 15 + groutBags * 15 + waterproofGallons * 50;
    const estimatedCost = tileCost + materialsCost;

    const recommendations: string[] = [];

    // Floor tile recommendations
    if (floorTileArea > 0.111) {
      recommendations.push('⚠ Large floor tiles (>4") difficult to slope to drain');
    } else {
      recommendations.push('✓ Small floor tiles allow proper slope to drain');
    }

    // Niche recommendations
    if (hasNiche) {
      recommendations.push('✓ Plan niche to align with tile courses');
      recommendations.push('✓ Slope niche bottom slightly outward for drainage');
    }

    // General recommendations
    recommendations.push('✓ Apply waterproofing membrane on all surfaces');
    recommendations.push('✓ Use unsanded grout for joints under 1/8"');
    recommendations.push('✓ Seal grout after curing (except epoxy grout)');
    recommendations.push('✓ Start wall tile layout from center for symmetry');

    if (wallSquareFeet > 50) {
      recommendations.push('✓ Consider large format tiles to reduce grout lines');
    }

    setResult({
      wallSquareFeet,
      floorSquareFeet,
      wallTilesNeeded,
      floorTilesNeeded,
      nicheArea,
      benchArea,
      thinsetBags,
      groutBags,
      waterproofGallons,
      estimatedCost,
      recommendations
    });
    setError('');
    trackCalculatorUsage('shower-tile');
  };

  const faqItems = [
    {
      question: 'What size tile is best for shower floors?',
      answer: 'Shower floors need small tiles (2"×2" or smaller, or mosaic/penny tile) because the floor must slope toward the drain. Small tiles conform to the slope better than large tiles, which would require thick mortar beds or special techniques. Many codes require tile small enough to maintain proper drainage slope.'
    },
    {
      question: 'How much tile overage should I order?',
      answer: 'Order 10-15% extra for walls and 15-20% extra for floors and complex areas. Cuts, corners, niches, and the sloped floor waste more tile. Also keep some extra tiles for future repairs - matching tile years later can be difficult if the style is discontinued.'
    },
    {
      question: 'Do I need to waterproof under shower tile?',
      answer: 'Yes, waterproofing is essential and often required by code. Tile and grout are NOT waterproof. Use a liquid membrane (like RedGard), sheet membrane (like Kerdi), or foam board system. Cover all walls, floor, curb, and especially corners and seams. Two coats minimum for liquid membrane.'
    },
    {
      question: 'What is the best tile pattern for shower walls?',
      answer: 'Running bond (brick pattern) with a 1/3 offset is most common and forgiving. Straight stack (grid) shows any wall imperfections. Herringbone looks great but creates more cuts and waste. Large format tiles (12"×24" or bigger) give a modern look with less grout to maintain.'
    },
    {
      question: 'How do I tile a shower niche without leaks?',
      answer: 'A niche is a common leak point. The niche must be fully waterproofed including all corners with membrane corners/tape. Slope the bottom shelf slightly outward (toward shower) so water drains out. Use a pre-formed niche or build carefully with proper waterproofing. Apply silicone caulk at tile corners inside the niche.'
    }
  ];

  const relatedCalculators = [
    { title: 'Backsplash Calculator', link: '/construction/backsplash', description: 'Calculate kitchen backsplash tile' },
    { title: 'Tile Calculator', link: '/construction/tile', description: 'Calculate floor and wall tile materials' },
    { title: 'Drywall Mud Calculator', link: '/construction/drywall-mud', description: 'Calculate joint compound for drywall' }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate shower tile materials accurately with these steps:",
      steps: [
        "Enter your shower interior dimensions in inches - width and depth",
        "Select the wall height (typically 84 inches to ceiling)",
        "Check if you have a niche or bench to include those areas",
        "Select wall tile size and floor tile size (use small tiles for floor drainage slope)",
        "Review calculated tile counts, setting materials, and waterproofing needs"
      ]
    },
    whyMatters: {
      description: "Shower tiling requires precise material calculations because showers have unique requirements: walls, floor, possible niches and benches, all needing waterproofing. Underestimating means project delays waiting for more tile which might be a different dye lot.",
      benefits: [
        "Calculate exact tile quantities with waste for cuts",
        "Determine waterproofing membrane coverage",
        "Know thinset and grout quantities needed",
        "Include niche and bench tile requirements"
      ]
    },
    examples: [
      {
        title: "Standard 36×36 Shower with Niche",
        scenario: "36 inch by 36 inch shower, 84 inches high, with standard niche",
        calculation: "Back wall: 21 sq ft + Side walls: 42 sq ft + Niche: 4 sq ft = 67 sq ft",
        result: "77 sq ft wall tile (with 15% waste), 11 sq ft floor tile (with 20% waste)"
      },
      {
        title: "Large Shower with Bench",
        scenario: "48×60 inch shower with corner bench",
        calculation: "Walls: 98 sq ft + Bench: 7 sq ft = 105 sq ft total",
        result: "3 bags thinset, 2 bags grout, 3 gallons waterproofing"
      }
    ],
    commonMistakes: [
      "Skipping waterproofing membrane (leads to mold and structural damage)",
      "Using large tiles on the floor (cannot slope properly to drain)",
      "Not ordering enough tile from the same dye lot",
      "Forgetting to tile inside the curb",
      "Using sanded grout in small joints (scratches tile)"
    ]
  };

  return (
    <CalculatorLayout
      title="Shower Tile Calculator"
      description="Calculate shower wall and floor tile quantities, plus thinset, grout, and waterproofing materials. Includes niche and bench calculations."
    >
      <CalculatorSchema
        name="Shower Tile Calculator"
        description="Calculate tile quantities for shower walls and floors including waterproofing, thinset, and grout requirements"
        url="/construction/shower-tile"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="showerWidth">Shower Width (inches)</label>
          <input
            type="number"
            id="showerWidth"
            value={showerWidth}
            onChange={(e) => setShowerWidth(e.target.value)}
            placeholder="e.g., 36"
            min="24"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="showerDepth">Shower Depth (inches)</label>
          <input
            type="number"
            id="showerDepth"
            value={showerDepth}
            onChange={(e) => setShowerDepth(e.target.value)}
            placeholder="e.g., 36"
            min="24"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="wallHeight">Wall Height (inches)</label>
          <select
            id="wallHeight"
            value={wallHeight}
            onChange={(e) => setWallHeight(e.target.value)}
          >
            <option value="72">72" (6 feet)</option>
            <option value="84">84" (7 feet - Standard)</option>
            <option value="96">96" (8 feet - Full Height)</option>
            <option value="108">108" (9 feet)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="tileSize">Wall Tile Size</label>
          <select
            id="tileSize"
            value={tileSize}
            onChange={(e) => setTileSize(e.target.value)}
          >
            <option value="3x6">3" × 6" (Subway)</option>
            <option value="4x12">4" × 12" (Long Subway)</option>
            <option value="6x6">6" × 6"</option>
            <option value="12x12">12" × 12"</option>
            <option value="12x24">12" × 24" (Standard Large)</option>
            <option value="24x24">24" × 24" (Extra Large)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="floorTileSize">Floor Tile Size</label>
          <select
            id="floorTileSize"
            value={floorTileSize}
            onChange={(e) => setFloorTileSize(e.target.value)}
          >
            <option value="1x1">1" × 1" (Penny/Mosaic)</option>
            <option value="hex1">1" Hexagon</option>
            <option value="2x2">2" × 2"</option>
            <option value="hex2">2" Hexagon</option>
            <option value="4x4">4" × 4"</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={hasNiche}
              onChange={(e) => setHasNiche(e.target.checked)}
            />
            Include shower niche (12" × 24" standard)
          </label>
        </div>

        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={hasBench}
              onChange={(e) => setHasBench(e.target.checked)}
            />
            Include corner bench
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Tile Needs
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Shower Tile Materials</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Wall Area:</span>
                <span className={styles.resultValue}>{result.wallSquareFeet.toFixed(1)} sq ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Floor Area:</span>
                <span className={styles.resultValue}>{result.floorSquareFeet.toFixed(1)} sq ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Wall Tiles (with waste):</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff', fontSize: '1.25rem' }}>{result.wallTilesNeeded}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Floor Tiles (with waste):</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff' }}>{result.floorTilesNeeded}</span>
              </div>
              {result.nicheArea > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Niche Area:</span>
                  <span className={styles.resultValue}>{result.nicheArea} sq ft</span>
                </div>
              )}
              {result.benchArea > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Bench Area:</span>
                  <span className={styles.resultValue}>{result.benchArea.toFixed(1)} sq ft</span>
                </div>
              )}
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Thinset (50lb bags):</span>
                <span className={styles.resultValue}>{result.thinsetBags} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Grout (25lb bags):</span>
                <span className={styles.resultValue}>{result.groutBags} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Waterproofing:</span>
                <span className={styles.resultValue}>{result.waterproofGallons} gallon(s)</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Est. Materials Cost:</span>
                <span className={styles.resultValue}>${result.estimatedCost.toFixed(0)}</span>
              </div>
            </div>

            <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Important Notes</h4>
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
