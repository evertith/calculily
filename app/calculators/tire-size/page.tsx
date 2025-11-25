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

export default function TireSizeCalculator() {
  const { trackCalculatorUsage, trackEvent } = useAnalytics();
  const [originalSize, setOriginalSize] = useState<string>('');
  const [newSize, setNewSize] = useState<string>('');
  const [speedInput, setSpeedInput] = useState<string>('60');
  const [result, setResult] = useState<{
    originalDiameter: number;
    newDiameter: number;
    difference: number;
    percentDifference: number;
    recommended: boolean;
    actualSpeed: number;
    speedDifference: number;
    speedPercentDiff: number;
    originalRevs: number;
    newRevs: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const faqItems = [
    {
      question: "How do I read tire size markings?",
      answer: "Tire sizes are written like P215/65R15. The 'P' indicates passenger vehicle. '215' is the tire width in millimeters. '65' is the aspect ratio (sidewall height as percentage of width). 'R' means radial construction. '15' is the rim diameter in inches. Some tires may have additional markings like load index and speed rating after the size (e.g., 215/65R15 95H)."
    },
    {
      question: "How much tire size difference is safe?",
      answer: "Generally, tire diameter should be within 3% of the original size to avoid problems. Larger differences can cause: inaccurate speedometer readings, odometer errors, potential rubbing against wheel wells or suspension components, altered gear ratios affecting performance and fuel economy, and possible damage to drivetrain components (especially in AWD/4WD vehicles). Always consult your vehicle's manual for acceptable tire size ranges."
    },
    {
      question: "Will larger tires affect my speedometer?",
      answer: "Yes, larger tires will make your speedometer read slower than your actual speed because the tires cover more ground per revolution. For example, if your speedometer shows 60 mph with 3% larger tires, you're actually traveling about 61.8 mph. Conversely, smaller tires make the speedometer read faster than actual speed. This also affects your odometer, causing incorrect mileage readings."
    },
    {
      question: "Can I use a different tire size than what came with my car?",
      answer: "Yes, but with limitations. You can typically use 'plus-sizing' (larger diameter wheels with lower profile tires) or adjust within your vehicle's acceptable range. The new tire's overall diameter should be very close to the original. Check your owner's manual for approved tire sizes, or consult a tire professional. Consider that changing tire size affects speedometer accuracy, ride comfort, handling, and fuel economy. For AWD/4WD vehicles, all tires must match closely to prevent drivetrain damage."
    }
  ];

  const relatedCalculators = [
    {
      title: "Fuel Cost Calculator",
      link: "/calculators/fuel-cost",
      description: "Calculate fuel costs for trips"
    },
    {
      title: "Gas Mileage Calculator",
      link: "/calculators/gas-mileage",
      description: "Track your vehicle's MPG"
    },
    {
      title: "Car Payment Calculator",
      link: "/calculators/car-payment",
      description: "Calculate auto loan payments"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Compare tire sizes to understand how a change affects your vehicle's performance and speedometer accuracy:",
      steps: [
        "Enter your current tire size (found on the tire sidewall, e.g., 225/60R16).",
        "Enter the new tire size you're considering.",
        "The format is: width (mm) / aspect ratio / R + rim diameter (inches).",
        "Click 'Calculate' to see the difference in diameter, circumference, and speedometer error."
      ]
    },
    whyMatters: {
      description: "Changing tire sizes affects more than just looks. Different sized tires alter your speedometer accuracy, fuel economy, ride height, and can even affect safety systems like ABS and stability control. A tire that's too tall or short can cause speedometer errors of 5% or more, meaning your actual speed differs from what's displayed. Understanding these differences helps you choose plus-sizes safely or find equivalent replacement tires.",
      benefits: [
        "Understand how tire changes affect speedometer accuracy",
        "Compare overall diameter when changing wheel sizes",
        "Ensure replacement tires maintain proper vehicle dynamics",
        "Calculate actual speed when running different tire sizes",
        "Find equivalent tire sizes for wheel upgrades"
      ]
    },
    examples: [
      {
        title: "Plus-Size Wheels",
        scenario: "Upgrading from 225/60R16 to 225/50R17 for a sportier look.",
        calculation: "Old diameter: 26.6\" → New diameter: 25.9\"",
        result: "Speedometer will read 2.6% high (reads 65 when actually going 63.3 mph)."
      },
      {
        title: "Truck Tire Upgrade",
        scenario: "Changing from 265/70R17 to 285/70R17 for more aggressive look.",
        calculation: "Old diameter: 31.6\" → New diameter: 32.7\"",
        result: "Speedometer reads 3.5% low (reads 65 when actually going 67.3 mph). May need recalibration."
      },
      {
        title: "Finding Equivalent Size",
        scenario: "Want 18\" wheels but need the same overall diameter as stock 215/55R17.",
        calculation: "Stock diameter: 26.3\". Need 215/45R18 or 225/45R18.",
        result: "225/45R18 = 25.9\" diameter - close enough for minimal speedometer error."
      }
    ],
    commonMistakes: [
      "Ignoring load rating when changing sizes - larger tires may have different weight capacities.",
      "Forgetting that aspect ratio is a percentage of width - same aspect ratio on wider tires = taller sidewall.",
      "Not checking for clearance - larger tires may rub on fenders or suspension components.",
      "Assuming bigger tires always improve performance - they can hurt acceleration and fuel economy.",
      "Not recalibrating the speedometer after significant size changes - this can affect GPS and trip calculations."
    ]
  };

  const parseTireSize = (sizeString: string) => {
    // Remove spaces and convert to uppercase
    const cleaned = sizeString.replace(/\s/g, '').toUpperCase();

    // Match pattern like P215/65R15 or 215/65R15
    const match = cleaned.match(/(\d+)\/(\d+)R(\d+)/);

    if (match) {
      return {
        width: parseInt(match[1]),
        aspectRatio: parseInt(match[2]),
        rimDiameter: parseInt(match[3])
      };
    }
    return null;
  };

  const calculateTireDiameter = (width: number, aspectRatio: number, rimDiameter: number): number => {
    // Sidewall height in mm
    const sidewall = (width * aspectRatio) / 100;

    // Total diameter in mm (sidewall × 2 + rim in mm)
    const rimMm = rimDiameter * 25.4;
    const diameter = (sidewall * 2) + rimMm;

    // Convert to inches
    return diameter / 25.4;
  };

  const calculateComparison = () => {
    setError('');

    if (!originalSize || !newSize) {
      setError('Please enter both tire sizes');
      return;
    }

    const origParsed = parseTireSize(originalSize);
    const newParsed = parseTireSize(newSize);

    if (!origParsed) {
      setError('Invalid original tire size format. Use format like 215/65R15');
      return;
    }

    if (!newParsed) {
      setError('Invalid new tire size format. Use format like 215/65R15');
      return;
    }

    const origDiameter = calculateTireDiameter(
      origParsed.width,
      origParsed.aspectRatio,
      origParsed.rimDiameter
    );

    const newDiameter = calculateTireDiameter(
      newParsed.width,
      newParsed.aspectRatio,
      newParsed.rimDiameter
    );

    const difference = newDiameter - origDiameter;
    const percentDifference = (difference / origDiameter) * 100;
    const recommended = Math.abs(percentDifference) < 3;

    // Speedometer calculations
    const speed = parseFloat(speedInput) || 60;
    const ratio = newDiameter / origDiameter;
    const actualSpeed = speed * ratio;
    const speedDifference = actualSpeed - speed;
    const speedPercentDiff = (speedDifference / speed) * 100;

    // Revolutions per mile
    const originalRevs = 63360 / (origDiameter * Math.PI);
    const newRevs = 63360 / (newDiameter * Math.PI);

    setResult({
      originalDiameter: origDiameter,
      newDiameter: newDiameter,
      difference,
      percentDifference,
      recommended,
      actualSpeed,
      speedDifference,
      speedPercentDiff,
      originalRevs,
      newRevs
    });

    trackCalculatorUsage('Tire Size Calculator', {
      originalSize,
      newSize,
      percentDifference: percentDifference.toFixed(2),
      recommended: recommended.toString()
    });
  };

  return (
    <CalculatorLayout
      title="Tire Size Calculator"
      description="Compare tire sizes to see diameter differences and speedometer error. Find equivalent sizes when changing wheels or upgrading tires."
    >
      <CalculatorSchema
        name="Tire Size Calculator"
        description="Free tire size calculator to compare tire dimensions. See diameter differences, speedometer error, and find equivalent tire sizes for wheel upgrades."
        url="/calculators/tire-size"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateComparison(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="originalSize" className={styles.label}>
            Original Tire Size
          </label>
          <input
            id="originalSize"
            type="text"
            className={styles.input}
            value={originalSize}
            onChange={(e) => setOriginalSize(e.target.value)}
            placeholder="e.g., 215/65R15"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newSize" className={styles.label}>
            New Tire Size
          </label>
          <input
            id="newSize"
            type="text"
            className={styles.input}
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="e.g., 225/60R16"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="speedInput" className={styles.label}>
            Speedometer Speed (for correction calculation)
          </label>
          <input
            id="speedInput"
            type="number"
            className={styles.input}
            value={speedInput}
            onChange={(e) => setSpeedInput(e.target.value)}
            placeholder="60"
            step="1"
            min="1"
          />
        </div>

        <button type="submit" className={styles.button}>
          Compare Tire Sizes
        </button>
      </form>

      {error && (
        <div className={styles.errors}>
          <div className={styles.error}>{error}</div>
        </div>
      )}

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Original Tire Diameter</span>
            <span className={styles.resultValue}>{result.originalDiameter.toFixed(2)}"</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>New Tire Diameter</span>
            <span className={styles.resultValue}>{result.newDiameter.toFixed(2)}"</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Diameter Difference</span>
            <span className={styles.resultValuePrimary}>
              {result.difference > 0 ? '+' : ''}{result.difference.toFixed(2)}" ({result.percentDifference > 0 ? '+' : ''}{result.percentDifference.toFixed(2)}%)
            </span>
          </div>

          <div style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e0e0e0' }}>Speedometer Correction</h3>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Speedometer Shows</span>
              <span className={styles.resultValue}>{speedInput} mph</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Actual Speed</span>
              <span className={styles.resultValue}>{result.actualSpeed.toFixed(1)} mph</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Speed Difference</span>
              <span className={styles.resultValue}>
                {result.speedDifference > 0 ? '+' : ''}{result.speedDifference.toFixed(1)} mph ({result.speedPercentDiff > 0 ? '+' : ''}{result.speedPercentDiff.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e0e0e0' }}>Additional Information</h3>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Original Revs/Mile</span>
              <span className={styles.resultValue}>{result.originalRevs.toFixed(0)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>New Revs/Mile</span>
              <span className={styles.resultValue}>{result.newRevs.toFixed(0)}</span>
            </div>
          </div>

          {result.recommended ? (
            <div className={styles.note}>
              <strong>✓ Recommended:</strong> This tire size change is within acceptable limits (less than 3% difference).
              Your speedometer and odometer will have minimal error.
            </div>
          ) : (
            <div className={styles.warning}>
              <strong>⚠ Not Recommended:</strong> This tire size differs by more than 3% from the original.
              This may cause speedometer inaccuracy, potential rubbing issues, and could affect vehicle performance.
              Consult a tire professional or your vehicle manual before making this change.
            </div>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('automotive', 3)}
        calculatorName="Tire Size Calculator"
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
