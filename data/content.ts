import type { Testimonial, FAQ, TeamMember } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Ahmed Hassan",
    city: "Lahore",
    rating: 5,
    comment: "Ordered from PakTech — the product was completely genuine and delivered in 2 days. Highly recommended for tech lovers in Pakistan!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    product: "PakTech Pro Buds X3",
  },
  {
    id: "t-2",
    name: "Sana Mirza",
    city: "Karachi",
    rating: 5,
    comment: "Best online tech store I've found in Pakistan. COD option made it so easy to order. The smartwatch quality is amazing!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    product: "PakTech Watch Ultra",
  },
  {
    id: "t-3",
    name: "Bilal Ahmed",
    city: "Islamabad",
    rating: 4,
    comment: "The GaN charger is incredibly fast — charges my MacBook and phone at the same time. Premium packaging too.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    product: "GaN Charger 100W",
  },
  {
    id: "t-4",
    name: "Ayesha Khan",
    city: "Rawalpindi",
    rating: 5,
    comment: "Ordered via WhatsApp and got same-day confirmation. Customer service is top notch. Will order again!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    product: "FitTrack Smart Band 7",
  },
  {
    id: "t-5",
    name: "Usman Tariq",
    city: "Faisalabad",
    rating: 5,
    comment: "The gaming headset sound quality is incredible. Footsteps are crystal clear in PUBG. Worth every rupee!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    product: "Pro Gaming Headset 7.1",
  },
  {
    id: "t-6",
    name: "Maria Joseph",
    city: "Multan",
    rating: 4,
    comment: "The 30000mAh power bank lasted our entire family trip. Genuine product with warranty card. Thank you PakTech!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    product: "PowerMax 30000mAh",
  },
];

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "Do you offer Cash on Delivery (COD)?",
    answer: "Yes! We offer Cash on Delivery across Pakistan. You can pay when you receive your order. Some remote areas may require advance payment.",
  },
  {
    id: "faq-2",
    question: "How long does delivery take?",
    answer: "Major cities (Lahore, Karachi, Islamabad, Rawalpindi): 2-3 business days. Other cities: 3-5 business days. Remote areas: 5-7 business days.",
  },
  {
    id: "faq-3",
    question: "Are the products original?",
    answer: "Absolutely! We only sell 100% original, quality-checked products. Every item comes with a warranty card and authenticity guarantee.",
  },
  {
    id: "faq-4",
    question: "What is your return policy?",
    answer: "You can return an unused product within 7 days if it's defective or doesn't match the description. Return shipping is paid by the customer unless the product is defective.",
  },
  {
    id: "faq-5",
    question: "When do I get free delivery?",
    answer: "Delivery is free on every order across Pakistan.",
  },
  {
    id: "faq-6",
    question: "How do I order via WhatsApp?",
    answer: "Message us on WhatsApp with the product name or link. Our team will confirm your order and share delivery details.",
  },
  {
    id: "faq-7",
    question: "How do I claim warranty?",
    answer: "Follow the process on the warranty card included with your product, or contact our support team. Email: hasnainrao512@gmail.com or WhatsApp: +92 343 4324106",
  },
  {
    id: "faq-8",
    question: "Do you accept bulk/corporate orders?",
    answer: "Yes! Special pricing is available for corporate and bulk orders. Contact us via the contact page or email.",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "team-1",
    name: "Hasnain Rao",
    role: "Founder, CEO & Owner",
    bio: "Owner, CEO, and founder of PakTech with 10+ years in Pakistan's electronics industry. Passionate about making premium tech accessible.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
  {
    id: "team-2",
    name: "Zainab Ali",
    role: "Head of Operations",
    bio: "Ensures every order reaches customers on time with premium packaging and quality checks.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    id: "team-3",
    name: "Omar Farooq",
    role: "Product Curator",
    bio: "Handpicks every product in our catalog, ensuring only the best tech accessories make it to PakTech.",
    image: "https://images.unsplash.com/photo-1519081908943-0e06a1b60852?w=400&h=400&fit=crop",
  },
  {
    id: "team-4",
    name: "Fatima Noor",
    role: "Customer Success Lead",
    bio: "Leads our support team to deliver exceptional customer experiences across Pakistan.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
];

export const brandStats = [
  { label: "Happy Customers", value: "50,000+" },
  { label: "Products Sold", value: "200,000+" },
  { label: "Cities Covered", value: "150+" },
  { label: "Products", value: "500+" },
];
