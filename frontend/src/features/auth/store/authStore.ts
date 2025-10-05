import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type IUser } from "../types/types";
import { logOutAction } from "../hooks/actions";

interface AuthStore {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;

  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  logout: async () => {
    try {
      await logOutAction();
      set({ user: null, token: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));

interface ResetState {
  email: string;
  clear: () => void;
  setEmail: (email: string) => void;
}

export const useResetPasswordStore = create<ResetState>()(
  persist(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
      clear: () => set({ email: "" }),
    }),
    {
      name: "reset-password-session",
      storage: createJSONStorage(() => sessionStorage),
    },
  )
);
