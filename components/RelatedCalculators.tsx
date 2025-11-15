import Link from 'next/link';
import styles from '@/styles/RelatedCalculators.module.css';

interface RelatedCalc {
  title: string;
  link: string;
  description: string;
}

interface RelatedCalculatorsProps {
  calculators: RelatedCalc[];
}

export default function RelatedCalculators({ calculators }: RelatedCalculatorsProps) {
  return (
    <div className={styles.relatedContainer}>
      <h2 className={styles.relatedTitle}>Related Calculators</h2>
      <div className={styles.relatedGrid}>
        {calculators.map((calc) => (
          <Link key={calc.link} href={calc.link} className={styles.relatedCard}>
            <h3 className={styles.relatedCardTitle}>{calc.title}</h3>
            <p className={styles.relatedCardDescription}>{calc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
