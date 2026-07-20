"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types";
import { formatPrice } from "@/lib/format";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  selectedCategory: string;
  priceRange: [number, number];
  priceBounds: { min: number; max: number };
  categories: Category[];
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onReset: () => void;
  className?: string;
}

export function FilterSidebar({
  selectedCategory,
  priceRange,
  priceBounds,
  categories,
  onCategoryChange,
  onPriceChange,
  onReset,
  className,
}: FilterSidebarProps) {
  const [localRange, setLocalRange] = useState(priceRange);

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={selectedCategory === "all"}
              onCheckedChange={() => onCategoryChange("all")}
            />
            <span className="text-sm">All Products</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategory === cat.slug}
                onCheckedChange={() => onCategoryChange(cat.slug)}
              />
              <span className="text-sm">{cat.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider
          min={priceBounds.min}
          max={priceBounds.max}
          step={500}
          value={localRange}
          onValueChange={(v) => setLocalRange(v as [number, number])}
          onValueCommit={(v) => onPriceChange(v as [number, number])}
          className="mb-3"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(localRange[0])}</span>
          <span>{formatPrice(localRange[1])}</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}
