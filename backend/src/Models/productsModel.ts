// models/product.ts
import mongoose, { Schema, Model } from 'mongoose';
import { IProduct } from '../types/productsTypes.js';

/**
 * Mongoose schema for Product model.
 * Defines structure and validation for products.
 */
const productSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    stock: {
      type: Number,
      min: [0, 'Stock must be a non-negative number'],
      default: 0, // Default to 0 if not provided
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: ['equipment', 'supplements', 'clothing', 'other'],
        message: '{VALUE} is not a valid category',
      },
    },
    type: {
      type: String,
      trim: true,
      enum: {
        values: ['women', 'men', 'general', 'all'],
        message: '{VALUE} is not a valid type',
      },
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries on category
productSchema.index({ category: 1 });

// Mongoose model
const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default ProductModel;