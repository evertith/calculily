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

export default function OutletSpacingCalculator() {
  const { trackCalculatorUsage } = useAnalytics();

  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomType, setRoomType] = useState('living');
  const [doorways, setDoorways] = useState('1');
  const [windowCount, setWindowCount] = useState('2');
  const [result, setResult] = useState<{
    minimumOutlets: number;
    recommendedOutlets: number;
    wallSpacing: string;
    kitchenCountertopOutlets: number;
    bathroomOutlets: number;
    perimeter: number;
    usableWallSpace: number;
    specialRequirements: string[];
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    const doors = parseInt(doorways);
    const windows = parseInt(windowCount);

    if (isNaN(length) || length <= 0 || isNaN(width) || width <= 0) {
      setError('Please enter valid room dimensions');
      setResult(null);
      return;
    }

    // Calculate perimeter
    const perimeter = 2 * (length + width);

    // Subtract non-usable wall space (3ft per door, 3ft per window average)
    const doorSpace = doors * 3;
    const windowSpace = windows * 3;
    const usableWallSpace = perimeter - doorSpace - windowSpace;

    // NEC 210.52(A) - No point along wall should be more than 6ft from outlet
    // This means outlets every 12ft maximum along usable wall
    // Any wall section 2ft or longer needs to be counted
    const minimumOutlets = Math.ceil(usableWallSpace / 12);

    let recommendedOutlets = minimumOutlets;
    let kitchenCountertopOutlets = 0;
    let bathroomOutlets = 0;
    const specialRequirements: string[] = [];

    switch (roomType) {
      case 'kitchen':
        // Kitchen countertop: outlet within 24" of any point (outlets every 48")
        // Assume 50% of perimeter is countertop
        const countertopLength = perimeter * 0.4;
        kitchenCountertopOutlets = Math.ceil(countertopLength / 4);
        recommendedOutlets = minimumOutlets + kitchenCountertopOutlets;
        specialRequirements.push('• Countertop outlets must be GFCI protected');
        specialRequirements.push('• Two 20-amp small appliance circuits required');
        specialRequirements.push('• Island/peninsula needs outlet if ≥24" × 12"');
        specialRequirements.push('• No outlet more than 24" from countertop edge');
        break;
      case 'bathroom':
        bathroomOutlets = Math.max(1, Math.ceil(usableWallSpace / 12));
        recommendedOutlets = bathroomOutlets;
        specialRequirements.push('• All bathroom outlets must be GFCI protected');
        specialRequirements.push('• At least one outlet within 36" of sink');
        specialRequirements.push('• Dedicated 20-amp circuit required');
        specialRequirements.push('• No outlets in shower/tub zone');
        break;
      case 'bedroom':
        recommendedOutlets = Math.max(minimumOutlets, 4);
        specialRequirements.push('• AFCI protection required on all circuits');
        specialRequirements.push('• Consider outlets near bed locations');
        specialRequirements.push('• USB outlets recommended for nightstands');
        break;
      case 'living':
        recommendedOutlets = Math.max(minimumOutlets, Math.ceil(minimumOutlets * 1.5));
        specialRequirements.push('• AFCI protection required');
        specialRequirements.push('• Consider floor outlets for center seating');
        specialRequirements.push('• TV/entertainment areas need multiple outlets');
        break;
      case 'garage':
        recommendedOutlets = Math.max(minimumOutlets, Math.ceil(perimeter / 12));
        specialRequirements.push('• GFCI protection required for all outlets');
        specialRequirements.push('• One outlet per vehicle space minimum');
        specialRequirements.push('• Consider 240V outlet for EV charging');
        specialRequirements.push('• Ceiling outlet for garage door opener');
        break;
      case 'laundry':
        recommendedOutlets = Math.max(2, minimumOutlets);
        specialRequirements.push('• GFCI protection within 6ft of sink');
        specialRequirements.push('• 240V outlet for electric dryer');
        specialRequirements.push('• 20-amp circuit for washing machine');
        break;
      case 'outdoor':
        recommendedOutlets = Math.max(2, Math.ceil(perimeter / 20));
        specialRequirements.push('• All outdoor outlets must be GFCI protected');
        specialRequirements.push('• Weather-resistant covers required (WR rated)');
        specialRequirements.push('• Front and back of house each need outlet');
        specialRequirements.push('• Minimum one outlet per floor level');
        break;
    }

    // General requirements
    specialRequirements.push('• Outlets required on walls 2 feet or wider');
    specialRequirements.push('• No point along wall more than 6ft from outlet');

    setResult({
      minimumOutlets,
      recommendedOutlets,
      wallSpacing: `Every ${Math.floor(usableWallSpace / minimumOutlets)} feet`,
      kitchenCountertopOutlets,
      bathroomOutlets,
      perimeter,
      usableWallSpace,
      specialRequirements
    });
    setError('');
    trackCalculatorUsage('outlet-spacing');
  };

  const faqItems = [
    {
      question: 'What is the 6-foot rule for electrical outlets?',
      answer: 'The NEC 6-foot rule (210.52) requires that no point along a wall should be more than 6 feet from an electrical outlet. This effectively means outlets must be placed no more than 12 feet apart along any wall. The rule ensures that a standard 6-foot cord can reach an outlet from any location along a wall.'
    },
    {
      question: 'How many outlets does a kitchen need?',
      answer: 'Kitchens have special requirements: countertop outlets must be placed so no point is more than 24 inches from an outlet (meaning outlets every 4 feet along counters). Additionally, kitchens require two dedicated 20-amp small appliance circuits, GFCI protection for all countertop outlets, and outlets for islands/peninsulas that are at least 24" × 12".'
    },
    {
      question: 'Do bedrooms require AFCI protection?',
      answer: 'Yes, the NEC requires Arc-Fault Circuit Interrupter (AFCI) protection for all 120V, 15 and 20-amp outlets in bedrooms, living rooms, dining rooms, family rooms, libraries, dens, closets, hallways, and similar rooms. AFCI breakers detect dangerous electrical arcs that could cause fires.'
    },
    {
      question: 'What is the difference between GFCI and AFCI?',
      answer: 'GFCI (Ground-Fault Circuit Interrupter) protects against electrical shock by detecting current imbalances between hot and neutral wires, typically required in wet areas like bathrooms, kitchens, and outdoors. AFCI (Arc-Fault Circuit Interrupter) protects against fires by detecting dangerous electrical arcs in wiring, required in bedrooms and living spaces.'
    },
    {
      question: 'How high should outlets be mounted?',
      answer: 'Standard outlet height is 12-18 inches from the floor to the center of the outlet box. Kitchen countertop outlets should be 15-20 inches above the counter. Bathroom outlets are typically 44-48 inches high (above counter). Accessible design (ADA) recommends 15 inches minimum to 48 inches maximum.'
    }
  ];

  const relatedCalculators = [
    { title: 'Wire Size Calculator', link: '/construction/wire-size', description: 'Calculate wire gauge for circuits' },
    { title: 'Electrical Load Calculator', link: '/construction/electrical-load', description: 'Calculate electrical service requirements' },
    { title: 'BTU Calculator', link: '/construction/btu', description: 'Calculate heating and cooling BTU needs' }
  ];

  const contentData = {
    howToUse: {
      intro: "Plan electrical outlets to meet NEC code requirements:",
      steps: [
        "Enter room length and width in feet",
        "Select the room type for specific requirements",
        "Indicate number of doorways (3 feet each)",
        "Enter number of windows (3 feet average each)",
        "Review minimum and recommended outlet counts"
      ]
    },
    whyMatters: {
      description: "Proper outlet spacing is required by the National Electrical Code for safety. The 6-foot rule ensures appliances can reach an outlet without extension cords, reducing fire hazards. Different rooms have specific GFCI and AFCI requirements.",
      benefits: [
        "Calculate NEC-compliant minimum outlet count",
        "Get room-specific requirements (GFCI, AFCI)",
        "Plan for countertop outlets in kitchens",
        "Avoid code violations during inspection"
      ]
    },
    examples: [
      {
        title: "12×14 Living Room",
        scenario: "2 doorways, 3 windows, standard room",
        calculation: "52 ft perimeter - 15 ft (doors/windows) = 37 ft usable",
        result: "4 outlets minimum, 6 recommended (AFCI required)"
      },
      {
        title: "10×12 Kitchen",
        scenario: "8 feet of countertop, 1 doorway",
        calculation: "Countertop: 8 ÷ 4 = 2 outlets (24 inch rule)",
        result: "2 countertop (GFCI), plus wall outlets, 2 dedicated circuits"
      }
    ],
    commonMistakes: [
      "Forgetting walls 2 feet or wider need outlet access",
      "Not accounting for furniture blocking outlets",
      "Placing outlets too close to corners",
      "Missing GFCI in wet areas (within 6 feet of water)",
      "Forgetting outdoor and garage outlet requirements"
    ]
  };

  return (
    <CalculatorLayout
      title="Outlet Spacing Calculator"
      description="Calculate required electrical outlet spacing and count for any room based on NEC code requirements. Includes GFCI, AFCI, and room-specific regulations."
    >
      <CalculatorSchema
        name="Outlet Spacing Calculator"
        description="Calculate electrical outlet requirements based on NEC code for different room types including GFCI and AFCI requirements"
        url="/construction/outlet-spacing"
        datePublished="2025-01-15"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.calculator}>
        <div className={styles.inputGroup}>
          <label htmlFor="roomLength">Room Length (feet)</label>
          <input
            type="number"
            id="roomLength"
            value={roomLength}
            onChange={(e) => setRoomLength(e.target.value)}
            placeholder="e.g., 14"
            min="1"
            step="0.5"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="roomWidth">Room Width (feet)</label>
          <input
            type="number"
            id="roomWidth"
            value={roomWidth}
            onChange={(e) => setRoomWidth(e.target.value)}
            placeholder="e.g., 12"
            min="1"
            step="0.5"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="roomType">Room Type</label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="living">Living Room / Family Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="kitchen">Kitchen</option>
            <option value="bathroom">Bathroom</option>
            <option value="garage">Garage</option>
            <option value="laundry">Laundry Room</option>
            <option value="outdoor">Outdoor / Patio</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="doorways">Number of Doorways</label>
          <select
            id="doorways"
            value={doorways}
            onChange={(e) => setDoorways(e.target.value)}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="windowCount">Number of Windows</label>
          <select
            id="windowCount"
            value={windowCount}
            onChange={(e) => setWindowCount(e.target.value)}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6+</option>
          </select>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={calculate} className={styles.calculateBtn}>
          Calculate Outlets
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Outlet Requirements</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Minimum Outlets (Code):</span>
                <span className={styles.resultValue}>{result.minimumOutlets}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Recommended Outlets:</span>
                <span className={styles.resultValue}>{result.recommendedOutlets}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Outlet Spacing:</span>
                <span className={styles.resultValue}>{result.wallSpacing}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Room Perimeter:</span>
                <span className={styles.resultValue}>{result.perimeter.toFixed(1)} ft</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Usable Wall Space:</span>
                <span className={styles.resultValue}>{result.usableWallSpace.toFixed(1)} ft</span>
              </div>
              {result.kitchenCountertopOutlets > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Countertop Outlets:</span>
                  <span className={styles.resultValue}>{result.kitchenCountertopOutlets}</span>
                </div>
              )}
            </div>

            <h4 style={{ marginTop: '1rem', color: '#e0e0e0' }}>Code Requirements</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.9rem' }}>
              {result.specialRequirements.map((req, index) => (
                <li key={index} style={{ padding: '0.25rem 0', color: '#b0b0b0' }}>
                  {req}
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
