// models/subscription.ts (for Node.js backend with Mongoose)
import mongoose, { Schema, Model } from 'mongoose';
import { ISubscription } from "../types/subscriptionTypes.js"

/**
 * Mongoose schema for Subscription model.
 * Includes timestamps, validation, and virtual methods for professional usage.
 */
const subscriptionSchema: Schema<ISubscription> = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      match: [/^[0-9a-fA-F]{24}$/, 'User ID must be a valid MongoDB ObjectId'],
    },
    planType: {
      type: String,
      enum: {
        values: ['monthly', 'quarterly', 'yearly'],
        message: '{VALUE} is not a valid plan type',
      },
      required: [true, 'Plan type is required'],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (this: ISubscription, value: Date) {
          return !value || value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'expired', 'canceled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual method to check if subscription is active
subscriptionSchema.virtual('isActive').get(function (this: ISubscription) {
  if (this.status !== 'active') return false;
  if (this.endDate && this.endDate < new Date()) return false;
  return true;
});

// Pre-save hook to calculate default endDate if not provided
subscriptionSchema.pre('save', function (next) {
  if (!this.endDate) {
    let monthsToAdd = 0;
    switch (this.planType) {
      case 'monthly':
        monthsToAdd = 1;
        break;
      case 'quarterly':
        monthsToAdd = 3;
        break;
      case 'yearly':
        monthsToAdd = 12;
        break;
    }
    this.endDate = new Date(this.startDate);
    this.endDate.setMonth(this.endDate.getMonth() + monthsToAdd);
  }
  next();
});

// Index for faster queries on userId and status
subscriptionSchema.index({ userId: 1, status: 1 });

// Mongoose model
const SubscriptionModel: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default SubscriptionModel;