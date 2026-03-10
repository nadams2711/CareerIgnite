import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Routes that require login (any role)
const authRequiredRoutes = ["/dashboard", "/plan", "/onboarding", "/careers", "/school", "/schools"];

// Routes only for STUDENT role
const studentOnlyRoutes = ["/dashboard", "/plan", "/onboarding"];

// Routes only for SCHOOL_ADMIN role
const schoolAdminRoutes = ["/schools"];
// /school/*/dashboard is also admin-only (checked with regex below)
// /school/register is open to any logged-in user (that's how they become admin)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;
  const adminSchoolCode = req.auth?.user?.adminSchoolCode;

  // Check if route requires authentication
  const needsAuth = authRequiredRoutes.some((route) => pathname.startsWith(route));
  if (needsAuth && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isLoggedIn) return NextResponse.next();

  // ── Role-based routing ──

  const isAdmin = role === "SCHOOL_ADMIN" && adminSchoolCode;

  // Student-only routes: redirect admins to their school dashboard
  const isStudentRoute = studentOnlyRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
  if (isStudentRoute && isAdmin) {
    return NextResponse.redirect(new URL(`/school/${adminSchoolCode}/dashboard`, req.url));
  }

  // School admin routes: redirect students to their dashboard
  const isAdminRoute = schoolAdminRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
    || /^\/school\/[^/]+\/dashboard/.test(pathname);
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|icons|manifest.json).*)"],
};
