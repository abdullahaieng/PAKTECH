import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo";
import { getAllCategories } from "@/lib/services/category-service";
import { filterProducts, getPriceRange } from "@/lib/services/product-service";
import { ensureStoreReady } from "@/lib/db/store";
import { ShopClient } from "./shop-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = genMeta({
  title: "Shop",
  description: "Browse premium tech accessories — AirPods, smart watches, power banks, chargers, and more.",
  url: "https://paktech.pk/shop",
});

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  await ensureStoreReady();
  const priceRange = getPriceRange();
  const categories = getAllCategories();
  const products = filterProducts({
    search: sp.search,
    category: sp.category,
    sortBy: sp.sort ?? "featured",
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
  });

  return (
    <ShopClient
      initial={{
        categories,
        priceRange,
        products,
      }}
    />
  );
}
