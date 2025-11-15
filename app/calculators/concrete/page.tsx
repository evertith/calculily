'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import styles from '@/styles/Calculator.module.css';

type ShapeType = 'slab' | 'footing' | 'column' | 'stairs';

export default function ConcreteCalculator() {
  const [shape, setShape] = useState<ShapeType>('slab');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [thicknessUnit, setThicknessUnit] = useState<'feet' | 'inches'>('inches');
  const [diameter, setDiameter] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [numSteps, setNumSteps] = useState<string>('');
  const [riseHeight, setRiseHeight] = useState<string>('');
  const [runDepth, setRunDepth] = useState<string>('');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [pricePerYard, setPricePerYard] = useState<string>('150');
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculateSlab = (l: number, w: number, t: number, unit: string) => {
    const thicknessFeet = unit === 'inches' ? t / 12 : t;
    const cubicFeet = l * w * thicknessFeet;
    return cubicFeet / 27;
  };

  const calculateFooting = (l: number, w: number, d: number) => {
    const cubicFeet = l * w * d;
    return cubicFeet / 27;
  };

  const calculateColumn = (d: number, h: number, q: number) => {
    const radius = d / 2;
    const area = Math.PI * Math.pow(radius, 2);
    const volumePerColumn = area * h;
    const totalCubicFeet = volumePerColumn * q;
    return totalCubicFeet / 27;
  };

  const calculateStairs = (w: number, rise: number, run: number, steps: number) => {
    let totalVolume = 0;
    for (let i = 1; i <= steps; i++) {
      const stepHeight = rise * i;
      const stepVolume = w * run * stepHeight;
      totalVolume += stepVolume;
    }
    return totalVolume / 27;
  };

  const calculateBagsNeeded = (cubicYards: number, bagSize: number) => {
    const cubicFeetPerBag: { [key: number]: number } = {
      40: 0.3,
      60: 0.45,
      80: 0.6
    };
    const cubicFeet = cubicYards * 27;
    return Math.ceil(cubicFeet / cubicFeetPerBag[bagSize]);
  };

  const handleCalculate = () => {
    const newErrors: string[] = [];

    // Validate inputs based on shape
    if (shape === 'slab' || shape === 'footing') {
      if (!length || parseFloat(length) <= 0) newErrors.push('Please enter a valid length');
      if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid width');
      if (!thickness || parseFloat(thickness) <= 0) newErrors.push('Please enter a valid thickness/depth');
    } else if (shape === 'column') {
      if (!diameter || parseFloat(diameter) <= 0) newErrors.push('Please enter a valid diameter');
      if (!height || parseFloat(height) <= 0) newErrors.push('Please enter a valid height');
      if (!quantity || parseFloat(quantity) <= 0) newErrors.push('Please enter a valid quantity');
    } else if (shape === 'stairs') {
      if (!width || parseFloat(width) <= 0) newErrors.push('Please enter a valid width');
      if (!riseHeight || parseFloat(riseHeight) <= 0) newErrors.push('Please enter a valid rise height');
      if (!runDepth || parseFloat(runDepth) <= 0) newErrors.push('Please enter a valid run depth');
      if (!numSteps || parseFloat(numSteps) <= 0) newErrors.push('Please enter a valid number of steps');
    }

    if (!wasteFactor || parseFloat(wasteFactor) < 0) newErrors.push('Please enter a valid waste factor');
    if (!pricePerYard || parseFloat(pricePerYard) < 0) newErrors.push('Please enter a valid price');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    setErrors([]);

    let cubicYards = 0;

    if (shape === 'slab') {
      cubicYards = calculateSlab(
        parseFloat(length),
        parseFloat(width),
        parseFloat(thickness),
        thicknessUnit
      );
    } else if (shape === 'footing') {
      cubicYards = calculateFooting(
        parseFloat(length),
        parseFloat(width),
        parseFloat(thickness)
      );
    } else if (shape === 'column') {
      cubicYards = calculateColumn(
        parseFloat(diameter),
        parseFloat(height),
        parseFloat(quantity)
      );
    } else if (shape === 'stairs') {
      cubicYards = calculateStairs(
        parseFloat(width),
        parseFloat(riseHeight),
        parseFloat(runDepth),
        parseFloat(numSteps)
      );
    }

    const waste = parseFloat(wasteFactor);
    const cubicYardsWithWaste = cubicYards * (1 + waste / 100);
    const cost = cubicYardsWithWaste * parseFloat(pricePerYard);
    const bags80lb = calculateBagsNeeded(cubicYardsWithWaste, 80);
    const truckLoads = cubicYardsWithWaste > 10 ? Math.ceil(cubicYardsWithWaste / 10) : 0;

    setResults({
      cubicYards: cubicYards.toFixed(2),
      cubicYardsWithWaste: cubicYardsWithWaste.toFixed(2),
      cost: cost.toFixed(2),
      bags80lb,
      truckLoads,
      wasteFactor: waste
    });
  };

  const faqItems = [
    {
      question: 'How do I calculate cubic yards of concrete?',
      answer: 'Multiply length × width × thickness (in feet) to get cubic feet, then divide by 27 to get cubic yards. For example, a 10ft × 10ft slab that is 4 inches thick: 10 × 10 × 0.33 = 33 cubic feet ÷ 27 = 1.22 cubic yards.'
    },
    {
      question: 'What is a typical waste factor for concrete?',
      answer: '10% is standard for most projects. This accounts for spillage, uneven subgrade, and measurement variations. For complex shapes or inexperienced crews, use 15-20%.'
    },
    {
      question: 'How many 80lb bags equal a cubic yard?',
      answer: 'Approximately 45 bags of 80lb concrete mix equal one cubic yard. However, for projects over 1-2 cubic yards, it\'s more economical to order ready-mix concrete delivery.'
    },
    {
      question: 'What thickness should a concrete slab be?',
      answer: 'Standard residential slabs are 4 inches thick. Garage floors and driveways should be 6 inches. Heavy equipment areas need 8+ inches. Always check local building codes for requirements.'
    }
  ];

  const relatedCalculators = [
    {
      title: 'Fence Calculator',
      link: '/calculators/fence',
      description: 'Calculate fence materials and concrete for posts'
    },
    {
      title: 'Deck Calculator',
      link: '/calculators/deck',
      description: 'Estimate decking and framing materials'
    },
    {
      title: 'Drywall Calculator',
      link: '/calculators/drywall',
      description: 'Calculate drywall sheets needed'
    }
  ];

  return (
    <CalculatorLayout
      title="Concrete Calculator"
      description="Calculate cubic yards of concrete needed for slabs, footings, columns, and stairs"
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Shape Type</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.buttonOption} ${shape === 'slab' ? styles.buttonOptionActive : ''}`}
              onClick={() => setShape('slab')}
            >
              Slab
            </button>
            <button
              className={`${styles.buttonOption} ${shape === 'footing' ? styles.buttonOptionActive : ''}`}
              onClick={() => setShape('footing')}
            >
              Footing
            </button>
            <button
              className={`${styles.buttonOption} ${shape === 'column' ? styles.buttonOptionActive : ''}`}
              onClick={() => setShape('column')}
            >
              Column
            </button>
            <button
              className={`${styles.buttonOption} ${shape === 'stairs' ? styles.buttonOptionActive : ''}`}
              onClick={() => setShape('stairs')}
            >
              Stairs
            </button>
          </div>
        </div>

        {(shape === 'slab' || shape === 'footing') && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Length (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 10"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Width (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g., 10"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                {shape === 'slab' ? 'Thickness' : 'Depth'}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  className={styles.input}
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  placeholder={shape === 'slab' ? 'e.g., 4' : 'e.g., 1'}
                  step="0.1"
                  style={{ flex: 1 }}
                />
                <select
                  className={styles.select}
                  value={thicknessUnit}
                  onChange={(e) => setThicknessUnit(e.target.value as 'feet' | 'inches')}
                  style={{ flex: '0 0 auto', width: '120px' }}
                >
                  <option value="inches">Inches</option>
                  <option value="feet">Feet</option>
                </select>
              </div>
            </div>
          </>
        )}

        {shape === 'column' && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Diameter (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                placeholder="e.g., 0.5"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Height (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 4"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Number of Posts</label>
              <input
                type="number"
                className={styles.input}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 6"
                step="1"
              />
            </div>
          </>
        )}

        {shape === 'stairs' && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Width (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g., 4"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Rise Height per Step (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={riseHeight}
                onChange={(e) => setRiseHeight(e.target.value)}
                placeholder="e.g., 0.58"
                step="0.01"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Run Depth per Step (feet)</label>
              <input
                type="number"
                className={styles.input}
                value={runDepth}
                onChange={(e) => setRunDepth(e.target.value)}
                placeholder="e.g., 1"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Number of Steps</label>
              <input
                type="number"
                className={styles.input}
                value={numSteps}
                onChange={(e) => setNumSteps(e.target.value)}
                placeholder="e.g., 5"
                step="1"
              />
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Waste Factor (%)</label>
          <input
            type="number"
            className={styles.input}
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
            placeholder="e.g., 10"
            step="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price per Cubic Yard ($)</label>
          <input
            type="number"
            className={styles.input}
            value={pricePerYard}
            onChange={(e) => setPricePerYard(e.target.value)}
            placeholder="e.g., 150"
            step="1"
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
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e0e0e0' }}>Results</h2>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Concrete Needed (without waste)</span>
            <span className={styles.resultValue}>{results.cubicYards} yd³</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>
              Concrete with {results.wasteFactor}% Waste Factor
            </span>
            <span className={styles.resultValuePrimary}>{results.cubicYardsWithWaste} yd³</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Estimated Cost</span>
            <span className={styles.resultValue}>${results.cost}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>80lb Bags Needed</span>
            <span className={styles.resultValue}>{results.bags80lb} bags</span>
          </div>

          {results.truckLoads > 0 && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Truck Loads (approx.)</span>
              <span className={styles.resultValue}>{results.truckLoads} loads</span>
            </div>
          )}

          <div className={styles.note}>
            <strong>Note:</strong> For projects over 2 cubic yards, ordering ready-mix concrete is more economical than bags.
            One cubic yard = approximately {results.bags80lb} bags of 80lb concrete mix. Always order slightly more than calculated
            to account for variations in ground level and spillage.
          </div>

          {parseFloat(results.cubicYardsWithWaste) < 0.5 && (
            <div className={styles.note}>
              <strong>Small Project Tip:</strong> For this small amount, consider using pre-mixed bags. You'll need approximately {results.bags80lb}
              bags of 80lb concrete mix. Mix in a wheelbarrow or concrete mixer.
            </div>
          )}
        </div>
      )}

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
