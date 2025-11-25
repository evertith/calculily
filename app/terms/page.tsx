import styles from '@/styles/About.module.css';

export const metadata = {
  title: 'Terms of Service - Calculily',
  description: 'Terms of Service for Calculily.com. Read our terms and conditions for using our free online calculators.',
};

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms of Service</h1>
      <p className={styles.text}>Last Updated: November 24, 2024</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
        <p className={styles.text}>
          By accessing and using Calculily.com ("the Website"), you accept and agree to be bound by these
          Terms of Service. If you do not agree to these terms, please do not use our website or services.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Description of Service</h2>
        <p className={styles.text}>
          Calculily provides free online calculators for various purposes including financial calculations,
          home improvement estimates, electrical calculations, unit conversions, and more. Our calculators
          are designed to help users perform quick estimates and should be used as informational tools only.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Disclaimer of Accuracy</h2>
        <p className={styles.text}>
          While we strive to provide accurate calculations, Calculily makes no warranties or representations
          regarding the accuracy, reliability, or completeness of any calculations or information provided.
          Our calculators are intended for general informational and educational purposes only.
        </p>
        <ul className={styles.list}>
          <li>Financial calculators (mortgage, loan, etc.) provide estimates only - always consult a qualified financial advisor before making financial decisions</li>
          <li>Electrical calculators should not replace professional electrical engineering advice - improper electrical work can be dangerous</li>
          <li>Construction calculators provide estimates - actual material requirements may vary based on site conditions</li>
          <li>Medical or health-related calculations are not provided and should never be attempted with general calculators</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Limitation of Liability</h2>
        <p className={styles.text}>
          To the fullest extent permitted by applicable law, Calculily and its operators shall not be liable
          for any direct, indirect, incidental, special, consequential, or punitive damages resulting from:
        </p>
        <ul className={styles.list}>
          <li>Your use or inability to use the calculators or website</li>
          <li>Any errors, mistakes, or inaccuracies in calculations</li>
          <li>Decisions made based on calculator results</li>
          <li>Any unauthorized access to or alteration of your data</li>
          <li>Any interruption or cessation of service</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. User Responsibilities</h2>
        <p className={styles.text}>
          When using Calculily, you agree to:
        </p>
        <ul className={styles.list}>
          <li>Use the calculators for lawful purposes only</li>
          <li>Verify important calculations independently or with qualified professionals</li>
          <li>Not rely solely on our calculators for critical decisions involving safety, finances, or legal matters</li>
          <li>Not attempt to reverse engineer, modify, or copy our calculators or website code</li>
          <li>Not use automated systems to access the website in a manner that sends more requests than a human can reasonably produce</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Intellectual Property</h2>
        <p className={styles.text}>
          All content on Calculily, including but not limited to text, graphics, logos, calculator designs,
          and software, is the property of Calculily or its content suppliers and is protected by
          intellectual property laws. You may use our calculators for personal, non-commercial purposes
          but may not reproduce, distribute, or create derivative works without permission.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Third-Party Links and Advertisements</h2>
        <p className={styles.text}>
          Our website may contain links to third-party websites and advertisements. These links are
          provided for your convenience only. We do not endorse, control, or assume responsibility
          for the content, privacy policies, or practices of any third-party sites. Your interactions
          with third-party websites are solely between you and the third party.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>8. Affiliate Disclosure</h2>
        <p className={styles.text}>
          Calculily participates in affiliate programs, including the Amazon Services LLC Associates Program.
          This means we may earn commissions on qualifying purchases made through links on our website.
          This does not affect the price you pay and helps support the free operation of our calculators.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>9. Changes to Terms</h2>
        <p className={styles.text}>
          We reserve the right to modify these Terms of Service at any time. Changes will be effective
          immediately upon posting to the website. Your continued use of Calculily after changes are
          posted constitutes your acceptance of the modified terms. We encourage you to review these
          terms periodically.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>10. Termination</h2>
        <p className={styles.text}>
          We reserve the right to terminate or restrict your access to Calculily at any time, without
          notice, for any reason, including violation of these Terms of Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>11. Governing Law</h2>
        <p className={styles.text}>
          These Terms of Service shall be governed by and construed in accordance with the laws of
          the United States, without regard to conflict of law principles.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>12. Contact Information</h2>
        <p className={styles.text}>
          If you have any questions about these Terms of Service, please contact us through our
          Contact page or reach out via the methods listed there.
        </p>
      </section>
    </div>
  );
}
