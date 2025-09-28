// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication (excluding auth pages handled explicitly)
const publicRoutes = ["/"];

/**
 * Middleware to protect routes based on authentication status.
 * - Allows access to public routes (/, /signup, /login) for unauthenticated users.
 * - Redirects unauthenticated users to /login for protected routes.
 * - Redirects authenticated users away from /signup and /login to /dashboard.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for token in cookies (plain string value)
  const token = request.cookies.get("token")?.value || null;

  // Auth pages handling first
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Allow access to non-auth public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to /login for protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}

// Apply middleware to all routes except API and static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};