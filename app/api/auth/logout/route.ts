import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/cookies";

export async function POST() {
  const response = NextResponse.json({ success: true, data: { loggedOut: true } });
  return clearSessionCookie(response);
}
