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
import CalculatorSchema from '@/components/CalculatorSchema';
import CalculatorContent from '@/components/CalculatorContent';

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
      description: "Calculate exact age in years, months, and days"
    },
    {
      title: "Time Zone Converter",
      link: "/calculators/time-zone-converter",
      description: "Convert times between world time zones"
    },
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages and percent changes"
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Need to know how many days between two dates or find a date in the future? Our date calculator handles all date math:",
      steps: [
        "Choose your calculation type: days between two dates, add days to a date, or subtract days from a date.",
        "Enter your starting date using the date picker.",
        "For date difference: enter the second date. For add/subtract: enter the number of days.",
        "Click 'Calculate' to see the result, including breakdowns by weeks, months, and years where applicable."
      ]
    },
    whyMatters: {
      description: "Date calculations come up more often than you might think - counting down to events, calculating project timelines, determining age, figuring out when bills are due, or planning vacations. While calendar math seems simple, accounting for varying month lengths, leap years, and weekends makes it surprisingly complex. A date calculator eliminates errors and saves time on these common but tricky calculations.",
      benefits: [
        "Count down days to important events like weddings, trips, or deadlines",
        "Calculate exact time between dates for project planning",
        "Determine due dates and deadline dates accurately",
        "Figure out the date X days from now for scheduling",
        "Calculate age differences or time elapsed precisely"
      ]
    },
    examples: [
      {
        title: "Vacation Countdown",
        scenario: "Today is January 15th and your vacation starts June 20th. How many days until vacation?",
        calculation: "Days from Jan 15 to June 20",
        result: "156 days (about 5 months and 5 days)"
      },
      {
        title: "Project Deadline",
        scenario: "A project needs to be done in 45 business days. You start February 1st.",
        calculation: "Add 45 weekdays (about 63 calendar days) to Feb 1",
        result: "Deadline: approximately April 5th"
      },
      {
        title: "Event Planning",
        scenario: "How many days between Thanksgiving (Nov 28) and Christmas (Dec 25)?",
        calculation: "Days from Nov 28 to Dec 25",
        result: "27 days to prepare for Christmas after Thanksgiving"
      }
    ],
    commonMistakes: [
      "Forgetting about leap years when calculating dates spanning February - every 4 years adds an extra day.",
      "Confusing 'days from today' with 'days including today' - clarify whether to count the start date.",
      "Not accounting for time zones when planning international events or deadlines.",
      "Assuming all months have 30 days - month lengths vary from 28-31 days.",
      "Mixing up business days (weekdays) with calendar days - 10 business days is typically 14 calendar days."
    ]
  };

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
      description="Calculate days between two dates or add/subtract days from any date. Find exact durations for planning deadlines, events, and countdowns."
    >
      <CalculatorSchema
        name="Date Calculator"
        description="Free date calculator to find days between dates, add or subtract days from a date. Calculate durations, deadlines, and countdowns easily."
        url="/calculators/date-calculator"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

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

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="Date Calculator"
      />

      {/* Sidebar Square Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      <CalculatorContent
        howToUse={contentData.howToUse}
        whyMatters={contentData.whyMatters}
        examples={contentData.examples}
        commonMistakes={contentData.commonMistakes}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </CalculatorLayout>
  );
}
