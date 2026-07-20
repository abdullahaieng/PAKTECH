import { requireAdmin } from "@/lib/auth/admin-auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/product-service";
import { revalidateStorePages } from "@/lib/revalidate-store-pages";
import { ok, fail, unauthorized } from "@/lib/api/response";
import { ProductSchema } from "@/lib/validation/schemas";
import type { Product } from "@/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return fail("Product not found", 404);
  return ok(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  const body = await request.json() as Partial<Product>;
  const validation = ProductSchema.partial().safeParse(body);
  if (!validation.success) {
    const errors = validation.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    return fail(`Validation failed: ${errors.join(", ")}`, 400);
  }

  const product = await updateProduct(id, validation.data as Partial<Product>);
  if (!product) return fail("Product not found", 404);
  revalidateStorePages(product.slug);
  return ok(product);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return fail("Product not found", 404);
  const slug = product.slug;
  if (!(await deleteProduct(id))) return fail("Product not found", 404);
  revalidateStorePages(slug);
  return ok({ deleted: true });
}
