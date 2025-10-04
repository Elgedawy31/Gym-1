"use server";

import { API_CONFIG } from "@/config/api";
import axios, { type AxiosInstance } from "axios";
import { cookies } from "next/headers";

const serverAxios: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

serverAxios.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("token")?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default serverAxios;
