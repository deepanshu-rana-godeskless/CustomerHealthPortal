/**
 * Sidebar Navigation Configuration
 * Uses centralized route constants and type-safe interfaces
 * Single source of truth for navigation structure
 */

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

import { PROTECTED_ROUTES } from "@/config/routes";
import { NavGroup, NavMainItem, NavSubItem } from "@/types/common";

/**
 * Navigation configuration using centralized routes
 * Makes adding new routes simple - just update routes.ts and this file
 */
export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Customer Health",
    items: [
      {
        title: "Overview",
        url: PROTECTED_ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: "Businesses",
        url: PROTECTED_ROUTES.CUSTOMERS,
        icon: Users,
      },
      {
        title: "Add Business",
        url: PROTECTED_ROUTES.ADD_BUSINESS,
        icon: Plus,
        isNew: true,
      },
    ],
  },
] as const;

/**
 * Utility functions for navigation
 */
export const NavigationUtils = {
  /**
   * Find navigation item by URL
   */
  findItemByUrl: (url: string): NavMainItem | NavSubItem | null => {
    for (const group of sidebarItems) {
      for (const item of group.items) {
        if (item.url === url) return item;
        if (item.subItems) {
          const subItem = item.subItems.find(sub => sub.url === url);
          if (subItem) return subItem;
        }
      }
    }
    return null;
  },

  /**
   * Get all navigation URLs for validation
   */
  getAllUrls: (): string[] => {
    const urls: string[] = [];
    for (const group of sidebarItems) {
      for (const item of group.items) {
        urls.push(item.url);
        if (item.subItems) {
          urls.push(...item.subItems.map(sub => sub.url));
        }
      }
    }
    return urls;
  },

  /**
   * Check if URL is in navigation
   */
  isValidNavUrl: (url: string): boolean => {
    return NavigationUtils.getAllUrls().includes(url);
  },
} as const;
