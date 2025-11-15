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
  if (!products || products.length === 0) {
    return null;
  }

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

              {product.price && product.price.trim() !== '' && (
                <p className={styles.price}>{product.price}</p>
              )}

              {product.rating && product.rating > 0 && (
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
