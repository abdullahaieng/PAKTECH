import { isFirebaseConfigured } from "@/lib/firebase/config";
import { ok } from "@/lib/api/response";

export async function GET() {
  return ok({ enabled: isFirebaseConfigured() });
}
