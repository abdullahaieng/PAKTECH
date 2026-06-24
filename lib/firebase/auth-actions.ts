"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

function mapFirebaseError(code: string): string {
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Invalid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "Invalid email or password.",
    "auth/wrong-password": "Invalid email or password.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
  };
  return messages[code] ?? "Authentication failed. Please try again.";
}

export async function syncFirebaseSession(
  idToken: string,
  extra?: { name?: string; phone?: string }
): Promise<void> {
  const res = await fetch("/api/auth/firebase/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, ...extra }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Session sync failed");
}

async function afterAuth(credential: UserCredential, extra?: { phone?: string; name?: string }) {
  const idToken = await credential.user.getIdToken();
  await syncFirebaseSession(idToken, {
    name: extra?.name ?? credential.user.displayName ?? undefined,
    phone: extra?.phone,
  });
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  try {
    const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    await afterAuth(credential);
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    throw new Error(mapFirebaseError(code));
  }
}

export async function registerWithEmail(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<void> {
  try {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      input.email,
      input.password
    );
    if (input.name) {
      await updateProfile(credential.user, { displayName: input.name });
    }
    await afterAuth(credential, { name: input.name, phone: input.phone });
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    throw new Error(mapFirebaseError(code));
  }
}

export async function signInWithGoogle(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await signInWithPopup(getFirebaseAuth(), provider);
    await afterAuth(credential);
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    throw new Error(mapFirebaseError(code));
  }
}

export async function resetPasswordEmail(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(getFirebaseAuth(), email);
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    throw new Error(mapFirebaseError(code));
  }
}

export async function firebaseSignOut(): Promise<void> {
  await signOut(getFirebaseAuth());
  await fetch("/api/auth/logout", { method: "POST" });
}
