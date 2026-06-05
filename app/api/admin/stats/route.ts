import { requireAdmin } from "@/lib/auth/admin-auth";
import { getDashboardStats } from "@/lib/services/stats-service";
import { ok, unauthorized } from "@/lib/api/response";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok(getDashboardStats());
}
