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

interface Course {
  id: number;
  grade: string;
  credits: string;
  weighted: boolean;
}

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, grade: 'A', credits: '3', weighted: false }
  ]);
  const [result, setResult] = useState<{
    gpa: number;
    weightedGpa: number;
    totalCredits: number;
    totalPoints: number;
  } | null>(null);
  const { trackCalculatorUsage, trackEvent } = useAnalytics();

  const gradePoints: { [key: string]: number } = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'D-': 0.7,
    'F': 0.0
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const credits = parseFloat(course.credits);
      if (isNaN(credits) || credits <= 0) return;

      let points = gradePoints[course.grade];
      if (points === undefined) return;

      totalPoints += points * credits;

      let weightedPoints = points;
      if (course.weighted) {
        weightedPoints += 1.0;
      }
      totalWeightedPoints += weightedPoints * credits;

      totalCredits += credits;
    });

    if (totalCredits > 0) {
      const resultData = {
        gpa: totalPoints / totalCredits,
        weightedGpa: totalWeightedPoints / totalCredits,
        totalCredits,
        totalPoints
      };
      setResult(resultData);

      // Track calculator usage
      trackCalculatorUsage('GPA Calculator', {
        num_courses: courses.length,
        total_credits: totalCredits,
        gpa: resultData.gpa,
        weighted_gpa: resultData.weightedGpa
      });
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    calculateGPA();
  }, [courses]);

  const addCourse = () => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    setCourses([...courses, { id: newId, grade: 'A', credits: '3', weighted: false }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string | boolean) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const faqItems = [
    {
      question: "How is GPA calculated?",
      answer: "GPA (Grade Point Average) is calculated by converting letter grades to grade points (A=4.0, B=3.0, etc.), multiplying each by the course credits, summing these products, and dividing by total credits. For example, if you have an A (4.0) in a 3-credit course and a B (3.0) in a 4-credit course: (4.0×3 + 3.0×4) ÷ 7 = 3.43 GPA."
    },
    {
      question: "What's the difference between weighted and unweighted GPA?",
      answer: "Unweighted GPA uses a 4.0 scale regardless of course difficulty. Weighted GPA adds extra points for honors, AP, or IB courses (typically 0.5-1.0 points), allowing GPAs above 4.0. This rewards students who take challenging courses. Different schools may use different weighting systems."
    },
    {
      question: "What GPA do I need for college?",
      answer: "It varies by college. Community colleges typically accept students with any GPA. State universities often look for 2.5-3.5 GPA. Competitive colleges want 3.5+ unweighted or 4.0+ weighted. However, colleges consider many factors beyond GPA, including test scores, extracurriculars, and essays."
    },
    {
      question: "Can I raise my GPA significantly in one semester?",
      answer: "The impact depends on how many credits you've completed. With few credits completed, one semester can change your GPA dramatically. With many credits, the effect is smaller. For example, raising a 3.0 GPA to 3.5 in one semester is easier as a freshman than as a senior."
    }
  ];

  const contentData = {
    howToUse: {
      intro: "Calculate your GPA accurately by entering your courses and grades. Our calculator handles weighted credit hours:",
      steps: [
        "Enter each course name (optional, but helps you keep track).",
        "Select the letter grade you received for each course.",
        "Enter the credit hours for each course (typically 3-4 for most courses).",
        "Click 'Add Course' to add more courses to your calculation.",
        "Your cumulative GPA updates automatically as you enter grades."
      ]
    },
    whyMatters: {
      description: "Your GPA is a critical metric throughout your academic career and beyond. It determines eligibility for scholarships, Dean's List recognition, honors programs, and graduate school admission. Many employers also look at GPA when hiring recent graduates. Understanding how individual course grades affect your cumulative GPA helps you make strategic decisions about course selection, studying priorities, and whether to retake a course.",
      benefits: [
        "Track your academic progress toward graduation requirements",
        "Determine eligibility for scholarships and honors programs",
        "Plan course loads to maintain or improve your GPA",
        "Calculate what grades you need to reach GPA goals",
        "Prepare accurate information for job and graduate school applications"
      ]
    },
    examples: [
      {
        title: "First Semester Freshman",
        scenario: "4 courses: English (B, 3 credits), Calculus (A, 4 credits), Psychology (A-, 3 credits), History (B+, 3 credits).",
        calculation: "English: 3.0×3 + Calc: 4.0×4 + Psych: 3.7×3 + Hist: 3.3×3 = 46.0 points ÷ 13 credits",
        result: "Semester GPA: 3.54"
      },
      {
        title: "Improving Your GPA",
        scenario: "Current GPA: 2.8 with 60 credit hours. You take 15 more credits with a 3.5 GPA.",
        calculation: "(2.8×60 + 3.5×15) ÷ 75 total credits",
        result: "New cumulative GPA: 2.94 - a 0.14 point improvement"
      },
      {
        title: "Dean's List Calculation",
        scenario: "Need 3.5 GPA for Dean's List. Current semester: A (4 cr), B+ (3 cr), A- (3 cr), ? (3 cr).",
        calculation: "Current points: 16 + 9.9 + 11.1 = 37 in 10 credits. Need 45.5 points in 13 credits for 3.5.",
        result: "You need at least a B+ (3.3) in your last class to make Dean's List."
      }
    ],
    commonMistakes: [
      "Forgetting to weight grades by credit hours - a 4-credit A matters more than a 3-credit A.",
      "Using high school GPA scales for college calculations - college typically uses a 4.0 scale without weighting.",
      "Not understanding that some schools use +/- grades while others don't - know your school's scale.",
      "Ignoring pass/fail courses in cumulative GPA calculations - they usually don't affect GPA but do count for credits.",
      "Calculating semester GPA when cumulative is needed (or vice versa) - they're different numbers."
    ]
  };

  const relatedCalculators = [
    {
      title: "Percentage Calculator",
      link: "/calculators/percentage",
      description: "Calculate percentages for grades and scores"
    },
    {
      title: "Age Calculator",
      link: "/calculators/age-calculator",
      description: "Calculate exact age in years, months, and days"
    },
    {
      title: "Simple Interest Calculator",
      link: "/calculators/simple-interest",
      description: "Calculate interest on student loans"
    }
  ];

  return (
    <CalculatorLayout
      title="GPA Calculator"
      description="Calculate your GPA with weighted credit hours. Enter your courses, letter grades, and credits to find your cumulative grade point average."
    >
      <CalculatorSchema
        name="GPA Calculator"
        description="Free GPA calculator to compute your grade point average. Enter courses, grades, and credit hours for accurate cumulative GPA calculations."
        url="/calculators/gpa-calculator"
        faqItems={faqItems}
      />

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      <div className={styles.form}>
        {courses.map((course, index) => (
          <div key={course.id} style={{
            padding: '1rem',
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#e0e0e0' }}>
                Course {index + 1}
              </h3>
              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourse(course.id)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#ff6b6b',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Grade</label>
                <select
                  className={styles.select}
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                >
                  {Object.keys(gradePoints).map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Credits</label>
                <input
                  type="number"
                  className={styles.input}
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                  step="0.5"
                  min="0"
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={course.weighted}
                  onChange={(e) => updateCourse(course.id, 'weighted', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span className={styles.label} style={{ margin: 0 }}>
                  Weighted (Honors/AP/IB)
                </span>
              </label>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCourse}
          className={styles.button}
          style={{ backgroundColor: '#333', marginTop: '0.5rem' }}
        >
          + Add Course
        </button>
      </div>

      {result && (
        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Unweighted GPA</span>
            <span className={styles.resultValuePrimary}>{result.gpa.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Weighted GPA</span>
            <span className={styles.resultValue}>{result.weightedGpa.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Credits</span>
            <span className={styles.resultValue}>{result.totalCredits.toFixed(1)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Grade Points</span>
            <span className={styles.resultValue}>{result.totalPoints.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className={styles.note}>
        <strong>Note:</strong> This calculator uses the standard 4.0 GPA scale. Weighted courses add 1.0 point to the grade point value. Different schools may use different scales or weighting systems.
      </div>

      {/* Mid Content Square Ad - After results */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      <ProductRecommendation
        products={getProducts('general-tools', 3)}
        calculatorName="GPA Calculator"
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
