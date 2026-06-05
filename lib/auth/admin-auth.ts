import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@paktech.pk";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "paktech-admin-secret-change-in-production";

export function verifyAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function createAdminToken(): string {
  const payload = Buffer.from(JSON.stringify({ role: "admin", exp: Date.now() + 86400000 })).toString("base64url");
  const signature = createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
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
