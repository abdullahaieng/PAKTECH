import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/services/product-service";
import { getCategoryName } from "@/lib/services/category-service";
import { generateMetadata as genMeta, generateProductJsonLd } from "@/lib/seo";
import { ProductDetailClient } from "./product-detail-client";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return genMeta({ title: "Product Not Found", noIndex: true });

  return genMeta({
    title: product.name,
    description: product.shortDescription,
    image: product.images[0],
    url: `https://paktech.pk/product/${product.slug}`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product.slug);
  const jsonLd = generateProductJsonLd({
    name: product.name,
    description: product.description,
    image: product.images[0],
    price: product.price,
    salePrice: product.salePrice,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    sku: product.sku,
    slug: product.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        categoryName={getCategoryName(product.category)}
      />
    </>
  );
}
