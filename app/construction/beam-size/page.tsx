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

export default function BeamSizeCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [span, setSpan] = useState<string>('');
  const [tributaryWidth, setTributaryWidth] = useState<string>('');
  const [loadType, setLoadType] = useState<string>('floor');
  const [species, setSpecies] = useState<string>('SYP');
  const [beamType, setBeamType] = useState<string>('solid');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Allowable loads in plf (pounds per linear foot) for various beam sizes
  // Based on typical species at #2 grade, L/360 deflection criteria
  const beamCapacities: Record<string, Record<string, { span: number; capacity: number }[]>> = {
    'SYP': {
      '2-2x8': [
        { span: 6, capacity: 1200 }, { span: 8, capacity: 850 }, { span: 10, capacity: 600 }
      ],
      '2-2x10': [
        { span: 6, capacity: 1600 }, { span: 8, capacity: 1200 }, { span: 10, capacity: 900 }, { span: 12, capacity: 700 }
      ],
      '2-2x12': [
        { span: 8, capacity: 1500 }, { span: 10, capacity: 1200 }, { span: 12, capacity: 950 }, { span: 14, capacity: 750 }
      ],
      '3-2x10': [
        { span: 8, capacity: 1800 }, { span: 10, capacity: 1350 }, { span: 12, capacity: 1050 }, { span: 14, capacity: 850 }
      ],
      '3-2x12': [
        { span: 10, capacity: 1800 }, { span: 12, capacity: 1425 }, { span: 14, capacity: 1125 }, { span: 16, capacity: 900 }
      ],
      '4x6': [
        { span: 6, capacity: 1000 }, { span: 8, capacity: 650 }
      ],
      '4x8': [
        { span: 6, capacity: 1500 }, { span: 8, capacity: 1100 }, { span: 10, capacity: 800 }
      ],
      '4x10': [
        { span: 8, capacity: 1400 }, { span: 10, capacity: 1100 }, { span: 12, capacity: 850 }
      ],
      '4x12': [
        { span: 10, capacity: 1400 }, { span: 12, capacity: 1150 }, { span: 14, capacity: 900 }
      ],
      '6x8': [
        { span: 8, capacity: 1800 }, { span: 10, capacity: 1350 }, { span: 12, capacity: 1050 }
      ],
      '6x10': [
        { span: 10, capacity: 1800 }, { span: 12, capacity: 1500 }, { span: 14, capacity: 1200 }
      ],
      '6x12': [
        { span: 12, capacity: 1800 }, { span: 14, capacity: 1500 }, { span: 16, capacity: 1250 }
      ]
    }
  };

  const loadValues: Record<string, number> = {
    'floor': 50, // 40 psf live + 10 psf dead
    'deck': 50, // 40 psf live + 10 psf dead
    'roof': 35, // 20 psf live + 15 psf dead (snow areas higher)
    'balcony': 60 // 60 psf live
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const beamSpan = parseFloat(span);
    const tribWidth = parseFloat(tributaryWidth);

    if (isNaN(beamSpan) || beamSpan <= 0) newErrors.push('Please enter a valid span');
    if (isNaN(tribWidth) || tribWidth <= 0) newErrors.push('Please enter a valid tributary width');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // Calculate load per linear foot
    const loadPsf = loadValues[loadType];
    const loadPlf = loadPsf * tribWidth;

    // Find suitable beams
    const speciesBeams = beamCapacities[species] || beamCapacities['SYP'];
    const suitableBeams: { size: string; capacity: number; utilization: number }[] = [];

    // Filter by beam type
    const beamSizes = Object.keys(speciesBeams).filter(size => {
      if (beamType === 'solid') return !size.includes('-');
      if (beamType === 'built') return size.includes('-');
      return true;
    });

    for (const size of beamSizes) {
      const spanData = speciesBeams[size];
      // Find capacity at this span (interpolate if needed)
      let capacity = 0;

      // Find the two closest span entries
      const sortedSpans = spanData.sort((a, b) => a.span - b.span);

      for (let i = 0; i < sortedSpans.length; i++) {
        if (sortedSpans[i].span >= beamSpan) {
          if (i === 0) {
            capacity = sortedSpans[i].capacity;
          } else {
            // Interpolate
            const lower = sortedSpans[i - 1];
            const upper = sortedSpans[i];
            const ratio = (beamSpan - lower.span) / (upper.span - lower.span);
            capacity = lower.capacity - ratio * (lower.capacity - upper.capacity);
          }
          break;
        }
      }

      // If span is greater than max in table, use last value with reduction
      if (capacity === 0 && sortedSpans.length > 0) {
        const lastEntry = sortedSpans[sortedSpans.length - 1];
        if (beamSpan <= lastEntry.span * 1.2) {
          capacity = lastEntry.capacity * (lastEntry.span / beamSpan);
        }
      }

      if (capacity >= loadPlf) {
        const utilization = (loadPlf / capacity) * 100;
        suitableBeams.push({ size, capacity: Math.round(capacity), utilization: Math.round(utilization) });
      }
    }

    // Sort by smallest adequate size
    suitableBeams.sort((a, b) => a.utilization - b.utilization);
    suitableBeams.reverse();

    // Get minimum recommended
    const recommended = suitableBeams.length > 0 ? suitableBeams[suitableBeams.length - 1] : null;

    setResults({
      span: beamSpan,
      tributaryWidth: tribWidth,
      loadType,
      loadPsf,
      loadPlf: Math.round(loadPlf),
      species: species === 'SYP' ? 'Southern Yellow Pine' : species,
      beamType: beamType === 'solid' ? 'Solid Timber' : beamType === 'built' ? 'Built-up' : 'Any',
      suitableBeams: suitableBeams.slice(0, 5),
      recommended
    });

    trackCalculatorUsage('Beam Size Calculator', {
      span: beamSpan.toString(),
      tributaryWidth: tribWidth.toString(),
      recommended: recommended?.size || 'none'
    });
  };

  const faqItems = [
    {
      question: 'How do I determine beam size for a given span?',
      answer: 'Beam size depends on span length, tributary width (area supported), load type, and wood species. Calculate the load per linear foot (psf x tributary width), then reference span tables to find a beam with adequate capacity.'
    },
    {
      question: 'What is tributary width?',
      answer: 'Tributary width is half the distance to the next support on each side. If joists span 12 feet on each side of a beam, tributary width is 12 feet total (6\' + 6\'). This determines how much floor load the beam carries.'
    },
    {
      question: 'Should I use built-up or solid beams?',
      answer: 'Built-up beams (multiple 2x boards nailed together) are easier to handle and carry. Solid timber beams are aesthetically preferred for exposed applications and have slightly better performance. Both are code-accepted when properly constructed.'
    },
    {
      question: 'What is the maximum span for a 4x8 beam?',
      answer: 'A 4x8 Southern Pine #2 beam can span about 8-10 feet depending on load. For a typical floor load with 8\' tributary width, expect around 8\' span. Longer spans require larger beams or additional posts.'
    },
    {
      question: 'Do I need an engineer for beam sizing?',
      answer: 'For standard residential applications covered by prescriptive span tables, engineered analysis is not required. For unusual loads, long spans, point loads, or commercial projects, professional engineering is recommended.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Joist Span Calculator',
      link: '/construction/joist-span',
      description: 'Find maximum joist spans'
    },
    {
      title: 'Deck Footings Calculator',
      link: '/construction/deck-footings',
      description: 'Calculate footings for beams'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate framing materials'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Beams carry loads from joists to posts or walls. Sizing depends on the span, tributary area, and load type. This calculator helps you find suitable beam sizes for your application.",
      steps: [
        "Enter the beam span (distance between supports).",
        "Enter tributary width (half the joist span on each side of beam).",
        "Select load type (floor, deck, roof, or balcony).",
        "Choose beam type preference (built-up or solid timber).",
        "Review recommended sizes and their utilization percentages."
      ]
    },
    whyMatters: {
      description: "Beams are critical structural elements. Undersized beams cause sagging, bouncy floors, and potential structural failure. Oversized beams waste money and may be difficult to handle. Proper sizing ensures safe, comfortable structures that meet building codes.",
      benefits: [
        "Find minimum beam size for your load",
        "Compare built-up vs solid timber options",
        "See utilization percentages for sizing margin",
        "Understand load calculations",
        "Select economical yet adequate sizes"
      ]
    },
    examples: [
      {
        title: "Floor Beam",
        scenario: "12-foot span beam supporting joists spanning 8 feet on each side (16\' tributary).",
        calculation: "50 psf x 16\' = 800 plf load",
        result: "3-2x12 or 6x12 beam required."
      },
      {
        title: "Deck Beam",
        scenario: "8-foot span beam with joists spanning 6 feet each side (12\' tributary).",
        calculation: "50 psf x 12\' = 600 plf load",
        result: "2-2x10 or 4x10 beam adequate."
      },
      {
        title: "Roof Ridge Beam",
        scenario: "14-foot span supporting 10 feet of rafter length each side.",
        calculation: "35 psf x 20\' = 700 plf load",
        result: "3-2x12 or 6x10 beam needed."
      }
    ],
    commonMistakes: [
      "Forgetting tributary width - the beam supports area, not just the joists directly above it.",
      "Using nominal dimensions for calculations - a 4x8 is actually 3.5\" x 7.5\".",
      "Ignoring deflection criteria - beams must be stiff enough to prevent bounce.",
      "Not accounting for point loads - concentrated loads require separate analysis.",
      "Improper built-up beam construction - boards must be properly nailed per code."
    ]
  };

  return (
    <CalculatorLayout
      title="Beam Size Calculator"
      description="Calculate the required beam size for your span and load. Find suitable built-up and solid timber beam options."
    >
      <CalculatorSchema
        name="Beam Size Calculator"
        description="Free beam size calculator to determine structural beam dimensions based on span, load, and tributary width."
        url="/construction/beam-size"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Beam Span (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={span}
              onChange={(e) => setSpan(e.target.value)}
              placeholder="e.g., 12"
              step="0.5"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Distance between posts or supports
            </small>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tributary Width (feet)</label>
            <input
              type="number"
              className={styles.input}
              value={tributaryWidth}
              onChange={(e) => setTributaryWidth(e.target.value)}
              placeholder="e.g., 12"
              step="0.5"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Total joist span supported (both sides)
            </small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Load Type</label>
          <select
            className={styles.select}
            value={loadType}
            onChange={(e) => setLoadType(e.target.value)}
          >
            <option value="floor">Floor (50 psf total)</option>
            <option value="deck">Deck (50 psf total)</option>
            <option value="roof">Roof (35 psf total)</option>
            <option value="balcony">Balcony (60 psf total)</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Wood Species</label>
            <select
              className={styles.select}
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              <option value="SYP">Southern Yellow Pine</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Beam Type</label>
            <select
              className={styles.select}
              value={beamType}
              onChange={(e) => setBeamType(e.target.value)}
            >
              <option value="any">Any (show all options)</option>
              <option value="built">Built-up (2x members)</option>
              <option value="solid">Solid Timber (4x, 6x)</option>
            </select>
          </div>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Beam Size
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Beam Size Results</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Beam Span</span>
            <span className={styles.resultValue}>{results.span} feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Tributary Width</span>
            <span className={styles.resultValue}>{results.tributaryWidth} feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Load Type</span>
            <span className={styles.resultValue}>{results.loadType} ({results.loadPsf} psf)</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Load per Linear Foot</span>
            <span className={styles.resultValuePrimary}>{results.loadPlf} plf</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Recommended Beam</h3>
          </div>

          {results.recommended ? (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Minimum Size</span>
              <span className={styles.resultValuePrimary}>{results.recommended.size}</span>
            </div>
          ) : (
            <div className={styles.warning}>
              No standard beam found for this span and load. Consider reducing span with additional posts, or consult a structural engineer.
            </div>
          )}

          {results.suitableBeams.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Suitable Beam Options</h3>
              </div>

              {results.suitableBeams.map((beam: any) => (
                <div key={beam.size} className={styles.resultItem}>
                  <span className={styles.resultLabel}>{beam.size}</span>
                  <span className={styles.resultValue}>
                    {beam.capacity} plf capacity ({beam.utilization}% utilized)
                  </span>
                </div>
              ))}
            </>
          )}

          <div className={styles.note}>
            <strong>Important:</strong> These are simplified calculations based on common span tables. For critical applications, unusual loads, or spans over 14 feet, consult a structural engineer. Built-up beams must be constructed per code with proper nailing pattern.
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
