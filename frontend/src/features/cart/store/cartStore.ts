"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartItem } from "../types/cartTypes";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Cart operations
  addItem: (item: Omit<CartItem, 'price'> & { price: number }) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      setCart: (cart) => set({ cart, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),

      addItem: (newItem) => {
        const state = get();
        if (!state.cart) {
          // Create new cart
          const cart: Cart = {
            _id: 'local-cart',
            userId: 'local-user',
            items: [newItem as CartItem],
            totalPrice: newItem.price * newItem.quantity,
            totalItems: newItem.quantity,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set({ cart });
        } else {
          // Update existing cart
          const existingItemIndex = state.cart.items.findIndex(
            (item) => item.productId === newItem.productId
          );

          let updatedItems: CartItem[];
          if (existingItemIndex >= 0) {
            // Update existing item
            updatedItems = [...state.cart.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
            };
          } else {
            // Add new item
            updatedItems = [...state.cart.items, newItem as CartItem];
          }

          const totalPrice = updatedItems.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
          );
          const totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          set({
            cart: {
              ...state.cart,
              items: updatedItems,
              totalPrice,
              totalItems,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },

      updateItemQuantity: (productId, quantity) => {
        const state = get();
        if (!state.cart) return;

        const updatedItems = state.cart.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        );

        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        set({
          cart: {
            ...state.cart,
            items: updatedItems,
            totalPrice,
            totalItems,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      removeItem: (productId) => {
        const state = get();
        if (!state.cart) return;

        const updatedItems = state.cart.items.filter(
          (item) => item.productId !== productId
        );

        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        set({
          cart: {
            ...state.cart,
            items: updatedItems,
            totalPrice,
            totalItems,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      clearCart: () => {
        const state = get();
        if (!state.cart) return;

        set({
          cart: {
            ...state.cart,
            items: [],
            totalPrice: 0,
            totalItems: 0,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      getTotalItems: () => {
        const state = get();
        return state.cart?.totalItems || 0;
      },

      getTotalPrice: () => {
        const state = get();
        return state.cart?.totalPrice || 0;
      },

      getItemQuantity: (productId) => {
        const state = get();
        const item = state.cart?.items.find(
          (item) => item.productId === productId
        );
        return item?.quantity || 0;
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
