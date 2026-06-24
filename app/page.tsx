import { ProductSection } from "@/components/home/product-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { HeroBanner } from "@/components/home/hero-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { TestimonialSlider } from "@/components/home/testimonial-slider";
import { Newsletter } from "@/components/home/newsletter";
import {
  getFeaturedProducts,
  getBestSellers,
} from "@/lib/services/product-service";
import { getAllCategories } from "@/lib/services/category-service";
import { getTestimonials } from "@/lib/services/content-service";
import { ensureStoreReady } from "@/lib/db/store";
 
export const dynamic = "force-dynamic";
 
export default async function HomePage() {
  await ensureStoreReady();
 
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellers();
  const categories = getAllCategories();
  const testimonials = getTestimonials();
 
  return (
    <div className="bg-background min-h-screen">
      {/* Redesigned Flagship Hero Section */}
      <HeroBanner />
 
      {/* Brand Trust Section (Grayscale premium style) */}
      <section className="py-12 border-y border-zinc-200/50 dark:border-zinc-900 bg-zinc-50/30 dark:bg-[#050508]/30 backdrop-blur-sm">
        <div className="container-custom">
          <p className="text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Engineered for Devices from World Leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 sm:gap-x-16 gap-y-6 opacity-35 dark:opacity-45 hover:opacity-65 transition-opacity duration-300">
            {/* Apple */}
            <span className="text-xl md:text-2xl font-semibold tracking-tight text-foreground font-sans">Apple</span>
            {/* Samsung */}
            <span className="text-xl md:text-2xl font-bold tracking-widest text-foreground uppercase font-sans">Samsung</span>
            {/* Sony */}
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-foreground uppercase font-serif">SONY</span>
            {/* Logitech */}
            <span className="text-xl md:text-2xl font-light tracking-wide text-foreground uppercase font-sans">logitech</span>
            {/* JBL */}
            <span className="text-2xl md:text-3xl font-extrabold tracking-tighter text-foreground uppercase font-sans">JBL</span>
            {/* Anker */}
            <span className="text-xl md:text-2xl font-medium tracking-tight text-foreground uppercase font-sans">ANKER</span>
          </div>
        </div>
      </section>
 
      {/* Featured Products Section */}
      <ProductSection
        title="Featured Products"
        subtitle="Curated picks of our most premium and popular accessories"
        products={featured}
      />
 
      {/* Why Choose Us Section (Updated & Elevate to premium glass cards) */}
      <WhyChooseUs />
 
      {/* Shop by Category Section */}
      <section className="py-20 md:py-28 border-y border-border/20 bg-secondary/10 dark:bg-card/10">
        <div className="container-custom">
          <CategoriesSection categories={categories} />
        </div>
      </section>
 
      {/* Best Sellers Section */}
      <ProductSection
        title="Best Sellers"
        subtitle="Top-rated accessories favored by tech enthusiasts across Pakistan"
        products={bestSellers}
        accent
      />
 
      {/* Customer Reviews Section */}
      {testimonials && testimonials.length > 0 && (
        <TestimonialSlider testimonials={testimonials} />
      )}
 
      {/* Newsletter Signup Section */}
      <section className="py-20 md:py-32 bg-secondary/20 dark:bg-[#050508]/30">
        <div className="container-custom max-w-3xl">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
