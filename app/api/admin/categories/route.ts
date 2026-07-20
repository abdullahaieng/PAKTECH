import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllCategories, createCategory } from "@/lib/services/category-service";
import { ok, unauthorized, fail } from "@/lib/api/response";
import type { Category } from "@/types";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok(getAllCategories());
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  try {
    const body = await request.json() as Omit<Category, "id" | "productCount">;
    if (!body.name || !body.slug) return fail("Missing required fields");
    const category = createCategory(body);
    return ok(category, 201);
  } catch {
    return fail("Invalid request");
  }
}
