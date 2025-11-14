# Calculily - Calculator Website Build Plan

## Project Overview
Build a dark-themed calculator website using Next.js, deployed to Cloudflare Pages. The site will feature multiple calculators with a minimal, clean design optimized for SEO and ad monetization.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** CSS Modules (minimal design aesthetic)
- **Deployment:** Cloudflare Pages
- **Analytics:** Google Analytics
- **Ads:** Google AdSense (to be integrated after deployment)

## Project Structure
```
calculily/
├── app/
│   ├── layout.tsx (root layout with dark theme)
│   ├── page.tsx (homepage - calculator directory)
│   ├── about/
│   │   └── page.tsx
│   ├── calculators/
│   │   ├── wire-gauge/
│   │   │   └── page.tsx
│   │   ├── mortgage/
│   │   │   └── page.tsx
│   │   ├── etsy-pricing/
│   │   │   └── page.tsx
│   │   ├── led-power/
│   │   │   └── page.tsx
│   │   ├── loan/
│   │   │   └── page.tsx
│   │   ├── tip/
│   │   │   └── page.tsx
│   │   ├── fuel-cost/
│   │   │   └── page.tsx
│   │   └── voltage-drop/
│   │       └── page.tsx
├── components/
│   ├── CalculatorLayout.tsx (shared layout for all calculators)
│   ├── CalculatorCard.tsx (for homepage grid)
│   ├── Header.tsx
│   └── Footer.tsx
├── styles/
│   ├── globals.css
│   ├── CalculatorLayout.module.css
│   └── Home.module.css
├── lib/
│   └── calculators.ts (calculation logic)
└── public/
    ├── robots.txt
    └── sitemap.xml
```

## Phase 1: Project Setup

### Step 1: Initialize Next.js Project
```bash
npx create-next-app@latest calculily --typescript --app --no-tailwind
cd calculily
```

### Step 2: Configure for Cloudflare Pages
Create `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### Step 3: Set up base styles
Create `app/globals.css` with dark theme:
```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  background-color: #0a0a0a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

input,
select,
button {
  font-family: inherit;
}
```

## Phase 2: Core Components

### Component 1: Header
File: `components/Header.tsx`
- Logo/site name on left
- Navigation links (Calculators, About)
- Minimal design matching the aesthetic
- Mobile responsive

### Component 2: Footer
File: `components/Footer.tsx`
- Copyright
- Links (About, Contact, Privacy Policy)
- Simple, minimal footer

### Component 3: CalculatorLayout
File: `components/CalculatorLayout.tsx`
- Reusable layout for all calculator pages
- Props: title, description, children
- Consistent styling matching minimal-calculator.jsx design
- Max width container, centered
- Proper spacing and typography

### Component 4: CalculatorCard
File: `components/CalculatorCard.tsx`
- Card component for homepage grid
- Props: title, description, link, icon/emoji
- Hover effects
- Links to individual calculator pages

## Phase 3: Homepage

File: `app/page.tsx`

**Requirements:**
- Hero section with site title and tagline
- Grid of calculator cards (CalculatorCard component)
- SEO metadata
- Mobile responsive (1 column on mobile, 2-3 on desktop)

**Calculator categories to display:**
1. Wire Gauge Calculator - "Calculate proper wire gauge for electrical runs"
2. Mortgage Calculator - "Calculate monthly payments and total interest"
3. Etsy Pricing Calculator - "Price your handmade products profitably"
4. LED Power Calculator - "Calculate power requirements for LED strips"
5. Loan Calculator - "Calculate loan payments and amortization"
6. Tip Calculator - "Calculate tips and split bills"
7. Fuel Cost Calculator - "Calculate trip fuel costs"
8. Voltage Drop Calculator - "Calculate voltage drop over distance"

## Phase 4: Calculator Pages

### Calculator 1: Wire Gauge Calculator
File: `app/calculators/wire-gauge/page.tsx`

**Inputs:**
- Distance (feet) - number input
- Amperage (amps) - number input
- Voltage - dropdown (120V, 240V)

**Calculation Logic:**
```javascript
// Circular mils calculation
const cmils = (2 * 12.9 * distance * amperage) / (voltage * 0.03);

// Wire gauge determination
let gauge = '14 AWG';
if (cmils > 83690) gauge = '4 AWG';
else if (cmils > 66360) gauge = '6 AWG';
else if (cmils > 52620) gauge = '8 AWG';
else if (cmils > 33100) gauge = '10 AWG';
else if (cmils > 20820) gauge = '12 AWG';

