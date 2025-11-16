'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import AdUnit from '@/components/AdUnit';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

export default function AgeCalculator() {
  const [birthdate, setBirthdate] = useState<string>('');
  const [asOfDate, setAsOfDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalMonths: number;
    totalWeeks: number;
    totalHours: number;
    nextBirthday?: {
      date: Date;
      daysUntil: number;
    };
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const calculateAge = (birthdate: Date, asOfDate: Date) => {
    const birth = new Date(birthdate);
    const today = new Date(asOfDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    return {
      years,
      months,
      days,
      totalDays,
      totalMonths,
      totalWeeks: Math.floor(totalDays / 7),
      totalHours: totalDays * 24
    };
  };

  const nextBirthday = (birthdate: Date, fromDate: Date) => {
    const birth = new Date(birthdate);
    const today = new Date(fromDate);
    const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysUntil = Math.floor((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { date: thisYearBirthday, daysUntil };
  };

  useEffect(() => {
    if (birthdate && asOfDate) {
      const birth = new Date(birthdate);
      const asOf = new Date(asOfDate);

      if (birth <= asOf) {
        const age = calculateAge(birth, asOf);
        const birthday = nextBirthday(birth, asOf);

        const resultData = {
          ...age,
          nextBirthday: birthday
        };
        setResult(resultData);

        // Track calculator usage
        trackCalculatorUsage('Age Calculator', {
          age_years: age.years,
          total_days: age.totalDays
        });
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [birthdate, asOfDate]);

  const faqItems = [
    {
      question: "How is age calculated exactly?",
      answer: "Age is calculated by finding the difference between your birthdate and the current date (or specified date). The calculator determines years, months, and days, adjusting for varying month lengths and leap years."
    },
    {
      question: "Why does the calculator show total days, weeks, and months?",
      answer: "These alternative measurements give you perspective on your lifetime. For example, knowing you've lived 10,000 days or 500 weeks can be interesting for milestones and celebrations."
    },
    {
      question: "How accurate is the next birthday countdown?",
      answer: "The next birthday countdown is exact, calculating the precise number of days until your next birthday. It automatically accounts for leap years and varying month lengths."
    },
    {
      question: "Can I calculate someone's age on a specific past date?",
      answer: "Yes! Use the 'As of Date' field to calculate what someone's age was on any specific date. This is useful for historical records, legal documents, or determining age eligibility for past events."
    }
  ];

  const relatedCalculators = [
    {
      title: "Date Calculator",
      link: "/calculators/date-calculator",
      description: "Calculate days between dates and date math"
    },
    {
      title: "Time Zone Converter",
      link: "/calculators/time-zone-converter",
      description: "Convert time between different time zones"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percentage changes"
    }
  ];

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <CalculatorLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days. Find out how many days you've been alive and when your next birthday is."
    >
      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="birthdate" className={styles.label}>
            Birthdate
          </label>
          <input
            id="birthdate"
            type="date"
            className={styles.input}
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="asOfDate" className={styles.label}>
            Calculate Age As Of
          </label>
          <input
            id="asOfDate"
            type="date"
            className={styles.input}
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
          />
        </div>
      </div>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Age</span>
            <span className={styles.resultValuePrimary}>
              {result.years} years, {result.months} months, {result.days} days
            </span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Days Lived</span>
            <span className={styles.resultValue}>{result.totalDays.toLocaleString()} days</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Weeks Lived</span>
            <span className={styles.resultValue}>{result.totalWeeks.toLocaleString()} weeks</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Months Lived</span>
            <span className={styles.resultValue}>{result.totalMonths.toLocaleString()} months</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Hours Lived</span>
            <span className={styles.resultValue}>{result.totalHours.toLocaleString()} hours</span>
          </div>
          {result.nextBirthday && (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Next Birthday</span>
                <span className={styles.resultValue}>{formatDate(result.nextBirthday.date)}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Days Until Next Birthday</span>
                <span className={styles.resultValue}>
                  {result.nextBirthday.daysUntil === 0
                    ? "Today! Happy Birthday!"
                    : `${result.nextBirthday.daysUntil} days`
                  }
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Age Calculator"
      />

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
