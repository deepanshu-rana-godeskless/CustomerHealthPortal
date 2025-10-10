/**
 * Authentication Types - Customer Health Portal
 * GoDeskless Inc.
 */

// Login Request Payload
export interface LoginRequest {
  username: string; // email address
  password: string;
  user_type: "management";
}

// Login Response from API
export interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
  scope: string;
  refresh_token: string;
  user_data: UserData;
}

// User Data from Login Response
export interface UserData {
  email: string;
  product_name: string;
  crm_type: string;
  domain_name: string;
  user_type: string;
  id: number;
  company_name: string | null;
  phone_number: string | null;
  designation: string | null;
  date_joined: string;
  first_name: string | null;
  last_name: string | null;
  allowed_user: number;
  pool_id: string;
  is_admin: boolean;
  is_active: boolean;
}

// Error Response from API
export interface LoginErrorResponse {
  msg: string;
  error_code: number;
}

// Local Storage Auth Data
export interface StoredAuthData extends LoginResponse {
  timestamp: number; // When the token was stored
}

// Auth State for the Application
export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}
