import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Restricted routes that require active authentication
const RESTRICTED_ROUTES = [
  "/profile",
  "/create",
  "/create-quiz",
  "/editor",
  "/deploy",
  "/quiz",
  "/results",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current route matches any restricted pattern
  const isRestricted = RESTRICTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isRestricted) {
    const accessToken = request.cookies.get("accessToken")?.value;

    // If user has logged out or has no accessToken cookie, show Page Not Found
    if (!accessToken) {
      const notFoundUrl = new URL("/not-found", request.url);
      return NextResponse.rewrite(notFoundUrl, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/create/:path*",
    "/create-quiz/:path*",
    "/editor/:path*",
    "/deploy/:path*",
    "/quiz/:path*",
    "/results/:path*",
  ],
};
