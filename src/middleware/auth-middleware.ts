/**
 * Authentication Middleware
 * Uses centralized route configuration for consistency
 * Provides robust authentication checks for all routes
 */

import { NextResponse, type NextRequest } from "next/server";
import { RouteUtils, PROTECTED_ROUTES, AUTH_ROUTES } from "@/config/routes";

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Use centralized route utilities for consistency
  const isProtectedRoute = RouteUtils.isProtectedRoute(pathname);
  const isAuthRoute = RouteUtils.isAuthRoute(pathname);

  // Check for authentication token in cookies
  const authToken = req.cookies.get("godeskless_auth_token");
  const isAuthenticated = !!authToken?.value;

  // Log authentication attempts in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Auth Middleware] ${pathname} - Protected: ${isProtectedRoute}, Auth: ${isAuthRoute}, Authenticated: ${isAuthenticated}`);
  }

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`[Auth Middleware] Redirecting unauthenticated user from ${pathname} to login`);
    return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN_V2, req.url));
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    console.log(`[Auth Middleware] Redirecting authenticated user from ${pathname} to dashboard`);
    return NextResponse.redirect(new URL(PROTECTED_ROUTES.DASHBOARD, req.url));
  }

  return NextResponse.next();
}