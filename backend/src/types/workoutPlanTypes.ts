import { Document, Types } from "mongoose";

export interface IWorkoutPlan extends Document {
  trainerId: Types.ObjectId;
  title: string;
  description?: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: { name: string; sets: number; reps: number; rest: string }[];
  usersSubscribed: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  subscribedCount: number; // Virtual field
}
