import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/services/product-service";
import { ensureStoreReady } from "@/lib/db/store";
import { SITE_CONFIG } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await ensureStoreReady();
  const productUrls = getAllProducts().map((product) => ({
    url: `${SITE_CONFIG.url}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticPages = [
    { url: SITE_CONFIG.url, priority: 1 },
    { url: `${SITE_CONFIG.url}/shop`, priority: 0.9 },
    { url: `${SITE_CONFIG.url}/about`, priority: 0.7 },
    { url: `${SITE_CONFIG.url}/contact`, priority: 0.7 },
    { url: `${SITE_CONFIG.url}/cart`, priority: 0.5 },
    { url: `${SITE_CONFIG.url}/account`, priority: 0.5 },
  ].map((page) => ({
    ...page,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...productUrls];
}
