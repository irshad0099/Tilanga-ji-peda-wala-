import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Every page except /login needs a valid session; anyone else is sent to
// the login page (and back to where they were going after signing in).
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const email = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/login") {
    return email ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }
  if (!email) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next's assets and any file with an extension (logo, icon).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
