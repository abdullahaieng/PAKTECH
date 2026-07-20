import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieOptions, SESSION_COOKIE } from "./session";
import type { User } from "@/types";

export function setSessionCookie(response: NextResponse, user: User) {
  const token = createSessionToken(user.id, user.email);
  response.cookies.set(SESSION_COOKIE, token, getSessionCookieOptions());
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { ...getSessionCookieOptions(), maxAge: 0 });
  return response;
}
