/**
 * Authentication Service - Customer Health Portal
 * GoDeskless Inc.
 *
 * Handles API authentication, token management, and localStorage operations
 */

import type { LoginRequest, LoginResponse, LoginErrorResponse, StoredAuthData } from "@/types/auth";
import { environment } from "@/config/environment";

const API_BASE_URL = `${environment.apiUrl}/api/stb/api/v1`;
const AUTH_STORAGE_KEY = "godeskless_auth_data";

export class AuthService {
  /**
   * Authenticate user with GoDeskless API
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    const payload: LoginRequest = {
      username: email,
      password: password,
      user_type: "management",
    };

    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData: LoginErrorResponse = await response.json();
      throw new Error(errorData.msg || "Authentication failed");
    }

    const loginData: LoginResponse = await response.json();

    // Store authentication data in localStorage
    this.storeAuthData(loginData);

    return loginData;
  }

  /**
   * Store authentication data in localStorage with timestamp
   */
  static storeAuthData(authData: LoginResponse): void {
    const storedData: StoredAuthData = {
      ...authData,
      timestamp: Date.now(),
    };

    try {
      // Store in localStorage for client-side access
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedData));
      localStorage.setItem("accessToken", authData.access_token);

      // Set secure cookie for middleware authentication
      const expiresAt = new Date(Date.now() + authData.expires_in * 1000);
      const isProduction = window.location.protocol === 'https:';
      const secureFlag = isProduction ? '; Secure' : '';
      document.cookie = `godeskless_auth_token=${authData.access_token}; path=/; expires=${expiresAt.toUTCString()}; SameSite=Lax${secureFlag}`;
    } catch (error) {
      console.error("Failed to store authentication data:", error);
    }
  }

  /**
   * Retrieve stored authentication data
   */
  static getStoredAuthData(): StoredAuthData | null {
    try {
      const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedData) return null;

      const authData: StoredAuthData = JSON.parse(storedData);

      // Check if token is still valid
      const expiresAt = authData.timestamp + authData.expires_in * 1000;
      if (Date.now() >= expiresAt) {
        this.clearAuthData();
        return null;
      }

      return authData;
    } catch (error) {
      console.error("Failed to retrieve authentication data:", error);
      this.clearAuthData();
      return null;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  static isAuthenticated(): boolean {
    const authData = this.getStoredAuthData();
    return authData !== null && authData.user_data.is_active;
  }

  /**
   * Get current user data
   */
  static getCurrentUser() {
    const authData = this.getStoredAuthData();
    return authData?.user_data || null;
  }

  /**
   * Get access token for API requests
   */
  static getAccessToken(): string | null {
    const authData = this.getStoredAuthData();
    return authData?.access_token || null;
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    const authData = this.getStoredAuthData();
    return authData?.refresh_token || null;
  }

  /**
   * Clear all authentication data and logout
   */
  static logout(): void {
    this.clearAuthData();

    // Clear localStorage tokens
    localStorage.removeItem("accessToken");

    // Clear auth cookie
    const isProduction = window.location.protocol === 'https:';
    const secureFlag = isProduction ? '; Secure' : '';
    document.cookie = `godeskless_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secureFlag}`;

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth/v2/login";
    }
  }

  /**
   * Clear stored authentication data
   */
  private static clearAuthData(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear authentication data:", error);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(): Promise<LoginResponse | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return null;
    }

    try {
      // Note: You'll need to implement the refresh endpoint call here
      // This is a placeholder for the refresh token API call
      console.warn("Refresh token endpoint not implemented yet");
      return null;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      this.logout();
      return null;
    }
  }

  /**
   * Create authorization header for API requests
   */
  static getAuthHeader(): { Authorization: string } | {} {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
