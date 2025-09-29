import mongoose, { Model, Schema } from "mongoose";
import { ICart, Item } from "../types/cartTypes.js";

/**
 * Mongoose schema for Item sub-document.
 */
const itemSchema = new Schema(
  {
    productId: { type: String, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

/**
 * Mongoose schema for Cart model.
 * Defines structure and validation for carts.
 */
const cartSchema: Schema<ICart> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    items: {
      type: [itemSchema],
      default: [],
      validate: {
        validator: (items: Item[]) => items.length <= 50, // Example limit
        message: 'Cart cannot contain more than 50 items',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries on userId
cartSchema.index({ userId: 1 });

// Pre-save hook to validate items
cartSchema.pre('save', async function (next) {
  if (this.isModified('items') && this.items.length > 0) {
    const productIds = this.items.map((item) => item.productId);
    const products = await mongoose.model('Product').find({ _id: { $in: productIds }});
    if (products.length !== productIds.length) {
      return next(new Error('One or more product IDs in items are invalid or deleted'));
    }
  }
  next();
});

// Virtual field for total items count
cartSchema.virtual('totalItems').get(function (this: ICart) {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Mongoose model
const CartModel: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);

export default CartModel;