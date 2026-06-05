import { NextResponse } from "next/server";
import { authenticateUser, toPublicUser } from "@/lib/services/user-service";
import { setSessionCookie } from "@/lib/auth/cookies";
import { fail } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return fail("Email and password required");

    const user = await authenticateUser(email, password);
    if (!user) return fail("Invalid email or password", 401);

    const response = NextResponse.json({ success: true, data: toPublicUser(user) });
    return setSessionCookie(response, user);
  } catch {
    return fail("Login failed");
  }
}
