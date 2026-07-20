import type { Product } from "@/types";
import type { StoreDatabase } from "./types";
import { createSeedDatabase } from "./seed";

let seedDefaults: StoreDatabase | null = null;

function getSeedDefaults(): StoreDatabase {
  if (!seedDefaults) seedDefaults = createSeedDatabase();
  return seedDefaults;
}

function pickArrayOrSeed<T>(incoming: T[] | undefined, seed: T[]): T[] {
  if (incoming === undefined) return seed;
  return incoming;
}

function mergeProducts(incoming: Product[] | undefined, seed: Product[]): Product[] {
  if (incoming === undefined) return seed;
  if (incoming.length === 0) return [];

  const seedById = new Map(seed.map((product) => [product.id, product]));
  const seedBySlug = new Map(seed.map((product) => [product.slug, product]));

  return incoming
    .map((product) => {
      const fallback = seedById.get(product.id) ?? seedBySlug.get(product.slug);
      if (!fallback) return product;

      return {
        ...fallback,
        ...product,
        images: product.images?.length ? product.images : fallback.images,
        features: product.features?.length ? product.features : fallback.features,
        specifications: { ...fallback.specifications, ...product.specifications },
      };
    })
    .filter((product) => (product.images?.length ?? 0) > 0);
}

export function mergeData(data: Partial<StoreDatabase>): StoreDatabase {
  const seed = getSeedDefaults();
  return {
    ...seed,
    ...data,
    products: mergeProducts(data.products, seed.products),
    categories: pickArrayOrSeed(data.categories, seed.categories),
    coupons: pickArrayOrSeed(data.coupons, seed.coupons),
    settings: data.settings ?? seed.settings,
    users: data.users ?? [],
    passwordResetTokens: data.passwordResetTokens ?? [],
    orders: data.orders ?? [],
    contactMessages: data.contactMessages ?? [],
    faqs: pickArrayOrSeed(data.faqs, seed.faqs),
    testimonials: pickArrayOrSeed(data.testimonials, seed.testimonials),
    teamMembers: pickArrayOrSeed(data.teamMembers, seed.teamMembers),
    brandStats: pickArrayOrSeed(data.brandStats, seed.brandStats),
  } as StoreDatabase;
}
