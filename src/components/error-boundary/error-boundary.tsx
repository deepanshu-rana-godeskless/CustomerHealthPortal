"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppError } from "@/types/common";

interface ErrorBoundaryState {
    hasError: boolean;
    error: AppError | null;
    errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showErrorDetails?: boolean;
}

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Provides consistent error handling across the application
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error: {
                code: "REACT_ERROR_BOUNDARY",
                message: error.message,
                details: { name: error.name, stack: error.stack },
            },
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to monitoring service
        this.logErrorToService(error, errorInfo);

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        this.setState({
            errorInfo,
        });
    }

    private logErrorToService = (error: Error, errorInfo: ErrorInfo): void => {
        // In production, send to error monitoring service (Sentry, LogRocket, etc.)
        if (process.env.NODE_ENV === "production") {
            console.error("Error Boundary caught an error:", error, errorInfo);
            // TODO: Send to monitoring service
            // errorMonitoringService.captureException(error, { extra: errorInfo });
        } else {
            console.error("Error Boundary caught an error:", error, errorInfo);
        }
    };

    private handleRetry = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    private handleGoHome = (): void => {
        window.location.href = "/dashboard";
    };

    private handleRefresh = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError && this.state.error) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <Card className="w-full max-w-2xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl">Something went wrong</CardTitle>
                            <CardDescription>
                                An unexpected error occurred. Please try one of the options below.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Error Alert */}
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error Details</AlertTitle>
                                <AlertDescription className="mt-2">
                                    <code className="text-sm">{this.state.error.message}</code>
                                </AlertDescription>
                            </Alert>

                            {/* Error Details (Development only) */}
                            {this.props.showErrorDetails && process.env.NODE_ENV === "development" && (
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Debug Information</AlertTitle>
                                    <AlertDescription className="mt-2">
                                        <details className="text-xs">
                                            <summary className="cursor-pointer font-medium">Stack Trace</summary>
                                            <pre className="mt-2 whitespace-pre-wrap break-all">
                                                {this.state.error.details?.stack}
                                            </pre>
                                        </details>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button onClick={this.handleRetry} className="flex-1">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                                <Button onClick={this.handleRefresh} variant="outline" className="flex-1">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refresh Page
                                </Button>
                                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go to Dashboard
                                </Button>
                            </div>

                            {/* Help Text */}
                            <p className="text-sm text-muted-foreground text-center mt-4">
                                If this problem persists, please contact our support team.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook for programmatic error boundary triggering
 */
export const useErrorHandler = () => {
    return (error: Error, errorInfo?: ErrorInfo) => {
        // This will trigger the error boundary
        throw error;
    };
};

/**
 * Higher-order component to wrap components with error boundary
 */
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
};