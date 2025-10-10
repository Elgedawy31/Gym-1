import { useMutation, useQuery } from "@tanstack/react-query";
import { createTrainerSubscriptionService, getMyTrainerSubscriptionService } from "../service/trainerSubscriptionService";
import { ITrainerSubscriptionRequest, Subscription } from "../types/types";
import toast from "react-hot-toast";

export const useCreateTrainerSubscription = () => {
  return useMutation<Subscription, Error, ITrainerSubscriptionRequest>({
    mutationFn: createTrainerSubscriptionService,
    onSuccess: () => {
      toast.success("Trainer subscription successfully");
      window.location.reload();
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

