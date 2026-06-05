"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, getEffectivePrice } from "@/lib/format";
import { getDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { useToast } from "@/components/providers/notification-provider";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function ProductCardComponent({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const setQuickViewProduct = useUIStore((s) => s.setQuickViewProduct);
  const openCart = useUIStore((s) => s.openCart);
  const { toast } = useToast();

  const effectivePrice = getEffectivePrice(product.price, product.salePrice);
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
    toast(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast(isInWishlist ? "Removed from wishlist" : "Added to wishlist", "info");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border bg-card overflow-hidden interactive-card transition-transform duration-300 hover:-translate-y-1",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-muted/30 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <Badge variant="sale">-{getDiscountPercentage(product.price, product.salePrice!)}%</Badge>
            )}
            {product.isNewArrival && <Badge variant="new">New</Badge>}
            {product.isFlashSale && <Badge variant="sale">Flash</Badge>}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              <Heart className={cn("h-4 w-4", isInWishlist && "fill-accent text-accent")} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={handleQuickView}
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <Button className="w-full" variant="accent" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingBag className="h-4 w-4" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>

        <div className="p-3 space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{product.brand}</p>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{formatPrice(effectivePrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
