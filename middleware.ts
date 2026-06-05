import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ORIGIN = process.env.ADMIN_URL ?? "http://localhost:3001";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const response =
    request.method === "OPTIONS"
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", ADMIN_ORIGIN);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
