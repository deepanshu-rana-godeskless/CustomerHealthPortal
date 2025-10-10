export interface DateRange {
  filter: "today" | "day" | "week" | "month" | "mtd" | "ytd" | "custom";
  from: string;
  to: string;
}

export interface TenantData {
  closed_ticket_count: number;
  open_ticket_count: number;
  total_ticket_count: number;
  open_work_order: number;
  inprogress_work_order: number;
  closed_work_order: number;
  open_and_inprogress_work_order: number;
  total_visit_count: number;
  active_dispatcher: number;
  inactive_dispatcher: number;
  total_dispatcher: number;
  active_fr: number;
  inactive_fr: number;
  total_fr: number;
  active_fm: number;
  inactive_fm: number;
  total_fm: number;
  active_adminstrator: number;
  inactive_adminstrator: number;
  total_adminstrator: number;
  utilizations: {
    video_utilization: {
      current: number;
      remaining: number;
      total: number;
    };
    sms_utilization: {
      current: number;
      remaining: number;
      total: number;
    };
    whatsapp_utilization: {
      current: number;
      remaining: number;
      total: number;
    };
    diskspace_utilization: {
      current: number;
      remaining: number;
      total: number;
    };
  };
}

export interface TransactionTrend {
  status: boolean;
  data: Array<{
    value: string;
    visit_count: number;
    ticket_count: number;
  }>;
}

export interface MediaTrend {
  status: boolean;
  data: Array<{
    value: string;
    whatsapp_count: number;
    sms_count: number;
    actual_minutes: number;
  }>;
}

export interface AvgResolutionTime {
  status: boolean;
  data: Array<{
    avg_workorder_resolution_time: number;
  }>;
}

export interface KbPerTickets {
  status: boolean;
  data: Array<{
    kb_count: number;
    video_count: number;
    total_ticket_closed_count: number;
    service_catalog_count: number;
    sms_wapp_count: number;
    total_ticket_count: number;
    visit_autoschedule_count: number;
  }>;
}

export interface ApiUtilizationMTD {
  status: boolean;
  data: Array<{
    id: number;
    tenant: string;
    tenant_type: string;
    from: string;
    to: string;
    total_api_hits: number;
    maximum_total_api_hits: number;
    total_success_hits: number;
    total_failed_hits: number;
  }>;
}

export interface ApiUtilizationMonths {
  status: boolean;
  data: Array<{
    month: string;
    id: number;
    tenant: string;
    type: string;
    total_api_hits: number;
    total_success_hits: number;
    total_failed_hits: number;
  }>;
}

export interface CommunicationMetrics {
  noOfDays: number;
  initial_count: {
    tickets: number;
    workOrders: number;
    sms: number;
    whatsapp: number;
    video: number;
    api: number;
  };
  backdated_count: {
    tickets: number;
    workOrders: number;
    sms: number;
    whatsapp: number;
    video: number;
    api: number;
  };
}

export interface UserDetails {
  status: boolean;
  data: Array<{
    crm_type: string;
    purchased_licenses: number;
    total_activated_admin_count: number;
    total_activated_dispatcher_count: number;
    total_activated_agent_count: number;
    total_activated_field_manager_count: number;
    total_license_exceeded: number;
  }>;
}

export interface CompanyDetailsData {
  tenantData: TenantData;
  transactionTrend: TransactionTrend;
  mediaTrend: MediaTrend;
  avgResolutionTime: AvgResolutionTime;
  kbPerTickets: KbPerTickets;
  apiUtilizationMTD: ApiUtilizationMTD;
  apiUtilizationMonths: ApiUtilizationMonths;
  communicationMetrics: CommunicationMetrics[];
  userDetails: UserDetails;
}
