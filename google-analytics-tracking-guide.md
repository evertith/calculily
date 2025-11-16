# Google Analytics 4 Event Tracking Implementation Guide

## Overview
Implement comprehensive event tracking for Calculily to understand user behavior, optimize calculators, and track affiliate performance. This guide covers all tracking events, custom dimensions, and reporting setup.

---

## Phase 1: Core Event Tracking

### Event 1: Affiliate Link Clicks (CRITICAL)

**Purpose:** Track which Amazon affiliate products get clicked so we know what's working.

**File:** `components/ProductRecommendation.tsx`

**Update the component to track clicks:**

```typescript
import React from 'react';
import styles from './ProductRecommendation.module.css';

interface Product {
  name: string;
  imageUrl: string;
  affiliateLink: string;
  price?: string;
  rating?: number;
  description?: string;
}

interface ProductRecommendationProps {
  title?: string;
  products: Product[];
  disclaimer?: boolean;
  calculatorName?: string; // Add this to track which calculator the click came from
}

export default function ProductRecommendation({ 
  title = "Recommended Tools & Supplies",
  products,
  disclaimer = true,
  calculatorName = 'Unknown'
}: ProductRecommendationProps) {
  
  // Track affiliate link clicks
  const handleAffiliateClick = (product: Product) => {
    // Send event to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        product_name: product.name,
        product_category: calculatorName,
        link_url: product.affiliateLink,
        event_category: 'Affiliate',
        event_label: product.name,
        value: 0 // Could estimate commission value here
      });
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Affiliate Click Tracked:', {
        product: product.name,
        calculator: calculatorName,
        link: product.affiliateLink
      });
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      
      <div className={styles.productGrid}>
        {products.map((product, index) => (
          <div key={index} className={styles.productCard}>
            <div className={styles.imageWrapper}>
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className={styles.productImage}
              />
            </div>
            
            <div className={styles.productInfo}>
              <h4 className={styles.productName}>{product.name}</h4>
              
              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}
              
              {product.price && (
                <p className={styles.price}>{product.price}</p>
              )}
              
              {product.rating && (
                <div className={styles.rating}>
                  {'⭐'.repeat(Math.floor(product.rating))} {product.rating}
                </div>
              )}
              
              <a 
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={styles.button}
                onClick={() => handleAffiliateClick(product)}
              >
                View on Amazon
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {disclaimer && (
        <p className={styles.disclaimer}>
          As an Amazon Associate, I earn from qualifying purchases. This helps keep our calculators free!
        </p>
      )}
    </div>
  );
}
```

---

### Event 2: Calculator Usage Tracking

**Purpose:** Track when users actually USE calculators (not just visit the page).

**Create a custom hook for tracking:**

**File:** `lib/useAnalytics.ts`

```typescript
// Custom hook for analytics tracking
export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
      
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventName, parameters);
      }
    }
  };

  const trackCalculatorUsage = (calculatorName: string, inputs?: Record<string, any>) => {
    trackEvent('calculator_used', {
      calculator_name: calculatorName,
      event_category: 'Calculator',
      event_label: calculatorName,
      ...inputs
    });
  };

  const trackPageView = (pagePath: string, pageTitle: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  };

  return {
    trackEvent,
    trackCalculatorUsage,
    trackPageView
  };
};
```

**Example usage in a calculator:**

**File:** `app/calculators/wire-gauge/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useAnalytics } from '@/lib/useAnalytics';
import ProductRecommendation from '@/components/ProductRecommendation';
import { getRandomProducts } from '@/lib/affiliateLinks';

export default function WireGaugeCalculator() {
  const [distance, setDistance] = useState('');
  const [amperage, setAmperage] = useState('');
  const [voltage, setVoltage] = useState('120');
  const [result, setResult] = useState(null);
  
  const { trackCalculatorUsage } = useAnalytics();

  const calculateWireGauge = () => {
    const dist = parseFloat(distance);
    const amps = parseFloat(amperage);
    const volts = parseFloat(voltage);
    
    if (!dist || !amps || !volts) return;
    
    // Calculate...
    const calculatedResult = {
      gauge: '12 AWG',
      voltageDrop: 2.5
    };
    
    setResult(calculatedResult);
    
    // TRACK THE USAGE
    trackCalculatorUsage('Wire Gauge Calculator', {
      distance: dist,
      amperage: amps,
      voltage: volts,
      result_gauge: calculatedResult.gauge
    });
  };

  const recommendedProducts = getRandomProducts('wire-gauge', 3);

  return (
    <div>
      {/* Calculator UI */}
      
      <button onClick={calculateWireGauge}>
        Calculate
      </button>
      
      {result && (
        <>
          <div className="results">
            <h2>Recommended Wire Gauge: {result.gauge}</h2>
            <p>Voltage Drop: {result.voltageDrop}V</p>
          </div>
          
          {/* Pass calculator name for better tracking */}
          <ProductRecommendation 
            title="Recommended Electrical Tools"
            products={recommendedProducts}
            calculatorName="Wire Gauge Calculator"
          />
        </>
      )}
    </div>
  );
}
```

