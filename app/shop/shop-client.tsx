"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Category, Product } from "@/types";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { Pagination } from "@/components/shared/pagination";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PAGINATION } from "@/lib/constants";
import { useDebounce } from "@/hooks/use-client";

export interface ShopInitialData {
  categories: Category[];
  priceRange: { min: number; max: number };
  products: Product[];
}

function ShopContent({ initial }: { initial: ShopInitialData }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initial.priceRange.min,
    initial.priceRange.max,
  ]);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState(initial.products);
  const [loading, setLoading] = useState(false);
  const skipFetch = useRef(true);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (skipFetch.current) {
      skipFetch.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category !== "all") params.set("category", category);
    params.set("sort", sortBy);
    params.set("minPrice", String(priceRange[0]));
    params.set("maxPrice", String(priceRange[1]));

    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setProducts(json.data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedSearch, category, sortBy, priceRange]);

  const totalPages = Math.ceil(products.length / PAGINATION.productsPerPage);
  const paginatedProducts = useMemo(
    () => products.slice((page - 1) * PAGINATION.productsPerPage, page * PAGINATION.productsPerPage),
    [products, page]
  );

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setSortBy("featured");
    setPriceRange([initial.priceRange.min, initial.priceRange.max]);
    setPage(1);
  };

  const breadcrumbLabel =
    category !== "all"
      ? category.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "Shop";

  const filterProps = {
    selectedCategory: category,
    priceRange,
    priceBounds: initial.priceRange,
    categories: initial.categories,
    onCategoryChange: (c: string) => { setCategory(c); setPage(1); },
    onPriceChange: (range: [number, number]) => { setPriceRange(range); setPage(1); },
    onReset: handleReset,
  };

  return (
    <div className="container-custom py-8">
      <Breadcrumbs items={[{ label: breadcrumbLabel }]} className="mb-6" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{breadcrumbLabel}</h1>
          <p className="text-muted-foreground mt-1">{products.length} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar defaultValue={search} onSearch={setSearch} className="w-full md:w-64" />
          <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterSidebar {...filterProps} className="mt-6" />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border p-5">
            <FilterSidebar {...filterProps} />
          </div>
        </aside>

        <div>
          <ProductGrid products={paginatedProducts} loading={loading} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-10"
          />
        </div>
      </div>
    </div>
  );
}

export function ShopClient({ initial }: { initial: ShopInitialData }) {
  return (
    <Suspense fallback={<div className="container-custom py-8"><ProductGrid products={[]} loading /></div>}>
      <ShopContent initial={initial} />
    </Suspense>
  );
}
