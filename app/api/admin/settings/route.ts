import { requireAdmin } from "@/lib/auth/admin-auth";
import { getSettings, updateSettings } from "@/lib/services/content-service";
import { ok, unauthorized } from "@/lib/api/response";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok(getSettings());
}

export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  const body = await request.json();
  return ok(updateSettings(body));
}
