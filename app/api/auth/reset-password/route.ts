import { resetPasswordWithToken } from "@/lib/services/user-service";
import { ok, fail } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) return fail("Token and password required");
    if (password.length < 6) return fail("Password must be at least 6 characters");

    const result = await resetPasswordWithToken(token, password);
    if (!result.success) return fail(result.error ?? "Reset failed");

    return ok({ message: "Password reset successful. Please sign in." });
  } catch {
    return fail("Reset failed");
  }
}
