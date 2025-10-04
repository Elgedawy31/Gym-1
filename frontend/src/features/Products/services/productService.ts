"use client";

import { API_CONFIG } from "@/config/api";
import clientAxios from "@/lib/axios/clientAxios";
import { ProductsResponse } from "../types/productTypes";

export async function getProductsByType(type: string, limit: number, page: number, search?: string): Promise<ProductsResponse> {
  const res = await clientAxios.get(
    API_CONFIG.ENDPOINTS.PRODUCTS.GET_PRODUCTS_BY_TYPE(type, limit, page, search)
  );
  return res.data;
}