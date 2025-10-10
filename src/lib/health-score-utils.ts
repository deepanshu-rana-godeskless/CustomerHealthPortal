/**
 * Health Score Utilities
 * Customer Health Portal - GoDeskless Inc.
 */

export interface HealthScoreConfig {
  excellent: {
    min: number;
    className: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  };
  warning: {
    min: number;
    max: number;
    className: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  };
  critical: {
    max: number;
    className: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  };
}

// Configurable health score thresholds and styling
// Adjust the min/max values below to change when colors appear:
// - Green: Excellent health (80+ by default)
// - Light Yellow: Warning/needs attention (60-79 by default)
// - Red: Critical/at risk (below 60 by default)
export const HEALTH_SCORE_CONFIG: HealthScoreConfig = {
  excellent: {
    min: 80,
    className: "bg-green-600 text-white hover:bg-green-600",
    variant: "default",
    label: "Excellent",
  },
  warning: {
    min: 60,
    max: 79,
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-200 dark:text-yellow-900",
    variant: "outline",
    label: "Needs Attention",
  },
  critical: {
    max: 59,
    className: "bg-destructive text-white border-destructive hover:bg-destructive/90",
    variant: "destructive",
    label: "At Risk",
  },
};

export interface HealthScoreResult {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
  level: "excellent" | "warning" | "critical";
  label: string;
}

/**
 * Determines the health score styling based on the score value
 */
export function getHealthScoreStyling(score: string | number): HealthScoreResult {
  const numScore = typeof score === "string" ? parseFloat(score) : score;

  // Handle invalid scores
  if (isNaN(numScore)) {
    return {
      variant: "outline",
      className: "bg-muted text-muted-foreground",
      level: "warning",
      label: "Unknown",
    };
  }

  const config = HEALTH_SCORE_CONFIG;

  // Excellent health
  if (numScore >= config.excellent.min) {
    return {
      variant: config.excellent.variant,
      className: config.excellent.className,
      level: "excellent",
      label: config.excellent.label,
    };
  }

  // Warning range
  if (numScore >= config.warning.min && numScore <= config.warning.max) {
    return {
      variant: config.warning.variant,
      className: config.warning.className,
      level: "warning",
      label: config.warning.label,
    };
  }

  // Critical/At risk
  return {
    variant: config.critical.variant,
    className: config.critical.className,
    level: "critical",
    label: config.critical.label,
  };
}

/**
 * Get a simple health score badge variant (legacy support)
 */
export function getHealthScoreBadgeVariant(
  score: string | number,
): "default" | "secondary" | "destructive" | "outline" {
  return getHealthScoreStyling(score).variant;
}

// Payment date styling configuration
export interface PaymentDateConfig {
  expired: {
    className: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  };
  warning: {
    className: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  };
  safe: {
    className: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  };
}

// Configurable payment date styling
// Red: Past due dates
// Yellow: Due within one month
// Green: Due in more than one month
export const PAYMENT_DATE_CONFIG: PaymentDateConfig = {
  expired: {
    className: "bg-destructive text-white border-destructive hover:bg-destructive/90",
    variant: "destructive",
    label: "Expired",
  },
  warning: {
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-200 dark:text-yellow-900",
    variant: "outline",
    label: "Due Soon",
  },
  safe: {
    className: "bg-green-500 text-white border-green-500 hover:bg-green-600",
    variant: "default",
    label: "Active",
  },
};

export interface PaymentDateResult {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
  level: "expired" | "warning" | "safe";
  label: string;
}

/**
 * Determines payment date styling based on the date value
 */
export function getPaymentDateStyling(date: string | Date | null | undefined): PaymentDateResult {
  if (!date) {
    return {
      variant: "outline",
      className: "bg-muted text-muted-foreground",
      level: "warning",
      label: "Unknown",
    };
  }

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInMs = dateObj.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const config = PAYMENT_DATE_CONFIG;

    // Expired (past date)
    if (diffInDays < 0) {
      return {
        variant: config.expired.variant,
        className: config.expired.className,
        level: "expired",
        label: config.expired.label,
      };
    }

    // Due within one month (30 days)
    if (diffInDays <= 30) {
      return {
        variant: config.warning.variant,
        className: config.warning.className,
        level: "warning",
        label: config.warning.label,
      };
    }

    // Safe (more than one month)
    return {
      variant: config.safe.variant,
      className: config.safe.className,
      level: "safe",
      label: config.safe.label,
    };
  } catch (error) {
    console.error("Error processing payment date:", error);
    return {
      variant: "outline",
      className: "bg-muted text-muted-foreground",
      level: "warning",
      label: "Invalid",
    };
  }
}
