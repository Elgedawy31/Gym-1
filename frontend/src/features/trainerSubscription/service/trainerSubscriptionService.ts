import { ITrainerSubscriptionRequest, Subscription } from "../types/types";
import clientAxios from "@/lib/axios/clientAxios";
import { API_CONFIG } from "@/config/api";

export const createTrainerSubscriptionService = async (trainerSubscription: ITrainerSubscriptionRequest): Promise<Subscription> => {
  try {
    const response = await clientAxios.post<{ data: { subscription: Subscription } }>(API_CONFIG.ENDPOINTS.TRAINER_SUBSCRIPTION.CREATE_TRAINER_SUBSCRIPTION, trainerSubscription);
    return response.data.data.subscription;
  } catch (error) {
    console.error("Error creating trainer subscription:", error);
    throw new Error("Failed to create trainer subscription");
  }

}

export const getMyTrainerSubscriptionService = async (): Promise<Subscription[]> => {
  try {
    const response = await clientAxios.get<{ data: { subscriptions: Subscription[] } }>(API_CONFIG.ENDPOINTS.TRAINER_SUBSCRIPTION.GET_MY_TRAINER_SUBSCRIPTION);
    return response.data.data.subscriptions;
  } catch (error) {
    console.error("Error getting my trainer subscription:", error);
    throw new Error("Failed to get my trainer subscription");
  }
}

