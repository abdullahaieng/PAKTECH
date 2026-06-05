import type { Category } from "@/types";
import { getDatabase, updateDatabase } from "@/lib/db/file-store";

export function getAllCategories(): Category[] {
  return getDatabase().categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getDatabase().categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}

export function createCategory(data: Omit<Category, "id" | "productCount">): Category {
  const category: Category = { ...data, id: `cat-${Date.now()}`, productCount: 0 };
  updateDatabase((db) => {
    db.categories.push(category);
  });
  return category;
}

export function updateCategory(id: string, data: Partial<Category>): Category | null {
  let updated: Category | null = null;
  updateDatabase((db) => {
    const index = db.categories.findIndex((c) => c.id === id);
    if (index === -1) return;
    db.categories[index] = { ...db.categories[index], ...data, id };
    updated = db.categories[index];
  });
  return updated;
}

export function deleteCategory(id: string): boolean {
  let deleted = false;
  updateDatabase((db) => {
    const category = db.categories.find((c) => c.id === id);
    if (!category || category.productCount > 0) return;
    db.categories = db.categories.filter((c) => c.id !== id);
    deleted = true;
  });
  return deleted;
}

export function recalculateProductCounts(): void {
  updateDatabase((db) => {
    db.categories.forEach((cat) => {
      cat.productCount = db.products.filter((p) => p.category === cat.slug).length;
    });
  });
}
