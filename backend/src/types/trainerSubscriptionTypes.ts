import mongoose, { Document } from "mongoose";

/**
 * Interface for TrainerSubscription document.
 */
export interface ITrainerSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  trainerId: mongoose.Types.ObjectId;
  planType: "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate: Date;
  status?: string;
  createdAt: Date;
  updatedAt?: Date;
}