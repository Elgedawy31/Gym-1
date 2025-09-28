import { z } from 'zod';

/**
 * Zod schema for validating product query parameters.
 */
export const productQuerySchema = z.object({
  category: z
    .enum(['equipment', 'supplements', 'clothing', 'other'], {
      message: 'Category must be one of: equipment, supplements, clothing, other',
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
export type ProductQueryType = z.infer<typeof productQuerySchema>;