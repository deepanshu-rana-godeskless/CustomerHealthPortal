"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            try {
                const isAuth = AuthService.isAuthenticated();
                setIsAuthenticated(isAuth);

                if (!isAuth) {
                    // Clear any stale data and redirect
                    AuthService.logout();
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsAuthenticated(false);
                AuthService.logout();
            }
        };

        checkAuth();
    }, [router]);

    // Loading state
    if (isAuthenticated === null) {
        return fallback || (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Not authenticated - this shouldn't happen due to middleware, but extra safety
    if (!isAuthenticated) {
        return null;
    }

    // Authenticated - render children
    return <>{children}</>;
}