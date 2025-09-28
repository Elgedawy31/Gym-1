import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number
  category?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}