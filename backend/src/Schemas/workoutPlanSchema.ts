// types/workoutPlan.ts
import { z } from 'zod';

/**
 * Zod schema for validating an exercise within a workout plan.
 */
const exerciseSchema = z.object({
  name: z
    .string()
    .min(2, 'Exercise name must be at least 2 characters')
    .trim(),
  sets: z.number().min(1, 'Sets must be at least 1'),
  reps: z.number().min(1, 'Reps must be at least 1'),
  rest: z
    .string()
    .regex(/^\d+s$/, 'Rest must be a valid time format (e.g., "60s")')
    .default('60s'),
});

/**
 * Zod schema for validating a workout plan.
 */
export const workoutPlanSchema = z.object({
  trainerId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Trainer ID must be a valid MongoDB ObjectId')
    .min(1, 'Trainer ID is required'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Level must be beginner, intermediate, or advanced',
  }),
  duration: z.number().min(1, 'Duration must be at least 1'),
  exercises: z
    .array(exerciseSchema)
    .min(1, 'At least one exercise is required'),
  usersSubscribed: z
    .array(
      z.string().regex(/^[0-9a-fA-F]{24}$/, 'User ID must be a valid MongoDB ObjectId')
    )
    .optional(),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional(),
});

/**
 * Type inferred from workoutPlanSchema for TypeScript usage.
 */
export type WorkoutPlanType = z.infer<typeof workoutPlanSchema>;