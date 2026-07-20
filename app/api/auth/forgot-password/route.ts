import { createPasswordResetToken } from "@/lib/services/user-service";
import { ok, fail } from "@/lib/api/response";
import { sendPasswordReset } from "@/lib/email/service";
import { rateLimit } from "@/lib/utils/rate-limit";

const RATE_KEY = "forgot-password";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return fail("Email required");

    const result = await createPasswordResetToken(email);

    // Always return success message (don't reveal if email exists)
    if ("error" in result) {
      return ok({
        message: "If this email is registered, a reset link has been sent.",
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/account/reset-password?token=${result.token}`;

    // Rate limit per IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const key = `${RATE_KEY}:${ip}`;
    const rl = rateLimit(key, { windowMs: 60_000, max: 5 });
    if (!rl.ok) return ok({ message: "Too many requests. Try again later." });

    // Send email (if configured)
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev) {
      await sendPasswordReset(email, resetUrl);
    }

    return ok({
      message: "Reset link generated. Please check your email.",
      ...(isDev ? { resetUrl, devNote: "Development mode — email service not configured yet" } : {}),
    });
  } catch {
    return fail("Request failed");
  }
}
