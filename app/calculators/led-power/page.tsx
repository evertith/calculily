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

export default function LEDPowerCalculator() {
  const [numLEDs, setNumLEDs] = useState<string>('');
  const [wattsPerLED, setWattsPerLED] = useState<string>('0.3');
  const [usageFactor, setUsageFactor] = useState<number>(80);
  const [voltage, setVoltage] = useState<string>('5');
  const [result, setResult] = useState<{
    totalWatts: number;
    amps: number;
    recommendedPowerSupply: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const faqItems = [
    {
      question: "How many watts does each LED pixel actually use?",
      answer: "It depends on the LED type. WS2812B (NeoPixels) typically use 0.3W per pixel at full white brightness (all three RGB channels at maximum). SK6812 LEDs are similar. However, most LED installations don't run at full brightness constantly, which is why the usage factor is important. Single-color LEDs use significantly less, around 0.05-0.08W per LED."
    },
    {
      question: "What should I set the usage factor to?",
      answer: "For typical installations, 60-80% is realistic. If you're displaying mostly dim colors or animations (not full white), use 60-70%. For bright, colorful displays with lots of white, use 80%. Only use 100% if you need absolute worst-case planning for safety-critical applications. Most decorative LED projects never exceed 70% average power draw."
    },
    {
      question: "Why does the calculator recommend 20% extra power supply capacity?",
      answer: "The 20% overhead serves several purposes: 1) Power supplies are most efficient and run cooler at 80% load, 2) It provides safety margin for unexpected peak draws, 3) It extends power supply lifespan, and 4) It prevents voltage sag during high current demands. Never run a power supply at its maximum rating continuously."
    },
    {
      question: "Can I use a higher voltage to reduce current draw?",
      answer: "Yes, and it's often recommended for longer LED runs. Using 12V instead of 5V reduces current by 60%, and 24V reduces it by 80%. This means you can use thinner wire and have less voltage drop over distance. However, make sure your LED strips are rated for the voltage you choose - you cannot use 12V power with 5V LEDs."
    }
  ];

  const relatedCalculators = [
    {
      title: "Voltage Drop Calculator",
      link: "/calculators/voltage-drop",
      description: "Calculate voltage drop for LED runs"
    },
    {
      title: "Wire Gauge Calculator",
      link: "/calculators/wire-gauge",
      description: "Size wire for LED power feeds"
    },
    {
      title: "Amp Draw Calculator",
      link: "/calculators/amp-draw",
      description: "Calculate total circuit amperage"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Size your power supply correctly for LED strip lighting projects:",
      steps: [
        "Enter the total length of LED strip you'll be using in feet or meters.",
        "Input the power consumption per unit length (typically listed as watts per foot or meter on the strip specs).",
        "Add a safety margin (20% is recommended for reliability and heat management).",
        "Click 'Calculate' to see the total wattage and recommended power supply size."
      ]
    },
    whyMatters: {
      description: "LED strips are popular for under-cabinet lighting, accent lighting, and decorative installations, but they require properly sized power supplies. An undersized power supply will run hot, dim the LEDs, shorten lifespan, and potentially fail dangerously. An oversized supply wastes money and space. The key is matching the power supply to actual needs with appropriate headroom for reliability and future expansion.",
      benefits: [
        "Prevent power supply overheating and premature failure",
        "Ensure LEDs operate at full brightness",
        "Extend lifespan of both LEDs and power supplies",
        "Calculate correct wire gauge for LED runs",
        "Plan multi-zone installations with proper power distribution"
      ]
    },
    examples: [
      {
        title: "Under Cabinet Lighting",
        scenario: "Installing 12 feet of LED strip rated at 4.4W per foot for kitchen cabinets.",
        calculation: "12 ft × 4.4W = 52.8W + 20% margin = 63.4W",
        result: "Use at least a 75W power supply (next common size up from 60W)."
      },
      {
        title: "Accent Lighting",
        scenario: "Running 5 meters of RGB LED strip (14.4W/m) around a room perimeter.",
        calculation: "5m × 14.4W = 72W + 20% = 86.4W",
        result: "Use a 100W power supply for comfortable headroom."
      },
      {
        title: "Long Run Consideration",
        scenario: "20 feet of high-density strip at 7W/ft. Single run or split feeds?",
        calculation: "20 ft × 7W = 140W. Voltage drop over 20ft could cause dimming.",
        result: "Consider feeding power from both ends or middle, or use 24V strips instead of 12V."
      }
    ],
    commonMistakes: [
      "Sizing power supply exactly to load with no margin - always add 20% for reliability.",
      "Ignoring voltage drop on long runs - LED strips dim noticeably over long distances, especially 12V.",
      "Using watts per meter specs with foot measurements (or vice versa) - double-check units.",
      "Forgetting that RGB and RGBW strips draw more power at full white than single colors.",
      "Not accounting for multiple zones when planning power supply capacity."
    ]
  };

  const calculateLEDPower = () => {
    const leds = parseFloat(numLEDs);
    const watts = parseFloat(wattsPerLED);
    const volts = parseFloat(voltage);

    if (!leds || !watts || !volts) return;

    const totalWatts = leds * watts * (usageFactor / 100);
    const amps = totalWatts / volts;
    const recommendedPowerSupply = Math.ceil(totalWatts * 1.2);

    setResult({ totalWatts, amps, recommendedPowerSupply });

    // Track calculator usage
    trackCalculatorUsage('LED Power Calculator', {
      num_leds: leds,
      watts_per_led: watts,
      usage_factor: usageFactor,
      voltage: volts,
      recommended_power_supply: recommendedPowerSupply
    });
  };

  return (
    <CalculatorLayout
      title="LED Power Calculator"
      description="Calculate power supply requirements for LED strip lighting. Enter strip length and wattage to size your power supply with proper safety margin."
    >
      <CalculatorSchema
        name="LED Power Calculator"
        description="Free LED power supply calculator for strip lighting. Calculate wattage requirements and proper power supply sizing for LED installations."
        url="/calculators/led-power"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateLEDPower(); }}>
        <div className={styles.formGroup}>
          <label htmlFor="numLEDs" className={styles.label}>
            Number of LEDs/Pixels
          </label>
          <input
            id="numLEDs"
            type="number"
            className={styles.input}
            value={numLEDs}
            onChange={(e) => setNumLEDs(e.target.value)}
            placeholder="Enter number of LEDs"
            step="1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="wattsPerLED" className={styles.label}>
            Watts per LED
          </label>
          <input
            id="wattsPerLED"
            type="number"
            className={styles.input}
            value={wattsPerLED}
            onChange={(e) => setWattsPerLED(e.target.value)}
            placeholder="Typical: 0.3W for WS2812B"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="voltage" className={styles.label}>
            Voltage
          </label>
          <select
            id="voltage"
            className={styles.select}
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
          >
            <option value="5">5V</option>
            <option value="12">12V</option>
            <option value="24">24V</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="usageFactor" className={styles.label}>
            Usage Factor: {usageFactor}%
          </label>
          <input
            id="usageFactor"
            type="range"
            className={styles.input}
            value={usageFactor}
            onChange={(e) => setUsageFactor(parseInt(e.target.value))}
            min="0"
            max="100"
            step="5"
            style={{ cursor: 'pointer' }}
          />
          <small style={{ color: '#808080', fontSize: '0.85rem' }}>
            Typical usage: 80% (not all LEDs at full brightness all the time)
          </small>
        </div>

        <button type="submit" className={styles.button}>
          Calculate Power Requirements
        </button>
      </form>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Watts Required</span>
            <span className={styles.resultValuePrimary}>{result.totalWatts.toFixed(1)}W</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Amperage Draw</span>
            <span className={styles.resultValue}>{result.amps.toFixed(2)}A</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Recommended Power Supply</span>
            <span className={styles.resultValue}>{result.recommendedPowerSupply}W</span>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> The recommended power supply includes 20% overhead for safety and longevity. Always use a power supply rated for at least this wattage.
          </div>
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('electrical', 3)}
        calculatorName="LED Power Calculator"
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
