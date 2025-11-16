'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

type FenceType = 'privacy' | 'picket' | 'chainlink';

export default function FenceCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [fenceType, setFenceType] = useState<FenceType>('privacy');
  const [fenceLength, setFenceLength] = useState<string>('');
  const [fenceHeight, setFenceHeight] = useState<string>('6');
  const [postSpacing, setPostSpacing] = useState<string>('8');
  const [numGates, setNumGates] = useState<string>('1');
  const [boardWidth, setBoardWidth] = useState<string>('5.5');
  const [boardSpacing, setBoardSpacing] = useState<string>('0');
  const [numRails, setNumRails] = useState<string>('3');

  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculatePosts = (length: number, spacing: number, gates: number) => {
    const posts = Math.ceil(length / spacing) + 1;
    const gatePosts = gates * 2;
    return posts + gatePosts;
  };

  const calculateRails = (length: number, rails: number) => {
    return Math.ceil(length / 8) * rails;
  };

  const calculatePickets = (length: number, bWidth: number, spacing: number) => {
    const lengthInches = length * 12;
    const effectiveWidth = bWidth + spacing;
    return Math.ceil(lengthInches / effectiveWidth);
  };

  const calculateConcrete = (numPosts: number, postDiameter: number, holeDepth: number) => {
    const holeDiameter = postDiameter * 3;
    const radius = holeDiameter / 2 / 12;
    const depthFeet = holeDepth;
    const volumePerHole = Math.PI * Math.pow(radius, 2) * depthFeet;
    const totalCubicFeet = volumePerHole * numPosts;
    const cubicYards = totalCubicFeet / 27;
    const bags = Math.ceil(totalCubicFeet / 0.6);

    return { cubicYards, bags };
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    if (!fenceLength || parseFloat(fenceLength) <= 0) newErrors.push('Please enter a valid fence length');
    if (!fenceHeight || parseFloat(fenceHeight) <= 0) newErrors.push('Please enter a valid fence height');
    if (!postSpacing || parseFloat(postSpacing) <= 0) newErrors.push('Please enter a valid post spacing');
    if (!numGates || parseFloat(numGates) < 0) newErrors.push('Please enter a valid number of gates');

    if (fenceType === 'privacy' || fenceType === 'picket') {
      if (!boardWidth || parseFloat(boardWidth) <= 0) newErrors.push('Please enter a valid board width');
      if (!numRails || parseFloat(numRails) <= 0) newErrors.push('Please enter a valid number of rails');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    const posts = calculatePosts(parseFloat(fenceLength), parseFloat(postSpacing), parseFloat(numGates));
    const rails = calculateRails(parseFloat(fenceLength), parseFloat(numRails));
    const concrete = calculateConcrete(posts, 4, 2);

    let pickets = 0;
    if (fenceType === 'privacy' || fenceType === 'picket') {
      pickets = calculatePickets(
        parseFloat(fenceLength),
        parseFloat(boardWidth),
        parseFloat(boardSpacing)
      );
    }

    let materialsList: any = {
      posts: {
        quantity: posts,
        size: `4x4x${parseFloat(fenceHeight) + 2}'`
      },
      concrete: {
        bags: concrete.bags,
        cubicYards: concrete.cubicYards.toFixed(2)
      }
    };

    if (fenceType === 'privacy' || fenceType === 'picket') {
      materialsList.rails = {
        quantity: rails,
        size: '2x4x8\''
      };
      materialsList.pickets = {
        quantity: pickets,
        size: `1x6x${fenceHeight}'`
      };
    }

    if (fenceType === 'chainlink') {
      materialsList.chainLink = {
        linearFeet: parseFloat(fenceLength),
        height: `${fenceHeight}' height`
      };
      materialsList.topRail = {
        linearFeet: parseFloat(fenceLength),
        size: '1-3/8" diameter'
      };
    }

    setResults({
      fenceType,
      fenceLength: parseFloat(fenceLength),
      fenceHeight: parseFloat(fenceHeight),
      materials: materialsList,
      gates: parseFloat(numGates)
    });

    trackCalculatorUsage('Fence Calculator', {
      fenceType,
      fenceLength,
      posts: posts.toString()
    });
  };

  const faqItems = [
    {
      question: 'How far apart should fence posts be?',
      answer: '8 feet on center is standard for most residential fences. This works well with standard 8-foot lumber and provides adequate support. For areas with high winds or heavy fencing materials, consider 6-foot spacing.'
    },
    {
      question: 'How deep should fence posts be set?',
      answer: 'Posts should be set 1/3 of their total length underground, with a minimum of 2 feet deep. For a 6-foot fence, use 8-foot posts (6 feet above ground, 2 feet below). In areas with frost, go below the frost line.'
    },
    {
      question: 'How much concrete do I need per fence post?',
      answer: 'A typical 4x4 post requires a hole 12 inches in diameter and 2 feet deep. This needs about 2-3 bags of 80lb concrete mix per post. The concrete should extend 6 inches above ground level and slope away from the post.'
    },
    {
      question: 'What is the difference between privacy fence and picket fence?',
      answer: 'Privacy fences have boards placed tightly together (no spacing) for complete privacy, typically 6-8 feet tall. Picket fences have spacing between boards for decoration, usually 3-4 feet tall. Privacy fences use more materials and cost more.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for fence post holes'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate board feet for fence materials'
    },
    {
      title: 'Deck Calculator',
      link: '/calculators/deck',
      description: 'Calculate decking and railing materials'
    }
  ];

  return (
    <CalculatorLayout
      title="Fence Calculator"
      description="Calculate materials needed for wood privacy, picket, or chain link fences"
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Fence Type</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${fenceType === 'privacy' ? styles.buttonOptionActive : ''}`}
              onClick={() => setFenceType('privacy')}
            >
              Privacy
            </button>
            <button
              className={`${styles.buttonOption} ${fenceType === 'picket' ? styles.buttonOptionActive : ''}`}
              onClick={() => setFenceType('picket')}
            >
              Picket
            </button>
            <button
              className={`${styles.buttonOption} ${fenceType === 'chainlink' ? styles.buttonOptionActive : ''}`}
              onClick={() => setFenceType('chainlink')}
            >
              Chain Link
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Fence Length (feet)</label>
          <input
            type="number"
            className={styles.input}
            value={fenceLength}
            onChange={(e) => setFenceLength(e.target.value)}
            placeholder="e.g., 100"
            step="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Fence Height (feet)</label>
          <input
            type="number"
            className={styles.input}
            value={fenceHeight}
            onChange={(e) => setFenceHeight(e.target.value)}
            placeholder="e.g., 6"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Post Spacing (feet)</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${postSpacing === '6' ? styles.buttonOptionActive : ''}`}
              onClick={() => setPostSpacing('6')}
            >
              6 feet
            </button>
            <button
              className={`${styles.buttonOption} ${postSpacing === '8' ? styles.buttonOptionActive : ''}`}
              onClick={() => setPostSpacing('8')}
            >
              8 feet
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Number of Gates</label>
          <input
            type="number"
            className={styles.input}
            value={numGates}
            onChange={(e) => setNumGates(e.target.value)}
            placeholder="e.g., 1"
            step="1"
          />
        </div>

        {(fenceType === 'privacy' || fenceType === 'picket') && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Board Width (inches)</label>
              <input
                type="number"
                className={styles.input}
                value={boardWidth}
                onChange={(e) => setBoardWidth(e.target.value)}
                placeholder="e.g., 5.5"
                step="0.5"
              />
            </div>

            {fenceType === 'picket' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Board Spacing (inches)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={boardSpacing}
                  onChange={(e) => setBoardSpacing(e.target.value)}
                  placeholder="e.g., 2"
                  step="0.5"
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Number of Rails (horizontal)</label>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.buttonOption} ${numRails === '2' ? styles.buttonOptionActive : ''}`}
                  onClick={() => setNumRails('2')}
                >
                  2 Rails
                </button>
                <button
                  className={`${styles.buttonOption} ${numRails === '3' ? styles.buttonOptionActive : ''}`}
                  onClick={() => setNumRails('3')}
                >
                  3 Rails
                </button>
              </div>
            </div>
          </>
        )}

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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>
            Materials Needed - {results.fenceLength}' {results.fenceType === 'privacy' ? 'Privacy' : results.fenceType === 'picket' ? 'Picket' : 'Chain Link'} Fence
          </h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Posts Needed</span>
            <span className={styles.resultValuePrimary}>
              {results.materials.posts.quantity} posts
            </span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Post Size</span>
            <span className={styles.resultValue}>{results.materials.posts.size}</span>
          </div>

          {results.materials.rails && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Rails Needed</span>
                <span className={styles.resultValue}>
                  {results.materials.rails.quantity} boards
                </span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Rail Size</span>
                <span className={styles.resultValue}>{results.materials.rails.size}</span>
              </div>
            </>
          )}

          {results.materials.pickets && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>
                  {results.fenceType === 'privacy' ? 'Fence Boards' : 'Pickets'} Needed
                </span>
                <span className={styles.resultValue}>
                  {results.materials.pickets.quantity} boards
                </span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>
                  {results.fenceType === 'privacy' ? 'Board' : 'Picket'} Size
                </span>
                <span className={styles.resultValue}>{results.materials.pickets.size}</span>
              </div>
            </>
          )}

          {results.materials.chainLink && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Chain Link Fabric</span>
                <span className={styles.resultValue}>
                  {results.materials.chainLink.linearFeet} linear feet
                </span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Fabric Height</span>
                <span className={styles.resultValue}>{results.materials.chainLink.height}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Top Rail</span>
                <span className={styles.resultValue}>
                  {results.materials.topRail.linearFeet} linear feet
                </span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Rail Size</span>
                <span className={styles.resultValue}>{results.materials.topRail.size}</span>
              </div>
            </>
          )}

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Concrete Needed</span>
            <span className={styles.resultValue}>
              {results.materials.concrete.bags} bags (80lb)
            </span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Concrete (cubic yards)</span>
            <span className={styles.resultValue}>{results.materials.concrete.cubicYards} yd³</span>
          </div>

          {results.gates > 0 && (
            <div className={styles.note}>
              <strong>Gate Hardware Needed:</strong> For {results.gates} gate(s), you'll need gate hinges,
              latches, and possibly gate springs. Standard gate width is 3-4 feet. Consider using 6x6 posts
              for gate openings for extra strength.
            </div>
          )}

          <div className={styles.note}>
            <strong>Additional Materials:</strong>
            {results.fenceType === 'chainlink' ? (
              <> Tension bands, rail ends, post caps, tension wire, and tie wires. All hardware should be galvanized or vinyl-coated.</>
            ) : (
              <> Galvanized nails or deck screws (3" for rails, 2" for pickets), post caps to prevent water damage, and gate hardware if applicable. Consider adding a kickboard at the base for durability.</>
            )}
          </div>

          <div className={styles.note}>
            <strong>Installation Tips:</strong> Set posts first and let concrete cure for 24-48 hours before attaching
            rails and {results.fenceType === 'chainlink' ? 'fabric' : 'boards'}. Use a string line to ensure posts are straight.
            Posts should be set {results.fenceType === 'privacy' ? '2-2.5' : '2'} feet deep in concrete. Check local codes
            for setback requirements and permits.
          </div>
        </div>
      )}


      <ProductRecommendation
        products={getProducts('lumber', 3)}
        calculatorName="Fence Calculator"
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
