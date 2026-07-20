"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Heart, Star } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useToast } from "@/components/providers/notification-provider";
import { formatPrice, getEffectivePrice } from "@/lib/format";
import { getDiscountPercentage } from "@/lib/utils";

export function QuickViewModal() {
  const product = useUIStore((s) => s.quickViewProduct);
  const setQuickViewProduct = useUIStore((s) => s.setQuickViewProduct);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) =>
    product ? s.isInWishlist(product.id) : false
  );
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const effectivePrice = getEffectivePrice(product.price, product.salePrice);
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
    setQuickViewProduct(null);
    toast(`${product.name} added to cart!`);
  };

  return (
    <Dialog open={!!product} onOpenChange={() => setQuickViewProduct(null)}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square bg-secondary">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            {hasDiscount && (
              <Badge variant="sale" className="absolute top-4 left-4">
                -{getDiscountPercentage(product.price, product.salePrice!)}%
              </Badge>
            )}
          </div>
          <div className="p-6 flex flex-col">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
            <h2 className="text-xl font-semibold mt-1">{product.name}</h2>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-2xl font-bold">{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{product.shortDescription}</p>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="icon" onClick={() => toggleWishlist(product)}>
                <Heart className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
              </Button>
            </div>

            <div className="flex gap-3 mt-4">
              <Button className="flex-1" variant="accent" onClick={handleAddToCart}>
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </Button>
              <Button className="flex-1" variant="outline" asChild>
                <Link href={`/product/${product.slug}`} onClick={() => setQuickViewProduct(null)}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
