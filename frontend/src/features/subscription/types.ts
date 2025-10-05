export type PlanType = 'monthly' | 'quarterly' | 'yearly';

// export interface ISubscription {
//   _id: string;
//   userId: string;
//   planType: PlanType;
//   status: 'active' | 'inactive' | 'cancelled' | 'expired';
//   createdAt: string;
//   updatedAt: string;
// }

export interface ISubscription {
  userId: string;
  planType: PlanType;
  status: "active" | "expired" | "canceled";
  _id: string;
  id: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive: boolean;
}

export interface SubscriptionResponse {
  status: string;
  data: {
    subscription: ISubscription;
  };
}

export interface AllSubscriptionsResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  data: {
    subscriptions: ISubscription[];
  };
}

export interface UpdateRequest {
  subId: string,
  planType: PlanType,
}
