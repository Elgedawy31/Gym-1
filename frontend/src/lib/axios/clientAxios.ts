"use client";

import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/features/auth/store/authStore";
import { API_CONFIG } from "@/config/api";

const clientAxios: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

clientAxios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default clientAxios;
