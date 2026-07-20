import { createHmac, timingSafeEqual } from "crypto";
import { logger } from "@/lib/logger";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export function verifyAdminCredentials(email: string, password: string): boolean {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    logger.warn("admin-auth", "Admin credentials not set in environment; rejecting login attempts");
    return false;
  }
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function createAdminToken(): string {
  if (!ADMIN_SECRET) {
    logger.error("admin-auth", "ADMIN_SECRET is not set. Cannot create admin tokens.");
    throw new Error("ADMIN_SECRET is not configured");
  }
  const payloadObj = { role: "admin", exp: Date.now() + 24 * 60 * 60 * 1000 };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const signature = createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  if (!ADMIN_SECRET) {
    logger.warn("admin-auth", "ADMIN_SECRET not set; cannot verify admin tokens");
    return false;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  // verify signature
  const expected = createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  } catch (err) {
    return false;
  }

  // verify expiry
  try {
    const decoded = Buffer.from(payload, "base64url").toString();
    const obj = JSON.parse(decoded) as { exp?: number };
    if (!obj.exp) return false;
    if (Date.now() > obj.exp) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function requireAdmin(request: Request): boolean {
  return verifyAdminToken(getTokenFromRequest(request));
}
