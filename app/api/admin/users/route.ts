import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllUsers, toPublicUser } from "@/lib/services/user-service";
import { ok, unauthorized } from "@/lib/api/response";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok(getAllUsers().map(toPublicUser));
}
