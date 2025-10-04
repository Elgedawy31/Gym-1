import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number
  type: "woman" | "men"  | 'general';
  category?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}