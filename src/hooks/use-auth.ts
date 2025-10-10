/**
 * Authentication Hook - Customer Health Portal
 * GoDeskless Inc.
 *
 * React hook for managing authentication state and user data
 */

import { useState, useEffect, useCallback } from "react";

import { AuthService } from "@/services/auth-service";
import type { UserData, AuthState } from "@/types/auth";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on component mount
  useEffect(() => {
    checkAuthState();
  }, []);

  /**
   * Check current authentication state
   */
  const checkAuthState = useCallback(() => {
    try {
      const isAuthenticated = AuthService.isAuthenticated();
      const user = AuthService.getCurrentUser();
      const accessToken = AuthService.getAccessToken();
      const refreshToken = AuthService.getRefreshToken();

      // Calculate expiration time
      let expiresAt: number | null = null;
      const storedData = AuthService.getStoredAuthData();
      if (storedData) {
        expiresAt = storedData.timestamp + storedData.expires_in * 1000;
      }

      setAuthState({
        isAuthenticated,
        user,
        accessToken,
        refreshToken,
        expiresAt,
      });
    } catch (error) {
      console.error("Error checking auth state:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const loginResponse = await AuthService.login(email, password);

      // Update auth state
      setAuthState({
        isAuthenticated: true,
        user: loginResponse.user_data,
        accessToken: loginResponse.access_token,
        refreshToken: loginResponse.refresh_token,
        expiresAt: Date.now() + loginResponse.expires_in * 1000,
      });

      return loginResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  /**
   * Logout user and clear state
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    });
  }, []);

  /**
   * Refresh authentication state
   */
  const refreshAuth = useCallback(() => {
    checkAuthState();
  }, [checkAuthState]);

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  const isTokenExpiringSoon = useCallback(() => {
    if (!authState.expiresAt) return false;
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return authState.expiresAt < fiveMinutesFromNow;
  }, [authState.expiresAt]);

  /**
   * Get user display name
   */
  const getUserDisplayName = useCallback(() => {
    if (!authState.user) return "User";

    const { first_name, last_name, email } = authState.user;

    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    }

    return email;
  }, [authState.user]);

  /**
   * Check if user has admin privileges
   */
  const isAdmin = useCallback(() => {
    return authState.user?.is_admin || false;
  }, [authState.user]);

  /**
   * Get user permissions based on user type and admin status
   */
  const getUserPermissions = useCallback(() => {
    if (!authState.user) return [];

    const permissions = ["read"]; // Basic read permission for all users

    if (authState.user.user_type === "management") {
      permissions.push("write", "manage");
    }

    if (authState.user.is_admin) {
      permissions.push("admin", "delete");
    }

    return permissions;
  }, [authState.user]);

  return {
    // Auth state
    ...authState,
    isLoading,

    // Actions
    login,
    logout,
    refreshAuth,

    // Utilities
    isTokenExpiringSoon,
    getUserDisplayName,
    isAdmin,
    getUserPermissions,
  };
}
