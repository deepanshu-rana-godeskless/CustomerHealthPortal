"use client";

import { useEffect } from "react";


import { environment } from "@/config/environment";
import axios from "axios";
import { format } from "date-fns";

import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import data from "./_components/data.json";
import { SectionCards } from "./_components/section-cards";

export default function Page() {
  useEffect(() => {
    const fetchDashboardData = async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const API_URL = environment.apiUrl;

      try {
        const token = localStorage.getItem("accessToken");

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const api1Response = await axios.get(`${API_URL}/api/get/traffic/`, { headers });

        const api2Response = await axios.post(
          `${API_URL}/api/get/daily-utilization/?category=whatsapp`,
          { start_date: today, end_date: today },
          { headers },
        );

        const api3Response = await axios.post(
          `${API_URL}/api/get/daily-utilization/?category=video`,
          { start_date: today, end_date: today },
          { headers },
        );

        const api4Response = await axios.post(
          `${API_URL}/api/get/daily-utilization/?category=sms`,
          { start_date: today, end_date: today },
          { headers },
        );

        const api5Response = await axios.post(
          `${API_URL}/api/get/daily-utilization/?category=disk_space`,
          { start_date: today, end_date: today },
          { headers },
        );

        const api6Response = await axios.get(
          `${API_URL}/api/get/tenants/analytics/?type=paid`,
          { headers },
        );

        const api7Response = await axios.post(
          `${API_URL}/api/get/tenants/?page=1`,
          { from_date: today, to_date: today, tenant_type: "", timezone },
          { headers },
        );

        const api8Response = await axios.post(
          `${API_URL}/api/get/recent-user-tenant-data/`,
          { count: 5, fromDate: today, toDate: today, tenant_type: "paid" },
          { headers },
        );

        const api9Response = await axios.post(
          `${API_URL}/api/get/recent-ticket-visit-tenant-data/`,
          { count: 5, fromDate: today, toDate: today, tenant_type: "paid" },
          { headers },
        );

        const api10Response = await axios.post(
          `${API_URL}/api/get/tenant-top-usage/`,
          { count: 5, start_date: today, end_date: today, tenant_type: "paid" },
          { headers },
        );

        const api11Response = await axios.post(
          `${API_URL}/api/get/least-recent-user-tenant-data/`,
          { count: 5, fromDate: today, toDate: today, tenant_type: "paid" },
          { headers },
        );

        const api12Response = await axios.post(
          `${API_URL}/api/get/least-ticket-visit-tenant-data/`,
          { count: 5, fromDate: today, toDate: today, tenant_type: "paid" },
          { headers },
        );

        console.log({
          api1Response: api1Response.data,
          api2Response: api2Response.data,
          api3Response: api3Response.data,
          api4Response: api4Response.data,
          api5Response: api5Response.data,
          api6Response: api6Response.data,
          api7Response: api7Response.data,
          api8Response: api8Response.data,
          api9Response: api9Response.data,
          api10Response: api10Response.data,
          api11Response: api11Response.data,
          api12Response: api12Response.data,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data} />
    </div>
  );
}
