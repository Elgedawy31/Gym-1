"use client";

import { API_CONFIG } from "@/config/api";
import { Product, ProductsResponse } from "@/features/Products/types/productTypes";
import clientAxios from "@/lib/axios/clientAxios";
import { AxiosError } from "axios";

export const getAllProductsService = async (page: number, type?: string): Promise<ProductsResponse> => {
  const res = await clientAxios.get<ProductsResponse>(API_CONFIG.ENDPOINTS.DASHBOARD.GET_PRODUCTS(page, type));
  return res.data
}

export const createProductService = async (formData: FormData): Promise<Product> => {
  try {
    const res = await clientAxios.post(API_CONFIG.ENDPOINTS.DASHBOARD.CREATE_PRODUCT, formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data.data.product;
  } catch (error) {
    throw new Error(
      `Failed to Create Product: ${
        error instanceof AxiosError && error.response
          ? error.response.data.message || error.message
          : "Unknown error"
      }`
    );
  }

}

export const updateProductService = async (productId: string, formData: FormData): Promise<Product> => {
  const res = await clientAxios.patch(API_CONFIG.ENDPOINTS.DASHBOARD.UPDATE_PRODUCT(productId), formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data.product;
};
``

export const deleteProduct = async ( productId: string): Promise<void> => {
  await clientAxios.delete(API_CONFIG.ENDPOINTS.DASHBOARD.DELETE_PRODUCT(productId))
}