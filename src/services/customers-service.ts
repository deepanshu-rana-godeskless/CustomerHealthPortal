/**
 * Customer Health Portal - Customers API Service
 * GoDeskless Inc.
 *
 * Service for managing customer/tenant data
 */
import type { CustomersResponse, CustomersRequest } from "@/types/customers";

import { apiClient } from "./api-client";

export const customersService = {
  /**
   * Fetch customers/tenants data
   */
  async getCustomers(page: number = 1, tenantType: "paid" | "default" | "all" = "paid"): Promise<CustomersResponse> {
    const payload: CustomersRequest = {
      tenant_type: tenantType,
    };

    const response = await apiClient.post<CustomersResponse>(`/api/get/tenants/?page=${page}`, payload);

    return response;
  },
};
