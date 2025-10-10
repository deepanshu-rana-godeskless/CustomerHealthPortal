/**
 * Customer Health Portal - Customers Hook
 * GoDeskless Inc.
 *
 * React hook for managing customer data
 */
"use client";

import { useState, useEffect } from "react";

import { customersService } from "@/services/customers-service";
import type { Customer, CustomersResponse } from "@/types/customers";

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

      const response: CustomersResponse = await customersService.getCustomers(page, tenantType);

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
