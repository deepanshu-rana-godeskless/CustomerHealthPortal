/**
 * Customer Health Portal - Customers Hook
 * GoDeskless Inc.
 *
 * React hook for managing customer data
 */
"use client";

import { useState, useEffect } from "react";

import { customersService } from "@/services/data-service";
// Customer types
interface Customer {
  id: number;
  company: string;
  business_email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  plan_type: string;
  company_score: string | null;
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
  on_trial: boolean;
  trial_expired: boolean;
  created_on: string;
}

interface CustomersResponse {
  next: string | null;
  previous: string | null;
  count: number;
  total_pages: number;
  results: Customer[];
}

export function useCustomers(page: number = 1, tenantType: "paid" | "default" | "all" = "paid") {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    totalPages: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: CustomersResponse = await customersService.getTenants({ tenant_type: tenantType }, page);

      setData(response.results);
      setPagination({
        count: response.count,
        totalPages: response.total_pages,
        next: response.next,
        previous: response.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, tenantType]);

  return {
    customers: data,
    loading,
    error,
    pagination,
    refetch: fetchCustomers,
  };
}
