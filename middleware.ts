import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Check for token in Authorization header first, then fallback to cookie
  const authHeader = req.headers.get('authorization');
  const cookieToken = req.cookies.get("token")?.value;
  const token = authHeader ? authHeader.split(' ')[1] : cookieToken;
  
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  // Debug logging
  console.log('Middleware Debug:', {
    pathname,
    authHeader,
    cookieToken,
    token,
    isLoggedIn,
    cookies: req.cookies.getAll(),
    headers: Object.fromEntries(req.headers.entries())
  });

  // Define public paths (no auth required)
  const publicPaths = ["/login", "/signup"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // Define protected paths (auth required)
  const protectedPaths = ["/profile", "/orders", "/checkout"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // If user is NOT logged in and trying to access protected route, redirect to login
  if (isProtected && !isLoggedIn) {
    console.log('Redirecting to login: Not authenticated');
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // If user IS logged in and trying to access login/signup, redirect to dashboard
  if (isLoggedIn && isPublic) {
    console.log('Redirecting to dashboard: Already authenticated');
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/";
    return NextResponse.redirect(dashboardUrl);
  }

  // Add token to response headers for debugging
  const response = NextResponse.next();
  response.headers.set('x-debug-token', token || 'no-token');
  return response;
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
