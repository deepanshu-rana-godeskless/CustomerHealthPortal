/**
 * Customer Health Portal - Date Utilities
 * GoDeskless Inc.
 *
 * Comprehensive date formatting and manipulation utilities
 * Ensures consistent date display across the entire application
 */

/**
 * Main date formatter - formats dates in MMM DD, YY format
 * Examples: "Oct 08, 25", "Dec 31, 24", "Jan 15, 26"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("en-US", {
      month: "short", // MMM format (Jan, Feb, etc.)
      day: "2-digit", // DD format (01, 02, etc.)
      year: "2-digit", // YY format (24, 25, etc.)
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

/**
 * Format date with full year for important dates
 * Examples: "Oct 08, 2025", "Dec 31, 2024"
 */
export function formatDateLong(date: string | Date | null | undefined): string {
  if (!date) return "N/A";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting long date:", error);
    return "Invalid Date";
  }
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 months")
 * Useful for showing time differences in a human-readable format
 */
export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInMs = dateObj.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    if (diffInDays === -1) return "Yesterday";
    if (diffInDays > 1 && diffInDays <= 7) return `in ${diffInDays} days`;
    if (diffInDays < -1 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`;
    if (diffInDays > 7) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? "in 1 week" : `in ${weeks} weeks`;
    }
    if (diffInDays < -7) {
      const weeks = Math.floor(Math.abs(diffInDays) / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    return formatDate(date);
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return "Invalid Date";
  }
}

/**
 * Check if a date is expired (in the past)
 */
export function isDateExpired(date: string | Date | null | undefined): boolean {
  if (!date) return false;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.getTime() < Date.now();
  } catch (error) {
    return false;
  }
}

/**
 * Check if a date is upcoming (within specified days)
 */
export function isDateUpcoming(date: string | Date | null | undefined, withinDays: number = 30): boolean {
  if (!date) return false;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const futureThreshold = Date.now() + withinDays * 24 * 60 * 60 * 1000;
    return dateObj.getTime() <= futureThreshold && dateObj.getTime() >= Date.now();
  } catch (error) {
    return false;
  }
}

/**
 * Get date status for UI styling (expired, upcoming, normal)
 */
export function getDateStatus(date: string | Date | null | undefined): "expired" | "upcoming" | "normal" | "none" {
  if (!date) return "none";

  if (isDateExpired(date)) return "expired";
  if (isDateUpcoming(date, 30)) return "upcoming";
  return "normal";
}

/**
 * Format date range (e.g., "Oct 01, 25 - Oct 31, 25")
 */
export function formatDateRange(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start === "N/A" && end === "N/A") return "N/A";
  if (start === "N/A") return `Until ${end}`;
  if (end === "N/A") return `From ${start}`;

  return `${start} - ${end}`;
}
