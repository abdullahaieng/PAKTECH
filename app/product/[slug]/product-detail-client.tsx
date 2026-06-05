"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Minus, Plus, ShoppingBag, Heart, Star, Truck, Shield, RotateCcw, Zap, Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { useToast } from "@/components/providers/notification-provider";
import { formatPrice, getEffectivePrice } from "@/lib/format";
import { getDiscountPercentage } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  categoryName: string;
}

export function ProductDetailClient({ product, relatedProducts, categoryName }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const { toast } = useToast();

  const effectivePrice = getEffectivePrice(product.price, product.salePrice);
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
    toast(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    window.location.href = "/checkout";
  };

  return (
    <div className="container-custom py-8">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: categoryName, href: `/shop?category=${product.category}` },
          { label: product.name },
        ]}
        className="mb-6"
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="space-y-4">
          <div
            className={cn(
              "relative aspect-square rounded-xl overflow-hidden bg-secondary cursor-zoom-in",
              zoomed && "cursor-zoom-out"
            )}
            onClick={() => setZoomed(!zoomed)}
          >
            <motion.div
              animate={{ scale: zoomed ? 1.5 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            {hasDiscount && (
              <Badge variant="sale" className="absolute top-4 left-4">
                -{getDiscountPercentage(product.price, product.salePrice!)}%
              </Badge>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                  selectedImage === i ? "border-accent" : "border-transparent"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(effectivePrice)}</span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>

          <div className="flex flex-wrap gap-2">
            {product.features.slice(0, 4).map((f) => (
              <Badge key={f} variant="secondary">{f}</Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-destructive font-medium">Out of Stock</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant="accent" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingBag className="h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" className="flex-1" onClick={handleBuyNow} disabled={product.stock === 0}>
              <Zap className="h-5 w-5" /> Buy Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => toggleWishlist(product)}>
              <Heart className={cn("h-5 w-5", isInWishlist && "fill-red-500 text-red-500")} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => toast("Link copied!", "info")}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-accent" />
              <span className="font-medium">Free Shipping</span>
              <span className="text-xs text-muted-foreground">Orders over Rs. 5,000</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="h-5 w-5 text-accent" />
              <span className="font-medium">Original</span>
              <span className="text-xs text-muted-foreground">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-5 w-5 text-accent" />
              <span className="font-medium">7-Day Return</span>
              <span className="text-xs text-muted-foreground">Easy returns</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewsCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <p className="text-muted-foreground leading-relaxed max-w-3xl">{product.description}</p>
          <ul className="mt-4 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="specifications" className="mt-6">
          <div className="max-w-lg rounded-xl border overflow-hidden">
            {Object.entries(product.specifications).map(([key, value], i) => (
              <div key={key} className={cn("flex justify-between px-4 py-3 text-sm", i % 2 === 0 && "bg-secondary/50")}>
                <span className="font-medium">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6 max-w-2xl">
            {product.reviews?.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.city}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}
