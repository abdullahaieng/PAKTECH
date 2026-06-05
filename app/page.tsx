import { HeroBanner } from "@/components/home/hero-banner";
import { PromoMarquee } from "@/components/home/promo-marquee";
import { TrustBadges } from "@/components/shared/trust-badges";
import { ProductSection } from "@/components/home/product-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FlashSaleBanner } from "@/components/home/flash-sale-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { TestimonialSlider } from "@/components/home/testimonial-slider";
import { FAQSection } from "@/components/home/faq-section";
import { Newsletter } from "@/components/home/newsletter";
import { getDatabase } from "@/lib/db/file-store";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const db = getDatabase();
  const products = db.products;
  const categories = db.categories;
  const featured = products.filter((p) => p.isFeatured);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNewArrival);
  const flashSale = products.filter((p) => p.isFlashSale);
  const testimonials = db.testimonials;
  const faqs = db.faqs;

  return (
    <>
      <HeroBanner />
      <PromoMarquee />
      <section className="py-10 bg-background">
        <div className="container-custom">
          <TrustBadges variant="cards" />
        </div>
      </section>
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked premium tech accessories"
        products={featured}
        accent
      />
      <CategoriesSection categories={categories} />
      <FlashSaleBanner products={flashSale} />
      <ProductSection
        title="Best Sellers"
        subtitle="Most loved by our customers"
        products={bestSellers}
        href="/shop?sort=rating"
      />
      <ProductSection
        title="New Arrivals"
        subtitle="Latest additions to our collection"
        products={newArrivals}
        href="/shop?sort=newest"
      />
      <WhyChooseUs />
      <TestimonialSlider testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <Newsletter />
    </>
  );
}
