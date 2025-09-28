import { Document } from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  planType: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'expired' | 'canceled';
  isActive: () => boolean; // Virtual method
  createdAt: Date;
  updatedAt: Date;
}