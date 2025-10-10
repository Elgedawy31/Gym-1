import clientAxios from "@/lib/axios/clientAxios";
import type { ISubscription, PlanType } from "../types";
import { API_CONFIG } from "@/config/api";

/**
 * Fetches the current user's subscription
 * @returns The current subscription or null if the request fails
 * @throws ApiError if the request encounters an error
 */
export async function getMySubscriptionService(): Promise<ISubscription | null> {
  try {
    const res = await clientAxios.get<{ data: { subscription: ISubscription } }>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTION.GET_MY_SUBSCRIPTION
    );
    
    // Validate response data
    if (!res.data?.data?.subscription) {
      throw new Error("No subscription data found");
    }
    
    return res.data.data.subscription;
  } catch (error) {
    // Improved error handling with logging
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching subscription:", errorMessage);
    return null;
  }
}

/**
 * Creates a new subscription based on the provided plan type
 * @param planType The type of plan to subscribe to
 * @returns The newly created subscription
 * @throws ApiError if subscription creation fails
 */
export async function createSubscriptionService(planType: PlanType): Promise<ISubscription> {
  // Validate plan type
  if (!planType) {
    throw new Error("Plan type is required");
  }

  try {
    const res = await clientAxios.post<{ data: { subscription: ISubscription } }>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTION.CREATE_SUBSCRIPTION,
      { planType }
    );

    // Validate subscription data
    if (!res.data?.data?.subscription) {
      throw new Error("Failed to create subscription: No subscription data returned");
    }

    return res.data.data.subscription;
  } catch (error) {
    // Improved error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error creating subscription:", errorMessage);
    throw new Error(`Failed to create subscription: ${errorMessage}`);
  }
}

