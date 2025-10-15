"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { Contact2, ArrowLeft, CreditCard, Activity } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { customersService } from "@/services/data-service";
import { formatDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
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

interface CustomerDetailsPageProps {
  params: { id: string };
}

export default function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const paidRes = await customersService.getTenants({ tenant_type: "paid" }, 1);
        const defaultRes = await customersService.getTenants({ tenant_type: "default" }, 1);
        const allCustomers = [...paidRes.results, ...defaultRes.results];
        const foundCustomer = allCustomers.find((c) => c.id.toString() === params.id);
        if (foundCustomer) setCustomer(foundCustomer);
      } catch (err) {
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [params.id]);

  // TruncatedBadge moved outside hooks

  if (loading) {
    // TruncatedBadge component for truncating badge text
    const TruncatedBadge = ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      [key: string]: any;
    }) => (
      <div
        className={cn("bg-background border-input truncate rounded-md border px-2 py-1 text-sm font-medium", className)}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
        {...props}
      >
        {children}
      </div>
    );
    return (
      <div className="bg-background relative flex min-h-screen items-center justify-center">
        <DotPattern
          className={cn(
            "text-gray-300 opacity-20",
            "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          )}
          width={24}
          height={24}
          cx={1}
          cy={1}
          cr={1}
        />
        <div className="relative z-10 text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-background relative flex min-h-screen items-center justify-center">
        <DotPattern
          className={cn(
            "text-gray-300 opacity-20",
            "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          )}
          width={24}
          height={24}
          cx={1}
          cy={1}
          cr={1}
        />
        <div className="relative z-10 text-center">
          <h1 className="mb-2 text-2xl font-bold">Customer Not Found</h1>
          <p className="text-muted-foreground mb-4">The customer with ID {params.id} could not be found.</p>
          <Button asChild>
            <Link href="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="bg-background relative min-h-screen">
        <DotPattern
          className={cn(
            "text-gray-300 opacity-20",
            "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          )}
          width={24}
          height={24}
          cx={1}
          cy={1}
          cr={1}
        />

        {/* GRID LAYOUT */}
        <div className="relative z-10 grid grid-cols-[minmax(320px,400px)_1fr] gap-6 p-6">
          {/* LEFT STICKY PANEL */}
          <div className="sticky top-6 h-fit self-start">
            <Card className="bg-card/95 w-full border-0 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex w-full items-center gap-6">
                  <Avatar className="h-22 w-22">
                    <AvatarFallback className="text-2xl font-bold">
                      {customer.company
                        .split(" ")
                        .map((word) => word[0]?.toUpperCase() || "")
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-foreground truncate text-2xl font-bold" style={{ maxWidth: "250px" }}>
                        {customer.company}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{customer.company}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>

              <CardContent className="px-4">
                <div className="flex w-full flex-row items-center gap-4">
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                    <span className="text-muted-foreground text-xs">Instance Name</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TruncatedBadge className="flex w-full items-center justify-center text-center">
                          <span className="truncate">{customer.subdomain}</span>
                        </TruncatedBadge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{customer.subdomain}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex min-w-[100px] flex-col items-center gap-1">
                    <span className="text-muted-foreground text-xs">CRM Type</span>
                    <Badge variant="outline" className="px-2 py-1 text-sm">
                      {customer.crm_type}
                    </Badge>
                  </div>

                  <div className="flex min-w-[100px] flex-col items-center gap-1">
                    <span className="text-muted-foreground text-xs">Account Status</span>
                    <Badge variant="outline" className="px-2 py-1 text-sm">
                      {customer.tenant_type === "paid" ? "Customer" : "Prospect"}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4 md:my-6" />

                {/* CONTACT DETAILS */}
                <div className="flex flex-col gap-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Contact2 className="text-primary h-5 w-5" />
                    <span className="text-foreground text-lg font-semibold">Contact Details</span>
                  </div>

                  {/* Primary Contact */}
                  <div className="flex flex-col gap-2 pl-2">
                    <span className="text-foreground mb-1 text-base font-semibold">Primary Contact</span>
                    <div className="flex flex-row items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Name</span>
                        <span className="text-foreground text-base">
                          {customer.first_name} {customer.last_name}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Mobile</span>
                        <span className="text-foreground text-base">{customer.phone_number}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col">
                      <span className="text-muted-foreground text-xs">Email</span>
                      <span className="text-foreground text-base">{customer.business_email}</span>
                    </div>
                  </div>

                  {/* Secondary Contact */}
                  <div className="flex flex-col gap-2 pl-2">
                    <span className="text-foreground mb-1 text-base font-semibold">Secondary Contact</span>
                    <div className="flex flex-row items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Name</span>
                        <span className="text-foreground text-base">
                          {typeof (customer as any).secondary_first_name !== "undefined" ||
                            typeof (customer as any).secondary_last_name !== "undefined"
                            ? `${(customer as any).secondary_first_name || ""} ${(customer as any).secondary_last_name || ""}`.trim() ||
                            "-"
                            : "-"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Mobile</span>
                        <span className="text-foreground text-base">
                          {typeof (customer as any).secondary_phone !== "undefined"
                            ? (customer as any).secondary_phone || "-"
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                {/* Account Info Section */}
                <div className="flex flex-col gap-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CreditCard className="text-primary h-5 w-5" />
                    <span className="text-foreground text-lg font-semibold">Account & Billing</span>
                  </div>
                  <div className="mr-4 flex flex-row items-center gap-6">
                    <div className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-muted-foreground text-xs">Trial Expired</span>
                      <span className="text-foreground text-base">
                        {typeof (customer as any).trial_expired !== "undefined"
                          ? (customer as any).trial_expired
                            ? "Yes"
                            : "No"
                          : "-"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-muted-foreground text-xs">Paid Until</span>
                      <span className="text-foreground text-base">
                        {customer.paid_until ? formatDate(customer.paid_until) : "-"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-muted-foreground text-xs">End Date</span>
                      <span className="text-foreground text-base">
                        {customer.end_date ? formatDate(customer.end_date) : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* CUSTOMER SUCCESS SECTION */}
                <div className="flex flex-col gap-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Activity className="text-primary h-5 w-5" />
                    <span className="text-foreground text-lg font-semibold">Customer Success</span>
                  </div>

                  {/* QBR Dates */}
                  <div className="flex flex-row gap-6">
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-muted-foreground text-xs">Last QBR Date</span>
                      <span className="text-foreground text-base">
                        {customer.last_qbr_date ? formatDate(customer.last_qbr_date) : "-"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-muted-foreground text-xs">Next QBR Date</span>
                      <span className="text-foreground text-base">
                        {customer.next_qbr_date ? formatDate(customer.next_qbr_date) : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Customer Support Mobile */}
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">Customer Support Mobile</span>
                    <span className="text-foreground text-base">{customer.customer_support_mobile_number || "-"}</span>
                  </div>

                  {/* Final Comment */}
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">Final Comment</span>
                    <input
                      type="text"
                      disabled
                      value={customer.final_comment || ""}
                      className="border-input bg-muted/20 text-foreground w-full rounded-md border px-2 py-1 text-sm"
                    />
                  </div>

                  {/* CSM Assigned & Touchpoints */}
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">CSM Assigned & Touchpoints</span>
                    <input
                      type="text"
                      disabled
                      value={customer.csm_assigned_and_touchpoint_notes || ""}
                      className="border-input bg-muted/20 text-foreground w-full rounded-md border px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL */}
          <div className="min-h-screen">
            <Card className="bg-card/80 border-0 shadow-md">
              <CardHeader>
                <h2 className="text-foreground text-xl font-semibold">Customer Insights</h2>
                <p className="text-muted-foreground text-sm">
                  Analytics, usage trends, and performance metrics will appear here.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex h-[2000px] items-center justify-center">
                  Scroll down to see sticky left panel
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
