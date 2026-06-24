import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllProducts, createProduct } from "@/lib/services/product-service";
import { revalidateStorePages } from "@/lib/revalidate-store-pages";
import { ok, unauthorized, fail } from "@/lib/api/response";
import { ProductSchema } from "@/lib/validation/schemas";
import { ensureDatabaseIntegrity, backupDatabase } from "@/lib/db/backup";
import type { Product } from "@/types";

export async function GET(request: Request) {
  try {
    if (!requireAdmin(request)) return unauthorized();

    // Ensure database integrity
    const isHealthy = await ensureDatabaseIntegrity();
    if (!isHealthy) {
      return fail("Database integrity check failed", 503);
    }

    return ok(getAllProducts());
  } catch (err) {
    console.error("[admin/products] GET failed:", err);
    return fail("Failed to fetch products", 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!requireAdmin(request)) return unauthorized();

    // Parse request
    const body = await request.json();

    // Validate data with Zod
    const validation = ProductSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      return fail(`Validation failed: ${errors.join(", ")}`, 400);
    }

    const validatedData = validation.data as Omit<Product, "id">;

    // Create backup before modifying
    await backupDatabase();

    // Create product
    const product = await createProduct(validatedData);

    if (!product) {
      return fail("Failed to create product", 500);
    }

    // Revalidate store pages
    try {
      await revalidateStorePages(product.slug);
    } catch (err) {
      console.warn("[admin/products] revalidation failed:", err);
      // Don't fail the request if revalidation fails
    }

    return ok(product, 201);
  } catch (err) {
    console.error("[admin/products] POST failed:", err);

    if (err instanceof Error) {
      if (err.message.includes("ENOENT")) {
        return fail("Database file not found", 503);
      }
      if (err.message.includes("JSON")) {
        return fail("Database corrupted - recovery attempted", 503);
      }
      return fail(err.message, 500);
    }

    return fail("Failed to create product", 500);
  }
}
