import styles from '@/styles/About.module.css';

export const metadata = {
  title: 'About Calculily | Free Online Calculators',
  description: 'Learn about Calculily, our mission to provide free, accurate online calculators for everyone.',
};

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Calculily</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What is Calculily?</h2>
        <p className={styles.text}>
          Calculily is a collection of free, fast, and accurate online calculators designed to help you
          solve everyday problems. Whether you're working on an electrical project, planning a mortgage,
          pricing your handmade products, or just splitting a bill with friends, we've got you covered.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Mission</h2>
        <p className={styles.text}>
          We believe that everyone should have access to powerful calculation tools without the hassle
          of ads, paywalls, or complicated interfaces. Our mission is to provide clean, minimal, and
          highly functional calculators that just work.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Calculily?</h2>
        <ul className={styles.list}>
          <li>100% Free - No hidden costs or premium features</li>
          <li>Fast & Accurate - Instant calculations with precise results</li>
          <li>Clean Design - Minimal interface focused on usability</li>
          <li>Mobile Friendly - Works perfectly on all devices</li>
          <li>Privacy Focused - We don't collect or sell your data</li>
        </ul>
      </section>

      <section className={styles.section} id="privacy">
        <h2 className={styles.sectionTitle}>Privacy Policy</h2>
        <p className={styles.text}>
          Your privacy matters to us. Calculily does not collect, store, or share any personal information
          or calculation data. All calculations are performed locally in your browser. We may use
          anonymous analytics to improve the site, but no personally identifiable information is ever collected.
        </p>
      </section>

      <section className={styles.section} id="contact">
        <h2 className={styles.sectionTitle}>Contact Us</h2>
        <p className={styles.text}>
          Have a suggestion for a new calculator? Found a bug? We'd love to hear from you!
        </p>
        <p className={styles.text}>
          While we don't have a formal contact system yet, feel free to reach out through our
          GitHub repository or social media channels.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Suggest a Calculator</h2>
        <p className={styles.text}>
          We're always looking to add more useful calculators to our collection. If you have an idea
          for a calculator that would be helpful, let us know! We prioritize calculators that solve
          real-world problems and are frequently needed.
        </p>
      </section>
    </div>
  );
}
