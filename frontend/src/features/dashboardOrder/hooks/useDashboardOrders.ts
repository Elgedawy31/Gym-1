import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { OrdersResponse } from "../types"
import { getAllOrdersService, updateStatusService } from "../service/dashboardOrdersService"

export const useGetAllOrders = (page: number, status?: string) => {
  return useQuery<OrdersResponse>({
    queryKey: ['dashboard-orders', {page, status}],
    queryFn:() => getAllOrdersService(page, status)
  })
}


/**
 * Custom hook to update the status of an order in the dashboard.
 * On success, it invalidates the 'dashboard-orders' queries to refetch updated data.
 */
export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateStatusService(orderId, status),
    onSuccess: () => {
      // Invalidate all dashboard-orders queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['dashboard-orders'] });
      // Show a success toast
      if (typeof window !== "undefined") {
        // Only import toast on client side
        import("react-hot-toast").then(({ toast }) => {
          toast.success("Order status updated successfully!");
        });
      }
    },
  });
};
