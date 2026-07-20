import { resetPasswordWithToken } from "@/lib/services/user-service";
import { ok, fail } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { rateLimit } = await import("@/lib/utils/rate-limit");
    const rl = rateLimit(`reset-password:${ip}`, { windowMs: 60_000, max: 5 });
    if (!rl.ok) return fail("Too many requests. Try again later.", 429);

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
