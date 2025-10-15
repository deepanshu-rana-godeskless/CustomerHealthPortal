/**
 * Customer Health Portal - Main Middleware
 * GoDeskless Inc.
 *
 * Handles authentication, authorization, and routing for the portal
 * Uses centralized route configuration for consistency
 */
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middleware/auth-middleware";
import { RouteUtils, AUTH_ROUTES, PUBLIC_ROUTES } from "./config/routes";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle root path redirect to login
  if (pathname === PUBLIC_ROUTES.ROOT) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN_V2, req.url));
  }

  // Apply authentication middleware
  const authResponse = authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  return NextResponse.next();
}

// Use centralized route utilities to generate matcher patterns
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/customers/:path*",
    "/add-business/:path*",
    "/customers/:id/:path*",
    "/auth/v1/login/:path*",
    "/auth/v2/login/:path*",
    "/auth/v1/register/:path*",
    "/auth/v2/register/:path*",
  ],
};
