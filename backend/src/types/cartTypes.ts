import mongoose, { Document } from "mongoose";
import z from "zod";

export interface Item {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: Item[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  totalItems?: number; // Virtual field
}

/**
 * Zod schema for validating add-to-cart input.
 */
export const addToCartSchema = z.object({
  productId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Product ID must be a valid MongoDB ObjectId'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
});

/**
 * Type inferred from addToCartSchema for TypeScript usage.
 */
export type AddToCartType = z.infer<typeof addToCartSchema>;