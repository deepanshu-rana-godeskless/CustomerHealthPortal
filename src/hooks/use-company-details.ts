"use client";

import { useState, useEffect } from "react";

import {
  fetchTenantData,
  fetchTransactionTrend,
  fetchMediaTrend,
  fetchAvgWorkOrderResolutionTime,
  fetchKbPerTickets,
  fetchApiUtilizationMTD,
  fetchApiUtilizationPastMonths,
  fetchCommunicationMetrics,
  fetchTenantUserDetails,
} from "@/lib/apiService";
import type { DateRange, CompanyDetailsData } from "@/types/company-details";

export function useCompanyDetails(companyId: string, dateRange: DateRange) {
  const [companyData, setCompanyData] = useState<CompanyDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare common payload for POST requests
      const payload = {
        id: companyId,
        tenant_id: companyId,
        tenant_type: "paid", // This could be dynamic based on company data
        from_date: dateRange.from,
        to_date: dateRange.to,
        start_date: dateRange.from,
        end_date: dateRange.to,
        filter_value: dateRange.filter,
        timezone: "Asia/Calcutta", // This could be dynamic based on company settings
      };

      // Prepare params for GET requests
      const params = {
        tenant_type: "paid",
        id: companyId,
      };

      // Fetch all data in parallel
      const [
        tenantData,
        transactionTrend,
        mediaTrend,
        avgResolutionTime,
        kbPerTickets,
        apiUtilizationMTD,
        apiUtilizationMonths,
        communicationMetrics,
        userDetails,
      ] = await Promise.all([
        fetchTenantData(payload),
        fetchTransactionTrend(payload),
        fetchMediaTrend(payload),
        fetchAvgWorkOrderResolutionTime({
          id: companyId,
          tenant_type: "paid",
          from_date: dateRange.from,
          to_date: dateRange.to,
          timezone: "Asia/Calcutta",
        }),
        fetchKbPerTickets({
          id: companyId,
          tenant_type: "paid",
          from_date: dateRange.from,
          to_date: dateRange.to,
          timezone: "Asia/Calcutta",
        }),
        fetchApiUtilizationMTD(params),
        fetchApiUtilizationPastMonths({ id: companyId }),
        fetchCommunicationMetrics({
          tenant_id: companyId,
          tenant_type: "paid",
        }),
        fetchTenantUserDetails({
          id: companyId,
          tenant_id: companyId,
          tenant_type: "paid",
          user_type: "",
        }),
      ]);

      setCompanyData({
        tenantData,
        transactionTrend,
        mediaTrend,
        avgResolutionTime,
        kbPerTickets,
        apiUtilizationMTD,
        apiUtilizationMonths,
        communicationMetrics,
        userDetails,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch company details");
      console.error("Error fetching company details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchAllData();
    }
  }, [companyId, dateRange]);

  return {
    companyData,
    loading,
    error,
    refetch: fetchAllData,
  };
}
