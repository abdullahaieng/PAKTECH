import type { Product } from "@/types";
import { getDatabase, updateDatabase } from "@/lib/db/file-store";

export function getAllProducts(): Product[] {
  return getDatabase().products;
}

export function getProductById(id: string): Product | undefined {
  return getDatabase().products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getDatabase().products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.isFeatured);
}

export function getBestSellers(): Product[] {
  return getAllProducts().filter((p) => p.isBestSeller);
}

export function getNewArrivals(): Product[] {
  return getAllProducts().filter((p) => p.isNewArrival);
}

export function getFlashSaleProducts(): Product[] {
  return getAllProducts().filter((p) => p.isFlashSale);
}

export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const product = getProductBySlug(slug);
  if (!product) return [];
  return getAllProducts()
    .filter((p) => p.category === product.category && p.slug !== slug)
    .slice(0, limit);
}

export function getPriceRange(): { min: number; max: number } {
  const products = getAllProducts();
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.salePrice ?? p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function filterProducts(options: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}): Product[] {
  let filtered = [...getAllProducts()];

  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (options.category && options.category !== "all") {
    filtered = filtered.filter((p) => p.category === options.category);
  }

  if (options.minPrice !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice ?? p.price) >= options.minPrice!);
  }

  if (options.maxPrice !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice ?? p.price) <= options.maxPrice!);
  }

  switch (options.sortBy) {
    case "price-asc":
      filtered.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      break;
    case "price-desc":
      filtered.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      break;
    default:
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return filtered;
}

export function createProduct(data: Omit<Product, "id">): Product {
  const product: Product = { ...data, id: `prod-${Date.now()}` };
  updateDatabase((db) => {
    db.products.unshift(product);
    const cat = db.categories.find((c) => c.slug === product.category);
    if (cat) cat.productCount += 1;
  });
  return product;
}

export function updateProduct(id: string, data: Partial<Product>): Product | null {
  let updated: Product | null = null;
  updateDatabase((db) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return;
    const product = { ...db.products[index], ...data, id };
    if ("salePrice" in data && data.salePrice === undefined) {
      delete product.salePrice;
    }
    db.products[index] = product;
    updated = product;
  });
  return updated;
}

export function deleteProduct(id: string): boolean {
  let deleted = false;
  updateDatabase((db) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return;
    const product = db.products[index];
    db.products.splice(index, 1);
    const cat = db.categories.find((c) => c.slug === product.category);
    if (cat && cat.productCount > 0) cat.productCount -= 1;
    deleted = true;
  });
  return deleted;
}

export function decrementStock(productId: string, quantity: number): boolean {
  let success = false;
  updateDatabase((db) => {
    const product = db.products.find((p) => p.id === productId);
    if (!product || product.stock < quantity) return;
    product.stock -= quantity;
    success = true;
  });
  return success;
}

export function incrementStock(productId: string, quantity: number): void {
  updateDatabase((db) => {
    const product = db.products.find((p) => p.id === productId);
    if (product) product.stock += quantity;
  });
}

export function getProductsOnSale(): Product[] {
  return getAllProducts().filter((p) => p.salePrice && p.salePrice < p.price);
}

export function applyBulkSale(options: {
  percentOff: number;
  category?: string;
  flashSale?: boolean;
}): { updated: number } {
  let updated = 0;
  updateDatabase((db) => {
    for (const product of db.products) {
      if (options.category && options.category !== "all" && product.category !== options.category) {
        continue;
      }
      product.salePrice = Math.round(product.price * (1 - options.percentOff / 100));
      if (options.flashSale) product.isFlashSale = true;
      updated++;
    }
  });
  return { updated };
}

export function clearSales(options?: { category?: string }): { updated: number } {
  let updated = 0;
  updateDatabase((db) => {
    for (const product of db.products) {
      if (options?.category && options.category !== "all" && product.category !== options.category) {
        continue;
      }
      if (product.salePrice || product.isFlashSale) {
        delete product.salePrice;
        product.isFlashSale = false;
        updated++;
      }
    }
  });
  return { updated };
}

export function removeProductSale(id: string): Product | null {
  return updateProduct(id, { salePrice: undefined, isFlashSale: false });
}
