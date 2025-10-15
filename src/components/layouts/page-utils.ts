/**
 * Enhanced Page Utilities
 * Provides type-safe utilities for creating protected pages
 * Follows SOLID principles and enterprise patterns
 */

import { ReactNode } from "react";
import { ProtectedLayout } from "@/components/layouts/protected-layout";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { LayoutProps, ComponentWithChildren } from "@/types/common";
import { PROTECTED_ROUTES } from "@/config/routes";

/**
 * Options for creating protected page layouts
 */
interface CreateLayoutOptions {
    /**
     * Whether to wrap with error boundary (default: true)
     */
    withErrorBoundary?: boolean;

    /**
     * Custom error fallback component
     */
    errorFallback?: ReactNode;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Custom loading fallback
     */
    loadingFallback?: ReactNode;
}

/**
 * Creates a type-safe protected page layout with enhanced error handling
 * 
 * @param pageName - Name of the page for debugging and display names
 * @param options - Configuration options for the layout
 * 
 * @example
 * ```tsx
 * // Basic usage
 * export default createProtectedPageLayout("Reports");
 * 
 * // With custom options
 * export default createProtectedPageLayout("Reports", {
 *   withErrorBoundary: true,
 *   className: "custom-layout-class"
 * });
 * ```
 */
export function createProtectedPageLayout(
    pageName: string = "Page",
    options: CreateLayoutOptions = {}
) {
    const {
        withErrorBoundary = true,
        errorFallback,
        className,
        loadingFallback,
    } = options;

    function PageLayout({ children }: ComponentWithChildren): JSX.Element {
        const layoutContent = (
            <ProtectedLayout className= { className } >
            { children }
            </ProtectedLayout>
    );

        if (withErrorBoundary) {
            return (
                <ErrorBoundary 
          fallback= { errorFallback }
            showErrorDetails = { process.env.NODE_ENV === "development" }
                >
                { layoutContent }
                </ErrorBoundary>
      );
        }

        return layoutContent;
    }

    // Set display name for better debugging and React DevTools
    PageLayout.displayName = `${pageName}Layout`;

    return PageLayout;
}

/**
 * Higher-order component for wrapping pages with protected layout
 * Useful for programmatic layout application
 * 
 * @example
 * ```tsx
 * const ProtectedReportsPage = withProtectedLayout(ReportsPage, "Reports");
 * ```
 */
export function withProtectedLayout<P extends object>(
    Component: React.ComponentType<P>,
    pageName: string,
    options: CreateLayoutOptions = {}
) {
    const LayoutWrapper = createProtectedPageLayout(pageName, options);

    function WrappedComponent(props: P): JSX.Element {
        return (
            <LayoutWrapper>
            <Component { ...props } />
            </LayoutWrapper>
        );
    }

    WrappedComponent.displayName = `withProtectedLayout(${Component.displayName || Component.name})`;
    return WrappedComponent;
}

/**
 * Validation utilities for routes and navigation
 */
export const PageUtils = {
    /**
     * Validate if a route is a protected route
     */
    isProtectedRoute: (route: string): boolean => {
        return Object.values(PROTECTED_ROUTES).some(protectedRoute =>
            route.startsWith(protectedRoute)
        );
    },

    /**
     * Get page name from route
     */
    getPageNameFromRoute: (route: string): string => {
        // Remove leading slash and convert to title case
        return route
            .replace(/^\//, '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    /**
     * Generate layout display name
     */
    generateLayoutDisplayName: (pageName: string): string => {
        return `${pageName}Layout`;
    },
} as const;

/**
 * Type exports for better type safety
 */
export type { CreateLayoutOptions };

// Re-export common types for convenience
export type { LayoutProps, ComponentWithChildren } from "@/types/common";