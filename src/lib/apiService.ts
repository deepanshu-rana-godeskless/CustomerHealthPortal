import axios from "axios";

const API_BASE_URL = "https://stbbackend.godeskless.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface ApiPayload {
  [key: string]: any;
}

interface ApiParams {
  [key: string]: any;
}

export const fetchTenantData = async (payload: ApiPayload) => {
  const response = await apiClient.post("/get/tenants/data/", payload);
  return response.data;
};

export const fetchTransactionTrend = async (payload: ApiPayload) => {
  const response = await apiClient.post("/trend/transaction-tenant-trend/paid/", payload);
  return response.data;
};

export const fetchMediaTrend = async (payload: ApiPayload) => {
  const response = await apiClient.post("/trend/media-tenant-trend/paid/", payload);
  return response.data;
};

export const fetchAvgWorkOrderResolutionTime = async (payload: ApiPayload) => {
  const response = await apiClient.post("/get/avg-workorder-resolution-time/", payload);
  return response.data;
};

export const fetchKbPerTickets = async (payload: ApiPayload) => {
  const response = await apiClient.post("/get/kb-per-tickets/", payload);
  return response.data;
};

export const fetchApiUtilizationMTD = async (params: ApiParams) => {
  const response = await apiClient.get("/get/api-utilization/mtd/", { params });
  return response.data;
};

export const fetchApiUtilizationPastMonths = async (params: ApiParams) => {
  const response = await apiClient.get("/get/api-utilization/past/months/", { params });
  return response.data;
};

export const fetchCommunicationMetrics = async (payload: ApiPayload) => {
  const response = await apiClient.post("/get/communication-metrics/counts/", payload);
  return response.data;
};

export const fetchTenantUserDetails = async (payload: ApiPayload) => {
  const response = await apiClient.post("/get/tenant/user_details/", payload);
  return response.data;
};
