import { Request, Response, NextFunction } from 'express';
import { catchAsync } from "../Utils/catchAsync.js";
import { AppError } from '../Utils/AppError.js';
import { trainerSubscriptionSchema } from '../Schemas/trainerSubscriptionSchema.js';
import TrainerSubscriptionModel from '../Models/trainerSubscriptionModel.js';
import { ZodError } from 'zod';
import UserModel from '../Models/userModel.js';
import ApiFeatures from '../Utils/ApiFeatures.js';
import { ITrainerSubscription } from '../types/trainerSubscriptionTypes.js';

/**
 * Creates a new trainer subscription.
 * @route POST /api/trainer-subscriptions
 * @access Private
 */
export const createTrainerSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError('User not authenticated', 401));

  try {
    const data = trainerSubscriptionSchema
      .omit({ createdAt: true, updatedAt: true, status: true, startDate: true })
      .parse({
        ...req.body,
        userId: userId.toString()
      });
      console.log(data.trainerId);
      
      const trainer = await UserModel.findById(data.trainerId);
      if (!trainer) return next(new AppError('Invalid trainer ID', 400));

    const subscription = await TrainerSubscriptionModel.create(data);

    res.status(201).json({
      status: 'success',
      data: { subscription },
    });
  } catch (error) {
    console.error("🔥 Caught error:", error);
    if (error instanceof ZodError) {
      const issues = error.issues.map((e) => e.message).join(", ");
      return next(new AppError(`Validation error: ${issues}`, 400));
    }
    return next(new AppError('Failed to create trainer subscription', 500));
  }
});


/**
 * Gets all subscriptions for the authenticated user with optional filtering and pagination.
 * @route GET /api/trainer-subscriptions/me
 * @access Private
 */
export const getUserSubscriptions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  // Build query with ApiFeatures, filtering by userId
  const features = new ApiFeatures<ITrainerSubscription>(
    TrainerSubscriptionModel.find({ userId }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // Execute query
  const { results: subscriptions, total, page, limit } = await features.execute();

  if (!subscriptions || subscriptions.length === 0) {
    return next(new AppError('No subscriptions found for this user', 404));
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
 * Gets all subscriptions for the authenticated trainer with optional filtering and pagination.
 * @route GET /api/trainer-subscriptions
 * @access Private (Trainer only)
 */
export const getTrainerSubscriptions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const trainerId = req.user?._id;
  if (!trainerId || !/^[0-9a-fA-F]{24}$/.test(trainerId.toString())) {
    return next(new AppError('Trainer not authenticated or invalid trainer ID', 401));
  }

  // Build query with ApiFeatures, filtering by trainerId
  const features = new ApiFeatures<ITrainerSubscription>(
    TrainerSubscriptionModel.find({ trainerId }).populate('userId', 'name email'), // Optional: Populate user details
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // Execute query
  const { results: subscriptions, total, page, limit } = await features.execute();

  if (!subscriptions || subscriptions.length === 0) {
    return next(new AppError('No subscriptions found for this trainer', 404));
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
 * Gets all trainer subscriptions with optional filtering, sorting, and pagination.
 * @route GET /api/trainer-subscriptions/all
 * @access Private (Admin only)
 */
export const getAllSubscriptions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Build query with ApiFeatures
  const features = new ApiFeatures<ITrainerSubscription>(
    TrainerSubscriptionModel.find().populate('userId', 'name email').populate('trainerId', 'name'), // Optional: Populate user and trainer details
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // Execute query
  const { results: subscriptions, total, page, limit } = await features.execute();

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
 * Updates the status of a trainer subscription.
 * @route PATCH /api/trainer-subscriptions/:id
 * @access Private (Subscription owner or Admin)
 */
export const updateSubscriptionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const subscriptionId = req.params.id;
  if (!subscriptionId || !/^[0-9a-fA-F]{24}$/.test(subscriptionId)) {
    return next(new AppError('Valid subscription ID is required', 400));
  }

  // Validate request body
  const { status } = trainerSubscriptionSchema.partial().pick({ status: true }).parse(req.body);

  // Check if subscription exists and user is authorized
  const subscription = await TrainerSubscriptionModel.findById(subscriptionId);
  if (!subscription) {
    return next(new AppError('Subscription not found', 404));
  }
  if (subscription.userId.toString() !== userId.toString() && req.user?.role !== 'admin') {
    return next(new AppError('Unauthorized: You can only update your own subscription or need admin access', 403));
  }

  // Update subscription status
  const updatedSubscription = await TrainerSubscriptionModel.findByIdAndUpdate(
    subscriptionId,
    { status, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!updatedSubscription) {
    return next(new AppError('Failed to update subscription status', 500));
  }

  res.status(200).json({
    status: 'success',
    data: { subscription: updatedSubscription },
  });
});

/**
 * Deletes a trainer subscription by ID.
 * @route DELETE /api/trainer-subscriptions/:id
 * @access Private (Subscription owner or Admin)
 */
export const deleteSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const subscriptionId = req.params.id;
  if (!subscriptionId || !/^[0-9a-fA-F]{24}$/.test(subscriptionId)) {
    return next(new AppError('Valid subscription ID is required', 400));
  }

  // Check if subscription exists and user is authorized
  const subscription = await TrainerSubscriptionModel.findById(subscriptionId);
  if (!subscription) {
    return next(new AppError('Subscription not found', 404));
  }

  // Delete subscription
  await TrainerSubscriptionModel.findByIdAndDelete(subscriptionId);

  res.status(204).json({
    status: 'success',
    data: null, // No content returned for DELETE
  });
});