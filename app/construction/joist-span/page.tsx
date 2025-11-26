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

export default function JoistSpanCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [joistSize, setJoistSize] = useState<string>('2x10');
  const [spacing, setSpacing] = useState<string>('16');
  const [species, setSpecies] = useState<string>('SYP');
  const [grade, setGrade] = useState<string>('#2');
  const [loadType, setLoadType] = useState<string>('floor');
  const [desiredSpan, setDesiredSpan] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Maximum spans in feet based on species, grade, and load type
  // Values are for 40 psf live load + 10 psf dead load (floor) or 20 psf total load (ceiling)
  const spanTables: Record<string, Record<string, Record<string, { '12': number; '16': number; '24': number }>>> = {
    'SYP': {
      '#1': {
        '2x6': { '12': 12.5, '16': 11.5, '24': 10.0 },
        '2x8': { '12': 16.5, '16': 15.0, '24': 13.0 },
        '2x10': { '12': 21.0, '16': 19.0, '24': 16.5 },
        '2x12': { '12': 25.5, '16': 23.0, '24': 20.0 }
      },
      '#2': {
        '2x6': { '12': 12.0, '16': 11.0, '24': 9.5 },
        '2x8': { '12': 16.0, '16': 14.5, '24': 12.5 },
        '2x10': { '12': 20.5, '16': 18.5, '24': 15.5 },
        '2x12': { '12': 24.5, '16': 22.0, '24': 19.0 }
      },
      '#3': {
        '2x6': { '12': 10.0, '16': 9.0, '24': 7.5 },
        '2x8': { '12': 13.0, '16': 11.5, '24': 10.0 },
        '2x10': { '12': 16.5, '16': 14.5, '24': 12.0 },
        '2x12': { '12': 20.0, '16': 17.5, '24': 14.5 }
      }
    },
    'DF': {
      '#1': {
        '2x6': { '12': 12.5, '16': 11.5, '24': 10.0 },
        '2x8': { '12': 16.5, '16': 15.0, '24': 13.0 },
        '2x10': { '12': 21.0, '16': 19.0, '24': 16.5 },
        '2x12': { '12': 25.5, '16': 23.0, '24': 20.0 }
      },
      '#2': {
        '2x6': { '12': 12.0, '16': 11.0, '24': 9.0 },
        '2x8': { '12': 15.5, '16': 14.0, '24': 12.0 },
        '2x10': { '12': 20.0, '16': 18.0, '24': 15.0 },
        '2x12': { '12': 24.0, '16': 21.5, '24': 18.0 }
      },
      '#3': {
        '2x6': { '12': 9.5, '16': 8.5, '24': 7.0 },
        '2x8': { '12': 12.5, '16': 11.0, '24': 9.5 },
        '2x10': { '12': 16.0, '16': 14.0, '24': 11.5 },
        '2x12': { '12': 19.5, '16': 17.0, '24': 14.0 }
      }
    },
    'SPF': {
      '#1': {
        '2x6': { '12': 11.5, '16': 10.5, '24': 9.0 },
        '2x8': { '12': 15.0, '16': 13.5, '24': 11.5 },
        '2x10': { '12': 19.0, '16': 17.0, '24': 14.5 },
        '2x12': { '12': 23.0, '16': 21.0, '24': 18.0 }
      },
      '#2': {
        '2x6': { '12': 11.0, '16': 10.0, '24': 8.5 },
        '2x8': { '12': 14.5, '16': 13.0, '24': 11.0 },
        '2x10': { '12': 18.5, '16': 16.5, '24': 14.0 },
        '2x12': { '12': 22.0, '16': 20.0, '24': 17.0 }
      },
      '#3': {
        '2x6': { '12': 8.5, '16': 7.5, '24': 6.5 },
        '2x8': { '12': 11.0, '16': 10.0, '24': 8.5 },
        '2x10': { '12': 14.5, '16': 12.5, '24': 10.5 },
        '2x12': { '12': 17.5, '16': 15.5, '24': 12.5 }
      }
    }
  };

  const speciesNames: Record<string, string> = {
    'SYP': 'Southern Yellow Pine',
    'DF': 'Douglas Fir-Larch',
    'SPF': 'Spruce-Pine-Fir'
  };

  const handleCalculate = () => {
    setErrors([]);

    const spacingKey = spacing as '12' | '16' | '24';
    const speciesData = spanTables[species];
    const gradeData = speciesData?.[grade];
    const sizeData = gradeData?.[joistSize];

    if (!sizeData) {
      setErrors(['Span data not available for this combination']);
      setResults(null);
      return;
    }

    const maxSpan = sizeData[spacingKey];
    const ceilingMultiplier = loadType === 'ceiling' ? 1.33 : 1; // Ceiling joists can span ~33% more
    const adjustedMaxSpan = loadType === 'ceiling' ? maxSpan * ceilingMultiplier : maxSpan;

    const desired = parseFloat(desiredSpan) || 0;
    const spanOk = desired <= adjustedMaxSpan;

    // Find recommended joist size for desired span
    let recommendedSize = joistSize;
    if (desired > 0 && !spanOk) {
      const sizes = ['2x6', '2x8', '2x10', '2x12'];
      for (const size of sizes) {
        const testSpan = gradeData?.[size]?.[spacingKey] || 0;
        const adjustedTestSpan = loadType === 'ceiling' ? testSpan * ceilingMultiplier : testSpan;
        if (adjustedTestSpan >= desired) {
          recommendedSize = size;
          break;
        }
      }
    }

    // Get all size options
    const allSizes = ['2x6', '2x8', '2x10', '2x12'].map(size => ({
      size,
      span: gradeData?.[size]?.[spacingKey] || 0,
      adjustedSpan: (gradeData?.[size]?.[spacingKey] || 0) * (loadType === 'ceiling' ? ceilingMultiplier : 1)
    }));

    setResults({
      joistSize,
      spacing,
      species: speciesNames[species],
      grade,
      loadType: loadType === 'floor' ? 'Floor (40 psf live + 10 psf dead)' : 'Ceiling (10 psf live + 5 psf dead)',
      maxSpan: adjustedMaxSpan.toFixed(1),
      desiredSpan: desired > 0 ? desired : null,
      spanOk,
      recommendedSize,
      allSizes
    });

    trackCalculatorUsage('Joist Span Calculator', {
      joistSize,
      spacing,
      species,
      maxSpan: adjustedMaxSpan.toFixed(1)
    });
  };

  const faqItems = [
    {
      question: 'What is the maximum span for a 2x10 floor joist?',
      answer: 'A 2x10 Southern Pine #2 at 16" spacing can span up to 18\'6" for floor use. Douglas Fir spans 18\', while SPF spans 16\'6". Spans vary by species, grade, spacing, and load requirements.'
    },
    {
      question: 'How far can a 2x8 joist span?',
      answer: '2x8 joists span 12-15 feet depending on species, grade, and spacing. At 16" on center, Southern Pine #2 spans 14\'6", Douglas Fir spans 14\', and SPF spans 13\'. Use 12" spacing for longer spans.'
    },
    {
      question: 'Does joist spacing affect maximum span?',
      answer: 'Yes, significantly. Closer spacing (12" OC) allows longer spans than wider spacing (24" OC) because the load is distributed across more joists. 16" OC is standard for most residential floors.'
    },
    {
      question: 'What is the difference between floor and ceiling joist spans?',
      answer: 'Ceiling joists that only support a drywall ceiling can span about 33% more than floor joists because they carry less load. Floor joists must support 40 psf live load plus 10 psf dead load; attic joists with limited storage only need 20 psf.'
    },
    {
      question: 'Which lumber species is best for floor joists?',
      answer: 'Southern Yellow Pine (SYP) and Douglas Fir are the strongest common species, allowing the longest spans. SPF (Spruce-Pine-Fir) is lighter and less expensive but requires larger sizes for the same span.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Deck Joists Calculator',
      link: '/construction/deck-joists',
      description: 'Calculate deck joist materials'
    },
    {
      title: 'Beam Size Calculator',
      link: '/construction/beam-size',
      description: 'Size beams for spans'
    },
    {
      title: 'Lumber Calculator',
      link: '/calculators/lumber',
      description: 'Calculate framing lumber'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Joist span tables are based on engineering calculations that consider wood strength, deflection limits, and code requirements. This calculator helps you find maximum allowable spans and select appropriate joist sizes.",
      steps: [
        "Select joist size (2x6, 2x8, 2x10, or 2x12).",
        "Choose spacing (12\", 16\", or 24\" on center).",
        "Select wood species (SYP is strongest, SPF is most common).",
        "Choose lumber grade (#1, #2, or #3).",
        "Optionally enter your desired span to check feasibility."
      ]
    },
    whyMatters: {
      description: "Properly sized floor joists prevent bouncy floors, excessive deflection, and structural failure. Building codes specify maximum spans based on extensive engineering analysis. Using undersized joists leads to floor problems; oversizing wastes money. Span tables provide the guidance needed for code-compliant construction.",
      benefits: [
        "Find maximum spans for any joist configuration",
        "Compare different joist sizes and spacings",
        "Verify if desired spans are code-compliant",
        "Select optimal joist size for your application",
        "Understand how species and grade affect spans"
      ]
    },
    examples: [
      {
        title: "Bedroom Floor",
        scenario: "14-foot span for bedroom using #2 SYP at 16\" spacing.",
        calculation: "2x10 max span = 18\'6\" > 14\' required",
        result: "2x10 joists are adequate with 4\'6\" margin."
      },
      {
        title: "Large Living Room",
        scenario: "18-foot span with no center support, using Douglas Fir #2.",
        calculation: "2x12 at 12\" spacing = 24\' max span",
        result: "2x12 at 12\" spacing works; 2x10 falls short."
      },
      {
        title: "Ceiling Joists Only",
        scenario: "20-foot garage ceiling span with SPF #2 at 24\" spacing.",
        calculation: "2x10 floor span = 14\' x 1.33 ceiling = 18.6\' max",
        result: "2x12 needed for 20\' ceiling span."
      }
    ],
    commonMistakes: [
      "Using the wrong load type - floor loads are higher than ceiling loads.",
      "Ignoring lumber grade - #3 spans significantly less than #1.",
      "Assuming all species are equal - SPF is weaker than SYP or Douglas Fir.",
      "Not accounting for point loads - concentrated loads require engineering.",
      "Forgetting cantilevers - cantilever spans have different rules."
    ]
  };

  return (
    <CalculatorLayout
      title="Joist Span Calculator"
      description="Find maximum floor and ceiling joist spans by size, spacing, species, and grade. Based on IRC building code tables."
    >
      <CalculatorSchema
        name="Joist Span Calculator"
        description="Free joist span calculator to find maximum allowable spans for floor and ceiling joists based on size, spacing, and lumber species."
        url="/construction/joist-span"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Joist Size</label>
            <select
              className={styles.select}
              value={joistSize}
              onChange={(e) => setJoistSize(e.target.value)}
            >
              <option value="2x6">2x6</option>
              <option value="2x8">2x8</option>
              <option value="2x10">2x10</option>
              <option value="2x12">2x12</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Spacing (on center)</label>
            <select
              className={styles.select}
              value={spacing}
              onChange={(e) => setSpacing(e.target.value)}
            >
              <option value="12">12 inches</option>
              <option value="16">16 inches (standard)</option>
              <option value="24">24 inches</option>
            </select>
          </div>
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
              <option value="DF">Douglas Fir-Larch</option>
              <option value="SPF">Spruce-Pine-Fir</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Lumber Grade</label>
            <select
              className={styles.select}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="#1">#1 (highest)</option>
              <option value="#2">#2 (standard)</option>
              <option value="#3">#3 (economy)</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Application</label>
          <select
            className={styles.select}
            value={loadType}
            onChange={(e) => setLoadType(e.target.value)}
          >
            <option value="floor">Floor Joist (40 psf live load)</option>
            <option value="ceiling">Ceiling Joist (drywall only)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Desired Span (feet) - optional</label>
          <input
            type="number"
            className={styles.input}
            value={desiredSpan}
            onChange={(e) => setDesiredSpan(e.target.value)}
            placeholder="e.g., 14"
            step="0.5"
          />
          <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
            Enter to check if your required span is achievable
          </small>
        </div>

        <button className={styles.button} onClick={handleCalculate}>
          Calculate Span
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Joist Span Results</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Joist Size</span>
            <span className={styles.resultValue}>{results.joistSize}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Spacing</span>
            <span className={styles.resultValue}>{results.spacing}" on center</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Species</span>
            <span className={styles.resultValue}>{results.species}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Grade</span>
            <span className={styles.resultValue}>{results.grade}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Load Type</span>
            <span className={styles.resultValue}>{results.loadType}</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Maximum Span</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Max Span for {results.joistSize}</span>
            <span className={styles.resultValuePrimary}>{results.maxSpan} feet</span>
          </div>

          {results.desiredSpan && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Your Desired Span</span>
                <span className={styles.resultValue}>{results.desiredSpan} feet</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Span OK?</span>
                <span className={styles.resultValue} style={{ color: results.spanOk ? '#4ade80' : '#f87171' }}>
                  {results.spanOk ? 'YES - Within limits' : `NO - Use ${results.recommendedSize} or larger`}
                </span>
              </div>
            </>
          )}

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>All Sizes at {results.spacing}" OC</h3>
          </div>

          {results.allSizes.map((item: any) => (
            <div key={item.size} className={styles.resultItem}>
              <span className={styles.resultLabel}>{item.size}</span>
              <span className={styles.resultValue}>{item.adjustedSpan.toFixed(1)} feet</span>
            </div>
          ))}

          <div className={styles.note}>
            <strong>Note:</strong> These spans are based on IRC residential building code tables. Always verify with local building codes and consider having spans reviewed by a structural engineer for unusual loads or conditions.
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
