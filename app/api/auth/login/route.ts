import { NextResponse } from "next/server";
import { authenticateUser, toPublicUser } from "@/lib/services/user-service";
import { setSessionCookie } from "@/lib/auth/cookies";
import { fail } from "@/lib/api/response";
import { LoginSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { rateLimit } = await import("@/lib/utils/rate-limit");
    const rl = rateLimit(`login:${ip}`, { windowMs: 60_000, max: 10 });
    if (!rl.ok) return NextResponse.json({ success: false, error: "Too many login attempts. Try again later." }, { status: 429 });

    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.flatten().formErrors.join("; "), 422);

    const { email, password } = parsed.data;
    const user = await authenticateUser(email.toLowerCase(), password);
    if (!user) return fail("Invalid email or password", 401);

    const response = NextResponse.json({ success: true, data: toPublicUser(user) });
    return setSessionCookie(response, user);
  } catch {
    return fail("Login failed");
  }
}
