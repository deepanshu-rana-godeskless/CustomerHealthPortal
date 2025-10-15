/**
 * Common TypeScript interfaces and types
 * Centralizes all shared types for consistency across the application
 */

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// Base types
export interface BaseEntity {
    id: string | number;
    createdAt: Date;
    updatedAt: Date;
}

// Layout and UI types
export interface LayoutProps {
    children: ReactNode;
    className?: string;
}

export interface PageProps {
    params: Record<string, string>;
    searchParams: Record<string, string | string[] | undefined>;
}

// Navigation types
export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isNew?: boolean;
    comingSoon?: boolean;
    newTab?: boolean;
    badge?: string;
}

export interface NavSubItem extends NavItem {
    parentUrl: string;
}

export interface NavMainItem extends NavItem {
    subItems?: NavSubItem[];
}

export interface NavGroup {
    id: number;
    label?: string;
    items: NavMainItem[];
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Error types
export interface AppError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
}

// Loading and async states
export interface AsyncState<T = unknown> {
    data: T | null;
    loading: boolean;
    error: AppError | null;
}

// Form types
export interface FormField<T = string> {
    value: T;
    error?: string;
    touched: boolean;
    disabled?: boolean;
}

export interface FormState<T = Record<string, unknown>> {
    values: T;
    errors: Record<keyof T, string>;
    touched: Record<keyof T, boolean>;
    isSubmitting: boolean;
    isValid: boolean;
}

// Route constants type
export type ProtectedRoute =
    | "/dashboard"
    | "/customers"
    | "/add-business"
    | `/customers/${string}`;

// Theme and preferences
export type ThemeMode = "light" | "dark" | "system";
export type SidebarState = "expanded" | "collapsed";

// Component prop types
export interface ComponentWithClassName {
    className?: string;
}

export interface ComponentWithChildren {
    children: ReactNode;
}

export interface ComponentWithVariant<T extends string = string> {
    variant?: T;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Service types
export interface ServiceConfig {
    baseUrl: string;
    timeout: number;
    retries: number;
    headers: Record<string, string>;
}

export interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
    retries?: number;
}