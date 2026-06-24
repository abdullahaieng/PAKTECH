import { isFirebaseConfigured } from "./config";
import { getAdminAuth } from "./admin";

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  provider: "email" | "google";
}

export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured");
  }

  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken).catch((error) => {
    throw new Error(error.message || "Invalid Firebase token");
  });

  const userRecord = await auth.getUser(decoded.uid);
  const providers = userRecord.providerData.map((p) => p.providerId);
  const isGoogle = providers.includes("google.com");

  return {
    uid: userRecord.uid,
    email: userRecord.email ?? "",
    name: userRecord.displayName || userRecord.email?.split("@")[0] || "User",
    avatar: userRecord.photoURL ?? undefined,
    emailVerified: userRecord.emailVerified,
    provider: isGoogle ? "google" : "email",
  };
}
