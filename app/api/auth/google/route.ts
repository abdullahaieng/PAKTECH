import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getGoogleAuthUrl, isGoogleAuthConfigured } from "@/lib/auth/google";

export async function GET() {
  if (!isGoogleAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/account/login?error=google_not_configured", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
    );
  }

  const state = randomBytes(16).toString("hex");
  const response = NextResponse.redirect(getGoogleAuthUrl(state));
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
