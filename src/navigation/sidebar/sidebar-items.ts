import {
  LayoutDashboard,
  Users,
  Heart,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  DollarSign,
  Settings,
  Plus,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Customer Health",
    items: [
      {
        title: "Overview",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Businesses",
        url: "/dashboard/customers",
        icon: Users,
      },
      {
        title: "Add Business",
        url: "/dashboard/add-business",
        icon: Plus,
        isNew: true,
      },
      {
        title: "Health Scores",
        url: "/dashboard/health",
        icon: Heart,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: TrendingUp,
      },
      {
        title: "At-Risk Alerts",
        url: "/dashboard/alerts",
        icon: AlertTriangle,
      },
    ],
  },
  {
    id: 2,
    label: "Operations",
    items: [
      {
        title: "Support Center",
        url: "/dashboard/support",
        icon: MessageSquare,
      },
      {
        title: "Revenue Tracking",
        url: "/dashboard/revenue",
        icon: DollarSign,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
