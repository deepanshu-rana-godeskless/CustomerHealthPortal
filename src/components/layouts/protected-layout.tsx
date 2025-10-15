/**
 * Protected Layout Component
 * Enterprise-grade layout with authentication, error boundaries, and type safety
 * Single source of truth for all protected page layouts
 */

import { ReactNode, Suspense } from "react";
import { cookies } from "next/headers";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";
import { LayoutProps } from "@/types/common";
import {
    SIDEBAR_VARIANT_VALUES,
    SIDEBAR_COLLAPSIBLE_VALUES,
    CONTENT_LAYOUT_VALUES,
    NAVBAR_STYLE_VALUES,
    type SidebarVariant,
    type SidebarCollapsible,
    type ContentLayout,
    type NavbarStyle,
} from "@/types/preferences/layout";

import { AccountSwitcher } from "@/app/(main)/dashboard/_components/sidebar/account-switcher";
import { LayoutControls } from "@/app/(main)/dashboard/_components/sidebar/layout-controls";
import { SearchDialog } from "@/app/(main)/dashboard/_components/sidebar/search-dialog";
import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";

/**
 * Loading fallback component for Suspense boundaries
 */
const LayoutLoadingFallback = (): JSX.Element => (
    <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

/**
 * Error fallback component for layout errors
 */
const LayoutErrorFallback = (): JSX.Element => (
    <div className="flex h-screen items-center justify-center p-4">
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Layout Error</h2>
            <p className="text-muted-foreground mb-4">There was an error loading the page layout.</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
                Reload Page
            </button>
        </div>
    </div>
);

/**
 * Interface for layout preferences with strict typing
 */
interface LayoutPreferences {
    contentLayout: ContentLayout;
    variant: SidebarVariant;
    collapsible: SidebarCollapsible;
    navbarStyle: NavbarStyle;
}

/**
 * Shared layout component for all protected pages
 * Provides consistent sidebar, header, authentication, and error handling
 * Follows SOLID principles with single responsibility and dependency inversion
 */
export async function ProtectedLayout({ children, className }: LayoutProps): Promise<JSX.Element> {
    // Get sidebar state from cookies with proper error handling
    let defaultOpen = false;
    try {
        const cookieStore = await cookies();
        defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    } catch (error) {
        console.warn("Failed to read sidebar state from cookies:", error);
    }

    // Fetch all layout preferences in parallel for optimal performance
    const [sidebarVariant, sidebarCollapsible, contentLayout, navbarStyle] = await Promise.all([
        getPreference<SidebarVariant>("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
        getPreference<SidebarCollapsible>("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
        getPreference<ContentLayout>("content_layout", CONTENT_LAYOUT_VALUES, "centered"),
        getPreference<NavbarStyle>("navbar_style", NAVBAR_STYLE_VALUES, "scroll"),
    ]);

    const layoutPreferences: LayoutPreferences = {
        contentLayout,
        variant: sidebarVariant,
        collapsible: sidebarCollapsible,
        navbarStyle,
    };

    return (
        <ErrorBoundary
            fallback={<LayoutErrorFallback />}
            showErrorDetails={process.env.NODE_ENV === "development"}
        >
            <AuthGuard fallback={<LayoutLoadingFallback />}>
                <Suspense fallback={<LayoutLoadingFallback />}>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
                        <SidebarInset
                            data-content-layout={contentLayout}
                            className={cn(
                                "flex h-full flex-col",
                                "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl",
                                "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
                                className
                            )}
                        >
                            <header
                                data-navbar-style={navbarStyle}
                                className={cn(
                                    "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
                                    "data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md",
                                )}
                            >
                                <div className="flex w-full items-center justify-between px-4 lg:px-6">
                                    <div className="flex items-center gap-1 lg:gap-2">
                                        <SidebarTrigger className="-ml-1" />
                                        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                                        <SearchDialog />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LayoutControls {...layoutPreferences} />
                                        <ThemeSwitcher />
                                        <AccountSwitcher users={users} />
                                    </div>
                                </div>
                            </header>
                            <main className="h-full flex-1 overflow-y-auto p-4 md:p-6">
                                <ErrorBoundary>
                                    {children}
                                </ErrorBoundary>
                            </main>
                        </SidebarInset>
                    </SidebarProvider>
                </Suspense>
            </AuthGuard>
        </ErrorBoundary>
    );
}