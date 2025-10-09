"use client";
import { useAuthStore } from "@/features/auth/store/authStore";
import { IUser } from "@/features/auth/types/types";
import { ReactNode, useLayoutEffect } from "react";

export default function AuthProvider({
  token,
  user,
  children,
}: {
  token: string | null;
  user: IUser | null;
  children: ReactNode;
}) {
  const { setUser, setToken } = useAuthStore((state) => state);

  useLayoutEffect(() => {
    if (token && user) {
      setToken(token);
      setUser(user);
    }
  }, [token, user, setUser, setToken]);

  return <>{children}</>;
}
