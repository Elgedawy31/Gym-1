import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IUser } from "@/features/auth/types";

interface UserStore {
  users: IUser[] | null;
  setUser: (user: IUser[] | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: null,

  setUser: (users) => set({ users }),
}));