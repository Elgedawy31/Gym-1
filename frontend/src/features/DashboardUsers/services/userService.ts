"use client";

import { API_CONFIG } from "@/config/api";
import axios from "axios";
import { UsersResponse } from "../types/userTypes";
import clientAxios from "@/lib/axios/clientAxios";

export async function getAllUsers(page: number = 1, role?: string): Promise<UsersResponse> {
  try {
    const response = await clientAxios.get(API_CONFIG.ENDPOINTS.DASHBOARD_USER.GET_ALL_USERS(page, role));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    const response = await clientAxios.get(API_CONFIG.ENDPOINTS.DASHBOARD_USER.GET_USER_BY_ID(userId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    await clientAxios.delete(API_CONFIG.ENDPOINTS.DASHBOARD_USER.DELETE_USER(userId));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
}
