import { changeUserPassword } from "@/lib/services/user-service";
import { getSessionFromRequest } from "@/lib/auth/session";
import { ok, fail, unauthorized } from "@/lib/api/response";

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return unauthorized();

  try {
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) return fail("Both passwords required");
    if (newPassword.length < 6) return fail("New password must be at least 6 characters");

    const result = await changeUserPassword(session.userId, currentPassword, newPassword);
    if (!result.success) return fail(result.error ?? "Failed");

    return ok({ message: "Password updated successfully" });
  } catch {
    return fail("Failed to change password");
  }
}
