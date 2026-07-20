import { getProductBySlug } from "@/lib/services/product-service";
import { ok, fail } from "@/lib/api/response";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return fail("Product not found", 404);
  return ok(product);
}
