import { NextResponse } from "next/server";
import { createUser, toPublicUser } from "@/lib/services/user-service";
import { setSessionCookie } from "@/lib/auth/cookies";
import { fail } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();
    if (!name || !email || !password) return fail("Name, email and password required");
    if (password.length < 6) return fail("Password must be at least 6 characters");

    const user = await createUser({ name, email, phone, password, emailVerified: false });
    const response = NextResponse.json({ success: true, data: toPublicUser(user) });
    return setSessionCookie(response, user);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Registration failed");
  }
}
