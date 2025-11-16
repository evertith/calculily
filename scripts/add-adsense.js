#!/usr/bin/env node

/**
 * Script to add Google AdSense ad units to all calculator pages
 */

const fs = require('fs');
const path = require('path');

// List of all calculator pages to update (excluding wire-gauge which is already done)
const calculatorPages = [
  'app/calculators/voltage-drop/page.tsx',
  'app/calculators/led-power/page.tsx',
  'app/calculators/mortgage/page.tsx',
  'app/calculators/loan/page.tsx',
  'app/calculators/etsy-pricing/page.tsx',
  'app/calculators/tip/page.tsx',
  'app/calculators/fuel-cost/page.tsx',
  'app/calculators/unit-converter/page.tsx',
  'app/calculators/percentage/page.tsx',
  'app/calculators/date-calculator/page.tsx',
  'app/calculators/age-calculator/page.tsx',
  'app/calculators/sales-tax/page.tsx',
  'app/calculators/discount/page.tsx',
  'app/calculators/gpa-calculator/page.tsx',
  'app/calculators/time-zone-converter/page.tsx',
  'app/calculators/simple-interest/page.tsx',
  'app/calculators/cooking-converter/page.tsx',
  'app/calculators/concrete/page.tsx',
  'app/calculators/lumber/page.tsx',
  'app/calculators/paint/page.tsx',
  'app/calculators/fence/page.tsx',
  'app/calculators/insulation/page.tsx',
  'app/calculators/drywall/page.tsx',
  'app/calculators/deck/page.tsx',
  'app/calculators/amp-draw/page.tsx',
  'app/calculators/circuit-breaker/page.tsx',
  'app/calculators/battery-runtime/page.tsx',
  'app/calculators/solar-panel/page.tsx',
  'app/calculators/gas-mileage/page.tsx',
  'app/calculators/tire-size/page.tsx',
  'app/calculators/car-payment/page.tsx',
  'app/calculators/car-depreciation/page.tsx',
  'app/etsy-tools/fee-calculator/page.tsx',
  'app/etsy-tools/shipping-calculator/page.tsx',
  'app/etsy-tools/profit-calculator/page.tsx'
];

function updateCalculatorPage(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);

  console.log(`Processing: ${filePath}`);

  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if AdUnit is already imported
    if (content.includes('import AdUnit')) {
      console.log(`  ✓ Already updated, skipping`);
      return;
    }

    // Step 1: Add AdUnit import
    const importRegex = /(import ProductRecommendation from '@\/components\/ProductRecommendation';)/;
    if (importRegex.test(content)) {
      content = content.replace(
        importRegex,
        `$1\nimport AdUnit from '@/components/AdUnit';`
      );
    } else {
      console.log(`  ⚠ Warning: Could not find ProductRecommendation import`);
      return;
    }

    // Step 2: Add top banner ad after CalculatorLayout opening and before form
    // Look for the pattern: <CalculatorLayout...>\n      <form
    const topAdRegex = /(<CalculatorLayout[\s\S]*?>\n)(      <form)/;
    if (topAdRegex.test(content)) {
      content = content.replace(
        topAdRegex,
        `$1      {/* Top Banner Ad */}\n      <AdUnit adSlot="6981760215" className="ad-top-banner" />\n\n$2`
      );
    } else {
      console.log(`  ⚠ Warning: Could not find form start for top ad`);
    }

    // Step 3: Add mid content ad after results section and before ProductRecommendation
    const midAdRegex = /(      )\}\n\n(      <ProductRecommendation)/;
    if (midAdRegex.test(content)) {
      content = content.replace(
        midAdRegex,
        `$1}\n\n$1{/* Mid Content Square Ad - After results */}\n$1<AdUnit adSlot="6129936879" className="ad-mid-content" />\n\n$2`
      );
    } else {
      console.log(`  ⚠ Warning: Could not find ProductRecommendation for mid ad`);
    }

    // Step 4: Add sidebar ad after ProductRecommendation and before FAQ
    const sidebarAdRegex = /(      \/>\n\n)(      <FAQ)/;
    if (sidebarAdRegex.test(content)) {
      content = content.replace(
        sidebarAdRegex,
        `$1      {/* Sidebar Square Ad */}\n      <AdUnit adSlot="5668678546" className="ad-sidebar" />\n\n$2`
      );
    } else {
      console.log(`  ⚠ Warning: Could not find FAQ for sidebar ad`);
    }

    // Step 5: Add footer ad before closing CalculatorLayout
    const footerAdRegex = /(      <RelatedCalculators[\s\S]*?\/>\n)(      <\/CalculatorLayout>)/;
    if (footerAdRegex.test(content)) {
      content = content.replace(
        footerAdRegex,
        `$1\n      {/* Footer Banner Ad */}\n      <AdUnit adSlot="4136105023" className="ad-footer-banner" />\n$2`
      );
    } else {
      console.log(`  ⚠ Warning: Could not find CalculatorLayout close for footer ad`);
    }

    // Write updated content
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`  ✓ Successfully updated`);

  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error.message);
  }
}

console.log('Starting AdSense integration for all calculator pages...\n');

calculatorPages.forEach(updateCalculatorPage);

console.log('\n✓ Batch update complete!');
console.log('\nNext steps:');
console.log('1. Review the changes in git diff');
console.log('2. Test a few pages to ensure ads are loading correctly');
console.log('3. Update the Etsy Tools hub page separately (different layout)');
