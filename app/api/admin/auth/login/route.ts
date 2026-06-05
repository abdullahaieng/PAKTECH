import { verifyAdminCredentials, createAdminToken } from "@/lib/auth/admin-auth";
import { ok, fail } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!verifyAdminCredentials(email, password)) {
      return fail("Invalid credentials", 401);
    }
    return ok({ token: createAdminToken(), email });
  } catch {
    return fail("Invalid request");
  }
}
