import { API_CONFIG } from "@/config/api";
import { ISubscription, PlanType, SubscriptionStatus } from "@/features/subscription/types";
import clientAxios from "@/lib/axios/clientAxios";
import { AllSubscriptionsResponse } from "../types";
import { Subscription } from "@/features/trainerSubscription/types/types";

/**
 * Fetches all subscriptions from the API.
 * @returns The list of all subscriptions or null if the request fails
 * @throws ApiError if the request encounters an error
 */
export async function getAllSubscriptionsService(page: number, planType?: string): Promise<AllSubscriptionsResponse | null> {
  try {
    const res = await clientAxios.get<AllSubscriptionsResponse>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTION.GET_ALL_SUBSCRIPTION(page, planType) // Use the correct endpoint for all subscriptions
    );

    // Validate response data
    if (!res.data?.data?.subscriptions) {
      throw new Error("No subscriptions data found");
    }

    return res.data;
  } catch (error) {
    // Improved error handling with specific error logging
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching all subscriptions:", errorMessage);
    return null;
  }
}

export async function updateSubscriptionService(subId: string, payload: { planType?: PlanType; status?: SubscriptionStatus }): Promise<ISubscription> {
  if (!payload.planType && !payload.status) {
    throw new Error("At least one field (planType or status) is required");
  }

  try {
    const res = await clientAxios.patch<{ data: { subscription: ISubscription } }>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTION.UPDATE_SUBSCRIPTION(subId),
      payload
    );

    // Validate subscription data
    if (!res.data?.data?.subscription) {
      throw new Error("Failed to update subscription: No subscription data returned");
    }

    return res.data.data.subscription;
  } catch (error) {
    // Improved error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error update subscription:", errorMessage);
    throw new Error(`Failed to update subscription: ${errorMessage}`);
  }
}

export const getAllTrainerSubscriptionsService = async (page: number, planType?: string): Promise<AllSubscriptionsResponse> => {
  try {
    const response = await clientAxios.get<AllSubscriptionsResponse>(API_CONFIG.ENDPOINTS.TRAINER_SUBSCRIPTION.GET_ALL_TRAINER_SUBSCRIPTION(page, planType));
    return response.data;
  } catch (error) {
    console.error("Error getting all trainer subscriptions:", error);
    throw new Error("Failed to get all trainer subscriptions");
  }
}

export const updateTrainerSubscriptionService = async (subId: string, payload: { planType?: PlanType; status?: SubscriptionStatus }): Promise<Subscription> => {
  if (!payload.planType && !payload.status) {
    throw new Error("At least one field (planType or status) is required");
  }
  try {
    console.log(payload, subId);
    
    const response = await clientAxios.patch<{ data: { subscription: Subscription } }>(API_CONFIG.ENDPOINTS.TRAINER_SUBSCRIPTION.UPDATE_TRAINER_SUBSCRIPTION(subId),payload);
    return response.data.data.subscription;
  } catch (error) {
    // Improved error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error update subscription:", errorMessage);
    throw new Error(`Failed to update subscription: ${errorMessage}`);
  }
}