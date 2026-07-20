import { filterProducts, getAllProducts, getPriceRange } from "@/lib/services/product-service";
import { ensureStoreReady } from "@/lib/db/store";
import { ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureStoreReady();
  const { searchParams } = new URL(request.url);
  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("category") ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice") ||
    (searchParams.get("sort") && searchParams.get("sort") !== "featured");

  // Warm cache once per request
  const allProducts = getAllProducts();
  const priceRange = getPriceRange();

  const products = hasFilters
    ? filterProducts({
        search: searchParams.get("search") ?? undefined,
        category: searchParams.get("category") ?? undefined,
        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        sortBy: searchParams.get("sort") ?? "featured",
      })
    : allProducts;

  return ok({ products, priceRange });
}
