import { z } from 'zod';

export const subscriptionSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
  planType: z.enum(["monthly", "quarterly", "yearly"]),
  startDate: z.date().default(() => new Date()),
  endDate: z.date().optional(),
  status: z.enum(["active", "expired", "canceled"]).default("active")
});

export type SubscriptionType = z.infer<typeof subscriptionSchema>