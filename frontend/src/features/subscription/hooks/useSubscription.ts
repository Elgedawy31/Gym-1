import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import type { ISubscription, PlanType, UpdateRequest } from "../types";
import { createSubscriptionService, getMySubscriptionService } from "../service/subscriptionService";

// Define a custom error type for better error handling
interface ApiError {
  message: string;
  code?: string;
}

/**
 * Custom hook to fetch the current user's subscription using TanStack Query
 * @returns A query result object with the subscription data, loading state, and error state
 */
export function useGetMySubscription() {
  return useQuery<ISubscription | null, ApiError>({
    queryKey: ["subscription", "me"],
    queryFn: async () => {
      return await getMySubscriptionService();
    },
    // Optional: Configure query options for better control
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });
}

/**
 * Custom hook to create a new subscription using TanStack Query
 * @returns A mutation result object with methods to trigger subscription creation
 */
export function useCreateSubscription(): UseMutationResult<
  ISubscription,
  ApiError,
  PlanType,
  unknown
> {
  return useMutation<ISubscription, ApiError, PlanType>({
    mutationFn: async (planType: PlanType) => {
      return await createSubscriptionService(planType);
    },
    onError: (error: ApiError) => {
      // Log error for debugging
      console.error("Subscription creation failed:", error.message);
    },
    onSuccess: (data: ISubscription) => {
      // Optional: Add success handling, e.g., invalidate queries or show notification
      console.log("Subscription created successfully:", data);
    },
  });
}

