import { requireAdmin, verifyAdminCredentials } from "@/lib/auth/admin-auth";
import { ok, fail, unauthorized } from "@/lib/api/response";

export async function POST(request: Request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { currentPassword, newPassword, email } = await request.json();
    if (!currentPassword || !newPassword) return fail("Both passwords required");
    if (newPassword.length < 6) return fail("Password must be at least 6 characters");

    const adminEmail = email ?? process.env.ADMIN_EMAIL ?? "admin@paktech.pk";
    if (!verifyAdminCredentials(adminEmail, currentPassword)) {
      return fail("Current password is incorrect", 401);
    }

    // Until DB: admin password lives in .env — instruct to update env
    return ok({
      message: "Update the ADMIN_PASSWORD environment variable in production.",
      devNote: `Password updated (dev). Set ADMIN_PASSWORD=${newPassword} in .env.local and restart the server.`,
    });
  } catch {
    return fail("Failed");
  }
}
