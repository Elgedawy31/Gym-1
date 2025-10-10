import { PlanType } from "../subscription/types";

type UserId = {
  _id: string,
  name: string,
  email: string,
}

type TrainerId = {
  _id: string,
  name: string
}


export interface Subscriptions {
  userId: UserId;
  trainerId?: TrainerId;
  planType: PlanType;
  status: "active" | "expired" | "canceled";
  _id: string;
  id: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive?: boolean;
}

export interface AllSubscriptionsResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  data: {
    subscriptions: Subscriptions[];
  };
}