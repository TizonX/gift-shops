import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  // Define public paths (no auth required)
  const publicPaths = ["/login", "/signup"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // Define protected paths (auth required)
  const protectedPaths = ["/profile", "/orders", "/checkout"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // If user is NOT logged in and trying to access protected route, redirect to login
  if (isProtected && !isLoggedIn) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // If user IS logged in and trying to access login/signup, redirect to dashboard
  if (isLoggedIn && isPublic) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
