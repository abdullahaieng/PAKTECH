import { randomBytes } from "crypto";
import type { PublicUser, User, PasswordResetToken } from "@/types";
import { getDatabase, updateDatabase } from "@/lib/db/file-store";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    provider: user.provider,
    emailVerified: user.emailVerified,
    hasPassword: Boolean(user.passwordHash),
  };
}

export function getUserById(id: string): User | undefined {
  return getDatabase().users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getDatabase().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserByGoogleId(googleId: string): User | undefined {
  return getDatabase().users.find((u) => u.googleId === googleId);
}

export function getAllUsers(): User[] {
  return getDatabase().users;
}

export async function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  provider?: User["provider"];
  googleId?: string;
  avatar?: string;
  emailVerified?: boolean;
}): Promise<User> {
  const existing = getUserByEmail(input.email);
  if (existing) throw new Error("Email already registered");

  const now = new Date().toISOString();
  const user: User = {
    id: `user-${Date.now()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    passwordHash: input.password ? await hashPassword(input.password) : undefined,
    avatar: input.avatar,
    provider: input.provider ?? "email",
    googleId: input.googleId,
    emailVerified: input.emailVerified ?? false,
    createdAt: now,
    updatedAt: now,
  };

  updateDatabase((db) => {
    db.users.push(user);
  });

  return user;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = getUserByEmail(email);
  if (!user?.passwordHash) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  return valid ? user : null;
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string }
): Promise<User | null> {
  let updated: User | null = null;
  updateDatabase((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) return;
    if (data.name) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    user.updatedAt = new Date().toISOString();
    updated = user;
  });
  return updated;
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const user = getUserById(userId);
  if (!user) return { success: false, error: "User not found" };
  if (!user.passwordHash) return { success: false, error: "Google account — set password via reset" };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { success: false, error: "Current password is incorrect" };

  const passwordHash = await hashPassword(newPassword);
  updateDatabase((db) => {
    const u = db.users.find((x) => x.id === userId);
    if (u) {
      u.passwordHash = passwordHash;
      u.updatedAt = new Date().toISOString();
    }
  });
  return { success: true };
}

export async function setUserPassword(userId: string, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword);
  updateDatabase((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (user) {
      user.passwordHash = passwordHash;
      user.updatedAt = new Date().toISOString();
    }
  });
}

export function createPasswordResetToken(email: string): { token: string } | { error: string } {
  const user = getUserByEmail(email);
  if (!user) return { error: "No account found with this email" };

  const token = randomBytes(32).toString("hex");
  const resetToken: PasswordResetToken = {
    token,
    userId: user.id,
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
  };

  updateDatabase((db) => {
    db.passwordResetTokens = db.passwordResetTokens.filter((t) => t.userId !== user.id);
    db.passwordResetTokens.push(resetToken);
  });

  return { token };
}

export function getPasswordResetToken(token: string): PasswordResetToken | undefined {
  const entry = getDatabase().passwordResetTokens.find((t) => t.token === token);
  if (!entry) return undefined;
  if (new Date(entry.expiresAt) < new Date()) return undefined;
  return entry;
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const entry = getPasswordResetToken(token);
  if (!entry) return { success: false, error: "Invalid or expired reset link" };

  await setUserPassword(entry.userId, newPassword);
  updateDatabase((db) => {
    db.passwordResetTokens = db.passwordResetTokens.filter((t) => t.token !== token);
  });
  return { success: true };
}

export async function findOrCreateGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
}): Promise<User> {
  const byGoogle = getUserByGoogleId(profile.googleId);
  if (byGoogle) return byGoogle;

  const byEmail = getUserByEmail(profile.email);
  if (byEmail) {
    updateDatabase((db) => {
      const user = db.users.find((u) => u.id === byEmail.id);
      if (user) {
        user.googleId = profile.googleId;
        user.avatar = profile.avatar ?? user.avatar;
        user.emailVerified = profile.emailVerified || user.emailVerified;
        user.provider = user.passwordHash ? user.provider : "google";
        user.updatedAt = new Date().toISOString();
      }
    });
    return getUserById(byEmail.id)!;
  }

  return createUser({
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    provider: "google",
    googleId: profile.googleId,
    emailVerified: profile.emailVerified,
  });
}
