import { z } from "zod";

const CloudinaryImageUrlSchema = z.string().url().refine((url) => {
  try {
    return new URL(url).hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}, "Image must be uploaded to Cloudinary");

// Product Validation
export const ProductSchema = z.object({
  name: z.string().min(1, "Name required").max(200),
  slug: z.string().min(1, "Slug required").regex(/^[a-z0-9-]+$/),
  description: z.string().min(10, "Min 10 chars"),
  shortDescription: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  category: z.string().min(1),
  brand: z.string().min(1),
  sku: z.string().min(1),
  images: z.array(CloudinaryImageUrlSchema).min(1, "At least 1 image"),
  rating: z.number().min(0).max(5).default(0),
  reviewsCount: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isFlashSale: z.boolean().default(false),
});

export const CategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  image: z.string().url(),
  description: z.string().optional(),
  productCount: z.number().int().min(0).default(0),
});

export const OrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  shippingAddress: z.string().min(1),
  notes: z.string().optional(),
});

export type ValidatedProduct = z.infer<typeof ProductSchema>;
export type ValidatedCategory = z.infer<typeof CategorySchema>;
export type ValidatedOrder = z.infer<typeof OrderSchema>;

// Auth validation
export const RegisterSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  email: z.string().min(5).email(),
  phone: z.string().optional().nullable(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
