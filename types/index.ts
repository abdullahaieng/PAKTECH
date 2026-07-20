export type CategorySlug =
  | "airpods-earbuds"
  | "smart-watches"
  | "power-banks"
  | "fast-chargers"
  | "usb-cables"
  | "bluetooth-speakers"
  | "gaming-accessories"
  | "mobile-accessories"
  | "car-accessories";

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  productCount: number;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewsCount: number;
  category: CategorySlug;
  images: string[];
  stock: number;
  features: string[];
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  reviews?: ProductReview[];
  sku: string;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  avatar: string;
  product: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderLineItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderLineItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "card";
  notes?: string;
}

export interface Coupon {
  code: string;
  discount: number;
  active: boolean;
  description?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface StoreSettings {
  freeShippingThreshold: number;
  standardShipping: number;
  expressShipping: number;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
}

export type AuthProvider = "email" | "google";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  avatar?: string;
  provider: AuthProvider;
  googleId?: string;
  firebaseUid?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider: AuthProvider;
  emailVerified: boolean;
  hasPassword: boolean;
}

export interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  paymentMethod: "cod" | "card";
  notes?: string;
}

export interface ProductFilters {
  search: string;
  category: CategorySlug | "all";
  minPrice: number;
  maxPrice: number;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
  page: number;
}

export type SortOption = ProductFilters["sortBy"];

export type NotificationType = "success" | "error" | "info" | "warning" | "order" | "promo";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  href?: string;
}
