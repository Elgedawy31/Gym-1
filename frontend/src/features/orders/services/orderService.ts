"use client";

import { API_CONFIG } from "@/config/api";
import clientAxios from "@/lib/axios/clientAxios";
import { OrderResponse, OrdersResponse, CreateOrderRequest } from "../types/orderTypes";

export async function createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
  const res = await clientAxios.post(API_CONFIG.ENDPOINTS.ORDERS.CREATE_ORDER, data);
  return res.data;
}

export async function getMyOrders(): Promise<OrdersResponse> {
  const res = await clientAxios.get(API_CONFIG.ENDPOINTS.ORDERS.GET_MY_ORDERS);
  return res.data;
}

export async function getOrderById(orderId: string): Promise<OrderResponse> {
  const res = await clientAxios.get(API_CONFIG.ENDPOINTS.ORDERS.GET_ORDER_BY_ID(orderId));
  return res.data;
}
