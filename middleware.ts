import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login", "/signup"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // If user is NOT logged in and trying to access protected route, redirect to login
  // if (!isPublic && !isLoggedIn) {
  //   const loginUrl = req.nextUrl.clone();
  //   loginUrl.pathname = "/login";
  //   return NextResponse.redirect(loginUrl);
  // }

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
      Apply middleware to all paths EXCEPT:
      - _next/static (Next.js static files)
      - _next/image (Next.js image optimization)
      - favicon.ico
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
