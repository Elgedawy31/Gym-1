"use client";

import { API_CONFIG } from "@/config/api";
import clientAxios from "@/lib/axios/clientAxios";
import { DashboardStats } from "../types";

export const getDashboardStatsService = async (): Promise<DashboardStats> => {
  const res = await clientAxios.get(API_CONFIG.ENDPOINTS.DASHBOARD.GET_DASHBOARD_STATS);
  return res.data.data.stats;
};