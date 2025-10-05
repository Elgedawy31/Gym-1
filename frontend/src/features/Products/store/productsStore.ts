"use client";

import { create } from "zustand";

type ProductsState = {
  type: "general" | "men" | "woman";
  page: number;
  limit: number;
  category: string;
  setType: (type: ProductsState["type"]) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setCategory: (category: string) => void;
};

export const useProductsStore = create<ProductsState>((set) => ({
  type: "general",
  page: 1,
  limit: 9,
  category: "",
  setType: (type) => set({ type, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setCategory: (category) => set({ category, page: 1 }),
}));


