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
        "group relative rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-500 ease-out",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Frame */}
        <div className="relative aspect-square bg-secondary/30 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/[0.04] via-transparent to-transparent" />
 
          {/* Badges on Top-Left */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <Badge variant="sale" className="font-extrabold uppercase text-[10px] tracking-wider">
                -{getDiscountPercentage(product.price, product.salePrice!)}%
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge variant="new" className="font-extrabold uppercase text-[10px] tracking-wider">
                New
              </Badge>
            )}
            {product.isFlashSale && (
              <Badge variant="sale" className="bg-amber-500 text-white font-extrabold uppercase text-[10px] tracking-wider animate-pulse-glow">
                Flash
              </Badge>
            )}
          </div>
 
          {/* Quick Actions Panel on Top-Right */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 translate-y-[-8px] group-hover:translate-y-0 transition-all duration-300">
            <Button
              size="icon"
              className="h-9 w-9 rounded-full shadow-md bg-background/95 hover:bg-background border border-border/40 text-foreground/80 hover:text-red-500 transition-all duration-200"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              <Heart className={cn("h-4 w-4 transition-transform active:scale-75", isInWishlist && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded-full shadow-md bg-background/95 hover:bg-background border border-border/40 text-foreground/80 hover:text-primary transition-all duration-200"
              onClick={handleQuickView}
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
 
          {/* Hover Slide-up Add to Cart Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <Button className="w-full rounded-2xl shadow-lg font-bold" variant="accent" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingBag className="h-4 w-4" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
 
        {/* Product Details */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{product.brand}</p>
            {/* Rating pill */}
            <div className="flex items-center gap-1 rounded-full px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-border/50 text-[11px] font-bold text-foreground/80">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
              <span>{product.rating}</span>
            </div>
          </div>
          
          <h3 className="font-bold text-sm leading-snug line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors duration-200 h-10">
            {product.name}
          </h3>
 
          <div className="flex items-baseline gap-2.5 pt-1.5 border-t border-border/10">
            <span className="font-extrabold text-base text-primary">{formatPrice(effectivePrice)}</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through font-medium">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
