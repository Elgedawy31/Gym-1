// providers/query-provider.tsx
"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Default configuration for QueryClient
const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes to reduce unnecessary API calls
      staleTime: 5 * 60 * 1000,
      // Retry failed queries up to 3 times, except for 401/403 errors
      retry: (failureCount: number, error: unknown) => {
        if (
          error instanceof Error &&
          (error.message.includes("401") || error.message.includes("403"))
        ) {
          return false; // No retry for unauthorized or forbidden errors
        }
        return failureCount < 3;
      },
      // Disable refetch on window focus to improve performance
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Log mutation errors for debugging
      onError: (error: unknown) => {
        console.error("[QueryClient Mutation Error]", error);
      },
    },
  },
};

/**
 * Provides a configured QueryClient to the application with React Query.
 * Includes error handling, DevTools, and optimized query settings.
 *
 * @param {ReactNode} children - The child components to be wrapped by QueryClientProvider
 * @returns {JSX.Element} The QueryClientProvider with configured client
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  // Initialize QueryClient once using useState
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  // Fallback UI for ErrorBoundary
  const fallbackRender = ({ error }: { error: Error }) => (
    <div role="alert" style={{ padding: "1rem", color: "red" }}>
      <p>An error occurred: {error.message}</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );

  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary fallbackRender={fallbackRender}>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* Include DevTools only in development mode */}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
}