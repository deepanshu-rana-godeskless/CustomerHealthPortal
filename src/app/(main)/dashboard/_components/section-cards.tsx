"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { customersService } from "@/services/data-service";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

// ---------------------------
// Types
// ---------------------------
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
  on_trial: boolean;
  trial_expired: boolean;
  created_on: string;
  customer_support_mobile_number?: string | null;
  last_qbr_date?: string | null;
  final_comment?: string | null;
}

interface TenantsResponse {
  count: number;
  results: Customer[];
  next?: string | null;
  previous?: string | null;
}

// ---------------------------
// Main Component
// ---------------------------
export function SectionCards() {
  const [healthDialogOpen, setHealthDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"customers" | "prospects">("customers");

  const [visitsTab, setVisitsTab] = useState<"open" | "closed" | "total">("open");
  const [ticketTab, setTicketTab] = useState<"open" | "closed" | "total">("open");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [prospects, setProspects] = useState<Customer[]>([]);

  const [customersCount, setCustomersCount] = useState(0);
  const [prospectsCount, setProspectsCount] = useState(0);

  const [openTickets, setOpenTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);

  const [openVisits, setOpenVisits] = useState(0);
  const [closedVisits, setClosedVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<"customers" | "prospects">("customers");

  const [avgCustomerHealth, setAvgCustomerHealth] = useState<number | null>(null);
  const [avgProspectHealth, setAvgProspectHealth] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);

  // ---------------------------
  // Toast for Avg Health Dialog
  // ---------------------------
  useEffect(() => {
    if (healthDialogOpen) {
      toast(
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          <span>
            <span className="font-semibold">Note:</span>{" "}
            {activeTab === "customers" ? "Customers" : "Prospects"} with{" "}
            <span className="font-semibold">null</span> health scores are not included
            in the average calculation.
          </span>
        </div>,
        { duration: 7000 }
      );
    }
  }, [healthDialogOpen, activeTab]);

  // ---------------------------
  // Fetch All Pages Helper
  // ---------------------------
  const fetchAllTenants = async (tenant_type: string): Promise<TenantsResponse> => {
    let page = 1;
    let allResults: Customer[] = [];
    let count = 0;
    while (true) {
      const res: TenantsResponse = await customersService.getTenants({ tenant_type }, page);
      if (page === 1) count = res.count;
      allResults = [...allResults, ...res.results];
      if (!res.next) break;
      page++;
    }
    return { count, results: allResults };
  };

  // ---------------------------
  // Fetch Counts + Health Scores
  // ---------------------------
  const fetchCounts = async () => {
    setIsLoading(true);
    try {
      const customersRes = await fetchAllTenants("paid");
      const prospectsRes = await fetchAllTenants("default");

      setCustomersCount(customersRes.count);
      setProspectsCount(prospectsRes.count);
      setCustomers(customersRes.results);
      setProspects(prospectsRes.results);

      const validCustomerScores = customersRes.results
        .map((c) => parseFloat(c.company_score || "NaN"))
        .filter((s) => !isNaN(s));

      const validProspectScores = prospectsRes.results
        .map((c) => parseFloat(c.company_score || "NaN"))
        .filter((s) => !isNaN(s));

      setAvgCustomerHealth(
        validCustomerScores.length
          ? validCustomerScores.reduce((a, b) => a + b, 0) / validCustomerScores.length
          : null
      );
      setAvgProspectHealth(
        validProspectScores.length
          ? validProspectScores.reduce((a, b) => a + b, 0) / validProspectScores.length
          : null
      );
    } catch (err) {
      console.error("Error fetching counts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------
  // Fetch Tickets + Visits
  // ---------------------------
  const fetchTickets = async (tab: "customers" | "prospects") => {
    setTicketLoading(true);
    try {
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];
      const tenantType = tab === "customers" ? "paid" : "trial"; // Fixed typo 'trail' -> 'trial'
      const data = await customersService.getTicketUtilisation(tenantType, dateStr, dateStr);

      if (data.status && Array.isArray(data.data)) {
        const open = data.data.reduce((sum: number, item: any) => sum + (item.open_ticket_count || 0), 0)

        const closed = data.data.reduce((sum: number, i: any) => sum + (i.closed_ticket_count || 0), 0);

        const openV = data.data.reduce((sum: number, i: any) => sum + (i.open_and_inprogress_work_order || 0), 0);
        const closedV = data.data.reduce((sum: number, i: any) => sum + (i.closed_work_order || 0), 0);

        setOpenTickets(open);
        setClosedTickets(closed);
        setTotalTickets(open + closed);
        setOpenVisits(openV);
        setClosedVisits(closedV);
        setTotalVisits(openV + closedV);
      } else {
        setOpenTickets(0);
        setClosedTickets(0);
        setTotalTickets(0);
        setOpenVisits(0);
        setClosedVisits(0);
        setTotalVisits(0);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setOpenTickets(0);
      setClosedTickets(0);
      setTotalTickets(0);
      setOpenVisits(0);
      setClosedVisits(0);
      setTotalVisits(0);
    } finally {
      setTicketLoading(false);
    }
  };

  // Initial Data Load
  useEffect(() => {
    fetchCounts();
    fetchTickets(activeTab);
  }, [activeTab]);

  // ---------------------------
  // Drawer Table Data
  // ---------------------------
  const fetchTableData = async (type: "customers" | "prospects") => {
    setTableLoading(true);
    try {
      const tenantType = type === "customers" ? "paid" : "default";
      const res = await fetchAllTenants(tenantType);
      if (type === "customers") {
        setCustomers(res.results);
      } else {
        setProspects(res.results);
      }
    } catch (err) {
      console.error(`Error fetching ${type} data:`, err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleCountClick = (type: "customers" | "prospects") => {
    setSheetType(type);
    setSheetOpen(true);
    fetchTableData(type);
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* --- Customers/Prospects Count Card --- */}
      <Card className="@container/card py-3">
        <CardHeader className="flex flex-col gap-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
            <TabsList className="relative flex justify-center gap-2 border-b pb-1 px-4">
              {["customers", "prospects"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative px-2 py-1 text-xs font-medium transition-colors duration-200"
                >
                  {tab === "customers" ? "Total Customers" : "Total Prospects"}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-underline"
                      className="bg-primary absolute bottom-0 left-1/2 h-[2px] w-23 -translate-x-1/2 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="relative mt-2 flex h-[56px] items-center">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardTitle
                        className="text-4xl font-medium tabular-nums @[250px]/card:text-5xl cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleCountClick(activeTab)}
                      >
                        {activeTab === "customers" ? customersCount : prospectsCount}
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view {activeTab === "customers" ? "customers" : "prospects"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </div>
          </Tabs>
        </CardHeader>
      </Card>

      {/* --- Tickets Card --- */}
      <Card className="@container/card py-3">
        <CardHeader className="flex flex-col gap-2 px-1">
          <Tabs value={ticketTab} onValueChange={(v) => setTicketTab(v as typeof ticketTab)} className="w-full">
            <TabsList className="relative flex justify-center gap-2 border-b pb-1">
              {["open", "closed", "total"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative px-2 py-1 text-xs font-medium transition-colors duration-200"
                >
                  {tab === "open" ? "Open Tickets" : tab === "closed" ? "Closed Tickets" : "Total Tickets"}
                  {ticketTab === tab && (
                    <motion.div
                      layoutId="tab-underline-tickets"
                      className="bg-primary absolute bottom-0 left-1/2 h-[2px] w-20 -translate-x-1/2 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="relative mt-2 flex h-[56px] items-center">
              <motion.div
                key={ticketTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardTitle className="text-4xl font-medium tabular-nums @[250px]/card:text-5xl cursor-pointer hover:text-primary transition-colors px-4">
                        {ticketLoading ? (
                          <Spinner className="size-6" />
                        ) : ticketTab === "open" ? (
                          openTickets
                        ) : ticketTab === "closed" ? (
                          closedTickets
                        ) : (
                          totalTickets
                        )}
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {ticketTab === "open"
                          ? "Open tickets for today"
                          : ticketTab === "closed"
                            ? "Closed tickets for today"
                            : "Total tickets for today"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </div>
          </Tabs>
        </CardHeader>
      </Card>

      {/* --- Visits Card --- */}
      <Card className="@container/card py-3">
        <CardHeader className="flex flex-col gap-2 px-1">
          <Tabs value={visitsTab} onValueChange={(v) => setVisitsTab(v as typeof visitsTab)} className="w-full px-4">
            <TabsList className="relative flex justify-center gap-2 border-b pb-1">
              {["open", "closed", "total"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative px-2 py-1 text-xs font-medium transition-colors duration-200"
                >
                  {tab === "open" ? "Open Visits" : tab === "closed" ? "Closed Visits" : "Total Visits"}
                  {visitsTab === tab && (
                    <motion.div
                      layoutId="tab-underline-visits"
                      className="bg-primary absolute bottom-0 left-1/2 h-[2px] w-17 -translate-x-1/2 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="relative mt-2 flex h-[56px] items-center">
              <motion.div
                key={visitsTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardTitle className="text-4xl font-medium tabular-nums @[250px]/card:text-5xl cursor-pointer hover:text-primary transition-colors px-4">
                        {ticketLoading ? (
                          <Spinner className="size-6" />
                        ) : visitsTab === "open" ? (
                          openVisits
                        ) : visitsTab === "closed" ? (
                          closedVisits
                        ) : (
                          totalVisits
                        )}
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {visitsTab === "open"
                          ? "Open visits for today"
                          : visitsTab === "closed"
                            ? "Closed visits for today"
                            : "Total visits for today"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </div>
          </Tabs>
        </CardHeader>
      </Card>

      {/* --- Avg Health Score --- */}
      <Card className="@container/card py-5">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Heart className="size-4" />
            Avg Health Score
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mt-6">
           <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="text-4xl font-semibold tabular-nums cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setHealthDialogOpen(true)}
                  >
                    {isLoading ? (
                      <Spinner className="size-6" />
                    ) : activeTab === "customers" ? (
                      avgCustomerHealth !== null ? avgCustomerHealth.toFixed(1) : "N/A"
                    ) : avgProspectHealth !== null ? (
                      avgProspectHealth.toFixed(1)
                    ) : (
                      "N/A"
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Click to view calculation</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* --- Avg Health Score Breakdown Dialog --- */}
      <Dialog open={healthDialogOpen} onOpenChange={setHealthDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Average Health Score Breakdown</DialogTitle>
            <DialogDescription>
              This table shows each company, its health score, and how the average is calculated.
            </DialogDescription>
          </DialogHeader>
          <Card className="shadow-md gap-2 py-4">
            <CardHeader className="px-2">
              <CardTitle className="text-lg">
                <u>
                {activeTab === "customers" ? "Customers" : "Prospects"} Health Scores
                </u>
              </CardTitle>
            </CardHeader>
            {/* Disclaimer for null scores */}
            {(activeTab === "customers" ? customers : prospects).some(
              (c) => c.company_score === null || c.company_score === "" || isNaN(parseFloat(c.company_score as string))
            ) && (
                <Alert variant="warning" className="mb-4">
                  <AlertTriangle className="h-8 w-8" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    {activeTab === "customers" ? "Customers" : "Prospects"} with{" "}
                    <span className="font-semibold">null</span> health scores are not included in the average
                    calculation.
                  </AlertDescription>
                </Alert>
              )}
            <div className="overflow-auto min-h-[180px] max-h-[240px] sm:max-h-[240px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start font-bold">Company</TableHead>
                    <TableHead className="text-center font-bold">Health Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(activeTab === "customers" ? customers : prospects).map((c, idx) => (
                    <TableRow key={c.id || idx}>
                      <TableCell className="font-medium text-start">{c.company}</TableCell>
                      <TableCell className="text-center">
                        {c.company_score !== null &&
                          c.company_score !== "" &&
                          !isNaN(parseFloat(c.company_score as string)) ? (
                          <span className="font-semibold text-green-700">
                            {parseFloat(c.company_score as string).toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">Null</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
          <div className="p-2 bg-gradient-to-r from-primary/10 to-card rounded-lg border border-primary/20 max-w-md mx-auto">
            <div className="font-semibold mb-2 text-primary text-lg flex items-center gap-2">
              <Heart className="size-4 text-primary" />
              How is the average health score calculated?
            </div>
            <div className="text-[10px] leading-relaxed">
              <div className="mb-2">
                <span className="ml-0">
                  <u>Average</u> = <span className="font-mono">(Sum of all valid health scores) / (Number of valid companies)</span>
                </span>
              </div>
              <div className="mb-2">
                <span><u>Calculation:</u></span>
                <span className="ml-2">
                  {(() => {
                    const scores = (activeTab === "customers" ? customers : prospects)
                      .filter(
                        (c) =>
                          c.company_score !== null &&
                          c.company_score !== "" &&
                          !isNaN(parseFloat(c.company_score as string))
                      )
                      .map((c) => parseFloat(c.company_score as string));
                    if (scores.length === 0) return <span className="italic text-muted-foreground">No valid scores.</span>;
                    const sum = scores.reduce((a, b) => a + b, 0);
                    return (
                      <span>
                        <span className="font-mono">
                          ({scores.map((s) => s.toFixed(1)).join(" + ")}) / {scores.length} ={" "}
                          <span className="font-bold text-primary">{(sum / scores.length).toFixed(1)}</span>
                        </span>
                      </span>
                    );
                  })()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Only companies with a valid health score are included in the average.
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Drawer Table --- */}
      <Drawer open={sheetOpen} onOpenChange={setSheetOpen}>
        <DrawerContent className="h-[70vh] min-h-[500px] max-h-[80vh] px-6">
          <DrawerHeader>
            <DrawerTitle>{sheetType === "customers" ? "Total Customers" : "Total Prospects"}</DrawerTitle>
            <DrawerDescription>
              {sheetType === "customers"
                ? `You currently have ${customersCount} customers in your system.`
                : `You currently have ${prospectsCount} prospects in your pipeline.`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="mt-2 space-y-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sr.No</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Subdomain</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Plan Type</TableHead>
                  {sheetType === "customers" && <TableHead>Health Score</TableHead>}
                  <TableHead>Active Users</TableHead>
                  <TableHead>Client Type</TableHead>
                  <TableHead>{sheetType === "customers" ? "Paid Until" : "Trial Status"}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tableLoading ? (
                  <TableRow>
                    <TableCell colSpan={sheetType === "customers" ? 9 : 8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner className="size-6" />
                        <span className="text-sm text-muted-foreground">Loading {sheetType}...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sheetType === "customers" ? (
                  customers.map((customer, index) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{customer.company}</TableCell>
                      <TableCell>
                        <span className="text-blue-600 hover:text-blue-800 transition-colors">{customer.subdomain}</span>
                      </TableCell>
                      <TableCell>
                        {customer.first_name} {customer.last_name}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {customer.plan_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        {customer.company_score ? (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${parseFloat(customer.company_score) >= 90
                                ? "bg-green-100 text-green-800"
                                : parseFloat(customer.company_score) >= 75
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                          >
                            {customer.company_score}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {customer.total_activated_users}/{customer.allowed_users}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customer.client_type === "CUSTOMER"
                              ? "bg-green-100 text-green-800"
                              : customer.client_type === "DEMO"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {customer.client_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            {customer.paid_until ? new Date(customer.paid_until).toLocaleDateString() : "N/A"}
                          </span>
                          {customer.trial_expired && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200 w-fit">
                              Trial Expired
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  prospects.map((prospect, index) => (
                    <TableRow key={prospect.id}>
                      <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{prospect.company}</TableCell>
                      <TableCell>
                        <span className="text-blue-600 hover:text-blue-800 transition-colors">{prospect.subdomain}</span>
                      </TableCell>
                      <TableCell>
                        {prospect.first_name} {prospect.last_name}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {prospect.plan_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {prospect.total_activated_users}/{prospect.allowed_users}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${prospect.client_type === "DEMO"
                              ? "bg-blue-100 text-blue-800"
                              : prospect.client_type === "DEV_QA"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {prospect.client_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-center justify-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${prospect.on_trial
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : prospect.trial_expired
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-gray-50 text-gray-700 border border-gray-200"
                              }`}
                          >
                            {prospect.on_trial ? "On Trial" : prospect.trial_expired ? "Trial Expired" : "Inactive"}
                          </span>
                          {prospect.end_date && (
                            <span className="text-xs text-muted-foreground text-center">
                              Until: {new Date(prospect.end_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}