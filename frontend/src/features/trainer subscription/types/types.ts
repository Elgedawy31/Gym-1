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

export interface SubscriptionsResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  data: {
    subscriptions: Subscription[];
  };
}

