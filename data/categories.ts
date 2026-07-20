import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "AirPods & Earbuds",
    slug: "airpods-earbuds",
    description: "Premium wireless earbuds and AirPods alternatives",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
    productCount: 5,
  },
  {
    id: "cat-2",
    name: "Smart Watches",
    slug: "smart-watches",
    description: "Feature-rich smartwatches for every lifestyle",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    productCount: 4,
  },
  {
    id: "cat-3",
    name: "Power Banks",
    slug: "power-banks",
    description: "High-capacity portable chargers",
    image: "https://images.unsplash.com/photo-1609091839311-9f637c0d2a9f?w=600&h=600&fit=crop",
    productCount: 4,
  },
  {
    id: "cat-4",
    name: "Fast Chargers",
    slug: "fast-chargers",
    description: "GaN and PD fast charging solutions",
    image: "https://images.unsplash.com/photo-1583863788437-eb7e5672c4e9?w=600&h=600&fit=crop",
    productCount: 4,
  },
  {
    id: "cat-5",
    name: "USB Cables",
    slug: "usb-cables",
    description: "Durable braided and fast-charging cables",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    productCount: 3,
  },
  {
    id: "cat-6",
    name: "Bluetooth Speakers",
    slug: "bluetooth-speakers",
    description: "Portable speakers with premium sound",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    productCount: 3,
  },
  {
    id: "cat-7",
    name: "Gaming Accessories",
    slug: "gaming-accessories",
    description: "Pro gaming gear for competitive players",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop",
    productCount: 4,
  },
  {
    id: "cat-8",
    name: "Mobile Accessories",
    slug: "mobile-accessories",
    description: "Cases, stands, and phone essentials",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
    productCount: 4,
  },
  {
    id: "cat-9",
    name: "Car Accessories",
    slug: "car-accessories",
    description: "Smart car mounts and chargers",
    image: "https://images.unsplash.com/photo-1449965405229-59775e25960?w=600&h=600&fit=crop",
    productCount: 3,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}
