import { getAllCategories } from "@/lib/services/category-service";
import { ok } from "@/lib/api/response";

export async function GET() {
  return ok(getAllCategories());
}
