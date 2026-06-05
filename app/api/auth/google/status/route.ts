import { isGoogleAuthConfigured } from "@/lib/auth/google";
import { ok } from "@/lib/api/response";

export async function GET() {
  return ok({ enabled: isGoogleAuthConfigured() });
}
