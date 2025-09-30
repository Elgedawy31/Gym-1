import { Document } from 'mongoose';
import { Types } from 'mongoose';
import z from 'zod';

export interface Item {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface IOrder extends Document {
  fullName: string,
  userId: Types.ObjectId;
  items: Item[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled';
  shippingAddress: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
  totalItems?: number; // Virtual field
}

/**
 * Zod schema for validating createOrder request body.
 */
export const createOrderSchema = z.object({
  fullName: z
  .string()
  .min(3,'Name must be at least 3 characters'),
  shippingAddress: z.object({
    street: z
      .string()
      .min(2, 'Street must be at least 2 characters')
      .max(100, 'Street cannot exceed 100 characters')
      .trim(),
    city: z
      .string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City cannot exceed 50 characters')
      .trim(),
    country: z
      .string()
      .min(2, 'Country must be at least 2 characters')
      .max(50, 'Country cannot exceed 50 characters')
      .trim(),
    postalCode: z
      .string()
      .regex(/^[0-9A-Za-z-]{3,10}$/, 'Postal code must be 3-10 characters (numbers, letters, or hyphens)')
      .trim(),
  }),
});

/**
 * Zod schema for validating orderId in request params.
 */
export const orderIdSchema = z.object({
  orderId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Order ID must be a valid MongoDB ObjectId'),
});

/**
 * Zod schema for validating updateOrderStatus request body.
 */

export const updateOrderStatusSchema = z.object({
  status: z.enum(['confirmed', 'shipped', 'delivered', 'canceled'], {
    message: 'Status must be one of: confirmed, shipped, delivered, canceled',
  }),
});

/**
 * Zod schema for validating updateOrderStatus request body.
 */
export const orderQuerySchema = z.object({
  status: z.enum(['confirmed', 'shipped', 'delivered', 'canceled', 'pending'], {
    message: 'Status must be one of: confirmed, shipped, delivered, canceled',
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
 * Type inferred from createOrderSchema for TypeScript usage.
 */
export type CreateOrderType = z.infer<typeof createOrderSchema>;

/**
 * Type inferred from orderIdSchema for TypeScript usage.
 */
export type OrderIdType = z.infer<typeof orderIdSchema>;

/**
 * Type inferred from updateOrderStatusSchema for TypeScript usage.
 */
export type UpdateOrderStatusType = z.infer<typeof updateOrderStatusSchema>;

/**
 * Type inferred from updateOrderStatusSchema for TypeScript usage.
 */
export type OrderQueryType = z.infer<typeof orderQuerySchema>;