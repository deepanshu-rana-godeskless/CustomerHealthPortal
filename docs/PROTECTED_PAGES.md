# Protected Pages Architecture

This document explains how to create new protected pages in the Customer Health Portal following DRY and SOLID principles.

## Architecture Overview

The application uses a **shared layout system** that provides:
- ✅ Consistent sidebar navigation
- ✅ Unified header with theme toggle and settings
- ✅ Bulletproof authentication protection
- ✅ Responsive design and layout preferences
- ✅ Centralized route management

## Adding a New Protected Page

### Method 1: Quick Setup (Recommended)

1. **Create the page directory:**
   ```
   src/app/(main)/your-page-name/
   ```

2. **Create the page component:**
   ```tsx
   // src/app/(main)/your-page-name/page.tsx
   export default function YourPageName() {
     return (
       <div>
         <h1>Your Page Name</h1>
         {/* Your page content */}
       </div>
     );
   }
   ```

3. **Create the layout using the utility:**
   ```tsx
   // src/app/(main)/your-page-name/layout.tsx
   import { createProtectedPageLayout } from "@/components/layouts/page-utils";
   
   export default createProtectedPageLayout("YourPageName");
   ```

4. **Add route to constants:**
   ```tsx
   // src/components/layouts/page-utils.ts
   export const PROTECTED_ROUTES = {
     DASHBOARD: '/dashboard',
     CUSTOMERS: '/customers', 
     ADD_BUSINESS: '/add-business',
     YOUR_PAGE_NAME: '/your-page-name', // Add this line
   } as const;
   ```

5. **Update middleware matcher:**
   ```tsx
   // src/middleware.ts
   export const config = {
     matcher: ["/", "/dashboard/:path*", "/customers/:path*", "/add-business/:path*", "/your-page-name/:path*", "/auth/:path*"],
   };
   ```

6. **Add to sidebar navigation (optional):**
   ```tsx
   // Update your sidebar navigation configuration
   ```

### Method 2: Manual Setup

If you need custom layout behavior, create your layout manually:

```tsx
// src/app/(main)/your-page-name/layout.tsx
import { ReactNode } from "react";
import { ProtectedLayout } from "@/components/layouts/protected-layout";

export default function YourPageNameLayout({ children }: { children: ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
```

## What You Get Automatically

Every protected page includes:

### 🔒 Security Features
- Server-side authentication middleware
- Client-side authentication guard
- Automatic redirect to login for unauthenticated users
- Secure cookie-based session management

### 🎨 UI Components
- Responsive sidebar with navigation
- Header with search, settings, and theme toggle
- Account switcher and user management
- Consistent styling and theming

### ⚡ Performance Features
- Optimized layout preferences loading
- Cached sidebar state
- Efficient re-renders with proper React patterns

### 🛠️ Developer Experience
- TypeScript support with proper types
- Consistent component structure
- Easy debugging with proper display names
- Centralized route management

## File Structure

```
src/
├── app/(main)/
│   ├── dashboard/           # Main dashboard
│   ├── customers/           # Customer management
│   ├── add-business/        # Business onboarding
│   └── your-page-name/      # Your new page
│       ├── layout.tsx       # Uses ProtectedLayout
│       └── page.tsx         # Your page content
├── components/
│   ├── layouts/
│   │   ├── protected-layout.tsx    # Shared layout component
│   │   └── page-utils.ts           # Utilities and constants
│   └── auth/
│       └── auth-guard.tsx          # Client-side auth protection
└── middleware/
    └── auth-middleware.ts          # Server-side auth protection
```

## Design Principles

### DRY (Don't Repeat Yourself)
- Single source of truth for layout logic
- Shared components for common UI elements
- Centralized route and authentication management

### SOLID Principles
- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Easy to extend with new pages, closed for modification
- **Liskov Substitution**: All layouts are interchangeable
- **Interface Segregation**: Clean, focused interfaces
- **Dependency Inversion**: Components depend on abstractions, not concretions

## Best Practices

1. **Always use the shared layout** - Don't create custom layouts unless absolutely necessary
2. **Update route constants** - Keep PROTECTED_ROUTES updated for centralized management
3. **Follow naming conventions** - Use consistent naming for pages and components
4. **Add proper TypeScript types** - Leverage the provided type definitions
5. **Test your pages** - Ensure authentication and navigation work correctly

## Troubleshooting

### Page not protected?
- Check if route is added to PROTECTED_ROUTES
- Verify middleware matcher includes your route
- Ensure layout uses ProtectedLayout

### Sidebar not showing?
- Confirm you're using ProtectedLayout or createProtectedPageLayout
- Check for any CSS conflicts or z-index issues

### Authentication issues?
- Verify AuthGuard is properly implemented
- Check cookie settings and token management
- Review middleware configuration

## Examples

See existing implementations:
- `/dashboard` - Main dashboard with data visualization
- `/customers` - Customer management with data tables
- `/add-business` - Business onboarding with forms

All follow the same pattern and provide consistent user experience.