// Voltage drop
const voltageDrop = (2 * 12.9 * distance * amperage) / cmils;
```

**Output Display:**
- Recommended Wire Gauge (large, prominent)
- Voltage Drop (V)
- Safety note about consulting local codes

**SEO:**
- Title: "Wire Gauge Calculator | Calculily"
- Description: "Calculate the proper wire gauge for your electrical project based on distance, amperage, and voltage. Free wire sizing calculator."

### Calculator 2: Mortgage Calculator
File: `app/calculators/mortgage/page.tsx`

**Inputs:**
- Home Price - number input with $ prefix
- Down Payment (%) - number input with % suffix
- Loan Term (years) - dropdown (15, 20, 30)
- Interest Rate (%) - number input

**Calculation Logic:**
```javascript
const principal = homePrice - (homePrice * downPayment / 100);
const monthlyRate = interestRate / 100 / 12;
const numPayments = loanTerm * 12;

const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                       (Math.pow(1 + monthlyRate, numPayments) - 1);

const totalPaid = monthlyPayment * numPayments;
const totalInterest = totalPaid - principal;
```

**Output:**
- Monthly Payment
- Total Interest Paid
- Total Amount Paid
- Down Payment Amount

### Calculator 3: Etsy Pricing Calculator
File: `app/calculators/etsy-pricing/page.tsx`

**Inputs:**
- Material Cost - number input
- Labor Hours - number input
- Hourly Rate - number input
- Desired Profit Margin (%) - number input

**Calculation Logic:**
```javascript
const laborCost = laborHours * hourlyRate;
const baseCost = materialCost + laborCost;
const profitAmount = baseCost * (profitMargin / 100);
const subtotal = baseCost + profitAmount;

// Etsy fees
const listingFee = 0.20;
const transactionFee = subtotal * 0.065; // 6.5%
const paymentProcessingFee = (subtotal + 0.30) / (1 - 0.03) - subtotal; // 3% + $0.30

const totalFees = listingFee + transactionFee + paymentProcessingFee;
const recommendedPrice = subtotal + totalFees;
```

**Output:**
- Recommended Selling Price
- Breakdown: Materials, Labor, Profit, Fees
- Profit margin percentage

### Calculator 4: LED Power Calculator
File: `app/calculators/led-power/page.tsx`

**Inputs:**
- Number of LEDs/Pixels - number input
- Watts per LED - number input (default 0.3)
- Usage Factor (%) - slider (0-100%, default 80%)

**Calculation Logic:**
```javascript
const totalWatts = numLEDs * wattsPerLED * (usageFactor / 100);
const amps = totalWatts / voltage;
const recommendedPowerSupply = Math.ceil(totalWatts * 1.2); // 20% overhead
```

**Output:**
- Total Watts Required
- Amperage Draw
- Recommended Power Supply Size (with 20% overhead)

### Calculator 5: Loan Calculator
File: `app/calculators/loan/page.tsx`

**Inputs:**
- Loan Amount - number input
- Interest Rate (%) - number input
- Loan Term (months) - number input

**Calculation Logic:**
```javascript
const monthlyRate = interestRate / 100 / 12;
const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                       (Math.pow(1 + monthlyRate, loanTerm) - 1);
const totalPaid = monthlyPayment * loanTerm;
const totalInterest = totalPaid - loanAmount;
```

**Output:**
- Monthly Payment
- Total Interest
- Total Amount Paid
- Amortization summary

### Calculator 6: Tip Calculator
File: `app/calculators/tip/page.tsx`

**Inputs:**
- Bill Amount - number input
- Tip Percentage - buttons (15%, 18%, 20%, custom)
- Number of People - number input (default 1)

**Calculation Logic:**
```javascript
const tipAmount = billAmount * (tipPercentage / 100);
const totalAmount = billAmount + tipAmount;
const perPerson = totalAmount / numPeople;
```

**Output:**
- Tip Amount
- Total with Tip
- Amount per Person

### Calculator 7: Fuel Cost Calculator
File: `app/calculators/fuel-cost/page.tsx`

**Inputs:**
- Distance (miles) - number input
- Fuel Economy (MPG) - number input
- Fuel Price ($/gallon) - number input

**Calculation Logic:**
```javascript
const gallonsNeeded = distance / fuelEconomy;
const totalCost = gallonsNeeded * fuelPrice;
const costPerMile = fuelPrice / fuelEconomy;
```

**Output:**
- Total Fuel Cost
- Gallons Needed
- Cost per Mile

### Calculator 8: Voltage Drop Calculator
File: `app/calculators/voltage-drop/page.tsx`

**Inputs:**
- Wire Gauge - dropdown (14, 12, 10, 8, 6, 4, 2, 0 AWG)
- Distance (feet) - number input
- Amperage - number input
- Voltage - dropdown (12V, 24V, 120V, 240V)

**Calculation Logic:**
```javascript
// Resistance per 1000ft for each gauge
const resistance = {
  '14': 2.525,
  '12': 1.588,
  '10': 0.999,
  '8': 0.628,
  '6': 0.395,
  '4': 0.249,
  '2': 0.156,
  '0': 0.098
};

