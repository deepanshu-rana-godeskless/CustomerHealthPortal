"use client";
/**
 * Customer Health Portal - Customers Page
 * GoDeskless Inc.
 *
 * Main page for customer management and health monitoring
 */

import { useState } from "react";

// Customer types
type CustomerFilter = "paid" | "default";

import { AddBusinessModal } from "../add-business/_components/add-business-modal";

import { CustomersTable } from "./_components/customers-table";

export default function CustomersPage() {
  const [customerFilter, setCustomerFilter] = useState<CustomerFilter>("paid");

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Businesses</h1>
          <p className="text-muted-foreground">
            Monitor customer and prospects health, track engagement, and manage relationships across your entire
            business base.
          </p>
        </div>
        <AddBusinessModal
          isProspect={customerFilter === "default"}
          buttonText={customerFilter === "default" ? "Add Prospect" : "Add Customer"}
        />
      </div>

      <CustomersTable customerFilter={customerFilter} setCustomerFilter={setCustomerFilter} />
    </div>
  );
}
