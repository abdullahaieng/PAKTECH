import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/product-service";
import { ok, fail, unauthorized } from "@/lib/api/response";
import type { Product } from "@/types";

function revalidateStorePages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  if (slug) revalidatePath(`/product/${slug}`);
  else revalidatePath("/product", "layout");
}

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
  const product = updateProduct(id, body);
  if (!product) return fail("Product not found", 404);
  revalidateStorePages(product.slug);
  return ok(product);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  if (!deleteProduct(id)) return fail("Product not found", 404);
  return ok({ deleted: true });
}
