import { NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/verify-id-token";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { isFirestoreEnabled } from "@/lib/db/firestore-config";
import { findOrCreateFirebaseUser, toPublicUser } from "@/lib/services/user-service";
import { setSessionCookie } from "@/lib/auth/cookies";
import { fail } from "@/lib/api/response";

export async function POST(request: Request) {
  if (!isFirebaseConfigured() || !isFirestoreEnabled()) {
    return fail("Firebase/Firestore is not configured", 503);
  }

  try {
    const { idToken, name, phone } = await request.json();
    if (!idToken) return fail("Missing Firebase token");

    const profile = await verifyFirebaseIdToken(idToken);
    const user = await findOrCreateFirebaseUser({
      firebaseUid: profile.uid,
      email: profile.email,
      name: name || profile.name,
      phone,
      avatar: profile.avatar,
      emailVerified: profile.emailVerified,
      provider: profile.provider,
    });

    const response = NextResponse.json({ success: true, data: toPublicUser(user) });
    return setSessionCookie(response, user);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Firebase session failed", 401);
  }
}
