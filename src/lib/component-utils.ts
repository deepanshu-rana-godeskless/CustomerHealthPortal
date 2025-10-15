/**
 * UI Component Utilities
 * Provides reusable utilities for consistent UI components
 * Follows SOLID principles with composable design patterns
 */

import { ReactNode, ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

/**
 * Common size variants for UI components
 */
export const sizeVariants = {
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
} as const;

export type SizeVariant = keyof typeof sizeVariants;

/**
 * Common color variants for UI components
 */
export const colorVariants = {
    default: "default",
    primary: "primary",
    secondary: "secondary",
    destructive: "destructive",
    success: "success",
    warning: "warning",
    info: "info",
} as const;

export type ColorVariant = keyof typeof colorVariants;

/**
 * Loading state utilities
 */
export interface LoadingState {
    isLoading: boolean;
    loadingText?: string;
    loadingComponent?: ReactNode;
}

/**
 * Error state utilities
 */
export interface ErrorState {
    hasError: boolean;
    error?: Error | string;
    errorComponent?: ReactNode;
    onRetry?: () => void;
}

/**
 * Empty state utilities
 */
export interface EmptyState {
    isEmpty: boolean;
    emptyText?: string;
    emptyComponent?: ReactNode;
    emptyAction?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Combined state for data components
 */
export interface DataComponentState extends LoadingState, ErrorState, EmptyState {
    data?: any;
}

/**
 * Status indicator utilities
 */
export const StatusIndicators = {
    success: {
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        icon: "✓",
    },
    error: {
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        icon: "✕",
    },
    warning: {
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        icon: "⚠",
    },
    info: {
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        icon: "ℹ",
    },
    pending: {
        color: "bg-gray-500",
        textColor: "text-gray-700",
        bgColor: "bg-gray-50",
        icon: "⏳",
    },
} as const;

export type StatusType = keyof typeof StatusIndicators;

/**
 * Common spacing utilities
 */
export const spacing = {
    none: "0",
    xs: "0.5",
    sm: "1",
    md: "1.5",
    lg: "2",
    xl: "3",
    "2xl": "4",
    "3xl": "6",
    "4xl": "8",
} as const;

/**
 * Animation utilities
 */
export const animations = {
    fadeIn: "animate-in fade-in-0 duration-200",
    fadeOut: "animate-out fade-out-0 duration-200",
    slideIn: "animate-in slide-in-from-bottom-4 duration-300",
    slideOut: "animate-out slide-out-to-bottom-4 duration-300",
    scaleIn: "animate-in zoom-in-95 duration-200",
    scaleOut: "animate-out zoom-out-95 duration-200",
} as const;

export type AnimationType = keyof typeof animations;

/**
 * Focus utilities for accessibility
 */
export const focusRing = "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
export const focusVisible = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

/**
 * Screen reader utilities
 */
export const srOnly = "sr-only";
export const notSrOnly = "not-sr-only";

/**
 * Component composition utilities
 */
export interface WithClassName {
    className?: string;
}

export interface WithChildren {
    children?: ReactNode;
}

export interface WithTestId {
    testId?: string;
}

export interface WithVariants<T = {}> extends VariantProps<any> {
    variant?: T;
}

/**
 * Common props interface for all UI components
 */
export interface BaseComponentProps extends WithClassName, WithChildren, WithTestId {
    id?: string;
    "aria-label"?: string;
    "aria-describedby"?: string;
}

/**
 * Utility for creating consistent component variants using CVA pattern
 */
export function createVariants<T extends Record<string, any>>(
    baseClasses: string,
    variants: T,
    defaultVariants?: Partial<keyof T>
) {
    return {
        base: baseClasses,
        variants,
        defaultVariants,
    };
}

/**
 * Utility for merging component props with defaults
 */
export function mergeProps<T extends object>(
    defaultProps: Partial<T>,
    userProps: Partial<T>
): T {
    return { ...defaultProps, ...userProps } as T;
}

/**
 * Utility for conditional rendering based on state
 */
export function renderWithState<T>(
    state: DataComponentState,
    renderContent: (data: T) => ReactNode,
    options?: {
        loadingComponent?: ReactNode;
        errorComponent?: ReactNode;
        emptyComponent?: ReactNode;
    }
): ReactNode {
    const {
        loadingComponent = <div>Loading...</div>,
    errorComponent = <div>Error occurred </div>,
    emptyComponent = <div>No data available </div>,
} = options || {};

if (state.isLoading) {
    return state.loadingComponent || loadingComponent;
}

if (state.hasError) {
    return state.errorComponent || errorComponent;
}

if (state.isEmpty) {
    return state.emptyComponent || emptyComponent;
}

return renderContent(state.data);
}

/**
 * Utility for creating responsive classes
 */
export function responsive(
    base: string,
    variants: Partial<Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
): string {
    const classes = [base];

    Object.entries(variants).forEach(([breakpoint, className]) => {
        if (className) {
            classes.push(`${breakpoint}:${className}`);
        }
    });

    return cn(...classes);
}

/**
 * Utility for creating hover/focus states
 */
export function interactiveStates(
    base: string,
    hover?: string,
    focus?: string,
    active?: string,
    disabled?: string
): string {
    const classes = [base];

    if (hover) classes.push(`hover:${hover}`);
    if (focus) classes.push(`focus:${focus}`);
    if (active) classes.push(`active:${active}`);
    if (disabled) classes.push(`disabled:${disabled}`);

    return cn(...classes);
}

/**
 * Utility for creating consistent shadows
 */
export const shadows = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    inner: "shadow-inner",
} as const;

export type ShadowVariant = keyof typeof shadows;

/**
 * Utility for creating consistent borders
 */
export const borders = {
    none: "border-0",
    thin: "border",
    thick: "border-2",
    dashed: "border border-dashed",
    dotted: "border border-dotted",
} as const;

export type BorderVariant = keyof typeof borders;

/**
 * Utility for creating consistent rounded corners
 */
export const rounded = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
} as const;

export type RoundedVariant = keyof typeof rounded;

/**
 * Common transition utilities
 */
export const transitions = {
    none: "transition-none",
    all: "transition-all",
    colors: "transition-colors",
    opacity: "transition-opacity",
    shadow: "transition-shadow",
    transform: "transition-transform",
} as const;

export type TransitionVariant = keyof typeof transitions;

/**
 * Utility for creating consistent text styles
 */
export const textStyles = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
} as const;

export type TextStyle = keyof typeof textStyles;

/**
 * Utility for creating consistent font weights  
 */
export const fontWeights = {
    thin: "font-thin",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
} as const;

export type FontWeight = keyof typeof fontWeights;

/**
 * Composable component builder utility
 */
export function composeComponent<P extends BaseComponentProps>(
    displayName: string,
    defaultProps?: Partial<P>
) {
    return function <T extends P>(
        Component: React.ComponentType<T>
    ) {
        const ComposedComponent = (props: T) => {
            const mergedProps = mergeProps(defaultProps || {}, props) as T;
            return <Component { ...mergedProps } />;
        };

        ComposedComponent.displayName = displayName;
        return ComposedComponent;
    };
}