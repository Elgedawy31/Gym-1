import { ISubscription } from "@/features/subscription/types";

export interface ITrainerSubscriptionRequest {
  trainerId: string;
  planType: "monthly" | "quarterly" | "yearly";
}

export interface Subscription {
  _id: string;
  userId: string;
  trainerId: string;
  planType: "monthly" | "quarterly" | "yearly";
  status: "active" | "inactive" | "expired";
  startDate: string;
  endDate: string;
  createdAt: string;
  __v: number;
}

