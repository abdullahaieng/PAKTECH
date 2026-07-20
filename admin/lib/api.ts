const API_URL = process.env.NEXT_PUBLIC_STORE_API ?? "http://localhost:3000";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("paktech-admin-token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error ?? "Request failed");
  return json.data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; email: string }>("/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getStats: () => request<DashboardStats>("/api/admin/stats"),
  getOrders: () => request<Order[]>("/api/admin/orders"),
  getOrder: (id: string) => request<Order>(`/api/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    request<Order>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteOrder: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/orders/${id}`, { method: "DELETE" }),

  getProducts: () => request<Product[]>("/api/admin/products"),
  getProduct: (id: string) => request<Product>(`/api/admin/products/${id}`),
  createProduct: (data: Partial<Product>) =>
    request<Product>("/api/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Product>) =>
    request<Product>(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/products/${id}`, { method: "DELETE" }),

  getCategories: () => request<Category[]>("/api/admin/categories"),
  createCategory: (data: Partial<Category>) =>
    request<Category>("/api/admin/categories", { method: "POST", body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/categories/${id}`, { method: "DELETE" }),

  getCoupons: () => request<Coupon[]>("/api/admin/coupons"),
  createCoupon: (data: Coupon) =>
    request<Coupon>("/api/admin/coupons", { method: "POST", body: JSON.stringify(data) }),
  updateCoupon: (code: string, data: Partial<Coupon>) =>
    request<Coupon>(`/api/admin/coupons/${encodeURIComponent(code)}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCoupon: (code: string) =>
    request<{ deleted: boolean }>(`/api/admin/coupons/${encodeURIComponent(code)}`, { method: "DELETE" }),

  getSaleProducts: () => request<{ products: Product[] }>("/api/admin/sales"),
  applySale: (data: { percentOff: number; category?: string; flashSale?: boolean }) =>
    request<{ updated: number; message: string }>("/api/admin/sales", {
      method: "POST",
      body: JSON.stringify({ action: "apply", ...data }),
    }),
  clearSales: (category?: string) =>
    request<{ updated: number; message: string }>("/api/admin/sales", {
      method: "POST",
      body: JSON.stringify({ action: "clear", category }),
    }),
  removeProductSale: (productId: string) =>
    request<Product>("/api/admin/sales", {
      method: "POST",
      body: JSON.stringify({ action: "remove", productId }),
    }),

  getSettings: () => request<StoreSettings>("/api/admin/settings"),
  updateSettings: (data: Partial<StoreSettings>) =>
    request<StoreSettings>("/api/admin/settings", { method: "PATCH", body: JSON.stringify(data) }),

  getUsers: () => request<PublicUser[]>("/api/admin/users"),

  changeAdminPassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string; devNote?: string }>("/api/admin/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider: string;
  emailVerified: boolean;
  hasPassword: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  brand: string;
  sku: string;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface OrderLineItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  items: OrderLineItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
  };
  paymentMethod: string;
}

export interface Coupon {
  code: string;
  discount: number;
  active: boolean;
  description?: string;
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
