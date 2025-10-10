/**
 * API Client - Customer Health Portal
 * GoDeskless Inc.
 *
 * HTTP client with automatic authentication and token management
 */

import { AuthService } from "./auth-service";

const API_BASE_URL = "https://stbbackend.godeskless.com";

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ["/login/", "/analytics/", "/password-reset/"];

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if an endpoint is public (doesn't require authentication)
   */
  private isPublicEndpoint(endpoint: string): boolean {
    return PUBLIC_ENDPOINTS.some((publicEndpoint) => endpoint.includes(publicEndpoint));
  }

  /**
   * Make authenticated HTTP request
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Default headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    // Add authentication header for protected endpoints
    if (!this.isPublicEndpoint(endpoint)) {
      const authHeader = AuthService.getAuthHeader();
      Object.assign(headers, authHeader);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle authentication errors
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await AuthService.refreshAccessToken();
        if (refreshed) {
          // Retry request with new token
          const newAuthHeader = AuthService.getAuthHeader();
          Object.assign(headers, newAuthHeader);
          const retryResponse = await fetch(url, { ...config, headers });

          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          return await retryResponse.json();
        } else {
          // Refresh failed, logout user
          AuthService.logout();
          throw new Error("Session expired. Please login again.");
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances if needed
export { ApiClient };
