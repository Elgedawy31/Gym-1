export type PlanType = 'monthly' | 'quarterly' | 'yearly';

type UserSub = {
  _id: string,
  name: string,
  email: string,
}


export interface ISubscription {
  userId: string;
  trainerId?: string;
  planType: PlanType;
  status: "active" | "expired" | "canceled";
  _id: string;
  id?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive?: boolean;
}

export interface SubscriptionResponse {
  status: string;
  data: {
    subscription: ISubscription;
  };
}



export type SubscriptionStatus = 'active' | 'expired' | 'canceled';

export interface UpdateRequest {
  subId: string;
  planType?: PlanType;
  status?: SubscriptionStatus;
}
