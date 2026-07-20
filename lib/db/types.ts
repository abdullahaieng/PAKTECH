import type {
  Category,
  ContactMessage,
  Coupon,
  FAQ,
  Order,
  PasswordResetToken,
  Product,
  StoreSettings,
  TeamMember,
  Testimonial,
  User,
} from "@/types";

export interface BrandStat {
  label: string;
  value: string;
}

export interface StoreDatabase {
  products: Product[];
  categories: Category[];
  orders: Order[];
  coupons: Coupon[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  teamMembers: TeamMember[];
  brandStats: BrandStat[];
  contactMessages: ContactMessage[];
  users: User[];
  passwordResetTokens: PasswordResetToken[];
  settings: StoreSettings;
  version: number;
}
