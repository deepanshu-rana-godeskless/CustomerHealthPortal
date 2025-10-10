/**
 * Customer Health Portal - Customer Types
 * GoDeskless Inc.
 *
 * Type definitions for customer/tenant data
 */

export interface Customer {
  id: number;
  company: string;
  business_email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  plan_type: string;
  company_score: string;
  is_paid_user: boolean;
  paid_until: string;
  total_activated_users: number;
  allowed_users: number;
  crm_type: string;
  product_name: string;
  subdomain: string;
  tenant_type: string;
  is_license_exceeded: boolean;
  next_qbr_date: string | null;
  csm_assigned_and_touchpoint_notes: string;
  client_type: string;
  end_date: string;
  customer_support_mobile_number?: string | null;
  last_qbr_date?: string | null;
  final_comment?: string | null;
}

export interface CustomersResponse {
  next: string | null;
  previous: string | null;
  count: number;
  total_pages: number;
  results: Customer[];
}

export interface CustomersRequest {
  tenant_type: "paid" | "default" | "all";
}

export type CustomerFilter = "paid" | "default";
