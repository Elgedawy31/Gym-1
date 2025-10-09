"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "react-hot-toast";
import { getQueryClient } from "@/utils/queryClient";
import AuthProvider from "../providers/AuthProvider";
import { type IUser } from "@/features/auth/types/types";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = getQueryClient();

export function Providers({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { token?: string | null; user: IUser | null };
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider user={data?.user ?? null} token={data?.token ?? null}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </NextThemesProvider>
        <Toaster 
              position="top-left"
              reverseOrder={false}
              toastOptions={{
                className: 'bg-[var(--color-card)] text-[var(--color-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)]',
                style: {
                  background: 'var(--color-card)',
                  color: 'var(--color-foreground)',
                  border: '1px solid var(--color-border)',
                },
              }}
             />
      </AuthProvider>
    </QueryClientProvider>
  );
}
