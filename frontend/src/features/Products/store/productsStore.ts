"use client";

import { create } from "zustand";

type ProductsState = {
  type: "general" | "men" | "woman";
  page: number;
  limit: number;
  search: string;
  setType: (type: ProductsState["type"]) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
};

export const useProductsStore = create<ProductsState>((set) => ({
  type: "general",
  page: 1,
  limit: 9,
  search: "",
  setType: (type) => set({ type, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search, page: 1 }),
}));


