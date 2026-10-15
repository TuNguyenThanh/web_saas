import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/auth";

/**
 * Lightweight edge guard: if there's no session cookie at all, bounce to login
 * before the protected page even renders. The cookie's signature is verified
 * authoritatively server-side (see app/dashboard/layout.tsx) — this is just a
 * fast UX redirect, so we only check for presence here.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
