import { z } from 'zod';

// Zod schema for validation
export const userValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Gender must be male, female, or other',
  }),
  role: z.enum(['admin', 'trainer', 'member']).optional().default('member'),
});

/**
 * Zod schema for validating product query parameters.
 */
export const userQuerySchema = z.object({
  role: z
    .enum(['admin', 'trainer', 'member'], {
      message: 'Category must be one of: admin, trainer, member',
    })
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a valid number')
    .transform(Number)
    .refine((val) => val >= 1, 'Page must be at least 1')
    .optional()
    .default(1),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a valid number')
    .transform(Number)
    .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default(10),
  sort: z
    .string()
    .regex(/^(name|price|createdAt)(,-(name|price|createdAt))*$/, 'Sort must be a valid field (name, price, createdAt) with optional descending (-)')
    .optional(),
});

/**
 * Type inferred from productQuerySchema for TypeScript usage.
 */
export type UserQueryType = z.infer<typeof userQuerySchema>;