'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import FAQ from '@/components/FAQ';
import RelatedCalculators from '@/components/RelatedCalculators';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getProducts } from '@/lib/affiliateLinks';
import styles from '@/styles/Calculator.module.css';

interface TimeZone {
  name: string;
  offset: number;
  dst: boolean;
}

export default function TimeZoneConverter() {
  const [time, setTime] = useState<string>('12:00');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fromZone, setFromZone] = useState<string>('America/New_York');
  const [toZone, setToZone] = useState<string>('America/Los_Angeles');
  const [result, setResult] = useState<{
    convertedTime: string;
    convertedDate: string;
    timeDifference: number;
  } | null>(null);

  const timeZones: { [key: string]: string } = {
    'America/New_York': 'Eastern Time (ET)',
    'America/Chicago': 'Central Time (CT)',
    'America/Denver': 'Mountain Time (MT)',
    'America/Los_Angeles': 'Pacific Time (PT)',
    'America/Anchorage': 'Alaska Time (AKT)',
    'Pacific/Honolulu': 'Hawaii Time (HT)',
    'UTC': 'Coordinated Universal Time (UTC)',
    'Europe/London': 'Greenwich Mean Time (GMT)',
    'Europe/Paris': 'Central European Time (CET)',
    'Europe/Athens': 'Eastern European Time (EET)',
    'Asia/Dubai': 'Gulf Standard Time (GST)',
    'Asia/Kolkata': 'India Standard Time (IST)',
    'Asia/Shanghai': 'China Standard Time (CST)',
    'Asia/Tokyo': 'Japan Standard Time (JST)',
    'Australia/Sydney': 'Australian Eastern Time (AET)',
    'Pacific/Auckland': 'New Zealand Time (NZST)'
  };

  const convertTime = () => {
    try {
      const dateTimeString = `${date}T${time}:00`;
      const fromDate = new Date(dateTimeString + getTimeZoneOffsetString(fromZone, new Date(dateTimeString)));

      const options: Intl.DateTimeFormatOptions = {
        timeZone: toZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };

      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(fromDate);

      const year = parts.find(p => p.type === 'year')?.value;
      const month = parts.find(p => p.type === 'month')?.value;
      const day = parts.find(p => p.type === 'day')?.value;
      const hour = parts.find(p => p.type === 'hour')?.value;
      const minute = parts.find(p => p.type === 'minute')?.value;

      const convertedTime = `${hour}:${minute}`;
      const convertedDate = `${year}-${month}-${day}`;

      const fromOffset = getTimezoneOffset(fromZone, fromDate);
      const toOffset = getTimezoneOffset(toZone, fromDate);
      const timeDifference = (toOffset - fromOffset) / 60;

      setResult({
        convertedTime,
        convertedDate,
        timeDifference
      });
    } catch (error) {
      setResult(null);
    }
  };

  const getTimeZoneOffsetString = (timeZone: string, date: Date): string => {
    const offset = getTimezoneOffset(timeZone, date);
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const getTimezoneOffset = (timeZone: string, date: Date): number => {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
  };

  useEffect(() => {
    convertTime();
  }, [time, date, fromZone, toZone]);

  const faqItems = [
    {
      question: "What is a time zone?",
      answer: "A time zone is a region of the globe that observes a uniform standard time. The world is divided into time zones to account for the Earth's rotation. Most time zones are offset from Coordinated Universal Time (UTC) by a whole number of hours, though some are offset by 30 or 45 minutes."
    },
    {
      question: "What is Daylight Saving Time (DST)?",
      answer: "Daylight Saving Time is the practice of setting clocks forward by one hour during warmer months to extend evening daylight. Not all countries or regions observe DST. This calculator automatically accounts for DST based on the selected time zone and date."
    },
    {
      question: "How do I schedule a meeting across time zones?",
      answer: "Choose a time in your time zone and convert it to the other participant's time zone. Consider that 9 AM in New York (ET) is 6 AM in Los Angeles (PT). For international meetings, try to find times that are reasonable for all participants, avoiding very early or late hours."
    },
    {
      question: "Why do some time zones have 30 or 45 minute offsets?",
      answer: "While most time zones differ by whole hours, some regions use 30 or 45-minute offsets for political, geographical, or historical reasons. For example, India uses UTC+5:30, and Nepal uses UTC+5:45."
    }
  ];

  const relatedCalculators = [
    {
      title: "Date Calculator",
      link: "/calculators/date-calculator",
      description: "Calculate days between dates and date math"
    },
    {
      title: "Age Calculator",
      link: "/calculators/age-calculator",
      description: "Calculate your exact age from birthdate"
    },
    {
      title: "Unit Converter",
      link: "/calculators/unit-converter",
      description: "Convert between various units of measurement"
    }
  ];

  const getCurrentTime = (timezone: string): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleTimeString('en-US', options);
  };

  return (
    <CalculatorLayout
      title="Time Zone Converter"
      description="Convert time between time zones worldwide. Find meeting times across time zones and see current time in different zones."
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="date" className={styles.label}>
            Date
          </label>
          <input
            id="date"
            type="date"
            className={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="time" className={styles.label}>
            Time
          </label>
          <input
            id="time"
            type="time"
            className={styles.input}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fromZone" className={styles.label}>
            From Time Zone
          </label>
          <select
            id="fromZone"
            className={styles.select}
            value={fromZone}
            onChange={(e) => setFromZone(e.target.value)}
          >
            {Object.entries(timeZones).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>
            Current time: {getCurrentTime(fromZone)}
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
          <button
            type="button"
            onClick={() => {
              const temp = fromZone;
              setFromZone(toZone);
              setToZone(temp);
            }}
            className={styles.buttonOption}
            style={{ padding: '0.5rem 1rem' }}
          >
            ⇅ Swap
          </button>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="toZone" className={styles.label}>
            To Time Zone
          </label>
          <select
            id="toZone"
            className={styles.select}
            value={toZone}
            onChange={(e) => setToZone(e.target.value)}
          >
            {Object.entries(timeZones).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>
            Current time: {getCurrentTime(toZone)}
          </div>
        </div>
      </div>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Converted Time</span>
            <span className={styles.resultValuePrimary}>{result.convertedTime}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Converted Date</span>
            <span className={styles.resultValue}>{result.convertedDate}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Time Difference</span>
            <span className={styles.resultValue}>
              {result.timeDifference > 0 ? '+' : ''}{result.timeDifference} hours
            </span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Conversion</span>
            <span className={styles.resultValue} style={{ fontSize: '0.9rem' }}>
              {time} {timeZones[fromZone]} = {result.convertedTime} {timeZones[toZone]}
            </span>
          </div>
        </div>
      )}


      <ProductRecommendation
        products={getProducts('general-tools', 3)}
      />

      <FAQ items={faqItems} />
      <RelatedCalculators calculators={relatedCalculators} />
    </CalculatorLayout>
  );
}
