/**
 * Enhanced API Service Layer
 * Provides type-safe HTTP client with error handling, retries, and interceptors
 * Follows SOLID principles with dependency injection and interface segregation
 */

import { ApiResponse, ServiceConfig, RequestOptions, AppError } from "@/types/common";
import { AuthService } from "./auth-service";
import { environment } from "@/config/environment";

// Default configuration
const DEFAULT_CONFIG: ServiceConfig = {
    baseUrl: environment.apiUrl,
    timeout: 10000,
    retries: 3,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
};

/**
 * HTTP Status Code Constants
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * API Error Class for structured error handling
 */
export class ApiError extends Error implements AppError {
    public readonly code: string;
    public readonly status: number;
    public readonly details?: Record<string, unknown>;

    constructor(
        message: string,
        code: string = "API_ERROR",
        status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        details?: Record<string, unknown>
    ) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.status = status;
        this.details = details;
    }
}

/**
 * Enhanced HTTP Client with type safety and error handling
 */
export class HttpClient {
    private config: ServiceConfig;

    constructor(config: Partial<ServiceConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Create request headers with authentication
     */
    private async createHeaders(customHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
        const baseHeaders = { ...this.config.headers, ...customHeaders };

        // Add authentication token if available
        const authToken = AuthService.getAccessToken();
        if (authToken) {
            baseHeaders.Authorization = `Bearer ${authToken}`;
        }

        return baseHeaders;
    }

    /**
     * Handle API response and extract data
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get("content-type");
        const isJson = contentType?.includes("application/json");

        let data: unknown;
        try {
            data = isJson ? await response.json() : await response.text();
        } catch (error) {
            throw new ApiError(
                "Failed to parse response",
                "PARSE_ERROR",
                response.status,
                { originalError: error }
            );
        }

        if (!response.ok) {
            const errorMessage = this.extractErrorMessage(data);
            throw new ApiError(
                errorMessage,
                `HTTP_${response.status}`,
                response.status,
                { response: data }
            );
        }

        return data as T;
    }

    /**
     * Extract error message from response data
     */
    private extractErrorMessage(data: unknown): string {
        if (typeof data === "string") return data;
        if (typeof data === "object" && data !== null) {
            const errorData = data as Record<string, unknown>;
            return (errorData.message || errorData.error || errorData.msg || "Request failed") as string;
        }
        return "Unknown error occurred";
    }

    /**
     * Retry mechanism with exponential backoff
     */
    private async retryRequest<T>(
        requestFn: () => Promise<T>,
        retries: number = this.config.retries
    ): Promise<T> {
        try {
            return await requestFn();
        } catch (error) {
            if (retries > 0 && error instanceof ApiError && error.status >= 500) {
                const delay = Math.pow(2, this.config.retries - retries) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.retryRequest(requestFn, retries - 1);
            }
            throw error;
        }
    }

    /**
     * Generic request method
     */
    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const {
            method = "GET",
            headers: customHeaders = {},
            body,
            timeout = this.config.timeout,
            retries = this.config.retries,
        } = options;

        const url = endpoint.startsWith("http") ? endpoint : `${this.config.baseUrl}${endpoint}`;
        const headers = await this.createHeaders(customHeaders);

        const requestFn = async (): Promise<T> => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                const response = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);
                return await this.handleResponse<T>(response);
            } catch (error) {
                clearTimeout(timeoutId);

                if (error instanceof Error && error.name === "AbortError") {
                    throw new ApiError("Request timeout", "TIMEOUT_ERROR", 408);
                }

                if (error instanceof ApiError) {
                    throw error;
                }

                throw new ApiError(
                    error instanceof Error ? error.message : "Network error",
                    "NETWORK_ERROR",
                    0,
                    { originalError: error }
                );
            }
        };

        return this.retryRequest(requestFn, retries);
    }

    // HTTP Methods
    async get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "GET" });
    }

    async post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "POST", body });
    }

    async put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "PUT", body });
    }

    async patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "PATCH", body });
    }

    async delete<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "DELETE" });
    }
}

// Create singleton instance
export const httpClient = new HttpClient();

// Export convenience methods
export const api = {
    get: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
        httpClient.get<T>(endpoint, options),

    post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
        httpClient.post<T>(endpoint, body, options),

    put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
        httpClient.put<T>(endpoint, body, options),

    patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
        httpClient.patch<T>(endpoint, body, options),

    delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
        httpClient.delete<T>(endpoint, options),
};