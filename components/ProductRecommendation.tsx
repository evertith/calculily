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
  if (!products || products.length === 0) {
    return null;
  }

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
                loading="lazy"
              />
            </div>

            <div className={styles.productInfo}>
              <h4 className={styles.productName}>{product.name}</h4>

              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}

              {product.price && typeof product.price === 'string' && product.price.trim() !== '' && (
                <p className={styles.price}>{product.price}</p>
              )}

              {product.rating !== undefined && product.rating !== null && product.rating > 0 && (
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
