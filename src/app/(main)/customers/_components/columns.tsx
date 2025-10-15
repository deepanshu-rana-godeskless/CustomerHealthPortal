/**
 * Customer Health Portal - Customers Table Columns
 * GoDeskless Inc.
 */
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Edit, Trash2, Eye } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, getDateStatus } from "@/lib/date-utils";
import { getHealthScoreStyling, getPaymentDateStyling } from "@/lib/health-score-utils";
// Customer types
interface Customer {
  id: number;
  company: string;
  business_email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  plan_type: string;
  company_score: string | null;
  is_paid_user: boolean;
  paid_until: string;
  total_activated_users: number;
  allowed_users: number;
  crm_type: string;
  product_name: string;
  subdomain: string;
  tenant_type: string;
  is_license_exceeded: boolean;
  next_qbr_date: string | null;
  csm_assigned_and_touchpoint_notes: string;
  client_type: string;
  end_date: string;
  customer_support_mobile_number?: string | null;
  last_qbr_date?: string | null;
  final_comment?: string | null;
  on_trial: boolean;
  trial_expired: boolean;
  created_on: string;
}

type CustomersColumnsOptions = {
  onViewCustomer: (customerId: string) => void;
};

export const customersColumns = (options: CustomersColumnsOptions): ColumnDef<Customer>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "company",
    meta: {
      displayName: "Company",
    },
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Company" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.company}</span>
        <span className="text-muted-foreground text-xs">{row.original.subdomain}.godeskless.com</span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "first_name",
    meta: {
      displayName: "Contact",
    },
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Contact" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>
          {row.original.first_name} {row.original.last_name}
        </span>
        <span className="text-muted-foreground text-xs">{row.original.business_email}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "company_score",
    meta: {
      displayName: "Health Score",
    },
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Health Score" />
      </div>
    ),
    cell: ({ row }) => {
      const score = row.original.company_score;

      // Handle missing or invalid health scores
      if (!score || score === "" || score === null || score === undefined) {
        return (
          <div className="text-center">
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              N/A
            </Badge>
          </div>
        );
      }

      const healthStyling = getHealthScoreStyling(score);

      return (
        <div className="text-center">
          <Badge variant={healthStyling.variant} className={healthStyling.className}>
            {score}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "total_activated_users",
    meta: {
      displayName: "Users",
    },
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Users" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col text-center">
        <span className="tabular-nums">
          {row.original.total_activated_users}/{row.original.allowed_users}
        </span>
        {row.original.is_license_exceeded && <span className="text-destructive text-xs">License exceeded</span>}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "crm_type",
    meta: {
      displayName: "CRM",
    },
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="CRM" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline">{row.original.crm_type}</Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "paid_until",
    meta: {
      displayName: "Paid Until",
    },
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Paid Until" />
      </div>
    ),
    cell: ({ row }) => {
      const paymentDateStyling = getPaymentDateStyling(row.original.paid_until);

      return (
        <div className="text-center">
          <Badge variant={paymentDateStyling.variant} className={paymentDateStyling.className}>
            {formatDate(row.original.paid_until)}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center">
        <span className="sr-only">Actions</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-muted-foreground flex size-8" size="icon">
                <EllipsisVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  options.onViewCustomer(row.original.id.toString());
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  console.log("Edit customer:", row.original.company);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  console.log("Delete customer:", row.original.company);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
  },
];
