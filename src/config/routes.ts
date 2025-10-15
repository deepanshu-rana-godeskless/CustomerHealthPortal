/**
 * Centralized Route Management System
 * Single source of truth for all application routes
 * Follows DRY principle and makes route updates simple
 */

import { ProtectedRoute } from "@/types/common";

// Protected route constants - Single source of truth
export const PROTECTED_ROUTES = {
    DASHBOARD: "/dashboard",
    CUSTOMERS: "/customers",
    ADD_BUSINESS: "/add-business",
    CUSTOMER_DETAIL: "/customers/:id",
} as const;

// Auth route constants
export const AUTH_ROUTES = {
    LOGIN_V1: "/auth/v1/login",
    LOGIN_V2: "/auth/v2/login",
    REGISTER_V1: "/auth/v1/register",
    REGISTER_V2: "/auth/v2/register",
} as const;

// Public route constants
export const PUBLIC_ROUTES = {
    ROOT: "/",
    NOT_FOUND: "/not-found",
    UNAUTHORIZED: "/unauthorized",
} as const;

// All routes combined
export const ROUTES = {
    ...PROTECTED_ROUTES,
    ...AUTH_ROUTES,
    ...PUBLIC_ROUTES,
} as const;

// Type-safe route arrays for middleware and validation
export const PROTECTED_ROUTE_PATTERNS: string[] = Object.values(PROTECTED_ROUTES);
export const AUTH_ROUTE_PATTERNS: string[] = Object.values(AUTH_ROUTES);

// Utility functions for route management
export const RouteUtils = {
    /**
     * Check if a path matches a protected route pattern
     */
    isProtectedRoute: (pathname: string): boolean => {
        return PROTECTED_ROUTE_PATTERNS.some(route =>
            pathname.startsWith(route.replace(":id", ""))
        );
    },

    /**
     * Check if a path matches an auth route
     */
    isAuthRoute: (pathname: string): boolean => {
        return AUTH_ROUTE_PATTERNS.includes(pathname);
    },

    /**
     * Generate dynamic route with parameters
     */
    generateRoute: (route: string, params: Record<string, string>): string => {
        let generatedRoute = route;
        Object.entries(params).forEach(([key, value]) => {
            generatedRoute = generatedRoute.replace(`:${key}`, value);
        });
        return generatedRoute;
    },

    /**
     * Get all protected routes for middleware configuration
     */
    getProtectedRoutePatterns: (): string[] => {
        return PROTECTED_ROUTE_PATTERNS.map(route => `${route}/:path*`);
    },

    /**
     * Get all auth routes for middleware configuration  
     */
    getAuthRoutePatterns: (): string[] => {
        return AUTH_ROUTE_PATTERNS.map(route => `${route}/:path*`);
    },
} as const;

// Export types for type safety
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
export type ProtectedRouteKey = keyof typeof PROTECTED_ROUTES;
export type AuthRouteKey = keyof typeof AUTH_ROUTES;