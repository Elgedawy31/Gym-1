import { z } from 'zod';

/**
 * Zod schema for validating a product.
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be positive')),
  stock: z.preprocess(
    (val) => val ? Number(val) : 0,
    z.number().min(0, 'Stock must be non-negative').int()
  ).optional().default(0),
  category: z
    .enum(['equipment', 'supplements', 'clothing', 'other'])
    .optional(),
  type: z
    .enum(['woman', 'men', 'general'])
    .optional(),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional(),
});
