import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllOrders } from "@/lib/services/order-service";
import { ok, unauthorized } from "@/lib/api/response";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok(getAllOrders());
}
