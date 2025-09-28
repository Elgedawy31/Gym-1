// store/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import type { IUser } from "@/types/authType";

// Define AuthState interface
interface AuthState {
  token: string | null;
  user: IUser | null;
  setAuth: (token: string, user: IUser) => void;
  logout: () => void;
}

// Create Zustand store with persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token: string, user: IUser) => {
        set({ token, user });
        Cookies.set("token", token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      },
      logout: () => {
        set({ token: null, user: null });
        Cookies.remove("token");
      },
    }),
    {
      name: "auth-storage", // Unique key for storage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }), // Persist both token and user
    }
  )
);