"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "../service/dashboardService";
import { DashboardStats } from "../types";

export const useGetDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStatsService,
  });
};