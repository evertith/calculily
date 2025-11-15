'use client';

import { useState } from 'react';
import styles from '@/styles/FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
      <div className={styles.faqList}>
        {items.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => toggleQuestion(index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <span className={styles.faqIcon}>
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className={styles.faqAnswer}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
