/**
 * Customer Health Portal - Customers Table
 * GoDeskless Inc.
 */
"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Download, Users, ChevronDown } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomers } from "@/hooks/use-customers";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { exportCustomers, type ExportFormat } from "@/lib/export-utils";
import type { CustomerFilter } from "@/types/customers";

import { AddBusinessModal } from "../../add-business/_components/add-business-modal";

import { customersColumns } from "./columns";

// Accept customerFilter and setCustomerFilter as props
type Props = {
  customerFilter: CustomerFilter;
  setCustomerFilter: React.Dispatch<React.SetStateAction<CustomerFilter>>;
};

export function CustomersTable({ customerFilter, setCustomerFilter }: Props) {
  const router = useRouter(); // Initialize Next.js router

  const [currentPage, setCurrentPage] = useState(1);
  const { customers, loading, error, pagination, refetch } = useCustomers(currentPage, customerFilter);

  const handleViewCustomer = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  const columns = customersColumns({ onViewCustomer: handleViewCustomer }); // Call the function with navigation handler

  const table = useDataTableInstance({
    data: customers,
    columns,
    getRowId: (row) => row.id.toString(),
    defaultPageSize: 20, // Match API page size
  });

  React.useEffect(() => {
    table.setPageIndex(0);
  }, [customers, table]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [customerFilter]);

  const handlePreviousPage = () => {
    if (pagination.previous && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.next && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const canPreviousPage = pagination.previous !== null && currentPage > 1;
  const canNextPage = pagination.next !== null && currentPage < pagination.totalPages;

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = (format: ExportFormat) => {
    try {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

      const dataToExport = selectedRows.length > 0 ? selectedRows : customers;

      const isProspects = customerFilter === "default";
      const tabName = isProspects ? "Prospects" : "Customers";

      const filename =
        selectedRows.length > 0
          ? `${tabName}_Selected_${new Date().toISOString().split("T")[0]}`
          : `${tabName}_${new Date().toISOString().split("T")[0]}`;

      const title =
        selectedRows.length > 0
          ? `Selected ${tabName} (${selectedRows.length} entries)`
          : `All ${tabName} (${customers.length} entries)`;

      exportCustomers(dataToExport, format, filename, title);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-destructive text-center">
            <p>Error loading customers: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="min-w-[100px]">{customerFilter === "paid" ? "Customers" : "Prospects"}</span>
          </div>
          <Tabs value={customerFilter} onValueChange={(value) => setCustomerFilter(value as CustomerFilter)}>
            <TabsList>
              <TabsTrigger value="paid">Customers</TabsTrigger>
              <TabsTrigger value="default">Prospects</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span className="text-muted-foreground text-sm">
                {table.getFilteredSelectedRowModel().rows.length} selected
              </span>
            )}
            <DataTableViewOptions table={table} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={loading || customers.length === 0}>
                  <Download />
                  <span className="hidden lg:inline">
                    {table.getFilteredSelectedRowModel().rows.length > 0
                      ? `Export (${table.getFilteredSelectedRowModel().rows.length})`
                      : "Export"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("xlsx")}>
                  {table.getFilteredSelectedRowModel().rows.length > 0
                    ? `Export Selected as Excel (.xlsx)`
                    : "Export All as Excel (.xlsx)"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  {table.getFilteredSelectedRowModel().rows.length > 0
                    ? `Export Selected as CSV (.csv)`
                    : "Export All as CSV (.csv)"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  {table.getFilteredSelectedRowModel().rows.length > 0
                    ? `Export Selected as PDF (.pdf)`
                    : "Export All as PDF (.pdf)"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex size-full flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                <p className="text-muted-foreground">
                  {customerFilter === "paid" ? "Loading customers..." : "Loading prospects..."}
                </p>
              </div>
            </div>
          ) : (
            <DataTable table={table} columns={columns} />
          )}
        </div>
        {!loading && customers.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <div className="text-muted-foreground flex-1 text-sm">
              Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, pagination.count)} of{" "}
              {pagination.count} {customerFilter === "paid" ? "customers" : "trials"}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={handlePreviousPage}
                  disabled={!canPreviousPage || loading}
                >
                  <span className="sr-only">Go to previous page</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {currentPage} of {pagination.totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={handleNextPage}
                  disabled={!canNextPage || loading}
                >
                  <span className="sr-only">Go to next page</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
