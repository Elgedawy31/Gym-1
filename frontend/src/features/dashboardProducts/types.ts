import { z } from 'zod';

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  type: 'women' | 'men' | 'general';
  category?: string;
  image?: File;
}

// ----------------------
// Zod schema & Types
// ----------------------
export const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  stock: z.coerce.number().int().min(0).optional().default(0),
  type: z.enum(['women', 'men', 'general']),
  category: z.enum(['equipment', 'supplements', 'clothing', 'other']).optional(),
  image: z.instanceof(File).nullable().optional(), // allow File | null | undefined
});

export type CreateProductInput = z.input<typeof createProductSchema>;