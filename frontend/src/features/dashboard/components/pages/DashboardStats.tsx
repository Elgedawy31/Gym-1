"use client";

import { useGetDashboardStats } from "../../hooks/useDashboard";
import DashboardTemplates from "../templates/dashboardTemplates";

export default function DashboardStats() {
  const { data} = useGetDashboardStats()

  if(!data) return;
  
  return <DashboardTemplates data={data}/>
}
