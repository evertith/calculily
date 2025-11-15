# Amazon Affiliate Integration for Calculily

## Overview
Add Amazon affiliate product recommendations to calculators to generate passive income. Products should be genuinely helpful and relevant to the calculator's purpose.

---

## Component: ProductRecommendation

**File:** `components/ProductRecommendation.tsx`

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
}

export default function ProductRecommendation({ 
  title = "Recommended Tools & Supplies",
  products,
  disclaimer = true 
}: ProductRecommendationProps) {
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

## Styles: ProductRecommendation.module.css

**File:** `components/ProductRecommendation.module.css`

```css
.container {
  margin: 40px 0;
  padding: 30px;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 24px;
  text-align: center;
}

.productGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.productCard {
  background-color: #0a0a0a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
}

.productCard:hover {
  transform: translateY(-4px);
  border-color: #555;
}

.imageWrapper {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 10px;
}

.productImage {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.productInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.productName {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.4;
  min-height: 44px; /* Ensure consistent height */
}

.description {
  font-size: 13px;
  color: #aaa;
  margin-bottom: 12px;
  line-height: 1.5;
  flex: 1;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.rating {
  font-size: 14px;
  color: #ffa500;
  margin-bottom: 12px;
}

.button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #ffffff;
  color: #000;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s;
  margin-top: auto;
}

.button:hover {
  background-color: #e0e0e0;
}

.disclaimer {
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-top: 20px;
  font-style: italic;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  
  .productGrid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .imageWrapper {
    height: 180px;
  }
}
```

---

## Affiliate Links Configuration File

**File:** `lib/affiliateLinks.ts`

This is where you'll paste all your Amazon affiliate links. Claude Code will import from here.

```typescript
// Amazon Affiliate Links for Calculily
// Store ID: evertith
// Generated: [Date you create them]

export interface AffiliateProduct {
  name: string;
  imageUrl: string;
  affiliateLink: string;
  price?: string;
  rating?: number;
  description?: string;
  category: string[];
}

export const affiliateProducts: AffiliateProduct[] = [
  // ELECTRICAL TOOLS (for Wire Gauge, Voltage Drop, LED Power calculators)
  {
    name: "Klein Tools Wire Stripper/Cutter",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg", // Replace with actual Amazon image
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$24.99",
    rating: 4.8,
    description: "Professional grade wire stripper for 10-20 AWG solid and 12-22 AWG stranded wire.",
    category: ["electrical", "wire-gauge", "voltage-drop"]
  },
  {
    name: "Fluke 117 Digital Multimeter",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$179.99",
    rating: 4.7,
    description: "Professional electrician's multimeter with voltage detection and auto-ranging.",
    category: ["electrical", "voltage-drop", "led-power"]
  },
  {
    name: "Wire Gauge Measuring Tool",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$8.99",
    rating: 4.5,
    description: "Quickly identify wire gauge sizes from AWG 0 to 36.",
    category: ["electrical", "wire-gauge"]
  },
  {
    name: "Electrical Wire Assortment Kit",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$32.99",
    rating: 4.6,
    description: "560pcs wire connector kit with multiple gauges for all your electrical projects.",
    category: ["electrical", "wire-gauge"]
  },
  
  // LED/CHRISTMAS LIGHT SUPPLIES (for LED Power calculator)
  {
    name: "Mean Well 12V 30A Power Supply",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$45.99",
    rating: 4.7,
    description: "350W switching power supply, perfect for LED strips and Christmas lights.",
    category: ["led-power"]
  },
  {
    name: "WS2812B Individually Addressable LED Strip",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$18.99",
    rating: 4.4,
    description: "16.4ft RGB LED strip with 300 pixels, perfect for WLED projects.",
    category: ["led-power"]
  },
  
  // PAINTING SUPPLIES (for Paint Calculator)
  {
    name: "Purdy Paint Roller and Brush Set",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$39.99",
    rating: 4.8,
    description: "Professional painter's kit with premium roller and brushes.",
    category: ["paint"]
  },
  {
    name: "ScotchBlue Painter's Tape",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$12.99",
    rating: 4.7,
    description: "Multi-surface painter's tape for clean, sharp paint lines.",
    category: ["paint"]
  },
  {
    name: "Canvas Drop Cloths (4-Pack)",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$24.99",
    rating: 4.5,
    description: "Heavy-duty canvas drop cloths to protect your floors and furniture.",
    category: ["paint"]
  },
  
  // CONCRETE TOOLS (for Concrete Calculator)
  {
    name: "Marshalltown Concrete Finishing Trowel",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$29.99",
    rating: 4.8,
    description: "Professional-grade finishing trowel for smooth concrete surfaces.",
    category: ["concrete"]
  },
  {
    name: "Concrete Mixing Paddle for Drill",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$19.99",
    rating: 4.6,
    description: "Heavy-duty mixing paddle attachment for fast concrete mixing.",
    category: ["concrete"]
  },
  {
    name: "6 Cu Ft Wheelbarrow",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$89.99",
    rating: 4.5,
    description: "Heavy-duty wheelbarrow perfect for concrete and construction projects.",
    category: ["concrete", "fence", "deck"]
  },
  
  // ETSY SELLER SUPPLIES (for Etsy Pricing Calculator)
  {
    name: "Shipping Label Printer",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$199.99",
    rating: 4.6,
    description: "Thermal label printer for fast, professional shipping labels.",
    category: ["etsy-pricing"]
  },
  {
    name: "Poly Mailers 100-Pack",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$16.99",
    rating: 4.7,
    description: "Durable poly mailers for safe product shipping.",
    category: ["etsy-pricing"]
  },
  {
    name: "Thank You Cards for Small Business",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$12.99",
    rating: 4.8,
    description: "100 premium thank you cards to include with orders.",
    category: ["etsy-pricing"]
  },
  
  // LUMBER/CONSTRUCTION TOOLS (for Lumber, Fence, Deck calculators)
  {
    name: "DeWalt Cordless Circular Saw",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$199.99",
    rating: 4.8,
    description: "20V MAX circular saw perfect for cutting lumber and decking.",
    category: ["lumber", "fence", "deck"]
  },
  {
    name: "Milwaukee Tape Measure 25ft",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$19.99",
    rating: 4.7,
    description: "Heavy-duty tape measure with reinforced frame.",
    category: ["lumber", "concrete", "fence", "deck", "paint"]
  },
  {
    name: "Carpenter's Square",
    imageUrl: "https://m.media-amazon.com/images/I/71VxXxXxXx.jpg",
    affiliateLink: "https://www.amazon.com/dp/PRODUCTID?tag=evertith-20", // YOU FILL THIS IN
    price: "$12.99",
    rating: 4.6,
    description: "Essential tool for accurate framing and layout work.",
    category: ["lumber", "fence", "deck"]
  },

  // Add more products as you create affiliate links...
  
];

// Helper function to get products by category
export function getProductsByCategory(category: string): AffiliateProduct[] {
  return affiliateProducts.filter(product => 
    product.category.includes(category)
  );
}

// Helper function to get random products from category (for variety)
export function getRandomProducts(category: string, count: number = 3): AffiliateProduct[] {
  const products = getProductsByCategory(category);
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
```

---

## Implementation Instructions for Claude Code

### Step 1: Create the Component Files

1. Create `components/ProductRecommendation.tsx` with the component code above
2. Create `components/ProductRecommendation.module.css` with the styles above
3. Create `lib/affiliateLinks.ts` with the products array structure above

### Step 2: User Will Fill in Affiliate Links

The user (Seth) will:
1. Go to Amazon and find recommended products
2. Generate Amazon Associate links for each product
3. Get the product image URLs from Amazon
4. Fill in the `affiliateLinks.ts` file with real data
5. Provide you with the completed file

### Step 3: Add Product Recommendations to Calculators

For each calculator, import and use the component like this:

**Example: Wire Gauge Calculator**

```typescript
import ProductRecommendation from '@/components/ProductRecommendation';
import { getRandomProducts } from '@/lib/affiliateLinks';

// Inside your calculator page component:
export default function WireGaugeCalculator() {
  const [result, setResult] = useState(null);
  
  // Get products for this calculator
  const recommendedProducts = getRandomProducts('wire-gauge', 3);
  
  return (
    <CalculatorLayout
      title="Wire Gauge Calculator"
      description="Calculate the proper wire gauge for your electrical project"
    >
      {/* Calculator inputs and logic */}
      
      {result && (
        <>
          {/* Display results */}
          <div className={styles.results}>
            <h2>Recommended Wire Gauge: {result.gauge}</h2>
            <p>Voltage Drop: {result.voltageDrop}V</p>
          </div>
          
          {/* Add product recommendations AFTER results */}
          <ProductRecommendation 
            title="Recommended Electrical Tools"
            products={recommendedProducts}
          />
        </>
      )}
    </CalculatorLayout>
  );
}
```

### Step 4: Add to These Calculators (Priority Order)

1. **Wire Gauge Calculator** - category: `'wire-gauge'`
2. **LED Power Calculator** - category: `'led-power'`
3. **Paint Calculator** - category: `'paint'`
4. **Concrete Calculator** - category: `'concrete'`
5. **Etsy Pricing Calculator** - category: `'etsy-pricing'`
6. **Lumber Calculator** - category: `'lumber'`
7. **Fence Calculator** - category: `'fence'`
8. **Deck Calculator** - category: `'deck'`
9. **Voltage Drop Calculator** - category: `'voltage-drop'`

### Step 5: Add Disclaimer to Footer

Update `components/Footer.tsx` to include:

```typescript
<footer className={styles.footer}>
  <div className={styles.footerContent}>
    <p>© 2025 Calculily • Your toolkit for everyday calculations</p>
    <p className={styles.disclaimer}>
      As an Amazon Associate, I earn from qualifying purchases.
    </p>
    <nav className={styles.footerNav}>
      <a href="/about">About</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
</footer>
```

---

## Best Practices (Following Pro Tips)

✅ **Helpful, Not Pushy**
- Title is "Recommended Tools" not "BUY THESE NOW"
- Products shown AFTER calculator results (value first)
- Optional disclaimer explains commissions help keep site free

✅ **Specific Products**
- Use actual product names with model numbers
- Include ratings and prices for transparency
- Short descriptions explain why product is useful

✅ **Images Included**
- Product card design prominently features images
- White background for product images (Amazon standard)
- Consistent image sizing

✅ **FTC Disclosure**
- Disclaimer on every product recommendation section
- Additional disclosure in footer
- Links have `rel="sponsored"` attribute

✅ **Mobile-Friendly**
- Responsive grid (1 column on mobile, 2-3 on desktop)
- Touch-friendly buttons
- Optimized image loading

---

## Getting Product Information from Amazon

When creating your affiliate links:

1. **Find product on Amazon**
2. **Click "Get Link" in Amazon Associates toolbar** (or use SiteStripe)
3. **Copy the full product URL with your tag** (should include `tag=evertith-20`)
4. **Right-click product image** → "Copy Image Address" for imageUrl
5. **Copy product name** from page title
6. **Copy current price** (optional, can update periodically)
7. **Copy star rating** from reviews (optional)

---

## Testing Checklist

After implementation:
- [ ] Affiliate links include `?tag=evertith-20`
- [ ] Links open in new tab
- [ ] Links have `rel="noopener noreferrer sponsored"`
- [ ] Images load correctly
- [ ] Disclaimer is visible
- [ ] Mobile layout looks good
- [ ] Products are relevant to calculator
- [ ] Test a purchase to verify commission tracking

---

## Performance Tips

- **Lazy load product images** to keep calculator fast
- **Limit to 3-4 products per calculator** (don't overwhelm)
- **Rotate products** using `getRandomProducts()` for variety
- **Update prices quarterly** (or remove price if it changes frequently)

---

## File for User to Provide

Seth needs to create a file called `affiliateLinks-data.ts` with this format:

```typescript
// Just copy the products array from above and fill in YOUR affiliate links

export const myAffiliateProducts = [
  {
    name: "Klein Tools Wire Stripper/Cutter",
    imageUrl: "PASTE_AMAZON_IMAGE_URL_HERE",
    affiliateLink: "PASTE_YOUR_AFFILIATE_LINK_HERE",
    price: "$24.99",
    rating: 4.8,
    description: "Professional grade wire stripper for 10-20 AWG solid and 12-22 AWG stranded wire.",
    category: ["electrical", "wire-gauge", "voltage-drop"]
  },
  // ... add more products
];
```

Once Seth provides this file, Claude Code can just import it and use it!

---

## Summary for Claude Code

1. Create the `ProductRecommendation` component
2. Create the `affiliateLinks.ts` file structure
3. Wait for Seth to provide completed affiliate links file
4. Import and add `<ProductRecommendation>` to priority calculators
5. Add footer disclaimer
6. Test affiliate links work
7. Deploy!

This will generate passive income while providing genuine value to users. Win-win! 🚀
