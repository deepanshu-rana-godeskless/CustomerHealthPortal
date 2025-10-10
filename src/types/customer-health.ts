/**
 * Customer Health Portal - Type Definitions
 * GoDeskless Inc.
 *
 * Comprehensive type definitions for customer health monitoring,
 * analytics, and management system.
 */

// Core Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  industry?: string;
  size: "startup" | "small" | "medium" | "enterprise";
  subscription: SubscriptionPlan;
  status: CustomerStatus;
  healthScore: number;
  riskLevel: RiskLevel;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  assignedCSM?: string; // Customer Success Manager
  customFields: Record<string, unknown>;
}

export type CustomerStatus = "active" | "inactive" | "suspended" | "churned" | "prospect" | "onboarding";

export type RiskLevel = "low" | "medium" | "high" | "critical";

// Subscription & Billing
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: "free" | "basic" | "pro" | "enterprise";
  mrr: number; // Monthly Recurring Revenue
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentStatus: PaymentStatus;
}

export type PaymentStatus = "current" | "overdue" | "failed" | "cancelled";

// Health Metrics
export interface HealthMetrics {
  customerId: string;
  date: Date;
  healthScore: number;
  engagementScore: number;
  usageScore: number;
  supportScore: number;
  paymentScore: number;
  overallTrend: "improving" | "stable" | "declining";
  factors: HealthFactor[];
}

export interface HealthFactor {
  category: HealthCategory;
  impact: "positive" | "negative" | "neutral";
  weight: number;
  description: string;
  value: number;
}

export type HealthCategory =
  | "usage_frequency"
  | "feature_adoption"
  | "support_tickets"
  | "payment_history"
  | "engagement_level"
  | "login_frequency"
  | "api_usage"
  | "user_growth";

// Analytics & Reporting
export interface CustomerAnalytics {
  customerId: string;
  period: DateRange;
  metrics: {
    totalRevenue: number;
    averageSessionDuration: number;
    featureUsage: FeatureUsage[];
    supportTickets: number;
    npsScore?: number;
    churnProbability: number;
  };
  trends: AnalyticsTrend[];
}

export interface FeatureUsage {
  featureName: string;
  usageCount: number;
  lastUsed: Date;
  adoptionRate: number;
}

export interface AnalyticsTrend {
  metric: string;
  trend: "up" | "down" | "stable";
  changePercent: number;
  timeframe: string;
}

// Support & Communication
export interface SupportTicket {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  satisfactionRating?: number;
  tags: string[];
}

export type TicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketCategory = "technical" | "billing" | "feature_request" | "bug_report" | "general_inquiry";

// Churn Prediction
export interface ChurnPrediction {
  customerId: string;
  churnProbability: number;
  riskFactors: ChurnRiskFactor[];
  recommendedActions: RecommendedAction[];
  predictionDate: Date;
  timeToChurn?: number; // days
}

export interface ChurnRiskFactor {
  factor: string;
  weight: number;
  description: string;
  category: "usage" | "engagement" | "support" | "billing" | "feedback";
}

export interface RecommendedAction {
  action: string;
  priority: "high" | "medium" | "low";
  category: "intervention" | "communication" | "feature" | "support";
  description: string;
  estimatedImpact: number;
}

// Engagement Tracking
export interface EngagementEvent {
  id: string;
  customerId: string;
  eventType: EngagementType;
  timestamp: Date;
  details: Record<string, unknown>;
  value?: number;
  sessionId?: string;
}

export type EngagementType =
  | "login"
  | "feature_usage"
  | "api_call"
  | "support_interaction"
  | "billing_event"
  | "feedback_submission"
  | "training_completion";

// Notifications & Alerts
export interface Alert {
  id: string;
  customerId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  assignedTo?: string;
  metadata: Record<string, unknown>;
}

export type AlertType =
  | "health_decline"
  | "churn_risk"
  | "payment_issue"
  | "usage_drop"
  | "support_escalation"
  | "contract_renewal";

export type AlertSeverity = "info" | "warning" | "critical" | "urgent";

// Utility Types
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterOptions {
  status?: CustomerStatus[];
  riskLevel?: RiskLevel[];
  healthScoreRange?: [number, number];
  subscriptionTier?: string[];
  industry?: string[];
  dateRange?: DateRange;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerListResponse extends ApiResponse<Customer[]> {
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    atRiskCustomers: number;
    avgHealthScore: number;
  };
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  refreshInterval?: number;
}

export type WidgetType =
  | "metric_card"
  | "chart"
  | "table"
  | "alert_list"
  | "customer_list"
  | "health_score_distribution";

export type WidgetSize = "small" | "medium" | "large" | "xl";

// User & Permission Types
export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  permissions: Permission[];
  lastLogin?: Date;
  avatar?: string;
}

export type UserRole = "super_admin" | "admin" | "manager" | "analyst" | "viewer";

export interface Permission {
  resource: string;
  actions: ("read" | "write" | "delete" | "admin")[];
}
