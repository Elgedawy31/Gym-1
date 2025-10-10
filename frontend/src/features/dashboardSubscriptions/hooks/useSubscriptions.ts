import { ISubscription, PlanType, UpdateRequest } from "@/features/subscription/types";
import { ApiError } from "next/dist/server/api-utils";
import { getAllSubscriptionsService, getAllTrainerSubscriptionsService, updateSubscriptionService, updateTrainerSubscriptionService } from "../service/subscriptionsService";
import { UseMutationResult, useMutation, useQuery } from "@tanstack/react-query";
import { AllSubscriptionsResponse } from "../types";
import { Subscription } from "@/features/trainerSubscription/types/types";
import toast from "react-hot-toast";

/**
 * Custom hook to fetch the current user's subscription using TanStack Query
 * @returns A query result object with the subscription data, loading state, and error state
 */
export function useGetAllSubscription(page: number, planType?: string) {
  return useQuery<AllSubscriptionsResponse | null, ApiError>({
    queryKey: ["subscription", { page, planType }],
    queryFn: async () => getAllSubscriptionsService(page, planType),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

/**
 * Custom hook to create a new subscription using TanStack Query
 * @returns A mutation result object with methods to trigger subscription creation
 */
export function useUpdateSubscription(): UseMutationResult<
  ISubscription,
  ApiError,
  UpdateRequest,
  unknown
> {
  return useMutation<ISubscription, ApiError, UpdateRequest>({
    mutationFn: async ({ planType, status, subId }) => {
      return await updateSubscriptionService(subId, { planType, status });
    },
    onSuccess: () => {
      window.location.reload();
      toast.success("Subscription updated successfully");
    },
    onError: (error: ApiError) => {
      console.error("Subscription update failed:", error.message);
      toast.error("Failed to update subscription");
    },
  });
}

// export const useGetAllTrainerSubscriptions = (page: number) => {
//   return useQuery<SubscriptionsResponse, Error>({
//     queryKey: ["trainer-subscriptions", page],
//     queryFn: () => getAllTrainerSubscriptionsService(page),
//   });
// }

export function useGetAllTrainerSubscriptions(page: number, planType?: string) {
  return useQuery<AllSubscriptionsResponse | null, ApiError>({
    queryKey: ["subscription-trainer", { page, planType }],
    queryFn: async () => getAllTrainerSubscriptionsService(page, planType),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}


export function useUpdateTrainerSubscription(): UseMutationResult<
  Subscription,
  ApiError,
  UpdateRequest,
  unknown
> {
  return useMutation<Subscription, ApiError, UpdateRequest>({
    mutationFn: async ({ planType, status, subId }) => {
      return await updateTrainerSubscriptionService(subId, { planType, status });
    },
    onSuccess: () => {
        window.location.reload();
        toast.success?.("Trainer subscription updated successfully");
      },
    onError: (error: ApiError) => {
      console.error("Subscription update failed:", error.message);
      toast.error("Failed to update trainer subscription");
    },
  });
}