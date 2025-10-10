"use client";
import { useState, useEffect } from "react";

import axios from "axios";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Heart, AlertTriangle, DollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Tenant {
  tenant_type: string;
}

export function SectionCards() {
  const [activeTab, setActiveTab] = useState("customers");
  const [customersCount, setCustomersCount] = useState(0);
  const [prospectsCount, setProspectsCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const today = new Date().toISOString().split("T")[0];
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const token = localStorage.getItem("accessToken");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const response = await axios.post(
          "https://stbbackend-dev.godeskless.com/api/get/tenants/?page=1",
          { from_date: today, to_date: today, tenant_type: "", timezone },
          { headers },
        );

        const data: Tenant[] = response.data;
        const customers = data.filter((tenant) => tenant.tenant_type === "paid").length;
        const prospects = data.filter((tenant) => tenant.tenant_type === "default").length;

        setCustomersCount(customers);
        setProspectsCount(prospects);
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="flex flex-col gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tabs List with Smooth Indicator */}
            <TabsList className="relative flex justify-center gap-2 border-b pb-1">
              {["customers", "prospects"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative px-2 py-1 text-xs font-medium transition-colors duration-200"
                >
                  {tab === "customers" ? "Total Customers" : "Total Prospects"}

                  {/* Smooth underline for active tab */}
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

            {/* Animated Tab Content */}
            <div className="relative mt-2 flex h-[56px] items-center">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute"
              >
                <CardTitle className="text-4xl font-medium tabular-nums @[250px]/card:text-5xl">
                  {activeTab === "customers" ? customersCount : prospectsCount}
                </CardTitle>
              </motion.div>
            </div>
          </Tabs>

          {/* <CardFooter className="flex-col items-start gap-1.5 text-sm mt-2">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {activeTab === "customers" ? (
                <>
                  Growing customer base <TrendingUp className="size-4" />
                </>
              ) : (
                <>
                  Expanding prospect pipeline <TrendingUp className="size-4" />
                </>
              )}
            </div>
            <div className="text-muted-foreground">
              {activeTab === "customers"
                ? "Active customers across all tiers"
                : "Potential leads and trial accounts"}
            </div>
          </CardFooter> */}
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Heart className="size-4" />
            Avg Health Score
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">87.3</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +3.1%
            </Badge>
          </CardAction>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Improving health trends <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Overall customer satisfaction up</div>
        </CardFooter> */}
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <AlertTriangle className="size-4" />
            At-Risk Customers
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">127</CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <TrendingDown />
              -15.2%
            </Badge>
          </CardAction>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Risk reduction efforts working <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Proactive intervention success</div>
        </CardFooter> */}
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <DollarSign className="size-4" />
            Monthly Revenue
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$285.7K</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.4%
            </Badge>
          </CardAction>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue growth accelerating <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Customer lifetime value increasing</div>
        </CardFooter> */}
      </Card>
    </div>
  );
}
