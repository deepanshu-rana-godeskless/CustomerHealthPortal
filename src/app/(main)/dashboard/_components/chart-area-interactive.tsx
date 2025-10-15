"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "An interactive area chart for customer and prospect acquisitions";

const chartData = [
  { date: "2025-07-22", customers: 0, prospects: 150, customerName: "", prospectName: "Northland" },
  { date: "2025-07-23", customers: 0, prospects: 180, customerName: "", prospectName: "Carrefour" },
  { date: "2025-07-24", customers: 0, prospects: 120, customerName: "", prospectName: "Gdsandbox" },
  { date: "2025-07-25", customers: 0, prospects: 260, customerName: "", prospectName: "Compuservice" },
  { date: "2025-07-26", customers: 0, prospects: 290, customerName: "", prospectName: "Field Desk" },
  { date: "2025-07-27", customers: 1, prospects: 340, customerName: "CAD", prospectName: "Freshworksdemo" },
  { date: "2025-07-28", customers: 0, prospects: 180, customerName: "", prospectName: "Apexnow" },
  { date: "2025-07-29", customers: 0, prospects: 320, customerName: "", prospectName: "Acealign" },
  { date: "2025-07-30", customers: 0, prospects: 220, customerName: "", prospectName: "GoDeskless" },
  { date: "2025-07-31", customers: 0, prospects: 110, customerName: "", prospectName: "Mi" },
  { date: "2025-08-01", customers: 1, prospects: 190, customerName: "Carrefour", prospectName: "Mailhost" },
  { date: "2025-08-02", customers: 0, prospects: 360, customerName: "", prospectName: "Nesttech" },
  { date: "2025-08-03", customers: 0, prospects: 410, customerName: "", prospectName: "NextLevel Tech" },
  { date: "2025-08-04", customers: 0, prospects: 180, customerName: "", prospectName: "Univision" },
  { date: "2025-08-05", customers: 0, prospects: 150, customerName: "", prospectName: "NextLevel" },
  { date: "2025-08-06", customers: 0, prospects: 200, customerName: "", prospectName: "Freshdemo" },
  { date: "2025-08-07", customers: 0, prospects: 170, customerName: "", prospectName: "" },
  { date: "2025-08-08", customers: 0, prospects: 230, customerName: "", prospectName: "" },
  { date: "2025-08-09", customers: 0, prospects: 290, customerName: "", prospectName: "" },
  { date: "2025-08-10", customers: 0, prospects: 250, customerName: "", prospectName: "" },
  { date: "2025-08-11", customers: 1, prospects: 130, customerName: "Capital Concrete", prospectName: "" },
  { date: "2025-08-12", customers: 0, prospects: 420, customerName: "", prospectName: "" },
  { date: "2025-08-13", customers: 0, prospects: 180, customerName: "", prospectName: "" },
  { date: "2025-08-14", customers: 0, prospects: 240, customerName: "", prospectName: "" },
  { date: "2025-08-15", customers: 0, prospects: 380, customerName: "", prospectName: "" },
  { date: "2025-08-16", customers: 0, prospects: 220, customerName: "", prospectName: "" },
  { date: "2025-08-17", customers: 0, prospects: 310, customerName: "", prospectName: "" },
  { date: "2025-08-18", customers: 0, prospects: 190, customerName: "", prospectName: "" },
  { date: "2025-08-19", customers: 0, prospects: 420, customerName: "", prospectName: "" },
  { date: "2025-08-20", customers: 0, prospects: 390, customerName: "", prospectName: "" },
  { date: "2025-08-21", customers: 1, prospects: 520, customerName: "Cooly Connects", prospectName: "" },
  { date: "2025-08-22", customers: 0, prospects: 300, customerName: "", prospectName: "" },
  { date: "2025-08-23", customers: 0, prospects: 210, customerName: "", prospectName: "" },
  { date: "2025-08-24", customers: 0, prospects: 180, customerName: "", prospectName: "" },
  { date: "2025-08-25", customers: 0, prospects: 330, customerName: "", prospectName: "" },
  { date: "2025-08-26", customers: 0, prospects: 270, customerName: "", prospectName: "" },
  { date: "2025-08-27", customers: 0, prospects: 240, customerName: "", prospectName: "" },
  { date: "2025-08-28", customers: 0, prospects: 160, customerName: "", prospectName: "" },
  { date: "2025-08-29", customers: 0, prospects: 490, customerName: "", prospectName: "" },
  { date: "2025-08-30", customers: 0, prospects: 380, customerName: "", prospectName: "" },
  { date: "2025-08-31", customers: 1, prospects: 400, customerName: "Noch Power", prospectName: "" },
  { date: "2025-09-01", customers: 0, prospects: 420, customerName: "", prospectName: "" },
  { date: "2025-09-02", customers: 0, prospects: 350, customerName: "", prospectName: "" },
  { date: "2025-09-03", customers: 0, prospects: 180, customerName: "", prospectName: "" },
  { date: "2025-09-04", customers: 0, prospects: 230, customerName: "", prospectName: "" },
  { date: "2025-09-05", customers: 0, prospects: 140, customerName: "", prospectName: "" },
  { date: "2025-09-06", customers: 0, prospects: 120, customerName: "", prospectName: "" },
  { date: "2025-09-07", customers: 0, prospects: 290, customerName: "", prospectName: "" },
  { date: "2025-09-08", customers: 0, prospects: 220, customerName: "", prospectName: "" },
  { date: "2025-09-09", customers: 0, prospects: 250, customerName: "", prospectName: "" },
  { date: "2025-09-10", customers: 1, prospects: 170, customerName: "Telesis", prospectName: "" },
  { date: "2025-09-11", customers: 0, prospects: 460, customerName: "", prospectName: "" },
  { date: "2025-09-12", customers: 0, prospects: 190, customerName: "", prospectName: "" },
  { date: "2025-09-13", customers: 0, prospects: 130, customerName: "", prospectName: "" },
  { date: "2025-09-14", customers: 0, prospects: 280, customerName: "", prospectName: "" },
  { date: "2025-09-15", customers: 0, prospects: 230, customerName: "", prospectName: "" },
  { date: "2025-09-16", customers: 0, prospects: 200, customerName: "", prospectName: "" },
  { date: "2025-09-17", customers: 0, prospects: 410, customerName: "", prospectName: "" },
  { date: "2025-09-18", customers: 0, prospects: 160, customerName: "", prospectName: "" },
  { date: "2025-09-19", customers: 0, prospects: 380, customerName: "", prospectName: "" },
  { date: "2025-09-20", customers: 1, prospects: 140, customerName: "The Social Gaming Group", prospectName: "" },
  { date: "2025-09-21", customers: 0, prospects: 250, customerName: "", prospectName: "" },
  { date: "2025-09-22", customers: 0, prospects: 370, customerName: "", prospectName: "" },
  { date: "2025-09-23", customers: 0, prospects: 320, customerName: "", prospectName: "" },
  { date: "2025-09-24", customers: 0, prospects: 480, customerName: "", prospectName: "" },
  { date: "2025-09-25", customers: 0, prospects: 200, customerName: "", prospectName: "" },
  { date: "2025-09-26", customers: 0, prospects: 150, customerName: "", prospectName: "" },
  { date: "2025-09-27", customers: 0, prospects: 420, customerName: "", prospectName: "" },
  { date: "2025-09-28", customers: 0, prospects: 130, customerName: "", prospectName: "" },
  { date: "2025-09-29", customers: 0, prospects: 380, customerName: "", prospectName: "" },
  { date: "2025-09-30", customers: 1, prospects: 350, customerName: "Ametek", prospectName: "" },
  { date: "2025-10-01", customers: 0, prospects: 310, customerName: "", prospectName: "" },
  { date: "2025-10-02", customers: 0, prospects: 520, customerName: "", prospectName: "" },
  { date: "2025-10-03", customers: 0, prospects: 170, customerName: "", prospectName: "" },
  { date: "2025-10-04", customers: 0, prospects: 290, customerName: "", prospectName: "" },
  { date: "2025-10-05", customers: 0, prospects: 450, customerName: "", prospectName: "" },
  { date: "2025-10-06", customers: 0, prospects: 210, customerName: "", prospectName: "" },
  { date: "2025-10-07", customers: 0, prospects: 270, customerName: "", prospectName: "" },
  { date: "2025-10-08", customers: 0, prospects: 530, customerName: "", prospectName: "" },
  { date: "2025-10-09", customers: 0, prospects: 180, customerName: "", prospectName: "" },
  { date: "2025-10-10", customers: 1, prospects: 190, customerName: "maricopaelections", prospectName: "" },
  { date: "2025-10-11", customers: 0, prospects: 380, customerName: "", prospectName: "" },
  { date: "2025-10-12", customers: 0, prospects: 490, customerName: "", prospectName: "" },
  { date: "2025-10-13", customers: 0, prospects: 200, customerName: "", prospectName: "" },
  { date: "2025-10-14", customers: 0, prospects: 160, customerName: "", prospectName: "" },
  { date: "2025-10-15", customers: 1, prospects: 400, customerName: "Noch Power", prospectName: "" },
];

const chartConfig = {
  acquisitions: {
    label: "Acquisitions",
  },
  customers: {
    label: "Customers",
    color: "var(--chart-1)",
  },
  prospects: {
    label: "Prospects",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-10-15");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Customers and Prospects</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Total acquisitions for the last 3 months</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-customers)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-customers)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillProspects" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-prospects)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-prospects)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  formatter={(value, name, props) => {
                    const { payload } = props;
                    if (name === "customers" && value > 0 && payload.customerName) {
                      return [`Customer: ${payload.customerName} (Acquired: ${value})`, "Customers"];
                    } else if (name === "prospects" && value > 0 && payload.prospectName) {
                      return [`Prospect: ${payload.prospectName} (New: ${value})`, "Prospects"];
                    }
                    return value > 0 ? [value, name] : null;
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="customers" type="natural" fill="url(#fillCustomers)" stroke="var(--color-customers)" />
            <Area dataKey="prospects" type="natural" fill="url(#fillProspects)" stroke="var(--color-prospects)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}