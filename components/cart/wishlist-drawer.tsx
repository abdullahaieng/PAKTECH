"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/providers/notification-provider";
import { formatPrice, getEffectivePrice } from "@/lib/format";

export function WishlistDrawer() {
  const isOpen = useUIStore((s) => s.isWishlistOpen);
  const closeWishlist = useUIStore((s) => s.closeWishlist);
  const openCart = useUIStore((s) => s.openCart);
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product);
    openCart();
    closeWishlist();
    toast(`${product.name} added to cart!`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeWishlist}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Wishlist ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Heart className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="font-medium">Wishlist khali hai</p>
            <p className="text-sm text-muted-foreground mt-1">Save your favourite products here!</p>
            <Button className="mt-4" asChild onClick={closeWishlist}>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4">
            {items.map((product) => (
              <div key={product.id} className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-secondary">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${product.slug}`} onClick={closeWishlist} className="text-sm font-medium hover:text-accent line-clamp-2">
                    {product.name}
                  </Link>
                  <p className="text-sm font-semibold mt-1">
                    {formatPrice(getEffectivePrice(product.price, product.salePrice))}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="accent" onClick={() => handleAddToCart(product)}>
                      <ShoppingBag className="h-3.5 w-3.5" /> Add
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(product.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
