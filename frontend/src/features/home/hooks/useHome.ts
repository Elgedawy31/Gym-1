"use server";

import { API_CONFIG } from "@/config/api";
import serverAxios from "@/lib/axios/serverAxios";
import { Trainer } from "../types";
import { ProductsResponse } from "@/features/Products/types/productTypes";

export async function getTopTrainers(): Promise<Trainer[]> {
  const res = await serverAxios.get(API_CONFIG.ENDPOINTS.USERS.TOP_TRAINERS);
  return res.data.data.trainers;
}

export async function getTrainer(id: string): Promise<Trainer> {
  const res = await serverAxios.get(API_CONFIG.ENDPOINTS.USERS.GET_TRAINER(id))
  return res.data.data.user;
}

export async function getHomeProductsByType(type: string, limit: number, page: number, search?: string): Promise<ProductsResponse> {
  const res = await serverAxios.get(
    API_CONFIG.ENDPOINTS.PRODUCTS.GET_HOME_PRODUCTS_BY_TYPE(type, limit)
  );
  return res.data;
}