import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.disclaimer}>
          As an Amazon Associate, I earn from qualifying purchases.
        </p>
        <p className={styles.copyright}>
          &copy; {currentYear} Calculily. All rights reserved.
        </p>
        <nav className={styles.links}>
          <Link href="/about" className={styles.link}>
            About
          </Link>
          <Link href="/contact" className={styles.link}>
            Contact
          </Link>
          <Link href="/privacy" className={styles.link}>
            Privacy
          </Link>
          <Link href="/terms" className={styles.link}>
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
