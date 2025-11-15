import styles from './Privacy.module.css';

export const metadata = {
  title: "Privacy Policy - Calculily",
  description: "Privacy policy for Calculily online calculators",
};

export default function Privacy() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: November 15, 2024</p>

      <section className={styles.section}>
        <h2>Introduction</h2>
        <p>
          Welcome to Calculily. We respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you about how we handle your information when you visit our website.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Information We Collect</h2>
        <p>
          Calculily is designed to respect your privacy. All calculations are performed locally in your browser,
          and we do not collect, store, or transmit any calculation data you enter into our calculators.
        </p>
        <h3>Analytics Data</h3>
        <p>
          We use Google Analytics to understand how visitors use our website. This service collects:
        </p>
        <ul>
          <li>Pages you visit on our site</li>
          <li>Time spent on each page</li>
          <li>Browser type and version</li>
          <li>Device type and screen resolution</li>
          <li>General location (country/city level)</li>
          <li>Referring website</li>
        </ul>
        <p>
          This information is anonymized and helps us improve our service. You can opt out of Google Analytics
          by using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google Analytics Opt-out Browser Add-on</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Advertising</h2>
        <p>
          We use Google AdSense to display advertisements on our website. Google AdSense may use cookies and
          web beacons to serve ads based on your prior visits to our website or other websites. You can opt out
          of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          Ads Settings</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Cookies</h2>
        <p>
          Our website uses cookies from third-party services (Google Analytics and Google AdSense).
          Cookies are small text files stored on your device that help us analyze web traffic and serve relevant advertisements.
        </p>
        <p>
          You can control cookies through your browser settings. Please note that disabling cookies may
          affect the functionality of certain features on our website.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Your Calculation Data</h2>
        <p>
          All calculations performed on Calculily happen entirely in your web browser using JavaScript.
          We do not send any of your calculation inputs or results to our servers. Your data never leaves your device.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the privacy
          practices of these external sites. We encourage you to read their privacy policies.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Children's Privacy</h2>
        <p>
          Our service is not directed to children under 13 years of age. We do not knowingly collect
          personal information from children under 13.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our privacy policy from time to time. We will notify you of any changes by
          posting the new privacy policy on this page and updating the "Last updated" date.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us through the information
          provided on our <a href="/about">About page</a>.
        </p>
      </section>
    </div>
  );
}
