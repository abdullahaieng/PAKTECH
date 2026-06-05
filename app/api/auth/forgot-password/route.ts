import { createPasswordResetToken } from "@/lib/services/user-service";
import { ok, fail } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return fail("Email required");

    const result = createPasswordResetToken(email);

    // Always return success message (don't reveal if email exists)
    if ("error" in result) {
      return ok({
        message: "If this email is registered, a reset link has been sent.",
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/account/reset-password?token=${result.token}`;

    // Dev mode: return link directly (email service will be added in production)
    const isDev = process.env.NODE_ENV === "development";

    return ok({
      message: "Reset link generated. Please check your email.",
      ...(isDev ? { resetUrl, devNote: "Development mode — email service not configured yet" } : {}),
    });
  } catch {
    return fail("Request failed");
  }
}
