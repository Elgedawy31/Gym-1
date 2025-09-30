import mongoose, { Model } from "mongoose";
import { IOrder } from "../types/orderTypes.js";
import { Schema } from "mongoose";
import { Item } from "../types/cartTypes.js";

/**
 * Mongoose schema for Item sub-document.
 */
const itemSchema = new Schema(
  {
    productId: {
      type: String,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
  },
  { _id: false }
);

/**
 * Mongoose schema for ShippingAddress sub-document.
 */
const shippingAddressSchema = new Schema(
  {
    street: {
      type: String,
      required: [true, 'Street is required'],
      minlength: [2, 'Street must be at least 2 characters'],
      maxlength: [100, 'Street cannot exceed 100 characters'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      minlength: [2, 'City must be at least 2 characters'],
      maxlength: [50, 'City cannot exceed 50 characters'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      minlength: [2, 'Country must be at least 2 characters'],
      maxlength: [50, 'Country cannot exceed 50 characters'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      match: [/^[0-9A-Za-z-]{3,10}$/, 'Postal code must be 3-10 characters (numbers, letters, or hyphens)'],
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Mongoose schema for Order model.
 * Defines structure and validation for orders.
 */
const orderSchema: Schema<IOrder> = new Schema(
  {
    fullName: {
      type: String, 
      minlength: 3
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => {
          const user = await mongoose.model('User').exists({ _id: value });
          return !!user;
        },
        message: 'Invalid user ID',
      },
    },
    items: {
      type: [itemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: {
        validator: (items: Item[]) => items.length > 0 && items.length <= 50,
        message: 'Order must contain 1 to 50 items',
      },
    },
    totalAmount: {
      type: Number,
      min: [0, 'Total amount must be a positive number'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries on userId and status
orderSchema.index({ userId: 1, status: 1 });

// Pre-save hook to calculate totalAmount
orderSchema.pre('save', async function (next) {
  if (this.isModified('items')) {
    // Validate product IDs and fetch prices
    const productIds = this.items.map((item) => item.productId);
    const products = await mongoose.model('Product').find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return next(new Error('One or more product IDs in items are invalid or deleted'));
    }

    // Update prices in items and calculate totalAmount
    this.totalAmount = this.items.reduce((total, item) => {
      const product = products.find((p) => p._id.toString() === item.productId.toString());
      if (!product) return total;
      item.price = product.price; // Update item price to current product price
      return total + item.quantity * item.price;
    }, 0);
  }
  next();
});

// Virtual field for total items count
orderSchema.virtual('totalItems').get(function (this: IOrder) {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Mongoose model
const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default OrderModel;