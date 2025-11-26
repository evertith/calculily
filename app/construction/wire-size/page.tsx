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

export default function WireSizeCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [amperage, setAmperage] = useState('');
  const [distance, setDistance] = useState('');
  const [voltage, setVoltage] = useState('120');
  const [wireType, setWireType] = useState('copper');
  const [conduitType, setConduitType] = useState('romex');
  const [maxVoltageDrop, setMaxVoltageDrop] = useState('3');
  const [result, setResult] = useState<{
    recommendedSize: string;
    actualVoltageDrop: number;
    voltageDropPercent: number;
    wireResistance: number;
    minimumByAmpacity: string;
    minimumByVoltageDrop: string;
    costEstimate: string;
    notes: string[];
  } | null>(null);
  const [error, setError] = useState('');

  // Wire ampacity ratings (NEC Table 310.15) - 60°C column for typical residential
  const copperAmpacity: { [key: string]: number } = {
    '14': 15,
    '12': 20,
    '10': 30,
    '8': 40,
    '6': 55,
    '4': 70,
    '3': 85,
    '2': 95,
    '1': 110,
    '1/0': 125,
    '2/0': 145,
    '3/0': 165,
    '4/0': 195
  };

  const aluminumAmpacity: { [key: string]: number } = {
    '12': 15,
    '10': 25,
    '8': 30,
    '6': 40,
    '4': 55,
    '3': 65,
    '2': 75,
    '1': 85,
    '1/0': 100,
    '2/0': 115,
    '3/0': 130,
    '4/0': 150
  };

  // Resistance per 1000 feet (ohms)
  const copperResistance: { [key: string]: number } = {
    '14': 2.525,
    '12': 1.588,
    '10': 0.999,
    '8': 0.628,
    '6': 0.395,
    '4': 0.249,
    '3': 0.197,
    '2': 0.156,
    '1': 0.124,
    '1/0': 0.098,
    '2/0': 0.078,
    '3/0': 0.062,
    '4/0': 0.049
  };

  const aluminumResistance: { [key: string]: number } = {
    '12': 2.61,
    '10': 1.64,
    '8': 1.03,
    '6': 0.648,
    '4': 0.408,
    '3': 0.323,
    '2': 0.256,
    '1': 0.203,
    '1/0': 0.161,
    '2/0': 0.128,
    '3/0': 0.101,
    '4/0': 0.080
  };

  const wireSizes = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'];

  const calculate = () => {
    const amps = parseFloat(amperage);
    const dist = parseFloat(distance);
    const volts = parseFloat(voltage);
    const targetDrop = parseFloat(maxVoltageDrop);

    if (isNaN(amps) || amps <= 0) {
      setError('Please enter a valid amperage');
      setResult(null);
      return;
    }
    if (isNaN(dist) || dist <= 0) {
      setError('Please enter a valid one-way distance');
      setResult(null);
      return;
    }

    const ampacity = wireType === 'copper' ? copperAmpacity : aluminumAmpacity;
    const resistance = wireType === 'copper' ? copperResistance : aluminumResistance;

    // Find minimum wire by ampacity (with 80% derating for continuous loads)
    let minByAmpacity = '';
    for (const size of wireSizes) {
      if (ampacity[size] && ampacity[size] * 0.8 >= amps) {
        minByAmpacity = size;
        break;
      }
    }

    // Find minimum wire by voltage drop
    // VD = (2 × L × R × I) / 1000 for single phase
    // VD% = VD / V × 100
    let minByVoltageDrop = '';
    let actualDrop = 0;
    let actualDropPercent = 0;
    let wireRes = 0;

    for (const size of wireSizes) {
      if (!resistance[size]) continue;
      const vd = (2 * dist * resistance[size] * amps) / 1000;
      const vdPercent = (vd / volts) * 100;

      if (vdPercent <= targetDrop) {
        minByVoltageDrop = size;
        actualDrop = vd;
        actualDropPercent = vdPercent;
        wireRes = resistance[size];
        break;
      }
    }

    if (!minByAmpacity && !minByVoltageDrop) {
      setError('Load exceeds calculator capacity. Consult an electrician for loads over 195 amps.');
      setResult(null);
      return;
    }

    // Determine recommended size (larger of the two requirements)
    const ampacityIndex = wireSizes.indexOf(minByAmpacity);
    const voltageDropIndex = wireSizes.indexOf(minByVoltageDrop);

    let recommendedIndex: number;
    if (ampacityIndex === -1) recommendedIndex = voltageDropIndex;
    else if (voltageDropIndex === -1) recommendedIndex = ampacityIndex;
    else recommendedIndex = Math.max(ampacityIndex, voltageDropIndex);

    const recommendedSize = wireSizes[recommendedIndex] || '4/0';

    // Recalculate voltage drop for recommended size
    const finalRes = resistance[recommendedSize] || 0.049;
    const finalDrop = (2 * dist * finalRes * amps) / 1000;
    const finalDropPercent = (finalDrop / volts) * 100;

    // Cost estimate (rough per foot pricing)
    const copperPrices: { [key: string]: number } = {
      '14': 0.15, '12': 0.20, '10': 0.35, '8': 0.55, '6': 0.85,
      '4': 1.25, '3': 1.50, '2': 1.85, '1': 2.50, '1/0': 3.00,
      '2/0': 3.75, '3/0': 4.50, '4/0': 5.50
    };
    const aluminumPrices: { [key: string]: number } = {
      '12': 0.12, '10': 0.18, '8': 0.28, '6': 0.42, '4': 0.60,
      '3': 0.75, '2': 0.90, '1': 1.20, '1/0': 1.50, '2/0': 1.85,
      '3/0': 2.25, '4/0': 2.75
    };
    const prices = wireType === 'copper' ? copperPrices : aluminumPrices;
    const pricePerFoot = prices[recommendedSize] || 1;
    const totalCost = pricePerFoot * dist * 2; // Round trip

    const notes: string[] = [];

    if (conduitType === 'romex') {
      notes.push('NM-B (Romex) limited to 14-6 AWG for residential');
    }
    if (wireType === 'aluminum') {
      notes.push('Aluminum requires anti-oxidant compound and proper connectors');
      notes.push('Increase aluminum wire two sizes vs copper for same ampacity');
    }
    if (volts === 240) {
      notes.push('240V circuits have lower voltage drop for same amperage');
    }
    if (finalDropPercent > 3 && finalDropPercent <= 5) {
      notes.push('3-5% voltage drop acceptable for branch circuits');
    }
    if (recommendedIndex > ampacityIndex) {
      notes.push('Wire size increased due to voltage drop requirements');
    }

    setResult({
      recommendedSize: `${recommendedSize} AWG`,
      actualVoltageDrop: finalDrop,
      voltageDropPercent: finalDropPercent,
      wireResistance: finalRes,
      minimumByAmpacity: minByAmpacity ? `${minByAmpacity} AWG` : 'Exceeds range',
      minimumByVoltageDrop: minByVoltageDrop ? `${minByVoltageDrop} AWG` : 'Exceeds range',
      costEstimate: `$${totalCost.toFixed(2)} (${dist * 2} ft total)`,
      notes
    });
    setError('');
    trackCalculatorUsage('wire-size');
  };

  const faqItems = [
    {
      question: 'What is voltage drop and why does it matter?',
      answer: 'Voltage drop is the reduction in voltage as electricity travels through wire due to resistance. The NEC recommends keeping voltage drop below 3% for branch circuits and 5% total for feeders plus branch circuits. Excessive voltage drop causes lights to dim, motors to run hot, and appliances to malfunction or fail prematurely.'
    },
    {
      question: 'When should I use aluminum wire instead of copper?',
      answer: 'Aluminum wire is primarily used for larger service entrance cables (4/0, 2/0) and long feeder runs where cost savings are significant. For the same ampacity, aluminum wire must be two sizes larger than copper. Aluminum also requires special anti-oxidant compound and AL-rated connections. For branch circuits under 40 amps, copper is typically preferred.'
    },
    {
      question: 'What size wire do I need for a 200-amp service?',
      answer: 'A 200-amp residential service typically requires 4/0 AWG aluminum (most common) or 2/0 AWG copper for the service entrance conductors. The neutral is often one size smaller. Always verify with local codes and your utility company, as requirements can vary.'
    },
    {
      question: 'How do I calculate wire size for a subpanel?',
      answer: 'For a subpanel, consider both the amperage rating and the distance. A 100-amp subpanel 50 feet away needs 1 AWG copper or 2/0 aluminum minimum by ampacity. However, at longer distances, you may need to upsize for voltage drop. For a 100-amp panel 150 feet away, you might need 2/0 copper to keep voltage drop under 3%.'
    },
    {
      question: 'What is the difference between wire gauge and wire size?',
      answer: 'Wire gauge (AWG - American Wire Gauge) is the sizing standard for electrical wire. Smaller AWG numbers indicate larger wire: 14 AWG is smaller than 10 AWG. For very large wires, sizes go to 1, then 1/0, 2/0, 3/0, 4/0 (also written as 0, 00, 000, 0000). 4/0 is approximately 0.46 inches in diameter.'
    }
  ];

  const relatedCalculators = [
    { title: 'Electrical Load Calculator', link: '/construction/electrical-load', description: 'Calculate electrical service requirements' },
    { title: 'Outlet Spacing Calculator', link: '/construction/outlet-spacing', description: 'Calculate NEC outlet requirements' },
    { title: 'BTU Calculator', link: '/construction/btu', description: 'Calculate heating and cooling BTU needs' }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate proper wire size for electrical circuits:",
      steps: [
        "Enter the circuit amperage (breaker size or load current)",
        "Enter the one-way wire distance in feet from panel to load",
        "Select voltage (120V standard, 240V for heavy appliances)",
        "Choose wire material (copper or aluminum)",
        "Select acceptable voltage drop percentage (3% recommended)"
      ]
    },
    whyMatters: {
      description: "Wire sizing affects both safety and performance. Undersized wire overheats, creating fire hazards. Wire adequate for ampacity but undersized for distance causes voltage drop, making motors struggle and lights dim.",
      benefits: [
        "Size wire for both ampacity and voltage drop",
        "Compare copper vs aluminum options",
        "Ensure NEC code compliance",
        "Estimate wire cost for your run"
      ]
    },
    examples: [
      {
        title: "20-Amp Kitchen Circuit",
        scenario: "60 feet from panel, 120V copper wire",
        calculation: "By ampacity: 12 AWG. Voltage drop: 3.2% (exceeds 3%)",
        result: "10 AWG recommended for optimal performance"
      },
      {
        title: "100-Amp Subpanel Feed",
        scenario: "150 feet, 240V aluminum wire",
        calculation: "By ampacity: 1 AWG. By voltage drop: 2/0 needed",
        result: "2/0 aluminum to stay under 3% drop"
      }
    ],
    commonMistakes: [
      "Using only ampacity tables and ignoring voltage drop for long runs",
      "Forgetting wire distance is round-trip (already calculated)",
      "Confusing circuit breaker size with actual load",
      "Using copper ampacity values for aluminum wire",
      "Forgetting 80% derating for continuous loads (3+ hours)"
    ]
  };

  return (
    <CalculatorLayout
      title="Wire Size Calculator"
      description="Calculate the correct electrical wire gauge for your circuit based on amperage, distance, and voltage drop requirements. NEC compliant sizing for copper and aluminum wire."
    >
      <CalculatorSchema
        name="Wire Size Calculator"
        description="Calculate proper electrical wire gauge based on amperage, distance, and voltage drop for copper and aluminum conductors"
        url="/construction/wire-size"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="amperage">Circuit Amperage</label>
          <input
            type="number"
            id="amperage"
            value={amperage}
            onChange={(e) => setAmperage(e.target.value)}
            placeholder="e.g., 20"
            min="1"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="distance">One-Way Distance (feet)</label>
          <input
            type="number"
            id="distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g., 75"
            min="1"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="voltage">Voltage</label>
          <select
            id="voltage"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
          >
            <option value="120">120V (Standard)</option>
            <option value="240">240V (Heavy Appliances)</option>
            <option value="208">208V (Commercial)</option>
            <option value="277">277V (Commercial Lighting)</option>
            <option value="480">480V (Industrial)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="wireType">Wire Material</label>
          <select
            id="wireType"
            value={wireType}
            onChange={(e) => setWireType(e.target.value)}
          >
            <option value="copper">Copper</option>
            <option value="aluminum">Aluminum</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="conduitType">Wiring Method</label>
          <select
            id="conduitType"
            value={conduitType}
            onChange={(e) => setConduitType(e.target.value)}
          >
            <option value="romex">NM-B (Romex)</option>
            <option value="thhn">THHN in Conduit</option>
            <option value="uf">UF (Underground)</option>
            <option value="ser">SER Cable</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="maxVoltageDrop">Max Voltage Drop (%)</label>
          <select
            id="maxVoltageDrop"
            value={maxVoltageDrop}
            onChange={(e) => setMaxVoltageDrop(e.target.value)}
          >
            <option value="2">2% (Sensitive Electronics)</option>
            <option value="3">3% (NEC Recommended)</option>
            <option value="5">5% (NEC Maximum)</option>
          </select>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Wire Size
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Recommended Wire Size</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Recommended Size:</span>
                <span className={styles.resultValue} style={{ color: '#4a9eff', fontSize: '1.25rem' }}>{result.recommendedSize}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Voltage Drop:</span>
                <span className={styles.resultValue}>{result.actualVoltageDrop.toFixed(2)}V ({result.voltageDropPercent.toFixed(2)}%)</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Min by Ampacity:</span>
                <span className={styles.resultValue}>{result.minimumByAmpacity}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Min by Voltage Drop:</span>
                <span className={styles.resultValue}>{result.minimumByVoltageDrop}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Estimated Cost:</span>
                <span className={styles.resultValue}>{result.costEstimate}</span>
              </div>
            </div>

            {result.notes.length > 0 && (
              <>
                <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Notes</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  {result.notes.map((note, index) => (
                    <li key={index} style={{ padding: '0.25rem 0', color: '#b0b0b0' }}>
                      • {note}
                    </li>
                  ))}
                </ul>
              </>
            )}
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
