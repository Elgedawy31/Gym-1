import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../services/cartService";
import { AddToCartRequest, UpdateCartItemRequest } from "../types/cartTypes";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

export function useCartQuery() {
  const { setCart, setLoading, setError } = useCartStore();
  
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await getCart();
        setCart(data.data.cart);
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch cart');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 10_000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { addItem } = useCartStore();
  
  return useMutation({
    mutationFn: async (data: AddToCartRequest) => {
      // Optimistic update
      addItem({
        productId: data.productId,
        quantity: data.quantity || 1,
        price: 0, // Will be updated from server response
      });
      
      const response = await addToCart(data);
      return response;
    },
    onSuccess: (data) => {
      // Update with server response
      useCartStore.getState().setCart(data.data.cart);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // INSERT_YOUR_CODE
      // Show success toast
        toast.success("Item added to cart!");
    },
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { updateItemQuantity } = useCartStore();
  
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: UpdateCartItemRequest }) => {
      // Optimistic update
      updateItemQuantity(productId, data.quantity);
      
      const response = await updateCartItem(productId, data);
      return response;
    },
    onSuccess: (data) => {
      // Update with server response
      useCartStore.getState().setCart(data.data.cart);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { removeItem } = useCartStore();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      // Optimistic update
      removeItem(productId);
      
      const response = await removeFromCart(productId);
      return response;
    },
    onSuccess: (data) => {
      // Update with server response
      useCartStore.getState().setCart(data.data.cart);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { clearCart: clearLocalCart } = useCartStore();
  
  return useMutation({
    mutationFn: async () => {
      // Optimistic update
      clearLocalCart();
      
      const response = await clearCart();
      return response;
    },
    onSuccess: () => {
      // Cart is already cleared locally, just invalidate queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
