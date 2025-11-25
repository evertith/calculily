import styles from '@/styles/About.module.css';

export const metadata = {
  title: 'Contact Us - Calculily',
  description: 'Get in touch with Calculily. Report bugs, suggest new calculators, or ask questions about our free online calculator tools.',
};

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>We'd Love to Hear From You</h2>
        <p className={styles.text}>
          Have a question, found a bug, or want to suggest a new calculator? We're always looking
          to improve Calculily and add tools that help people solve real-world problems.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Email Us</h2>
        <p className={styles.text}>
          The best way to reach us is by email. We typically respond within 1-2 business days.
        </p>
        <p className={styles.text}>
          <strong>General Inquiries:</strong> hello@calculily.com
        </p>
        <p className={styles.text}>
          <strong>Bug Reports:</strong> support@calculily.com
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What to Include in Your Message</h2>
        <p className={styles.text}>
          To help us assist you quickly, please include relevant details:
        </p>
        <ul className={styles.list}>
          <li><strong>Bug Reports:</strong> Which calculator, what inputs you used, what you expected vs. what happened, and your browser/device</li>
          <li><strong>Calculator Suggestions:</strong> What calculation you need, why it would be useful, and any formulas or references you know of</li>
          <li><strong>General Feedback:</strong> What you like, what could be improved, or any features you'd find helpful</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Requested Calculators</h2>
        <p className={styles.text}>
          Before suggesting a new calculator, check if we might already have it! We currently offer
          calculators for mortgages, loans, tips, electrical work, construction materials, unit
          conversions, and much more. Visit our homepage to see the full list.
        </p>
        <p className={styles.text}>
          We prioritize building calculators that:
        </p>
        <ul className={styles.list}>
          <li>Solve common, everyday problems</li>
          <li>Are frequently searched for online</li>
          <li>Have clear, defined formulas</li>
          <li>Would help a wide range of users</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Business Inquiries</h2>
        <p className={styles.text}>
          For partnership opportunities, advertising inquiries, or business-related questions,
          please reach out to: business@calculily.com
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Response Time</h2>
        <p className={styles.text}>
          We're a small team dedicated to keeping Calculily free and useful for everyone.
          We read every message and do our best to respond within 1-2 business days.
          For urgent bug reports affecting calculator accuracy, we prioritize those fixes
          as quickly as possible.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Other Resources</h2>
        <p className={styles.text}>
          Looking for more information?
        </p>
        <ul className={styles.list}>
          <li><a href="/about" style={{ color: '#4a9eff' }}>About Calculily</a> - Learn more about our mission and values</li>
          <li><a href="/privacy" style={{ color: '#4a9eff' }}>Privacy Policy</a> - How we handle your data</li>
          <li><a href="/terms" style={{ color: '#4a9eff' }}>Terms of Service</a> - Our terms and conditions</li>
        </ul>
      </section>
    </div>
  );
}
