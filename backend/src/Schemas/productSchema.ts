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
  price: z
    .number()
    .min(0, 'Price must be a positive number')
    .nonnegative(),
  stock: z
    .number()
    .min(0, 'Stock must be a non-negative number')
    .int('Stock must be an integer')
    .optional()
    .default(0), // Default to 0 if not provided
  category: z
    .enum(['equipment', 'supplements', 'clothing', 'other'], {
      message: 'Category must be one of: equipment, supplements, clothing, other',
    })
    .optional(),
  imageUrl: z
    .string()
    .url('Image URL must be a valid URL')
    .regex(/\.(jpg|jpeg|png|gif)$/, 'Image URL must end with .jpg, .jpeg, .png, or .gif')
    .optional(),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional(),
});