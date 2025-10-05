"use client";

import { API_CONFIG } from "@/config/api";
import clientAxios from "@/lib/axios/clientAxios";
import { ProductsResponse, ProductByIdResponse } from "../types/productTypes";

export async function getProductsByType(type: string, limit: number, page: number, category?: string): Promise<ProductsResponse> {
  const res = await clientAxios.get(
    API_CONFIG.ENDPOINTS.PRODUCTS.GET_PRODUCTS_BY_TYPE(type, limit, page, category)
  );
  return res.data;
}

export async function getProductById(id: string): Promise<ProductByIdResponse> {
  const res = await clientAxios.get(
    API_CONFIG.ENDPOINTS.PRODUCTS.GET_PRODUCT_BY_ID(id)
  );
  return res.data;
}