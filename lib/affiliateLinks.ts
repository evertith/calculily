// Import the affiliate products from the template file
import { myAffiliateProducts } from '../affiliateLinks-template';

export interface AffiliateProduct {
  name: string;
  imageUrl: string;
  affiliateLink: string;
  price?: string;
  rating?: number;
  description?: string;
  category: string[];
}

// Use the products from the template file
export const affiliateProducts: AffiliateProduct[] = myAffiliateProducts;

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
  return shuffled.slice(0, Math.min(count, products.length));
}

// Helper function to get specific number of products (not randomized)
export function getProducts(category: string, count: number = 3): AffiliateProduct[] {
  const products = getProductsByCategory(category);
  return products.slice(0, Math.min(count, products.length));
}
