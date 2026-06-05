import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeGoogleCode, getGoogleUserInfo, isGoogleAuthConfigured } from "@/lib/auth/google";
import { findOrCreateGoogleUser } from "@/lib/services/user-service";
import { setSessionCookie } from "@/lib/auth/cookies";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(`${APP_URL}/account/login?error=google_cancelled`);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${APP_URL}/account/login?error=invalid_state`);
  }

  if (!isGoogleAuthConfigured()) {
    return NextResponse.redirect(`${APP_URL}/account/login?error=google_not_configured`);
  }

  try {
    const { access_token } = await exchangeGoogleCode(code);
    const profile = await getGoogleUserInfo(access_token);
    const user = await findOrCreateGoogleUser({
      googleId: profile.id,
      email: profile.email,
      name: profile.name,
      avatar: profile.picture,
      emailVerified: profile.verified_email,
    });

    const response = NextResponse.redirect(`${APP_URL}/account`);
    response.cookies.delete("oauth_state");
    return setSessionCookie(response, user);
  } catch {
    return NextResponse.redirect(`${APP_URL}/account/login?error=google_failed`);
  }
}
