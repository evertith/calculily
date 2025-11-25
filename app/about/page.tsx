import styles from '@/styles/About.module.css';

export const metadata = {
  title: 'About Calculily | Free Online Calculators for Everyone',
  description: 'Learn about Calculily - your trusted source for free, accurate online calculators. Built by developers who believe everyone deserves access to powerful calculation tools.',
};

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Calculily</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Story</h2>
        <p className={styles.text}>
          Calculily was born from a simple frustration: trying to calculate a mortgage payment
          and being bombarded with ads, popups, and requests for personal information. We believed
          there had to be a better way - clean, fast calculators that just work.
        </p>
        <p className={styles.text}>
          Founded in 2024, we've grown from a handful of basic calculators to a comprehensive
          suite of over 35 tools covering finance, home improvement, electrical work, cooking,
          e-commerce, and everyday math. Every calculator we build follows the same principles:
          accuracy first, simplicity always, and genuinely helpful for real-world problems.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Mission</h2>
        <p className={styles.text}>
          We believe powerful calculation tools should be accessible to everyone, regardless of
          technical background or budget. Whether you're a first-time homebuyer trying to understand
          mortgage payments, a DIYer planning a deck build, or an Etsy seller pricing products,
          you deserve tools that help you make informed decisions.
        </p>
        <p className={styles.text}>
          Our mission is simple: provide the most useful, accurate, and easy-to-use calculators
          on the internet, completely free. No accounts required, no data collection, no premium
          tiers hiding the good features.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Trust Calculily?</h2>
        <ul className={styles.list}>
          <li><strong>Accuracy Verified:</strong> Our calculations are based on industry-standard formulas and cross-checked against professional tools and references</li>
          <li><strong>Transparent Methods:</strong> Where applicable, we explain the formulas we use so you can verify our math</li>
          <li><strong>No Hidden Agendas:</strong> We don't sell leads to lenders or contractors. Our calculators give you honest numbers, not numbers designed to push you toward a sale</li>
          <li><strong>Active Maintenance:</strong> We regularly update our calculators to fix bugs, improve accuracy, and add features based on user feedback</li>
          <li><strong>Real-World Testing:</strong> Every calculator is tested with realistic scenarios before launch</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What We Offer</h2>
        <p className={styles.text}>
          Our calculator library spans multiple categories to help with life's common calculations:
        </p>
        <ul className={styles.list}>
          <li><strong>Financial Calculators:</strong> Mortgage, loans, car payments, compound interest, and more</li>
          <li><strong>Home Improvement:</strong> Concrete, lumber, paint, drywall, fencing, and deck material calculators</li>
          <li><strong>Electrical:</strong> Wire gauge, voltage drop, circuit breaker sizing, LED power requirements</li>
          <li><strong>E-Commerce:</strong> Etsy fee calculator, profit margins, shipping cost comparisons</li>
          <li><strong>Everyday Tools:</strong> Tip calculator, unit converter, cooking measurements, time zones</li>
          <li><strong>Automotive:</strong> Fuel cost, gas mileage tracking, car depreciation, tire size comparison</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Commitment to Quality</h2>
        <ul className={styles.list}>
          <li><strong>100% Free:</strong> No hidden costs, premium features, or paywalls</li>
          <li><strong>Fast & Reliable:</strong> Instant calculations that work every time</li>
          <li><strong>Clean Design:</strong> Minimal, distraction-free interface focused on usability</li>
          <li><strong>Mobile Friendly:</strong> Works perfectly on phones, tablets, and desktops</li>
          <li><strong>Privacy Focused:</strong> We don't collect personal data or sell your information</li>
          <li><strong>No Account Required:</strong> Use any calculator immediately, no sign-up needed</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How We're Supported</h2>
        <p className={styles.text}>
          Calculily is free to use thanks to non-intrusive advertising and affiliate partnerships.
          When you see product recommendations on our site, those may be affiliate links - if you
          make a purchase, we may earn a small commission at no extra cost to you. This helps us
          keep the lights on and continue building new calculators.
        </p>
        <p className={styles.text}>
          We're committed to keeping ads minimal and never letting them interfere with the
          calculator experience. Your calculation is always the priority.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Important Disclaimer</h2>
        <p className={styles.text}>
          While we work hard to ensure accuracy, Calculily's tools are intended for informational
          and educational purposes only. Always verify important calculations with qualified
          professionals:
        </p>
        <ul className={styles.list}>
          <li>Consult a financial advisor for major financial decisions</li>
          <li>Hire a licensed electrician for electrical work</li>
          <li>Work with contractors for construction projects</li>
          <li>Verify calculations independently for critical applications</li>
        </ul>
      </section>

      <section className={styles.section} id="contact">
        <h2 className={styles.sectionTitle}>Get in Touch</h2>
        <p className={styles.text}>
          Have a suggestion for a new calculator? Found a bug? We'd love to hear from you!
          We read every message and use your feedback to make Calculily better.
        </p>
        <p className={styles.text}>
          Visit our <a href="/contact" style={{ color: '#4a9eff' }}>Contact page</a> to reach out,
          or check our <a href="/privacy" style={{ color: '#4a9eff' }}>Privacy Policy</a> and
          <a href="/terms" style={{ color: '#4a9eff' }}> Terms of Service</a> for more information.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Thank You</h2>
        <p className={styles.text}>
          To everyone who uses Calculily - thank you. Every visitor, every calculation, and every
          piece of feedback helps us build better tools. We're honored to be part of your
          problem-solving process, whether you're figuring out how much concrete you need for
          a patio or deciding if you can afford that dream home.
        </p>
      </section>
    </div>
  );
}
