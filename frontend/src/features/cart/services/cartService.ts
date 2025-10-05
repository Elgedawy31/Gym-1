"use client";

import { API_CONFIG } from "@/config/api";
import clientAxios from "@/lib/axios/clientAxios";
import { CartResponse, AddToCartRequest, UpdateCartItemRequest } from "../types/cartTypes";

export async function getCart(): Promise<CartResponse> {
  const res = await clientAxios.get(API_CONFIG.ENDPOINTS.CART.GET_CART);
  return res.data;
}

export async function addToCart(data: AddToCartRequest): Promise<CartResponse> {
  const res = await clientAxios.post(API_CONFIG.ENDPOINTS.CART.ADD_TO_CART, data);
  return res.data;
}

export async function updateCartItem(productId: string, data: UpdateCartItemRequest): Promise<CartResponse> {
  const res = await clientAxios.patch(API_CONFIG.ENDPOINTS.CART.UPDATE_CART_ITEM(productId), data);
  return res.data;
}

export async function removeFromCart(productId: string): Promise<CartResponse> {
  const res = await clientAxios.delete(API_CONFIG.ENDPOINTS.CART.REMOVE_FROM_CART(productId));
  return res.data;
}

export async function clearCart(): Promise<{ status: string; message: string }> {
  const res = await clientAxios.delete(API_CONFIG.ENDPOINTS.CART.CLEAR_CART);
  return res.data;
}
