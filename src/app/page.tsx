/**
 * Root Page - Customer Health Portal
 * GoDeskless Inc.
 *
 * Redirects users to the authentication flow
 */
import { redirect } from "next/navigation";

export default function RootPage() {
  // This will be handled by middleware, but adding as fallback
  redirect("/auth/v2/login");
}
