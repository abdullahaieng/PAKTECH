import { updateUserProfile, toPublicUser } from "@/lib/services/user-service";
import { getSessionFromRequest } from "@/lib/auth/session";
import { ok, fail, unauthorized } from "@/lib/api/response";
import { logger } from "@/lib/logger";

export async function PATCH(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      logger.warn("profile", "Unauthorized profile update attempt");
      return unauthorized();
    }

    const body = await request.json();
    const { name, phone } = body;

    logger.info("profile", "Updating user profile", {
      userId: session.userId,
      hasName: !!name,
      hasPhone: !!phone,
    });

    if (!name && !phone) {
      return fail("No fields to update", 400);
    }

    const user = await updateUserProfile(session.userId, { name, phone });
    
    if (!user) {
      logger.error("profile", "User not found for update", new Error("User not found"), {
        userId: session.userId,
      });
      return fail("User not found", 404);
    }

    logger.info("profile", "Profile updated successfully", {
      userId: session.userId,
      phone: user.phone,
    });

    return ok(toPublicUser(user));
  } catch (error) {
    logger.error("profile", "Failed to update profile", error as Error);
    return fail("Failed to update profile", 500);
  }
}
