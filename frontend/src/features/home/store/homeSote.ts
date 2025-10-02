import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IUser } from "@/features/auth/types";

interface HomeStore {
  topTrainer: IUser[] | null;
  setUser: (user: IUser[] | null) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  topTrainer: null,

  setUser: (topTrainer) => set({ topTrainer }),
}));