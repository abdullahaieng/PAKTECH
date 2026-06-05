import { updateUserProfile, toPublicUser } from "@/lib/services/user-service";
import { getSessionFromRequest } from "@/lib/auth/session";
import { ok, fail, unauthorized } from "@/lib/api/response";

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return unauthorized();

  try {
    const { name, phone } = await request.json();
    const user = await updateUserProfile(session.userId, { name, phone });
    if (!user) return fail("User not found", 404);
    return ok(toPublicUser(user));
  } catch {
    return fail("Failed to update profile");
  }
}
