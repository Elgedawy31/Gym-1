// types/trainerSubscription.ts
import { z } from 'zod';

/**
 * Zod schema for validating a trainer subscription.
 */
export const trainerSubscriptionSchema = z.object({
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'User ID must be a valid MongoDB ObjectId')
    .min(1, 'User ID is required'),
  trainerId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Trainer ID must be a valid MongoDB ObjectId')
    .min(1, 'Trainer ID is required'),
  planType: z.enum(['monthly', 'quarterly', 'yearly'], {
    message: 'Plan type must be monthly, quarterly, or yearly',
  }),
  startDate: z.date().optional().default(() => new Date()),
  endDate: z
    .date()
    .optional()
    .refine(
      (value) => !value || value > new Date(),
      { message: 'End date must be in the future' }
    ),
  status: z
    .enum(['active', 'expired', 'canceled'], {
      message: 'Status must be active, expired, or canceled',
    })
    .default('active')
    .optional(),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional(),
})

  //     const start = new Date(data.startDate);
  //     let monthsToAdd = 0;
  //     switch (data.planType) {
  //       case 'monthly':
  //         monthsToAdd = 1;
  //         break;
  //       case 'quarterly':
  //         monthsToAdd = 3;
  //         break;
  //       case 'yearly':
  //         monthsToAdd = 12;
  //         break;
  //     }
  //     data.endDate = new Date(start.setMonth(start.getMonth() + monthsToAdd));
  //   }
  //   return data;
  // });

/**
 * Type inferred from trainerSubscriptionSchema for TypeScript usage.
 */
export type TrainerSubscriptionType = z.infer<typeof trainerSubscriptionSchema>;