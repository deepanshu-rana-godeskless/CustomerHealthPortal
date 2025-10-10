# Date Formatting Standards - Customer Health Portal

## Overview
All dates in the Customer Health Portal should be displayed consistently using the **MMM DD, YY** format (e.g., "Oct 08, 25").

## Global Date Utilities

### Import
```typescript
import { formatDate, formatDateLong, getDateStatus } from "@/lib/date-utils";
// or from utils for backward compatibility
import { formatDate } from "@/lib/utils";
```

### Primary Functions

#### `formatDate(date)` - Standard Format
Returns dates in **MMM DD, YY** format
```typescript
formatDate("2025-10-08T00:00:00Z") // → "Oct 08, 25"
formatDate("2024-12-31") // → "Dec 31, 24"
formatDate(null) // → "N/A"
formatDate("invalid") // → "Invalid Date"
```

#### `formatDateLong(date)` - Full Year Format
For important dates requiring full year context
```typescript
formatDateLong("2025-10-08") // → "Oct 08, 2025"
```

#### `getDateStatus(date)` - Status Helper
Returns status for UI styling
```typescript
getDateStatus("2024-01-01") // → "expired" (past date)
getDateStatus("2025-10-15") // → "upcoming" (within 30 days)
getDateStatus("2026-01-01") // → "normal" (future date)
getDateStatus(null) // → "none"
```

### Usage in Components

#### Table Columns
```tsx
{
  accessorKey: "paid_until",
  header: "Paid Until",
  cell: ({ row }) => {
    const status = getDateStatus(row.original.paid_until);
    const statusStyles = {
      expired: 'text-destructive',
      upcoming: 'text-orange-600', 
      normal: 'text-muted-foreground',
      none: 'text-muted-foreground'
    };
    
    return (
      <span className={`text-sm ${statusStyles[status]}`}>
        {formatDate(row.original.paid_until)}
      </span>
    );
  }
}
```

#### React Components
```tsx
function CustomerCard({ customer }) {
  return (
    <div>
      <p>Paid Until: {formatDate(customer.paid_until)}</p>
      <p>Next QBR: {formatDate(customer.next_qbr_date)}</p>
      <p>Created: {formatDateLong(customer.created_on)}</p>
    </div>
  );
}
```

## Available Utilities

| Function | Purpose | Output Example |
|----------|---------|----------------|
| `formatDate()` | Standard date format | "Oct 08, 25" |
| `formatDateLong()` | Full year format | "Oct 08, 2025" |
| `formatRelativeDate()` | Relative time | "2 days ago" |
| `isDateExpired()` | Check if past | true/false |
| `isDateUpcoming()` | Check if within 30 days | true/false |
| `getDateStatus()` | Get status for styling | "expired"/"upcoming"/"normal"/"none" |
| `formatDateRange()` | Date range format | "Oct 01, 25 - Oct 31, 25" |

## Implementation Examples

### Customer Health Dates
- **Subscription Expiry**: `formatDate(subscription.expires_at)`
- **QBR Scheduling**: `formatDate(customer.next_qbr_date)`
- **License Renewal**: `formatDate(license.renewal_date)`
- **Contract End Date**: `formatDate(contract.end_date)`

### Status Styling
```tsx
const status = getDateStatus(date);
const className = {
  expired: 'text-red-600 font-medium',
  upcoming: 'text-orange-600 font-medium', 
  normal: 'text-gray-600',
  none: 'text-gray-400 italic'
}[status];
```

## Notes
- All date utilities handle `null`, `undefined`, and invalid dates gracefully
- Returns "N/A" for null/undefined dates
- Returns "Invalid Date" for malformed date strings
- Consistent timezone handling using user's local timezone
- Backward compatible with existing `@/lib/utils` imports