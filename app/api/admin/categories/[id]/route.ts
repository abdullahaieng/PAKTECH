import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllCategories, updateCategory, deleteCategory } from "@/lib/services/category-service";
import { ok, fail, unauthorized } from "@/lib/api/response";
import type { Category } from "@/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  const body = await request.json() as Partial<Category>;
  const category = updateCategory(id, body);
  if (!category) return fail("Category not found", 404);
  return ok(category);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  const cats = getAllCategories();
  const cat = cats.find((c) => c.id === id);
  if (!cat) return fail("Category not found", 404);
  if (cat.productCount > 0) return fail("Cannot delete category with products");
  if (!deleteCategory(id)) return fail("Delete failed");
  return ok({ deleted: true });
}
