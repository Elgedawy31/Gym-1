import { ITrainerSubscriptionRequest, Subscription, SubscriptionsResponse } from "../types/types";
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

export const getAllTrainerSubscriptionsService = async (page: number = 1): Promise<SubscriptionsResponse> => {
  try {
    const response = await clientAxios.get<SubscriptionsResponse>(API_CONFIG.ENDPOINTS.TRAINER_SUBSCRIPTION.GET_ALL_TRAINER_SUBSCRIPTION(page));
    return response.data;
  } catch (error) {
    console.error("Error getting all trainer subscriptions:", error);
    throw new Error("Failed to get all trainer subscriptions");
  }
}

export const updateTrainerSubscriptionService = async (trainerSubscriptionId: string): Promise<Subscription> => {
  try {
    const response = await clientAxios.patch<{ data: { subscription: Subscription } }>(API_CONFIG.ENDPOINTS.TRAINER_SUBSCRIPTION.UPDATE_TRAINER_SUBSCRIPTION(trainerSubscriptionId));
    return response.data.data.subscription;
  } catch (error) {
    console.error("Error updating trainer subscription:", error);
    throw new Error("Failed to update trainer subscription");
  }
}