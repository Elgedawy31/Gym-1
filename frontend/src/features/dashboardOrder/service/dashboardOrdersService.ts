import clientAxios from "@/lib/axios/clientAxios";
import { OrdersResponse } from "../types";
import { API_CONFIG } from "@/config/api";

export const getAllOrdersService = async(page: number, status?: string): Promise<OrdersResponse> => {
  try {
    const res = await clientAxios.get<OrdersResponse>(API_CONFIG.ENDPOINTS.DASHBOARD_ORDERS.GET_ALL_ORDERS(page, status));
    return res.data;
  } catch (error) {
    // Handle error and throw a descriptive message
    throw new Error(
      `Failed to fetch orders: ${
        (error as any)?.response?.data?.message || (error as Error).message || "Unknown error"
      }`
    );
  }
}

export const updateStatusService = async (orderId: string, status: string): Promise<void> => {
  try {
    await clientAxios.patch(
      API_CONFIG.ENDPOINTS.DASHBOARD_ORDERS.UPDATE_ORDER_STATUS(orderId),
      { status }
    );
  } catch (error) {
    throw new Error(
      `Failed to update order status: ${
        (error as any)?.response?.data?.message || (error as Error).message || "Unknown error"
      }`
    );
  }
};