---

### Event 3: Result Views

**Purpose:** Track when users see calculator results (successful calculation).

Add to the calculate functions:

```typescript
const calculateWireGauge = () => {
  // ... calculation logic
  
  setResult(calculatedResult);
  
  // Track usage
  trackCalculatorUsage('Wire Gauge Calculator', {
    distance: dist,
    amperage: amps,
    voltage: volts,
    result_gauge: calculatedResult.gauge
  });
  
  // Track result view
  trackEvent('calculator_result_viewed', {
    calculator_name: 'Wire Gauge Calculator',
    event_category: 'Calculator',
    event_label: 'Result Viewed'
  });
};
```

---

### Event 4: Input Errors / Validation Failures

**Purpose:** Track when users enter invalid inputs (helps improve UX).

```typescript
const calculateWireGauge = () => {
  const dist = parseFloat(distance);
  const amps = parseFloat(amperage);
  const volts = parseFloat(voltage);
  
  // Validation
  if (!dist || !amps || !volts) {
    trackEvent('calculator_error', {
      calculator_name: 'Wire Gauge Calculator',
      error_type: 'missing_input',
      event_category: 'Error'
    });
    return;
  }
  
  if (dist <= 0 || amps <= 0) {
    trackEvent('calculator_error', {
      calculator_name: 'Wire Gauge Calculator',
      error_type: 'invalid_value',
      event_category: 'Error'
    });
    return;
  }
  
  // Continue with calculation...
};
```

---

## Phase 2: Custom Dimensions

**Setup in Google Analytics 4:**

1. Go to **Admin** → **Data display** → **Custom definitions**
2. Click **Create custom dimension**
3. Create these dimensions:

### Custom Dimension 1: Calculator Category

- **Dimension name:** `calculator_category`
- **Scope:** Event
- **Event parameter:** `calculator_category`

**Values:**
- `electrical`
- `financial`
- `home-improvement`
- `automotive`
- `general`

### Custom Dimension 2: Calculator Name

- **Dimension name:** `calculator_name`
- **Scope:** Event
- **Event parameter:** `calculator_name`

### Custom Dimension 3: Product Category

- **Dimension name:** `product_category`
- **Scope:** Event
- **Event parameter:** `product_category`

---

## Phase 3: Enhanced Measurement

**Enable in GA4 (if not already enabled):**

1. Go to **Admin** → **Data Streams**
2. Click your web stream
3. Click **Enhanced measurement**
4. Toggle ON (if not already)

**This automatically tracks:**
- ✅ Scrolling (90% scroll depth)
- ✅ Outbound clicks (including your Amazon links as backup)
- ✅ Site search (if you add search)
- ✅ Video engagement
- ✅ File downloads

---

## Phase 4: Conversion Events

**Setup in GA4:**

1. Go to **Admin** → **Events**
2. Click **Mark as conversion** for these events:

### Primary Conversions:
- ✅ `affiliate_click` - Most important for revenue tracking
- ✅ `calculator_used` - Engagement metric

### Secondary Conversions:
- ✅ `email_signup` (when you add this)
- ✅ `form_submit` (when you add contact forms)

---

## Phase 5: Page View Tracking with Context

**Update your layout to include calculator context:**

**File:** `app/layout.tsx`

```typescript
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}
```

**Add to each calculator page metadata:**

```typescript
export const metadata = {
  title: 'Wire Gauge Calculator | Calculily',
  description: '...',
  // Add custom metadata for tracking
  other: {
    calculator_category: 'electrical',
    calculator_type: 'wire-gauge'
  }
};
```

---

## Phase 6: Debugging and Testing

