'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import { useAnalytics } from '@/lib/useAnalytics';
import styles from '@/styles/Calculator.module.css';

type CalculationType = 'daysBetween' | 'addDays' | 'subtractDays';

export default function DateCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('daysBetween');
  const [date1, setDate1] = useState<string>('');
  const [date2, setDate2] = useState<string>('');
  const [daysToAdd, setDaysToAdd] = useState<string>('');
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(false);
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    months: number;
    years: number;
    workdays?: number;
    resultDate?: Date;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const daysBetween = (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    return diffDays;
  };

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const workdaysBetween = (startDate: Date, endDate: Date): number => {
    let count = 0;
    const curDate = new Date(startDate);
    const end = new Date(endDate);

    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  };

  const detailedDifference = (days: number) => {
    return {
      days: days,
      weeks: Math.floor(days / 7),
      months: Math.floor(days / 30.44),
      years: Math.floor(days / 365.25)
    };
  };

  useEffect(() => {
    if (calculationType === 'daysBetween' && date1 && date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const days = daysBetween(d1, d2);
      const detailed = detailedDifference(days);

      const resultData = {
        ...detailed,
        workdays: excludeWeekends ? workdaysBetween(d1 < d2 ? d1 : d2, d1 < d2 ? d2 : d1) : undefined
      };
      setResult(resultData);

      // Track calculator usage
      trackCalculatorUsage('Date Calculator', {
        calculation_type: calculationType,
        days_between: days,
        exclude_weekends: excludeWeekends
      });
    } else if ((calculationType === 'addDays' || calculationType === 'subtractDays') && date1 && daysToAdd) {
      const d1 = new Date(date1);
      const days = parseInt(daysToAdd);
      if (!isNaN(days)) {
        const resultDate = addDays(d1, calculationType === 'addDays' ? days : -days);
        const daysDiff = Math.abs(days);
        const detailed = detailedDifference(daysDiff);

        const resultData = {
          ...detailed,
          resultDate
        };
        setResult(resultData);

        // Track calculator usage
        trackCalculatorUsage('Date Calculator', {
          calculation_type: calculationType,
          days_added: days
        });
      }
    } else {
      setResult(null);
    }
  }, [calculationType, date1, date2, daysToAdd, excludeWeekends]);

  const faqItems = [
    {
      question: "How do I calculate the number of days between two dates?",
      answer: "Simply select 'Days Between' mode and enter your two dates. The calculator will show the total days, as well as the equivalent in weeks, months, and years. You can also enable 'Exclude Weekends' to count only workdays."
    },
    {
      question: "Does this calculator account for leap years?",
      answer: "Yes, the calculator automatically accounts for leap years when calculating date differences and adding/subtracting days. Leap years occur every 4 years (except for century years not divisible by 400)."
    },
    {
      question: "What are workdays vs calendar days?",
      answer: "Calendar days include all days of the week, while workdays exclude Saturdays and Sundays. Enable 'Exclude Weekends' to calculate only Monday through Friday. This is useful for business and project planning."
    },
    {
      question: "How accurate is the months calculation?",
      answer: "The months calculation uses an average of 30.44 days per month (365.25 ÷ 12). For exact month calculations, use the years, months, and days breakdown which accounts for varying month lengths."
    }
  ];

  const relatedCalculators = [
    {
      title: "Age Calculator",
      link: "/calculators/age-calculator",
      description: "Calculate your exact age from birthdate"
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
      title="Date Calculator"
      description="Calculate days between dates, add or subtract days from a date, and count workdays with our comprehensive date calculator."
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Calculation Type</label>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'daysBetween' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('daysBetween')}
            >
              Days Between
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'addDays' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('addDays')}
            >
              Add Days
            </button>
            <button
              type="button"
              className={`${styles.buttonOption} ${calculationType === 'subtractDays' ? styles.buttonOptionActive : ''}`}
              onClick={() => setCalculationType('subtractDays')}
            >
              Subtract Days
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date1" className={styles.label}>
            {calculationType === 'daysBetween' ? 'First Date' : 'Start Date'}
          </label>
          <input
            id="date1"
            type="date"
            className={styles.input}
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
          />
        </div>

        {calculationType === 'daysBetween' ? (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="date2" className={styles.label}>
                Second Date
              </label>
              <input
                id="date2"
                type="date"
                className={styles.input}
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={excludeWeekends}
                  onChange={(e) => setExcludeWeekends(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span className={styles.label} style={{ margin: 0 }}>Exclude Weekends</span>
              </label>
            </div>
          </>
        ) : (
          <div className={styles.formGroup}>
            <label htmlFor="daysToAdd" className={styles.label}>
              Number of Days
            </label>
            <input
              id="daysToAdd"
              type="number"
              className={styles.input}
              value={daysToAdd}
              onChange={(e) => setDaysToAdd(e.target.value)}
              placeholder="Enter number of days"
              min="0"
              step="1"
            />
          </div>
        )}
      </div>

      {result && (
        <div className={styles.results}>
          {calculationType === 'daysBetween' ? (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Total Days</span>
                <span className={styles.resultValuePrimary}>{result.days.toLocaleString()}</span>
              </div>
              {result.workdays !== undefined && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Workdays (Mon-Fri)</span>
                  <span className={styles.resultValue}>{result.workdays.toLocaleString()}</span>
                </div>
              )}
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Weeks</span>
                <span className={styles.resultValue}>{result.weeks.toLocaleString()}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Months (approx.)</span>
                <span className={styles.resultValue}>{result.months.toLocaleString()}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Years (approx.)</span>
                <span className={styles.resultValue}>{result.years.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Result Date</span>
                <span className={styles.resultValuePrimary}>
                  {result.resultDate && formatDate(result.resultDate)}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Days {calculationType === 'addDays' ? 'Added' : 'Subtracted'}</span>
                <span className={styles.resultValue}>{result.days.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      )}


      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Date Calculator"
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
