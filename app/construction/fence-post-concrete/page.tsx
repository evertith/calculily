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

export default function FencePostConcreteCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [numberOfPosts, setNumberOfPosts] = useState('');
  const [postSize, setPostSize] = useState('4x4');
  const [holeDepth, setHoleDepth] = useState('24');
  const [holeDiameter, setHoleDiameter] = useState('10');
  const [fenceHeight, setFenceHeight] = useState('6');
  const [result, setResult] = useState<{
    cuFtPerHole: number;
    totalCuFt: number;
    bags50lb: number;
    bags60lb: number;
    bags80lb: number;
    quicksetBags: number;
    waterGallons: number;
    totalPostLength: number;
    estimatedCost: number;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const posts = parseInt(numberOfPosts);
    const depth = parseFloat(holeDepth);
    const diameter = parseFloat(holeDiameter);
    const fHeight = parseFloat(fenceHeight);

    if (isNaN(posts) || posts <= 0) {
      setError('Please enter a valid number of posts');
      setResult(null);
      return;
    }

    // Get post dimensions
    let postWidth: number;
    switch (postSize) {
      case '4x4': postWidth = 3.5; break; // Actual 3.5"
      case '6x6': postWidth = 5.5; break;
      case 'round4': postWidth = 4; break;
      case 'round6': postWidth = 6; break;
      default: postWidth = 3.5;
    }

    // Calculate hole volume minus post volume
    const holeRadius = diameter / 2 / 12; // Convert to feet
    const holeVolume = Math.PI * holeRadius * holeRadius * (depth / 12);

    // Post volume in hole
    const postRadius = postWidth / 2 / 12;
    const postVolume = postSize.includes('round')
      ? Math.PI * postRadius * postRadius * (depth / 12)
      : (postWidth / 12) * (postWidth / 12) * (depth / 12);

    // Concrete volume = hole - post
    const concretePerHole = holeVolume - postVolume;
    const totalConcrete = concretePerHole * posts;

    // Bag calculations
    // 50lb fast-setting = 0.375 cu ft
    // 60lb bag = 0.45 cu ft
    // 80lb bag = 0.60 cu ft
    const bags50lb = Math.ceil(totalConcrete / 0.375 * 1.1); // 10% waste
    const bags60lb = Math.ceil(totalConcrete / 0.45 * 1.1);
    const bags80lb = Math.ceil(totalConcrete / 0.60 * 1.1);
    const quicksetBags = Math.ceil(totalConcrete / 0.375 * 1.1);

    // Water needed (roughly 3 quarts per 50lb bag)
    const waterGallons = quicksetBags * 0.75; // 3 quarts = 0.75 gallons

    // Total post length needed
    const postAboveGround = fHeight;
    const totalPostLength = (postAboveGround + depth / 12) * posts;

    // Cost estimate
    const bagCost = 5.50; // Average per bag
    const estimatedCost = bags80lb * bagCost;

    const recommendations: string[] = [];

    // Depth recommendations
    const minDepth = fHeight * 12 / 3; // 1/3 of fence height minimum
    if (depth < minDepth) {
      recommendations.push(`⚠ Depth should be at least ${minDepth.toFixed(0)}" (1/3 of fence height)`);
    } else {
      recommendations.push('✓ Post depth adequate for fence height');
    }

    // Check frost line
    if (depth < 24) {
      recommendations.push('⚠ May be above frost line in cold climates');
    }

    // Hole diameter recommendations
    if (diameter < postWidth + 4) {
      recommendations.push(`⚠ Hole diameter should be at least ${postWidth + 4}" for proper concrete coverage`);
    } else {
      recommendations.push('✓ Hole diameter provides adequate concrete coverage');
    }

    // Method recommendations
    if (posts > 10) {
      recommendations.push('✓ Consider renting a power auger for many holes');
    }

    recommendations.push('✓ Crown concrete above grade to shed water');
    recommendations.push('✓ Allow 24-48 hours cure time before attaching fence');

    setResult({
      cuFtPerHole: concretePerHole,
      totalCuFt: totalConcrete,
      bags50lb,
      bags60lb,
      bags80lb,
      quicksetBags,
      waterGallons,
      totalPostLength,
      estimatedCost,
      recommendations
    });
    setError('');
    trackCalculatorUsage('fence-post-concrete');
  };

  const faqItems = [
    {
      question: 'How deep should fence post holes be?',
      answer: 'The general rule is 1/3 of the total post length should be in the ground. For a 6-foot fence with an 8-foot post, bury 24-30 inches. In cold climates, posts should extend below the frost line (24-48 inches depending on region) to prevent heaving.'
    },
    {
      question: 'How wide should fence post holes be?',
      answer: 'Post holes should be three times the width of the post. For a 4x4 post (3.5 inches actual), dig a hole at least 10-12 inches in diameter. This provides enough concrete around the post for strength and allows room to plumb the post.'
    },
    {
      question: 'Should I use fast-setting or regular concrete for fence posts?',
      answer: 'Fast-setting concrete (like Quikrete Fast-Setting) is ideal for fence posts because you can backfill and attach fencing in 4 hours instead of waiting 24-48 hours. You pour the dry mix into the hole, add water, and it sets quickly. Regular concrete is fine if you have time to wait.'
    },
    {
      question: 'Do I need gravel at the bottom of fence post holes?',
      answer: 'Adding 3-4 inches of gravel at the bottom of post holes is recommended because it improves drainage and prevents water from pooling against the post bottom, which causes rot. This is especially important for wood posts in wet climates.'
    },
    {
      question: 'Can I set fence posts without concrete?',
      answer: 'Yes, posts can be set in compacted gravel or crushed stone (dry-pack method). This provides good drainage and can actually extend wood post life in wet climates. However, concrete provides more rigidity for gates and in windy areas. For temporary fences or easily-adjusted layouts, gravel is practical.'
    }
  ];

  const relatedCalculators = [
    { title: 'Concrete Slab Calculator', link: '/construction/concrete-slab', description: 'Calculate concrete for slabs' },
    { title: 'Footing Calculator', link: '/construction/footing', description: 'Calculate foundation footing materials' },
    { title: 'Deck Footings Calculator', link: '/construction/deck-footings', description: 'Calculate deck post footings' }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate concrete for fence post installation:",
      steps: [
        "Enter the total number of fence posts needed",
        "Select your post size (4x4, 6x6, or round)",
        "Choose hole depth based on fence height and frost line",
        "Select hole diameter (3x post width is recommended)",
        "Review concrete bag options including fast-setting formulas"
      ]
    },
    whyMatters: {
      description: "Properly set fence posts are the foundation of a durable fence. Undersized holes or insufficient concrete lead to leaning posts, especially under wind load or when gates are used heavily. Using the right hole depth prevents frost heaving in cold climates.",
      benefits: [
        "Calculate exact concrete quantities for all posts",
        "Compare bag sizes (50lb, 60lb, 80lb options)",
        "Prevent mid-project supply runs",
        "Ensure posts resist lateral forces and wind loads"
      ]
    },
    examples: [
      {
        title: "Privacy Fence - 20 Posts",
        scenario: "4x4 posts, 10 inch holes, 24 inches deep",
        calculation: "Hole: 0.436 cu ft - Post: 0.170 cu ft = 0.266 cu ft per hole × 20",
        result: "10 bags (80lb) or 13 bags (60lb)"
      },
      {
        title: "Heavy Gate Section",
        scenario: "2 posts, 6x6 posts, 12 inch holes, 36 inches deep",
        calculation: "Each hole: 0.785 - 0.573 = 0.212 cu ft × 2",
        result: "2 bags (50lb fast-setting)"
      }
    ],
    commonMistakes: [
      "Digging holes too shallow for fence height (leads to leaning)",
      "Not accounting for frost depth in cold climates (causes heaving)",
      "Making holes too narrow (not enough concrete grip)",
      "Overfilling holes with concrete (prevents drainage)",
      "Setting posts before checking string line alignment"
    ]
  };

  return (
    <CalculatorLayout
      title="Fence Post Concrete Calculator"
      description="Calculate how many bags of concrete you need for fence posts. Includes recommendations for hole size, depth, and fast-setting vs regular concrete."
    >
      <CalculatorSchema
        name="Fence Post Concrete Calculator"
        description="Calculate concrete bag quantities for setting fence posts based on number of posts, hole dimensions, and post size"
        url="/construction/fence-post-concrete"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="numberOfPosts">Number of Posts</label>
          <input
            type="number"
            id="numberOfPosts"
            value={numberOfPosts}
            onChange={(e) => setNumberOfPosts(e.target.value)}
            placeholder="e.g., 20"
            min="1"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="postSize">Post Size</label>
          <select
            id="postSize"
            value={postSize}
            onChange={(e) => setPostSize(e.target.value)}
          >
            <option value="4x4">4×4 (3.5" actual)</option>
            <option value="6x6">6×6 (5.5" actual)</option>
            <option value="round4">4" Round</option>
            <option value="round6">6" Round</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="holeDepth">Hole Depth (inches)</label>
          <select
            id="holeDepth"
            value={holeDepth}
            onChange={(e) => setHoleDepth(e.target.value)}
          >
            <option value="18">18" (Light Duty)</option>
            <option value="24">24" (Standard)</option>
            <option value="30">30" (Tall Fence)</option>
            <option value="36">36" (Deep Frost)</option>
            <option value="42">42" (Northern Climates)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="holeDiameter">Hole Diameter (inches)</label>
          <select
            id="holeDiameter"
            value={holeDiameter}
            onChange={(e) => setHoleDiameter(e.target.value)}
          >
            <option value="8">8" (Minimum for 4×4)</option>
            <option value="10">10" (Standard for 4×4)</option>
            <option value="12">12" (Standard for 6×6)</option>
            <option value="14">14" (Large Posts)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="fenceHeight">Fence Height (feet)</label>
          <select
            id="fenceHeight"
            value={fenceHeight}
            onChange={(e) => setFenceHeight(e.target.value)}
          >
            <option value="4">4 feet</option>
            <option value="5">5 feet</option>
            <option value="6">6 feet</option>
            <option value="8">8 feet</option>
          </select>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Concrete
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Concrete Requirements</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Concrete Per Hole:</span>
                <span className={styles.resultValue}>{result.cuFtPerHole.toFixed(3)} cu ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Concrete:</span>
                <span className={styles.resultValue}>{result.totalCuFt.toFixed(2)} cu ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>80lb Bags:</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff', fontSize: '1.25rem' }}>{result.bags80lb} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>60lb Bags:</span>
                <span className={styles.resultValue}>{result.bags60lb} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>50lb Fast-Set:</span>
                <span className={styles.resultValue}>{result.quicksetBags} bags</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Water (for fast-set):</span>
                <span className={styles.resultValue}>{result.waterGallons.toFixed(1)} gallons</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Post Length:</span>
                <span className={styles.resultValue}>{result.totalPostLength.toFixed(0)} ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Cost:</span>
                <span className={styles.resultValue}>${result.estimatedCost.toFixed(0)}</span>
              </div>
            </div>

            <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Recommendations</h4>
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
