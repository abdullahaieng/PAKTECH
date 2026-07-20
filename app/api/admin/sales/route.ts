import { revalidateStorePages } from "@/lib/revalidate-store-pages";
import { requireAdmin } from "@/lib/auth/admin-auth";
import {
  applyBulkSale,
  clearSales,
  getProductsOnSale,
  removeProductSale,
} from "@/lib/services/product-service";
import { ok, fail, unauthorized } from "@/lib/api/response";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok({ products: getProductsOnSale() });
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "apply") {
      const percentOff = Number(body.percentOff);
      if (!percentOff || percentOff < 1 || percentOff > 90) {
        return fail("Discount must be between 1% and 90%");
      }
      const result = await applyBulkSale({
        percentOff,
        category: body.category,
        flashSale: Boolean(body.flashSale),
      });
      revalidateStorePages();
      return ok({ ...result, message: `Sale applied to ${result.updated} products` });
    }

    if (action === "clear") {
      const result = await clearSales({ category: body.category });
      revalidateStorePages();
      return ok({ ...result, message: `Sale removed from ${result.updated} products` });
    }

    if (action === "remove") {
      if (!body.productId) return fail("Product ID required");
      const product = await removeProductSale(body.productId);
      if (!product) return fail("Product not found", 404);
      revalidateStorePages();
      return ok(product);
    }

    return fail("Invalid action");
  } catch {
    return fail("Failed to update sales");
  }
}
