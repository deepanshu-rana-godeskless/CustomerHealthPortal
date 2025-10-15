
/**
 * CustomersService - Centralized API Service for Customer/Tenant Data
 * Mirrors Angular data.service.ts pattern for simple, environment-driven API calls
 * All endpoints are defined and use config for base URLs
 */

import { httpClient } from "./http-client";
import { environment } from "@/config/environment";
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

interface CustomersRequest {
  tenant_type: "paid" | "default" | "all";
}

const API_URL = environment.apiUrl;
const LEAD_CREATION_API_URL = environment.leadCreationApiUrl;

export const customersService = {
  login: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/stb/api/v1/login/`, data),

  getTenants: (data: any, pageNo: number) =>
    httpClient.post<any>(`${API_URL}/api/get/tenants/?page=${pageNo}`, data),

  getTenantDetails: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/tenants/data/`, data),

  getTenantUserDetails: (data: any) => {
    let url = `${API_URL}/api/get/tenant/user_details/`;
    if (data.page) {
      url += `?page=${data.page}`;
    }
    return httpClient.post<any>(url, data);
  },

  getAvgWorkorderResolutionTime: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/avg-workorder-resolution-time/`, data),

  getKnowledgeBaseData: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/kb-per-tickets/`, data),

  getTrafficDetails: (data: any) =>
    httpClient.get<any>(`${API_URL}/api/get/traffic/`, data),

  getUsageDetails: (category: any, fromDate = "", toDate = "") => {
    const data = { start_date: fromDate, end_date: toDate };
    return httpClient.post<any>(`${API_URL}/api/get/daily-utilization/?category=${category}`, data);
  },

  changePassword: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/stb/api/v1/change/password/`, data),

  customerSignup: (data: any) =>
    httpClient.post<any>(`${LEAD_CREATION_API_URL}/api/generic/new-customer-signup/`, data),

  customerUserUpdate: (data: any) =>
    httpClient.post<any>(`${LEAD_CREATION_API_URL}/api/generic/user-data-customer-updation/`, data),

  customerMediaUpdate: (data: any) =>
    httpClient.post<any>(`${LEAD_CREATION_API_URL}/api/generic/media-pack-customer-updation/`, data),

  logOut: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/stb/api/v1/logout/`, data),

  getPlans: () =>
    httpClient.get<any>(`${API_URL}/api/v2/plans/`),

  extendPlan: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/stb/api/v1/extend/trial/`, data),

  getReports: (tenantType: any) =>
    httpClient.get<any>(`${API_URL}/api/get/tenants/analytics/?type=${tenantType}`),

  getTenantPlans: () =>
    httpClient.get<any>(`${API_URL}/commercial/stb/v1/getplans/`),

  updatePlan: (data: any) =>
    httpClient.get<any>(`${API_URL}/api/update/plan_type/?plan_type=${data.planType}&tenant_name=${data.tenantName}`),

  getSelectedPlan: (data: any) =>
    httpClient.post<any>(`${API_URL}/commercial/stb/v1/get/selectedplan/`, data),

  getPaidTransactionTrendPlan: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/trend/transaction-trend/${data.tenant_type}/`, data),

  getUserUtilization: (data: any) =>
    httpClient.get<any>(`${API_URL}/api/utilisation/user-utilisation/`, data),

  getTicketVisitCount: (start_date: any, end_date: any, tenant_type: any) =>
    httpClient.get<any>(`${API_URL}/api/utilisation/ticket-utilisation/${tenant_type}/?start_date=${start_date}&end_date=${end_date}`),

  getCustomersUsersCount: (data: any) =>
    httpClient.get<any>(`${API_URL}/api/utilisation/user-utilisation/`, data),

  getTicketsVisitCount: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/trend/transaction-trend/${data.tenant_type}/`, data),

  getMediaCount: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/all-tenant-usage/`, data),

  getCustomersUsersTrend: (data: any) =>
    httpClient.get<any>(`${API_URL}/api/utilisation/user-utilisation/?start_date=${data?.start_date}&end_date=${data?.end_date}`),

  getTicketsVisitTrend: (data: any) =>
    httpClient.get<any>(`${API_URL}/api/utilisation/user-utilisation/?start_date=${data?.start_date}&end_date=${data?.end_date}`),

  getTicketUtilisation: (tenantType: "paid" | "trail", startDate: string, endDate: string) =>
    httpClient.get<any>(`${API_URL}/api/utilisation/ticket-utilisation/${tenantType}/?start_date=${startDate}&end_date=${endDate}`),

  getMediaTrend: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/trend/media-trend/${data.tenant_type}/`, data),

  getCustomersUsersTrendForTenant: (data: any) =>
    httpClient.get<any>(`${API_URL}/api/utilisation/user-utilisation/?start_date=${data?.start_date}&end_date=${data?.end_date}`),

  getTicketsVisitTrendForTenant: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/trend/transaction-tenant-trend/${data.tenant_type}/`, data),

  getMediaTrendForTenant: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/trend/media-tenant-trend/${data.tenant_type}/`, data),

  getCustomersUsersRank: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/recent-user-tenant-data/`, data),

  getTicketsVisitRank: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/recent-ticket-visit-tenant-data/`, data),

  getMediaRank: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/tenant-top-usage/`, data),

  getCustomersUsersBottomRank: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/least-recent-user-tenant-data/`, data),

  getTicketsVisitBottomRank: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/least-ticket-visit-tenant-data/`, data),

  getMediaBottomRank: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/tenant-least-usage/`, data),

  getTicketsVisitAvg: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/avg-ticket-visit-user/`, data),

  getMediaAvg: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/tenant-average-utilization/`, data),

  getInstanceDetails: (data: any) =>
    httpClient.post<any>(`${LEAD_CREATION_API_URL}/api/generic/get-instance-details/`, data),

  updateCompanyBusinessData: (data: any) =>
    httpClient.post<any>(`${LEAD_CREATION_API_URL}/api/generic/customer-business-data-updation/`, data),

  updateCustomerContact: (data: any) =>
    httpClient.post<any>(`${LEAD_CREATION_API_URL}/api/generic/update-customer-contact/`, data),

  getApiUsedPerCustomer: (tenor: any = "mtd", tenantType: any = "paid") =>
    httpClient.get<any>(`${API_URL}/api/get/api-utilization/${tenor}/?tenant_type=${tenantType}`),

  getApiUsedPerSingleCustomer: (tenor: any = "mtd", tenantType: any = "paid", id: any) =>
    httpClient.get<any>(`${API_URL}/api/get/api-utilization/${tenor}/?tenant_type=${tenantType}&id=${id}`),

  getApiUsedPerMonthSingleCustomer: (id: any) =>
    httpClient.get<any>(`${API_URL}/api/get/api-utilization/past/months/?id=${id}`),

  getCustomerProgressMetrix: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/get/communication-metrics/counts/`, data),

  sendOtpToEmail: (data: { email: string }) =>
    httpClient.post<any>(`${API_URL}/api/reset-password/send-otp/`, data),

  verifyOrResetPassword: (data: any) =>
    httpClient.post<any>(`${API_URL}/api/reset-password/verify-otp/`, data),
};
export default customersService;
