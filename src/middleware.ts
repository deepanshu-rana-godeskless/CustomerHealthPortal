/**
 * Customer Health Portal - Authentication Middleware
 * GoDeskless Inc.
 *
 * Handles authentication and authorization for the portal
 */
import { NextRequest, NextResponse } from "next/server";

import { authMiddleware } from "./middleware/auth-middleware";

export function middleware(req: NextRequest) {
  // Handle root path redirect to login
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/auth/v2/login", req.url));
  }

  // Apply authentication middleware
  const response = authMiddleware(req);
  if (response) {
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};
