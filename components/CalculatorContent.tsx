import styles from '@/styles/CalculatorContent.module.css';

interface Example {
  title: string;
  scenario: string;
  calculation: string;
  result: string;
}

interface CalculatorContentProps {
  howToUse: {
    intro?: string;
    steps: string[];
  };
  whyMatters: {
    description: string;
    benefits?: string[];
  };
  examples: Example[];
  commonMistakes?: string[];
}

export default function CalculatorContent({
  howToUse,
  whyMatters,
  examples,
  commonMistakes
}: CalculatorContentProps) {
  return (
    <div className={styles.contentContainer}>
      {/* How to Use Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How to Use This Calculator</h2>
        {howToUse.intro && <p className={styles.intro}>{howToUse.intro}</p>}
        <ol className={styles.stepsList}>
          {howToUse.steps.map((step, index) => (
            <li key={index} className={styles.step}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Why This Matters Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why This Matters</h2>
        <p className={styles.description}>{whyMatters.description}</p>
        {whyMatters.benefits && whyMatters.benefits.length > 0 && (
          <ul className={styles.benefitsList}>
            {whyMatters.benefits.map((benefit, index) => (
              <li key={index} className={styles.benefit}>{benefit}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Worked Examples Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Worked Examples</h2>
        <div className={styles.examplesGrid}>
          {examples.map((example, index) => (
            <div key={index} className={styles.exampleCard}>
              <h3 className={styles.exampleTitle}>{example.title}</h3>
              <p className={styles.exampleScenario}>{example.scenario}</p>
              <div className={styles.exampleCalculation}>
                <strong>Calculation:</strong> {example.calculation}
              </div>
              <div className={styles.exampleResult}>
                <strong>Result:</strong> {example.result}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section */}
      {commonMistakes && commonMistakes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Common Mistakes to Avoid</h2>
          <ul className={styles.mistakesList}>
            {commonMistakes.map((mistake, index) => (
              <li key={index} className={styles.mistake}>{mistake}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
