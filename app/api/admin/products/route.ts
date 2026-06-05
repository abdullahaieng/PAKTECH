import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllProducts, createProduct } from "@/lib/services/product-service";
import { ok, unauthorized, fail } from "@/lib/api/response";
import type { Product } from "@/types";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok(getAllProducts());
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  try {
    const body = await request.json() as Omit<Product, "id">;
    if (!body.name || !body.slug || !body.price) return fail("Missing required fields");
    const product = createProduct(body);
    return ok(product, 201);
  } catch {
    return fail("Invalid request");
  }
}
