/**
 * Enhanced Application Configuration
 * Central configuration with comprehensive settings and type safety
 * Follows SOLID principles with environment-based configuration
 */

import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

/**
 * Environment variables with defaults and validation
 */
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version,
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  NEXT_PUBLIC_ENABLE_DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false', // Default true
  NEXT_PUBLIC_ENABLE_EXPORT: process.env.NEXT_PUBLIC_ENABLE_EXPORT !== 'false', // Default true
  NEXT_PUBLIC_ENABLE_MOCK_DATA: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
} as const;

export const appConfig = {
  /**
   * Application metadata
   */
  app: {
    name: "Customer Health Portal",
    company: "GoDeskless Inc.",
    version: env.NEXT_PUBLIC_APP_VERSION,
    copyright: `© ${currentYear}, GoDeskless Inc. All rights reserved.`,
    description: "Comprehensive customer management and analytics platform for GoDeskless Inc. Monitor customer health, track engagement, and manage relationships with advanced analytics and insights.",
    author: "GoDeskless Inc.",
    repository: "https://github.com/godeskless/customer-health-portal",
    license: "MIT",
    keywords: ["customer", "health", "portal", "analytics", "dashboard"],
    meta: {
      title: "Customer Health Portal - GoDeskless Inc.",
      description: "Comprehensive customer management and analytics platform for GoDeskless Inc. Monitor customer health, track engagement, and manage relationships with advanced analytics and insights.",
    },
    contact: {
      email: "support@godeskless.com",
      phone: "+1 (555) 123-4567",
      website: "https://godeskless.com",
    },
  },

  /**
   * Environment configuration
   */
  env: {
    NODE_ENV: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    isClient: typeof window !== 'undefined',
    isServer: typeof window === 'undefined',
  },

  /**
   * API configuration
   */
  api: {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,

    // Request configuration
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Version': env.NEXT_PUBLIC_APP_VERSION,
    },

    // API endpoints
    endpoints: {
      auth: {
        login: "/api/auth/login",
        logout: "/api/auth/logout",
        refresh: "/api/auth/refresh",
        profile: "/api/auth/profile",
        register: "/api/auth/register",
        resetPassword: "/api/auth/reset-password",
        verifyEmail: "/api/auth/verify-email",
      },
      customers: {
        list: "/api/customers",
        create: "/api/customers",
        update: (id: string) => `/api/customers/${id}`,
        delete: (id: string) => `/api/customers/${id}`,
        get: (id: string) => `/api/customers/${id}`,
        search: "/api/customers/search",
        export: "/api/customers/export",
        import: "/api/customers/import",
        bulk: "/api/customers/bulk",
      },
      business: {
        details: "/api/business/details",
        update: "/api/business/details",
        metrics: "/api/business/metrics",
        settings: "/api/business/settings",
        healthScore: "/api/business/health-score",
      },
      analytics: {
        dashboard: "/api/analytics/dashboard",
        reports: "/api/analytics/reports",
        export: "/api/analytics/export",
      },
      notifications: {
        list: "/api/notifications",
        markRead: (id: string) => `/api/notifications/${id}/read`,
        markAllRead: "/api/notifications/read-all",
        preferences: "/api/notifications/preferences",
      },
      health: "/api/health",
      upload: "/api/upload",
    },
  },

  /**
   * Authentication configuration
   */
  auth: {
    cookieName: "auth-token",
    refreshCookieName: "refresh-token",
    tokenExpiry: 3600, // 1 hour in seconds
    refreshTokenExpiry: 604800, // 7 days in seconds
    redirectAfterLogin: "/dashboard",
    redirectAfterLogout: "/auth/login",

    // Security settings
    security: {
      enableCSRF: true,
      enableMFA: false,
      passwordMinLength: 8,
      sessionTimeout: 1800, // 30 minutes
      maxLoginAttempts: 5,
      lockoutDuration: 300, // 5 minutes
    },

    // OAuth providers (if applicable)
    oauth: {
      google: {
        enabled: false,
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      },
      microsoft: {
        enabled: false,
        clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID,
      },
    },
  },

  /**
   * UI configuration
   */
  ui: {
    theme: {
      defaultTheme: "light",
      themes: ["light", "dark", "system"] as const,
      enableThemeToggle: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
    },

    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100] as const,
      maxPages: 10,
    },

    toast: {
      duration: 4000,
      position: "bottom-right" as const,
      maxToasts: 5,
    },

    modal: {
      closeOnOverlayClick: true,
      closeOnEscape: true,
      showCloseButton: true,
    },

    table: {
      defaultSortDirection: "asc" as const,
      enableSorting: true,
      enableFiltering: true,
      enableColumnVisibility: true,
      enableRowSelection: true,
    },

    forms: {
      validateOnBlur: true,
      validateOnChange: false,
      showRequiredIndicator: true,
      autoSave: false,
      autoSaveDelay: 2000,
    },
  },

  /**
   * Feature flags
   */
  features: {
    enableAnalytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    enableNotifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
    enableDarkMode: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
    enableExport: env.NEXT_PUBLIC_ENABLE_EXPORT,
    enableImport: env.NEXT_PUBLIC_ENABLE_EXPORT, // Usually coupled
    enableBulkOperations: true,
    enableAdvancedFiltering: true,
    enableRealTimeUpdates: false,
    enableOfflineMode: false,
    enableDataVisualization: true,
    enableAuditLog: env.NODE_ENV === 'production',
  },

  /**
   * Performance configuration
   */
  performance: {
    enableLazyLoading: true,
    enableVirtualization: true,
    enableCaching: true,
    cacheTimeout: 300000, // 5 minutes
    debounceDelay: 300,
    throttleDelay: 1000,
  },

  /**
   * Development configuration
   */
  dev: {
    enableDebugMode: env.NODE_ENV === 'development',
    enableMockData: env.NEXT_PUBLIC_ENABLE_MOCK_DATA,
    showErrorDetails: env.NODE_ENV === 'development',
    enablePerformanceMonitoring: env.NODE_ENV === 'development',
    enableAccessibilityChecks: env.NODE_ENV === 'development',
    logLevel: env.NODE_ENV === 'development' ? 'debug' : 'error',
  },

  /**
   * External services configuration
   */
  services: {
    sentry: {
      enabled: !!env.NEXT_PUBLIC_SENTRY_DSN && env.NODE_ENV === 'production',
      dsn: env.NEXT_PUBLIC_SENTRY_DSN,
      environment: env.NODE_ENV,
    },

    analytics: {
      enabled: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
      id: env.NEXT_PUBLIC_ANALYTICS_ID,
      trackPageViews: true,
      trackErrors: true,
      trackPerformance: env.NODE_ENV === 'production',
    },
  },

  /**
   * Data validation and constraints
   */
  constraints: {
    customer: {
      nameMaxLength: 100,
      emailMaxLength: 255,
      phoneMaxLength: 20,
      companyMaxLength: 100,
      notesMaxLength: 1000,
    },

    business: {
      nameMaxLength: 100,
      descriptionMaxLength: 500,
      websiteMaxLength: 255,
    },

    file: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/csv'],
      maxFiles: 5,
    },
  },

  /**
   * Localization configuration
   */
  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en'] as const,
    enableRTL: false,
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    currency: 'USD',
    numberFormat: 'en-US',
  },
} as const;

// Maintain backward compatibility
export const APP_CONFIG = appConfig.app;

// Type definitions for configuration
export type AppConfig = typeof appConfig;
export type ApiEndpoints = typeof appConfig.api.endpoints;
export type AuthConfig = typeof appConfig.auth;
export type UIConfig = typeof appConfig.ui;
export type FeatureFlags = typeof appConfig.features;
export type Theme = typeof appConfig.ui.theme.themes[number];
export type ToastPosition = typeof appConfig.ui.toast.position;
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Configuration validation
 */
export function validateConfig(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(', ')}`
    );
  }

  // Validate API URL format
  try {
    new URL(appConfig.api.baseUrl);
  } catch {
    console.error('Invalid API URL format:', appConfig.api.baseUrl);
  }
}

/**
 * Get configuration for specific environment
 */
export function getEnvConfig() {
  return {
    isDevelopment: appConfig.env.isDevelopment,
    isProduction: appConfig.env.isProduction,
    isTest: appConfig.env.isTest,
    apiUrl: appConfig.api.baseUrl,
    version: appConfig.app.version,
  };
}

// Initialize configuration validation
if (typeof window === 'undefined') {
  validateConfig();
}
