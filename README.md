# Calculily - Free Online Calculators

A collection of free, fast, and accurate online calculators built with Next.js and deployed to Cloudflare Pages.

## Features

- 🎯 8 Professional Calculators
- 🌙 Dark-themed minimal design
- 📱 Fully responsive (mobile-first)
- ⚡ Lightning-fast static site
- 🔍 SEO optimized
- ♿ Accessible (WCAG compliant)
- 🚀 Deployed on Cloudflare Pages

## Available Calculators

1. **Wire Gauge Calculator** - Calculate proper wire gauge for electrical runs
2. **Mortgage Calculator** - Calculate monthly payments and total interest
3. **Etsy Pricing Calculator** - Price handmade products profitably
4. **LED Power Calculator** - Calculate power requirements for LED strips
5. **Loan Calculator** - Calculate loan payments and amortization
6. **Tip Calculator** - Calculate tips and split bills
7. **Fuel Cost Calculator** - Calculate trip fuel costs
8. **Voltage Drop Calculator** - Calculate voltage drop over distance

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules
- **Deployment:** Cloudflare Pages (Static Export)
- **Build:** Next.js Static Export

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npx serve@latest out
```

## Project Structure

```
calculily/
├── app/
│   ├── layout.tsx                 # Root layout with Header/Footer
│   ├── page.tsx                   # Homepage with calculator grid
│   ├── about/                     # About page
│   └── calculators/               # Calculator pages
│       ├── wire-gauge/
│       ├── mortgage/
│       ├── etsy-pricing/
│       ├── led-power/
│       ├── loan/
│       ├── tip/
│       ├── fuel-cost/
│       └── voltage-drop/
├── components/
│   ├── Header.tsx                 # Site header
│   ├── Footer.tsx                 # Site footer
│   ├── CalculatorLayout.tsx       # Shared calculator layout
│   └── CalculatorCard.tsx         # Homepage calculator cards
├── styles/
│   ├── globals.css                # Global styles
│   ├── Home.module.css            # Homepage styles
│   ├── Calculator.module.css      # Shared calculator styles
│   ├── Header.module.css
│   ├── Footer.module.css
│   ├── CalculatorLayout.module.css
│   ├── CalculatorCard.module.css
│   └── About.module.css
└── public/
    ├── robots.txt                 # SEO robots file
    └── sitemap.xml                # SEO sitemap
```

## Development

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.

### Building for Production

```bash
npm run build
```

This creates an optimized static export in the `out` directory.

## Deployment to Cloudflare Pages

1. Push code to GitHub repository
2. Connect repository to Cloudflare Pages
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `out`
   - **Node version:** 18+

## SEO

- All pages have proper meta tags
- Semantic HTML structure
- Sitemap.xml included
- Robots.txt configured
- OpenGraph metadata for social sharing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

Suggestions for new calculators or improvements are welcome!

## License

MIT License - Feel free to use this project for your own purposes.

## Roadmap

Future enhancements:
- [ ] Calculator history (localStorage)
- [ ] Share results functionality
- [ ] Embeddable calculator widgets
- [ ] Dark/light theme toggle
- [ ] Search functionality
- [ ] Calculator categories/tags
- [ ] Additional calculators based on user requests

## Performance

- Static export for instant loading
- Minimal JavaScript bundle
- CSS Modules for optimized styling
- No external dependencies for calculations

## Accessibility

- ARIA labels on all inputs
- Keyboard navigation support
- High contrast dark theme
- Semantic HTML
- Screen reader friendly

---

Built with ❤️ using Next.js