**Create a debug component (development only):**

**File:** `components/AnalyticsDebug.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsDebug() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Intercept gtag calls
    const originalGtag = (window as any).gtag;
    
    (window as any).gtag = function(...args: any[]) {
      setEvents(prev => [...prev, { timestamp: Date.now(), args }]);
      if (originalGtag) {
        originalGtag.apply(null, args);
      }
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      background: '#1a1a1a',
      border: '2px solid #00ff00',
      color: '#00ff00',
      padding: '10px',
      fontSize: '11px',
      fontFamily: 'monospace',
      zIndex: 9999
    }}>
      <h4>Analytics Debug (Dev Only)</h4>
      {events.map((event, i) => (
        <div key={i} style={{ marginBottom: '10px', borderBottom: '1px solid #333' }}>
          <strong>{event.args[0]}</strong>: {event.args[1]}
          <pre>{JSON.stringify(event.args[2], null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
```

**Add to layout in development:**

```typescript
import AnalyticsDebug from '@/components/AnalyticsDebug';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AnalyticsDebug />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}
```

---

## Phase 7: Environment Variables

**File:** `.env.local`

```bash
# Google Analytics Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Update in production (Cloudflare Pages):**
- Add environment variable in Cloudflare dashboard
- Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Value: Your GA4 measurement ID

---

## Testing Checklist

After implementation, verify:

### Local Testing (Development):
- [ ] Open browser DevTools → Console
- [ ] Use a calculator
- [ ] See "Analytics Event: calculator_used" logged
- [ ] Click an affiliate link
- [ ] See "Affiliate Click Tracked" logged
- [ ] Check AnalyticsDebug panel shows events

### Production Testing:
- [ ] Open GA4 → Reports → Realtime
- [ ] Use a calculator on live site
- [ ] See event appear in Realtime (may take 5-10 seconds)
- [ ] Click affiliate link
- [ ] See `affiliate_click` event in Realtime
- [ ] Verify event parameters are populated

### GA4 Dashboard Verification:
- [ ] Go to Reports → Engagement → Events
- [ ] See `calculator_used` event
- [ ] See `affiliate_click` event
- [ ] Click event name → see parameters
- [ ] Verify calculator_name and product_name are tracked

---

## Reports to Create in GA4

### Report 1: Top Calculators by Usage

**Path:** Explore → Create new exploration

**Setup:**
- Dimensions: `calculator_name`
- Metrics: `Event count` (for `calculator_used` event)
- Visualization: Table

**Shows:** Which calculators people actually use most

---

### Report 2: Affiliate Click Performance

**Setup:**
- Dimensions: `product_name`, `calculator_name`
- Metrics: `Event count` (for `affiliate_click` event)
- Visualization: Table

**Shows:** Which products get clicked, from which calculators

---

### Report 3: Calculator Funnel

**Setup:**
- Step 1: Page view (calculator page)
- Step 2: `calculator_used` event
- Step 3: `affiliate_click` event

**Shows:** Drop-off rates between page visit → usage → affiliate click

---

### Report 4: Calculator Category Performance

**Setup:**
- Dimensions: `calculator_category`
- Metrics: Event count, Users, Sessions
- Visualization: Bar chart

**Shows:** Which calculator categories drive most traffic

---

## Data to Monitor Weekly

**Week 1-4 (Validation Phase):**
- [ ] Total calculator uses (all calculators)
- [ ] Top 5 calculators by usage
- [ ] Total affiliate clicks
- [ ] Top 5 products by clicks
- [ ] Calculator usage rate (uses / pageviews)
- [ ] Affiliate CTR (clicks / calculator uses)

**Month 2+ (Optimization Phase):**
- [ ] Compare week-over-week growth
- [ ] Calculator abandonment rate
- [ ] Mobile vs desktop usage patterns
- [ ] Traffic source performance
- [ ] Time on page by calculator

---

## Integration with Amazon Associates

**Cross-reference GA4 with Amazon:**

**Daily check:**
1. GA4: Count `affiliate_click` events
2. Amazon Associates Dashboard: Count total clicks
3. Should be roughly equal (some discrepancy normal)

**Weekly analysis:**
1. GA4: Which products got most clicks
2. Amazon: Which products generated sales
3. Identify: High-click, low-conversion products (remove or replace)

---

## Advanced: Custom Dashboard (Optional)

**Create a Looker Studio dashboard:**

1. Connect GA4 to Looker Studio
2. Create dashboard with:
   - Daily visitors (line chart)
   - Top calculators (table)
   - Affiliate clicks (line chart)
   - Calculator usage funnel (funnel chart)
   - Mobile vs desktop split (pie chart)

**Share with stakeholders or just yourself for easy monitoring!**

---

## Privacy & Compliance

**Required additions:**

### Update Privacy Policy page:

```
We use Google Analytics to understand how visitors use our calculators. 
This includes:
- Pages visited
- Calculators used
- Products clicked (not purchases)
- General location (city/country level)
- Device type (mobile, desktop)

