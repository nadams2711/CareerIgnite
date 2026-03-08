import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes
  const protectedRoutes = ["/dashboard", "/plan", "/onboarding", "/school/register", "/schools", "/careers"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
    || /^\/school\/[^/]+\/dashboard/.test(pathname);

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|icons|manifest.json).*)"],
};
