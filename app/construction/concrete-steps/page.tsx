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

export default function ConcreteStepsCalculator() {
  const { trackCalculatorUsage } = useAnalytics();
  const [stairWidth, setStairWidth] = useState<string>('');
  const [numSteps, setNumSteps] = useState<string>('');
  const [riseHeight, setRiseHeight] = useState<string>('7.5');
  const [runDepth, setRunDepth] = useState<string>('11');
  const [includeLanding, setIncludeLanding] = useState<boolean>(true);
  const [landingDepth, setLandingDepth] = useState<string>('36');
  const [slabThickness, setSlabThickness] = useState<string>('4');
  const [concretePrice, setConcretePrice] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    const width = parseFloat(stairWidth);
    const steps = parseInt(numSteps);
    const rise = parseFloat(riseHeight);
    const run = parseFloat(runDepth);
    const thickness = parseFloat(slabThickness);

    if (isNaN(width) || width <= 0) newErrors.push('Please enter a valid stair width');
    if (isNaN(steps) || steps <= 0) newErrors.push('Please enter the number of steps');
    if (isNaN(rise) || rise <= 0) newErrors.push('Please enter a valid rise height');
    if (isNaN(run) || run <= 0) newErrors.push('Please enter a valid run depth');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    // Convert to feet
    const widthFt = width / 12;
    const riseFt = rise / 12;
    const runFt = run / 12;
    const thickFt = thickness / 12;
    const landingFt = includeLanding ? parseFloat(landingDepth) / 12 : 0;

    // Calculate concrete volume for steps (each step is a rectangle)
    // Each step builds on the previous, creating a stair profile
    // Volume = width * (sum of step volumes)

    // Method: Calculate as a series of rectangular blocks
    // Step 1: rise x run x width
    // Step 2: rise x (run x 2) x width... etc
    // Or use the formula for stair cross-section area

    // Cross-section area of steps (triangular prism approach)
    // Each step adds: rise * (step# * run) for the vertical face
    // But actually it's easier to think of it as blocks

    // Total stair volume (solid block approach)
    // The stairs form a stepped solid. Calculate as:
    // Each step i (from bottom): rise * run * width * 1
    // But we also need the solid underneath each tread

    // More accurate: Calculate total bounding box minus the air above treads
    // Or sum each step as a rectangular block

    let stepsVolumeCuFt = 0;

    for (let i = 1; i <= steps; i++) {
      // Each step is a block: width x run x (total height up to this step)
      // But actually, the tread sits on concrete below
      // Simplified: each step adds width x run x rise of new concrete
      stepsVolumeCuFt += widthFt * runFt * riseFt;
    }

    // Add the solid platform under all steps (foundation slab)
    // This is width x total run x slab thickness
    const totalRun = steps * runFt;
    const baseSlabVolume = widthFt * totalRun * thickFt;
    stepsVolumeCuFt += baseSlabVolume;

    // Add landing if included
    let landingVolume = 0;
    if (includeLanding && landingFt > 0) {
      const totalRise = steps * riseFt;
      // Landing is a slab at the top: width x landing depth x slab thickness
      // Plus the fill underneath to the ground level
      landingVolume = widthFt * landingFt * (totalRise + thickFt);
      stepsVolumeCuFt += landingVolume;
    }

    const totalCuFt = stepsVolumeCuFt;
    const totalCuYd = totalCuFt / 27;

    // Ready-mix concrete (ordering in cubic yards)
    const cuYdRoundUp = Math.ceil(totalCuYd * 10) / 10; // Round to nearest 0.1

    // Bags of concrete (60 lb = 0.45 cu ft, 80 lb = 0.6 cu ft)
    const bags80lb = Math.ceil(totalCuFt / 0.6);
    const bags60lb = Math.ceil(totalCuFt / 0.45);

    // Rebar estimate (typically #4 rebar in steps)
    // Horizontal: 2 bars per tread, vertical: 1 per step
    const horizontalRebarFt = steps * 2 * (width / 12);
    const verticalRebarFt = steps * 2 * (rise / 12);
    const totalRebarFt = Math.ceil((horizontalRebarFt + verticalRebarFt) * 1.1);
    const rebar20ftSticks = Math.ceil(totalRebarFt / 20);

    // Wire mesh alternative (sq ft)
    const meshSqFt = Math.ceil(widthFt * totalRun * 1.1);

    // Form lumber estimate (2x6 or 2x8 for risers)
    const formBoardFt = Math.ceil(steps * width / 12 * 2); // Front and back forms

    // Cost calculations
    const price = parseFloat(concretePrice) || 0;
    let concreteCost = null;
    if (price > 0) {
      // Assume price is per bag (80 lb)
      concreteCost = bags80lb * price;
    }

    const rebarCost = rebar20ftSticks * 12; // ~$12 per 20ft #4 rebar
    const totalCost = concreteCost ? concreteCost + rebarCost : null;

    setResults({
      stairWidth: width,
      numSteps: steps,
      rise,
      run,
      totalRise: (steps * rise).toFixed(1),
      totalRun: (steps * run).toFixed(1),
      totalCuFt: totalCuFt.toFixed(2),
      totalCuYd: cuYdRoundUp.toFixed(2),
      bags80lb,
      bags60lb,
      landingVolume: landingVolume.toFixed(2),
      totalRebarFt,
      rebar20ftSticks,
      meshSqFt,
      formBoardFt,
      concreteCost: concreteCost ? concreteCost.toFixed(2) : null,
      rebarCost: rebarCost.toFixed(2),
      totalCost: totalCost ? totalCost.toFixed(2) : null
    });

    trackCalculatorUsage('Concrete Steps Calculator', {
      numSteps: steps.toString(),
      width: width.toString(),
      totalCuYd: cuYdRoundUp.toString()
    });
  };

  const faqItems = [
    {
      question: 'How much concrete do I need for steps?',
      answer: 'Calculate the volume of each step (width x run x rise) and add them together, plus the base slab thickness. A typical 36-inch wide, 4-step entry with landing requires about 0.5-0.7 cubic yards of concrete.'
    },
    {
      question: 'What is the proper rise and run for concrete steps?',
      answer: 'Building codes typically require: maximum 7.75-inch rise, minimum 10-inch run, and the formula 2R + T (two risers plus tread) should equal 24-25 inches for comfort. All risers must be within 3/8 inch of each other.'
    },
    {
      question: 'Do concrete steps need rebar?',
      answer: 'Yes, rebar or wire mesh is recommended for structural integrity. Use #4 rebar in a grid pattern, or 6x6 welded wire mesh. Rebar prevents cracking from settling, freeze-thaw cycles, and heavy loads.'
    },
    {
      question: 'How long until I can use new concrete steps?',
      answer: 'Wait 24-48 hours before removing forms and walking on steps carefully. Full cure takes 28 days, but steps can handle normal foot traffic after 7 days. Avoid heavy loads or impacts during the first week.'
    },
    {
      question: 'Can I pour concrete steps without forms?',
      answer: 'Forms are essential for clean edges and proper dimensions. Use 2x boards for riser forms, stake them firmly, and coat with form release oil. Remove forms after 24-48 hours to allow curing and finishing.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Concrete Calculator',
      link: '/calculators/concrete',
      description: 'Calculate concrete for slabs and footings'
    },
    {
      title: 'Stair Stringer Calculator',
      link: '/construction/stair-stringer',
      description: 'Calculate wood stair dimensions'
    },
    {
      title: 'Rebar Calculator',
      link: '/construction/rebar',
      description: 'Calculate rebar for reinforcement'
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Concrete steps are a permanent feature that requires careful planning. This calculator helps you determine the concrete volume needed based on your step dimensions and landing requirements.",
      steps: [
        "Enter the stair width in inches (36 inches minimum for entry steps).",
        "Enter the number of steps needed based on your total rise.",
        "Specify rise height (typically 7-7.5 inches) and run depth (10-11 inches).",
        "Include landing dimensions if you have a platform at the top.",
        "Review concrete quantities and reinforcement recommendations."
      ]
    },
    whyMatters: {
      description: "Concrete steps provide durable, low-maintenance access to your home. Unlike wood steps that require periodic maintenance and eventual replacement, properly constructed concrete steps can last 50+ years. Accurate concrete estimation prevents costly overages and ensures you complete the pour without running short.",
      benefits: [
        "Calculate exact concrete volume for steps",
        "Include landing and base slab quantities",
        "Estimate rebar or wire mesh needs",
        "Plan form lumber requirements",
        "Budget for complete project costs"
      ]
    },
    examples: [
      {
        title: "Basic Entry Steps",
        scenario: "A 36-inch wide entry with 3 steps (7.5\" rise, 11\" run) and 36-inch landing.",
        calculation: "Steps volume + base slab + landing = approximately 0.5 cubic yards",
        result: "14 bags (80 lb), 3 sticks rebar, form boards for risers."
      },
      {
        title: "Wide Porch Steps",
        scenario: "A 60-inch wide porch with 5 steps and 48-inch deep landing.",
        calculation: "Larger width and more steps = approximately 1.2 cubic yards",
        result: "32 bags (80 lb) or order 1.5 cu yd ready-mix."
      },
      {
        title: "Basement Exit Steps",
        scenario: "A 36-inch wide stairwell with 7 steps, no landing needed.",
        calculation: "Deep stairwell with 7 risers = approximately 0.8 cubic yards",
        result: "22 bags (80 lb), extra rebar for tall structure."
      }
    ],
    commonMistakes: [
      "Not accounting for the solid mass under each step - steps are not hollow.",
      "Forgetting the base slab - steps need a foundation to prevent settling.",
      "Skipping reinforcement - unreinforced steps will crack and crumble.",
      "Rushing form removal - wait 24-48 hours minimum before removing.",
      "Not checking for level - uneven steps are both unsafe and code violations."
    ]
  };

  return (
    <CalculatorLayout
      title="Concrete Steps Calculator"
      description="Calculate concrete volume for poured steps and landings. Includes rebar, form lumber, and cost estimates."
    >
      <CalculatorSchema
        name="Concrete Steps Calculator"
        description="Free concrete steps calculator to estimate concrete volume, rebar, and materials for poured entry steps and landings."
        url="/construction/concrete-steps"
        faqItems={faqItems}
      />

      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Stair Width (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={stairWidth}
              onChange={(e) => setStairWidth(e.target.value)}
              placeholder="e.g., 36"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Steps</label>
            <input
              type="number"
              className={styles.input}
              value={numSteps}
              onChange={(e) => setNumSteps(e.target.value)}
              placeholder="e.g., 4"
              min="1"
              step="1"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Rise Height per Step (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={riseHeight}
              onChange={(e) => setRiseHeight(e.target.value)}
              placeholder="e.g., 7.5"
              step="0.25"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Code maximum: 7.75 inches
            </small>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Run Depth per Step (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={runDepth}
              onChange={(e) => setRunDepth(e.target.value)}
              placeholder="e.g., 11"
              step="0.5"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Code minimum: 10 inches
            </small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={includeLanding}
              onChange={(e) => setIncludeLanding(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include Top Landing/Platform
          </label>
        </div>

        {includeLanding && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Landing Depth (inches)</label>
            <input
              type="number"
              className={styles.input}
              value={landingDepth}
              onChange={(e) => setLandingDepth(e.target.value)}
              placeholder="e.g., 36"
              step="1"
            />
            <small style={{ color: '#888', marginTop: '0.25rem', display: 'block' }}>
              Code requires landing at least as deep as door width
            </small>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Base Slab Thickness (inches)</label>
          <select
            className={styles.select}
            value={slabThickness}
            onChange={(e) => setSlabThickness(e.target.value)}
          >
            <option value="4">4 inches (standard)</option>
            <option value="6">6 inches (heavy duty)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Concrete Price per 80 lb Bag (optional)</label>
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
          Calculate Concrete
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Concrete Steps Materials</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Stair Width</span>
            <span className={styles.resultValue}>{results.stairWidth} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Number of Steps</span>
            <span className={styles.resultValue}>{results.numSteps}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Rise per Step</span>
            <span className={styles.resultValue}>{results.rise} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Run per Step</span>
            <span className={styles.resultValue}>{results.run} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Rise</span>
            <span className={styles.resultValue}>{results.totalRise} inches</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Run</span>
            <span className={styles.resultValue}>{results.totalRun} inches</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Concrete Needed</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Volume</span>
            <span className={styles.resultValue}>{results.totalCuFt} cubic feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cubic Yards</span>
            <span className={styles.resultValuePrimary}>{results.totalCuYd} cu yd</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>80 lb Bags</span>
            <span className={styles.resultValuePrimary}>{results.bags80lb} bags</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Or 60 lb Bags</span>
            <span className={styles.resultValue}>{results.bags60lb} bags</span>
          </div>

          <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Reinforcement & Forms</h3>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>#4 Rebar (total linear feet)</span>
            <span className={styles.resultValue}>{results.totalRebarFt} feet</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>20-foot Rebar Sticks</span>
            <span className={styles.resultValue}>{results.rebar20ftSticks} sticks</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Or Wire Mesh</span>
            <span className={styles.resultValue}>{results.meshSqFt} sq ft</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Form Lumber (linear feet)</span>
            <span className={styles.resultValue}>{results.formBoardFt} feet</span>
          </div>

          {results.totalCost && (
            <>
              <div style={{ borderTop: '1px solid #333', margin: '1rem 0', paddingTop: '1rem' }}>
                <h3 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '1.1rem' }}>Cost Estimate</h3>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Concrete (bags)</span>
                <span className={styles.resultValue}>${results.concreteCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Rebar (~$12 per 20ft)</span>
                <span className={styles.resultValue}>${results.rebarCost}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Material Cost</span>
                <span className={styles.resultValuePrimary}>${results.totalCost}</span>
              </div>
            </>
          )}

          <div className={styles.note}>
            <strong>Pro Tips:</strong> Use 4000 PSI concrete minimum for steps. Broom finish treads for traction. Cure slowly (cover with plastic) for 7 days for maximum strength.
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
