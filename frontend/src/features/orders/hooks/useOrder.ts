import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, getMyOrders, getOrderById } from "../services/orderService";
import { CreateOrderRequest } from "../types/orderTypes";
import toast from "react-hot-toast";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: () => {
      // Invalidate cart and orders queries
      toast.success("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useMyOrdersQuery() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrders,
    staleTime: 10_000,
  });
}

export function useOrderQuery(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 10_000,
  });
}