We do NOT track:
- Personal information
- Specific calculator inputs
- Individual user identities

You can opt out of Google Analytics tracking by installing the 
Google Analytics Opt-out Browser Add-on.
```

### Cookie Consent (Optional but Recommended):

Consider adding a simple cookie banner:
- "We use cookies for analytics to improve our calculators"
- Accept / Decline buttons
- Only load GA4 if accepted

---

## Summary of Events Being Tracked

| Event Name | Trigger | Parameters | Purpose |
|------------|---------|------------|---------|
| `affiliate_click` | User clicks "View on Amazon" | product_name, product_category, calculator_name | Track which products get clicks |
| `calculator_used` | User clicks "Calculate" button | calculator_name, input values, result | Track calculator usage |
| `calculator_result_viewed` | Results displayed | calculator_name | Track successful calculations |
| `calculator_error` | Invalid input or error | calculator_name, error_type | Track UX issues |
| `page_view` | Page load | page_path, page_title | Auto-tracked by GA4 |
| `scroll` | 90% scroll depth | page_path | Auto-tracked by Enhanced Measurement |

---

## Implementation Priority

**Do First (Today):**
1. ✅ Add `useAnalytics` hook
2. ✅ Add affiliate click tracking to ProductRecommendation component
3. ✅ Add calculator usage tracking to top 3 calculators
4. ✅ Test in development with console logs

**Do This Weekend:**
1. Add tracking to all calculators
2. Set up custom dimensions in GA4
3. Mark conversion events
4. Create first custom report

**Do Next Week:**
1. Review first week's data
2. Create Looker Studio dashboard (optional)
3. Set up weekly reporting
4. Optimize based on data

---

## Success Metrics

**After 1 week, you should see:**
- ✅ Events flowing into GA4 Realtime
- ✅ Calculator usage data populating
- ✅ Affiliate clicks being tracked
- ✅ No errors in console

**After 1 month, you should know:**
- ✅ Which calculators drive most traffic
- ✅ Which calculators have highest usage rate
- ✅ Which products get most clicks
- ✅ What your affiliate CTR is
- ✅ Mobile vs desktop usage patterns

**Use this data to:**
- Build more of what works
- Fix or remove what doesn't
- Optimize product recommendations
- Improve calculator UX

---

## Troubleshooting

**Events not showing in GA4:**
- Check NEXT_PUBLIC_GA_MEASUREMENT_ID is correct
- Verify GA4 tag is loading (check Network tab)
- Wait 24-48 hours for data to fully populate (Realtime should work immediately)
- Check ad blockers aren't blocking GA4

**Development console shows errors:**
- Ensure gtag is defined before calling
- Check all event parameters are valid
- Verify TypeScript types match

**Duplicate events:**
- Check you're not calling trackEvent multiple times
- Verify React components aren't re-rendering unnecessarily
- Use React.memo or useCallback if needed

---

## Notes for Claude Code

When implementing this:

1. **Start with the useAnalytics hook** - Create this first
2. **Update ProductRecommendation component** - Add click tracking
3. **Add tracking to top 3 calculators** - Wire Gauge, Paint, LED Power
4. **Test thoroughly in development** - Use console logs
5. **Deploy and verify in GA4 Realtime** - Make sure events flow
6. **Roll out to remaining calculators** - Once verified working

Remember:
- All tracking should work even if GA4 is blocked (fail gracefully)
- Log events to console in development for debugging
- Never track personal/sensitive information
- Keep event names consistent across all calculators

---

This implementation will give you complete visibility into:
- ✅ What people are using
- ✅ What's driving revenue
- ✅ Where to focus development
- ✅ How to optimize for growth

Let's get this data flowing! 📊🚀
