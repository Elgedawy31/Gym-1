// controllers/subscriptionController.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../Utils/catchAsync.js';
import { AppError } from '../Utils/AppError.js';
import { subscriptionSchema } from '../Schemas/subscriptionSchema.js';
import SubscriptionModel from '../Models/subscriptionModel.js';
import ApiFeatures from '../Utils/ApiFeatures.js';
import { ISubscription } from '../types/subscriptionTypes.js';

/**
 * Creates a new subscription for the authenticated user.
 * @route POST /api/subscriptions
 * @access Private (requires authentication)
 */
export const createSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get userId from authenticated user
  const userId = req.user?._id;
  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }


  // Validate request body using Zod
  const { planType } = subscriptionSchema.partial().parse({
    planType: req.body.planType,
  });

  // Check if the user already has an active subscription
  const existingSubscription = await SubscriptionModel.findOne({ userId, status: 'active' });
  if (existingSubscription) {
    return next(new AppError('User already has an active subscription', 400));
  }

  // Create subscription
  const subscription = await SubscriptionModel.create({
    userId,
    planType,
  });

  // Send response
  res.status(201).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

/**
 * Gets the authenticated user's active subscription.
 * @route GET /api/subscriptions/me
 * @access Private
 */
export const getMySubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  const subscription = await SubscriptionModel.findOne({ userId, status: 'active' });
  if (!subscription) {
    return next(new AppError('No active subscription found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { subscription },
  });
});

/**
 * Gets all subscriptions with filtering, sorting, and pagination.
 * @route GET /api/subscriptions
 * @access Private (Admin only)
 */
export const getAllSubscriptions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Build query using ApiFeatures with explicit type
  const features = new ApiFeatures<ISubscription>(SubscriptionModel.find().populate("userId", "name email"), req.query)
    .filter()
    .sort()
    .paginate();

  // Execute query
  const { results: subscriptions, total, page, limit } = await features.execute();

  // Check if subscriptions exist
  if (!subscriptions || subscriptions.length === 0) {
    return next(new AppError('No subscriptions found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    total,
    page,
    limit,
    data: { subscriptions },
  });
});

/**
 * Updates a subscription's status or planType.
 * @route PATCH /api/subscriptions/:id
 * @access Private (Admin or subscription owner)
 */
export const updateSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.status && !req.body.planType) return next(new AppError("Must be entered status or planType.", 400))
  
  const userId = req.user?._id;
  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  const subscriptionId = req.params.id;
  if (!subscriptionId || !/^[0-9a-fA-F]{24}$/.test(subscriptionId)) {
    return next(new AppError('Valid Subscription ID is required', 400));
  }

  // Validate request body
  const updateData = subscriptionSchema.partial().pick({ status: true, planType: true }).parse(req.body);

  // Check if subscription exists and user is authorized
  const subscription = await SubscriptionModel.findById(subscriptionId);
  if (!subscription) {
    return next(new AppError('Subscription not found', 404));
  }
  if (subscription.userId.toString() !== userId.toString() && req.user?.role !== 'admin') {
    return next(new AppError('Unauthorized: You can only update your own subscription or need admin access', 403));
  }

  // Update subscription
  const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
    subscriptionId,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!updatedSubscription) {
    return next(new AppError('Failed to update subscription', 500));
  }

  res.status(200).json({
    status: 'success',
    data: { subscription: updatedSubscription },
  });
});