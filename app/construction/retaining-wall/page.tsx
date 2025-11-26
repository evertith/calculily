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

export default function RetainingWallCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [wallLength, setWallLength] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('');
  const [blockType, setBlockType] = useState<string>('standard');
  const [blockLength, setBlockLength] = useState<string>('12');
  const [blockHeight, setBlockHeight] = useState<string>('4');
  const [blockDepth, setBlockDepth] = useState<string>('8');
  const [includeCapBlocks, setIncludeCapBlocks] = useState<boolean>(true);
  const [includeDrainage, setIncludeDrainage] = useState<boolean>(true);
  const [blockPrice, setBlockPrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const blockPresets: Record<string, { length: string; height: string; depth: string; sqFtPer: number }> = {
    standard: { length: '12', height: '4', depth: '8', sqFtPer: 0.33 },
    large: { length: '18', height: '6', depth: '12', sqFtPer: 0.75 },
    small: { length: '8', height: '4', depth: '6', sqFtPer: 0.22 },
    splitface: { length: '16', height: '8', depth: '12', sqFtPer: 0.89 }
  };

  const handleBlockTypeChange = (type: string) => {
    setBlockType(type);
    if (blockPresets[type]) {
      setBlockLength(blockPresets[type].length);
      setBlockHeight(blockPresets[type].height);
      setBlockDepth(blockPresets[type].depth);
    }
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);
    const blkLength = parseFloat(blockLength);
    const blkHeight = parseFloat(blockHeight);
    const blkDepth = parseFloat(blockDepth);

    if (isNaN(length) || length <= 0) newErrors.push('Please enter a valid wall length');
    if (isNaN(height) || height <= 0) newErrors.push('Please enter a valid wall height');
    if (isNaN(blkLength) || blkLength <= 0) newErrors.push('Please enter a valid block length');
    if (isNaN(blkHeight) || blkHeight <= 0) newErrors.push('Please enter a valid block height');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // Wall face area in square feet
    const wallAreaSqFt = length * height;

    // Block face area in square feet
    const blockFaceSqFt = (blkLength * blkHeight) / 144;

    // Number of courses (rows)
    const courses = Math.ceil((height * 12) / blkHeight);

    // Blocks per course
    const blocksPerCourse = Math.ceil((length * 12) / blkLength);

    // Total wall blocks (add 5% for waste and cuts)
    const wallBlocks = Math.ceil(courses * blocksPerCourse * 1.05);

    // Cap blocks (same length, typically only 1 course)
    const capBlocks = includeCapBlocks ? blocksPerCourse : 0;

    // Total blocks
    const totalBlocks = wallBlocks + capBlocks;

    // Base material (gravel) - typically 6 inches deep, 12 inches wide
    const baseLengthFt = length;
    const baseWidthFt = 1; // 12 inches
    const baseDepthFt = 0.5; // 6 inches
    const baseCubicFt = baseLengthFt * baseWidthFt * baseDepthFt;
    const baseCubicYards = baseCubicFt / 27;
    const baseTons = baseCubicYards * 1.4; // Gravel ~1.4 tons per cubic yard

    // Drainage gravel (behind wall) - typically 12 inches wide, full height
    let drainageCubicYards = 0;
    let drainageTons = 0;
    let drainPipeLength = 0;
    let fabricSqFt = 0;

    if (includeDrainage) {
      const drainageWidthFt = 1; // 12 inches behind wall
      const drainageCubicFt = length * height * drainageWidthFt;
      drainageCubicYards = drainageCubicFt / 27;
      drainageTons = drainageCubicYards * 1.4;

      // Drainage pipe (perforated)
      drainPipeLength = Math.ceil(length * 1.1); // Add 10% for connections

      // Filter fabric
      fabricSqFt = Math.ceil(length * (height + 2) * 1.5); // Extra for wrapping
    }

    // Geogrid for walls over 3 feet
    const needsGeogrid = height > 3;
    const geogridLayers = needsGeogrid ? Math.floor(height / 2) : 0;
    const geogridLength = needsGeogrid ? length * geogridLayers : 0;

    // Cost calculations
    const price = parseFloat(blockPrice) || 0;
    const blockCost = price > 0 ? totalBlocks * price : null;
    const baseCost = baseTons * 45; // ~$45 per ton for gravel
    const drainageCost = drainageTons * 45;
    const pipeCost = drainPipeLength * 1.50; // ~$1.50 per linear foot
    const fabricCost = fabricSqFt * 0.20; // ~$0.20 per sq ft
    const totalCost = blockCost ? blockCost + baseCost + drainageCost + pipeCost + fabricCost : null;

    setResults({
      wallAreaSqFt: wallAreaSqFt.toFixed(1),
      courses,
      blocksPerCourse,
      wallBlocks,
      capBlocks,
      totalBlocks,
      blockSize: `${blkLength}" x ${blkHeight}" x ${blkDepth}"`,
      baseCubicYards: baseCubicYards.toFixed(2),
      baseTons: baseTons.toFixed(2),
      drainageCubicYards: drainageCubicYards.toFixed(2),
      drainageTons: drainageTons.toFixed(2),
      drainPipeLength,
      fabricSqFt,
      needsGeogrid,
      geogridLength: geogridLength.toFixed(0),
      blockCost: blockCost ? blockCost.toFixed(2) : null,
      baseCost: baseCost.toFixed(2),
      drainageCost: drainageCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Retaining Wall Calculator', {
      wallLength: length.toString(),
      wallHeight: height.toString(),
      totalBlocks: totalBlocks.toString()
    });
  };

  const faqItems = [
    {
      question: 'How many retaining wall blocks do I need?',
      answer: 'Calculate wall face area (length x height), then divide by the face area of your chosen block. Standard 12x4 inch blocks cover about 0.33 sq ft each. Add 5-10% for cuts and waste, plus cap blocks for the top course.'
    },
    {
      question: 'How high can a retaining wall be without engineering?',
      answer: 'Most jurisdictions allow DIY retaining walls up to 4 feet without permits or engineering. Walls over 4 feet typically require engineered plans, permits, and professional installation. Always check local building codes.'
    },
    {
      question: 'Do retaining walls need drainage?',
      answer: 'Yes! Drainage is critical for retaining wall longevity. Water buildup behind the wall creates hydrostatic pressure that can cause failure. Install drainage gravel and perforated pipe behind the wall, with filter fabric to prevent soil migration.'
    },
    {
      question: 'What is geogrid and when do I need it?',
      answer: 'Geogrid is a reinforcement fabric that extends into the soil behind the wall, providing additional stability. Most segmental retaining wall systems require geogrid for walls over 3-4 feet tall, installed every 2-3 courses.'
    },
    {
      question: 'How much does a retaining wall cost per linear foot?',
      answer: 'DIY retaining walls cost $10-25 per square foot of face area for materials. Professional installation typically runs $25-50 per square foot. Taller walls and difficult site conditions increase costs significantly.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Gravel Calculator',
      link: '/construction/gravel',
      description: 'Calculate gravel for base and drainage'
    },
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for footings'
    },
    {
      title: 'Brick Calculator',
      link: '/construction/brick',
      description: 'Calculate bricks for walls and patios'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Building a retaining wall requires careful material estimation. Beyond the blocks themselves, you need base material, drainage components, and potentially reinforcement for taller walls.",
      steps: [
        "Measure the total length of your planned retaining wall in feet.",
        "Determine the exposed height of the wall (not including the buried first course).",
        "Select your block type or enter custom block dimensions.",
        "Indicate whether you want cap blocks for a finished top edge.",
        "Enable drainage calculation for proper water management (highly recommended)."
      ]
    },
    whyMatters: {
      description: "Retaining walls hold back soil and prevent erosion, but they must be properly designed and built to handle the lateral pressure from the retained earth. Inadequate drainage or undersized walls can fail dramatically, causing property damage and safety hazards. Proper material estimation ensures your wall has all necessary components for long-term stability.",
      benefits: [
        "Calculate exact block quantities including waste",
        "Determine base gravel requirements",
        "Include drainage materials for proper water management",
        "Identify when geogrid reinforcement is needed",
        "Estimate total project costs accurately"
      ]
    },
    examples: [
      {
        title: "Garden Terrace Wall",
        scenario: "A 20-foot long, 2-foot high decorative wall using standard 12x4 blocks.",
        calculation: "40 sq ft face area / 0.33 sq ft per block = 121 blocks + caps",
        result: "130 wall blocks, 20 cap blocks, 0.4 tons base gravel."
      },
      {
        title: "Driveway Retaining Wall",
        scenario: "A 40-foot long, 4-foot high wall requiring full drainage system.",
        calculation: "160 sq ft face / 0.33 = 485 blocks + drainage + geogrid",
        result: "510 blocks, 40 caps, 2.2 tons drainage gravel, 44 ft drain pipe."
      },
      {
        title: "Hillside Terrace System",
        scenario: "Three terraced walls: 30 ft at 3 ft, 25 ft at 2 ft, 20 ft at 2 ft.",
        calculation: "Combined face area: 90 + 50 + 40 = 180 sq ft",
        result: "Approximately 600 blocks total across all three walls."
      }
    ],
    commonMistakes: [
      "Skipping the gravel base - the foundation is critical for wall stability and drainage.",
      "Forgetting drainage - water pressure is the number one cause of retaining wall failure.",
      "Building too high without engineering - walls over 4 feet need professional design.",
      "Not accounting for setback - most blocks require 1/4 to 1 inch setback per course.",
      "Underestimating materials - always add 5-10% for cuts, waste, and hidden conditions."
    ]
  };

  return (
    <CalculatorLayout
      title="Retaining Wall Calculator"
      description="Calculate retaining wall blocks, base material, drainage gravel, and accessories. Includes cap blocks and geogrid requirements."
    >
      <CalculatorSchema
        name="Retaining Wall Calculator"
        description="Free retaining wall calculator to estimate blocks, base gravel, drainage materials, and costs for segmental retaining walls."
        url="/construction/retaining-wall"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Wall Length (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={wallLength}
              onChange={(e) => setWallLength(e.target.value)}
              placeholder="e.g., 25"
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
              placeholder="e.g., 3"
              step="0.5"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Exposed height (first course is typically buried)
            </small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Block Type</label>
          <select
            className={styles.select}
            value={blockType}
            onChange={(e) => handleBlockTypeChange(e.target.value)}
          >
            <option value="standard">Standard (12 x 4 x 8 inches)</option>
            <option value="large">Large (18 x 6 x 12 inches)</option>
            <option value="small">Small (8 x 4 x 6 inches)</option>
            <option value="splitface">Split Face (16 x 8 x 12 inches)</option>
            <option value="custom">Custom Dimensions</option>
          </select>
        </div>

        {blockType === 'custom' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Block Length (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={blockLength}
                onChange={(e) => setBlockLength(e.target.value)}
                placeholder="e.g., 12"
                step="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Block Height (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={blockHeight}
                onChange={(e) => setBlockHeight(e.target.value)}
                placeholder="e.g., 4"
                step="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Block Depth (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={blockDepth}
                onChange={(e) => setBlockDepth(e.target.value)}
                placeholder="e.g., 8"
                step="1"
              />
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeCapBlocks}
              onChange={(e) => setIncludeCapBlocks(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Cap Blocks (finished top course)
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeDrainage}
              onChange={(e) => setIncludeDrainage(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Drainage System (highly recommended)
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Block Price Each (optional)</label>
          <input
            type="number"
            className={styles.input}
            value={blockPrice}
            onChange={(e) => setBlockPrice(e.target.value)}
            placeholder="e.g., 3.50"
            step="0.01"
          />
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Materials
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Retaining Wall Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Wall Face Area</span>
            <span className={styles.resultValue}>{results.wallAreaSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Block Size</span>
            <span className={styles.resultValue}>{results.blockSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Number of Courses</span>
            <span className={styles.resultValue}>{results.courses} rows</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Blocks per Course</span>
            <span className={styles.resultValue}>{results.blocksPerCourse} blocks</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Block Requirements</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Wall Blocks (with 5% waste)</span>
            <span className={styles.resultValuePrimary}>{results.wallBlocks} blocks</span>
          </div>

          {results.capBlocks > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Cap Blocks</span>
              <span className={styles.resultValue}>{results.capBlocks} blocks</span>
            </div>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Blocks</span>
            <span className={styles.resultValuePrimary}>{results.totalBlocks} blocks</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Base & Drainage</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Base Gravel (6 inch depth)</span>
            <span className={styles.resultValue}>{results.baseTons} tons ({results.baseCubicYards} cu yd)</span>
          </div>

          {includeDrainage && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Drainage Gravel</span>
                <span className={styles.resultValue}>{results.drainageTons} tons ({results.drainageCubicYards} cu yd)</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Perforated Drain Pipe</span>
                <span className={styles.resultValue}>{results.drainPipeLength} linear feet</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Filter Fabric</span>
                <span className={styles.resultValue}>{results.fabricSqFt} sq ft</span>
              </div>
            </>
          )}

          {results.needsGeogrid && (
            <div className={styles.resultItem} style={{ backgroundColor: '#2a2a0a', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem' }}>
              <span className={styles.resultLabel}>Geogrid Required</span>
              <span className={styles.resultValue}>{results.geogridLength} linear feet</span>
            </div>
          )}

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Blocks</span>
                <span className={styles.resultValue}>${results.blockCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Base Gravel (~$45/ton)</span>
                <span className={styles.resultValue}>${results.baseCost}</span>
              </div>

              {includeDrainage && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Drainage Materials</span>
                  <span className={styles.resultValue}>${results.drainageCost}</span>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Estimated Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          {results.needsGeogrid && (
            <div className={styles.warning}>
              <strong>Important:</strong> Walls over 3-4 feet require geogrid reinforcement and may need engineering approval. Check local building codes before proceeding.
            </div>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Bury the first course below grade. Compact the base thoroughly before laying blocks. Backfill with drainage gravel as you build, not all at once.
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
