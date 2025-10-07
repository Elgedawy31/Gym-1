import { useMutation, useQuery } from "@tanstack/react-query";
import { createTrainerSubscriptionService, getAllTrainerSubscriptionsService, getMyTrainerSubscriptionService, updateTrainerSubscriptionService } from "../service/trainerSubscriptionService";
import { ITrainerSubscriptionRequest, Subscription, SubscriptionsResponse } from "../types/types";
import toast from "react-hot-toast";

export const useCreateTrainerSubscription = () => {
  return useMutation<Subscription, Error, ITrainerSubscriptionRequest>({
    mutationFn: createTrainerSubscriptionService,
    onSuccess: () => {
      toast.success("Trainer subscription created successfully");
    },
    onError: () => {
      toast.error("Failed to create trainer subscription");
    },
  });
}

export const useGetMyTrainerSubscription = () => {
  return useQuery<Subscription[], Error>({
    queryKey: ["trainer-subscription", "me"],
    queryFn: getMyTrainerSubscriptionService,
  });
}

export const useGetAllTrainerSubscriptions = (page: number) => {
  return useQuery<SubscriptionsResponse, Error>({
    queryKey: ["trainer-subscriptions", page],
    queryFn: () => getAllTrainerSubscriptionsService(page),
  });
}

export const useUpdateTrainerSubscription = () => {
  return useMutation<Subscription, Error, string>({
    mutationFn: updateTrainerSubscriptionService,
  });
}