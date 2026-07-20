import { NextResponse } from "next/server";
import { createUser, toPublicUser } from "@/lib/services/user-service";
import { setSessionCookie } from "@/lib/auth/cookies";
import { fail } from "@/lib/api/response";
import { RegisterSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { rateLimit } = await import("@/lib/utils/rate-limit");
    const rl = rateLimit(`register:${ip}`, { windowMs: 60_000, max: 5 });
    if (!rl.ok) return NextResponse.json({ success: false, error: "Too many requests. Try again later." }, { status: 429 });

    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.flatten().formErrors.join("; "), 422);

    const { name, email, phone, password } = parsed.data;
    const normalizedPhone = phone ?? undefined;
    try {
      const user = await createUser({ name, email: email.toLowerCase(), phone: normalizedPhone, password, emailVerified: false, avatar: "/logo.svg" });
      const response = NextResponse.json({ success: true, data: toPublicUser(user) });
      return setSessionCookie(response, user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      return fail(msg.includes("already registered") ? "Email already in use" : msg, msg.includes("already registered") ? 409 : 500);
    }
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Registration failed");
  }
}
