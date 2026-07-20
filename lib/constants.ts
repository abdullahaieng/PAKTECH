export const SITE_CONFIG = {
  name: "PakTech",
  title: "PakTech — Premium Tech Accessories in Pakistan",
  description:
    "Pakistan's premier destination for premium tech accessories. AirPods, smart watches, power banks, chargers, and more with nationwide delivery and Cash on Delivery.",
  url: "https://paktech.pk",
  ogImage: "/og-image.jpg",
  phone: "+92 343 4324106",
  whatsapp: "923434324106",
  email: "hasnainrao512@gmail.com",
  address: "Shop 12, Tech Plaza, Main Boulevard, Gulberg III, Lahore, Pakistan",
  social: {
    facebook: "https://www.facebook.com/share/14WoaJhjjKY/",
    instagram: "https://instagram.com/paktech97",
    twitter: "https://twitter.com/paktech",
  },
} as const;

export const SHIPPING_CONFIG = {
  freeShippingThreshold: 0,
  standardShipping: 0,
  expressShipping: 0,
} as const;

export const PAGINATION = {
  productsPerPage: 12,
} as const;

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Islamabad",
  "Gilgit-Baltistan",
  "AJK",
] as const;

export const TRUST_BADGES = [
  { label: "100% Original", icon: "Shield" },
  { label: "Cash on Delivery", icon: "Banknote" },
  { label: "7-Day Returns", icon: "RotateCcw" },
  { label: "Nationwide Shipping", icon: "Truck" },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const MEGA_MENU_CATEGORIES = [
  { label: "AirPods & Earbuds", href: "/shop?category=airpods-earbuds", icon: "Headphones" },
  { label: "Smart Watches", href: "/shop?category=smart-watches", icon: "Watch" },
  { label: "Power Banks", href: "/shop?category=power-banks", icon: "Battery" },
  { label: "Fast Chargers", href: "/shop?category=fast-chargers", icon: "Zap" },
  { label: "USB Cables", href: "/shop?category=usb-cables", icon: "Cable" },
  { label: "Bluetooth Speakers", href: "/shop?category=bluetooth-speakers", icon: "Speaker" },
  { label: "Gaming Accessories", href: "/shop?category=gaming-accessories", icon: "Gamepad2" },
  { label: "Mobile Accessories", href: "/shop?category=mobile-accessories", icon: "Smartphone" },
  { label: "Car Accessories", href: "/shop?category=car-accessories", icon: "Car" },
] as const;