const voltageDrop = (2 * resistance[gauge] * distance * amperage) / 1000;
const voltageDropPercent = (voltageDrop / voltage) * 100;
```

**Output:**
- Voltage Drop (V)
- Percentage Drop
- Warning if over 3% (excessive drop)

## Phase 5: About Page

File: `app/about/page.tsx`

**Content:**
- What is Calculily
- Mission statement
- Privacy policy basics
- Contact information
- Link to suggest new calculators

## Phase 6: SEO & Metadata

### Requirements for EVERY calculator page:
```typescript
export const metadata = {
  title: '[Calculator Name] | Calculily',
  description: '[SEO-optimized description]',
  keywords: '[relevant, keywords, here]',
  openGraph: {
    title: '[Calculator Name]',
    description: '[Description]',
    type: 'website',
  },
}
```

### Create sitemap
File: `public/sitemap.xml`
- List all calculator pages
- Homepage
- About page

### Create robots.txt
File: `public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://calculily.com/sitemap.xml
```

## Phase 7: Testing Requirements

### Functionality Tests
For each calculator:
1. Test with valid inputs - verify calculations are correct
2. Test with edge cases (0, negative numbers, very large numbers)
3. Test with empty inputs - should show validation or disable calculate button
4. Test on mobile viewport
5. Test keyboard navigation

### SEO Tests
1. Verify all meta tags are present
2. Check heading hierarchy (h1, h2, h3)
3. Verify internal links work
4. Test page load speed

### Cross-browser Tests
- Chrome
- Firefox
- Safari
- Mobile browsers

## Phase 8: Deployment

### Build for production:
```bash
npm run build
```

### Deploy to Cloudflare Pages:
1. Push to GitHub repository
2. Connect repository to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `out`
5. Node version: 18+

### Post-deployment:
1. Verify all pages load correctly
2. Submit sitemap to Google Search Console
3. Set up Google Analytics
4. Apply for Google AdSense (need traffic first)

## Phase 9: Future Enhancements (Post-MVP)

- [ ] Add more calculators based on user requests
- [ ] Implement calculator history (localStorage)
- [ ] Add "Share Results" functionality
- [ ] Create embeddable calculator widgets
- [ ] Add dark/light theme toggle (optional)
- [ ] Implement search functionality for calculators
- [ ] Add calculator categories/tags
- [ ] Create API endpoints for calculator logic (for potential mobile app)

## Development Notes

### Code Style
- Use TypeScript for type safety
- Use functional components with hooks
- Keep calculation logic in separate functions
- Add comments for complex calculations
- Use CSS Modules for scoped styling

### Performance
- Keep bundle size small
- Use Next.js Image component if adding images
- Minimize dependencies
- Static export for fast loading

### Accessibility
- Proper labels for all inputs
- Keyboard navigation support
- ARIA labels where appropriate
- Good color contrast (already handled with dark theme)

## File Naming Conventions
- Components: PascalCase (CalculatorLayout.tsx)
- Pages: kebab-case (wire-gauge/page.tsx)
- Styles: module.css (CalculatorLayout.module.css)
- Utilities: camelCase (calculators.ts)

## Git Workflow
```bash
git init
git add .
git commit -m "Initial commit: Calculily calculator website"
git branch -M main
git remote add origin [your-repo-url]
git push -u origin main
```

## Success Criteria
- [ ] All 8 calculators functional and accurate
- [ ] Mobile responsive on all pages
- [ ] SEO metadata on all pages
- [ ] Builds successfully for Cloudflare Pages
- [ ] All internal links working
- [ ] Clean, minimal dark design throughout
- [ ] Fast page load times (<2s)
- [ ] Accessible (keyboard navigation, labels)

---

## Quick Start Commands

```bash
# Create project
npx create-next-app@latest calculily --typescript --app --no-tailwind

# Install and run
cd calculily
npm install
npm run dev

# Build for production
npm run build

# Preview production build
npx serve@latest out
```

## Calculator Priority Order
1. Wire Gauge (most complex, test the architecture)
2. Tip Calculator (simplest, quick win)
3. Mortgage Calculator (common use case)
4. LED Power (your interest area)
5. Etsy Pricing (your business need)
6. Loan Calculator
7. Fuel Cost Calculator
8. Voltage Drop Calculator

Start with Wire Gauge and Tip calculators to validate the design and component structure before building the rest.
