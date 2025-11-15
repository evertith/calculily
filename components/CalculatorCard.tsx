import Link from 'next/link';
import styles from '@/styles/CalculatorCard.module.css';

interface CalculatorCardProps {
  title: string;
  description: string;
  link: string;
  icon?: string;
}

export default function CalculatorCard({ title, description, link, icon }: CalculatorCardProps) {
  return (
    <Link href={link} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  );
}
