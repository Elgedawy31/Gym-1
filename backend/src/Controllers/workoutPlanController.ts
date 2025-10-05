import { NextFunction, Request, Response } from 'express';
import { catchAsync } from "../Utils/catchAsync.js";
import { AppError } from '../Utils/AppError.js';
import { workoutPlanSchema } from '../Schemas/workoutPlanSchema.js';
import WorkoutPlanModel from '../Models/workoutPlanModel.js';
import { ZodError } from 'zod';
import ApiFeatures from '../Utils/ApiFeatures.js';
import { IWorkoutPlan } from '../types/workoutPlanTypes.js';
import TrainerSubscriptionModel from '../Models/trainerSubscriptionModel.js';

/**
 * Creates a new workout plan.
 * @route POST /api/workout-plans
 * @access Private (Trainer only)
 */
export const createWorkoutPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError('User not authenticated', 401));

  try {
    const data = workoutPlanSchema
      .omit({ createdAt: true, updatedAt: true, usersSubscribed: true })
      .parse({
        ...req.body,
        trainerId: userId.toString(),
      });

      const createdPlan = await WorkoutPlanModel.create(data);

      const workoutPlan = await WorkoutPlanModel.findById(createdPlan._id)
        .populate('trainerId', 'name email')
        .populate('usersSubscribed', 'name email');

      res.status(201).json({
        status: 'success',
        data: { workoutPlan },
      });
      
  } catch (error: any) {
    console.error("🔥 Caught error:", error);  
    if (error instanceof ZodError) {
      const issues = error.issues.map((e) => e.message).join(", ");
      return next(new AppError(`Validation error: ${issues}`, 400));
        }

        if (error.code === 11000) {
          return next(new AppError("Workout plan with this title already exists", 400));
        }
    return next(new AppError('Failed to create workout plan', 500));
  }
});

/**
 * Updates a workout plan by ID, restricted to the trainer who created it.
 * @route PATCH /api/workout-plans/:planId
 * @access Private (Trainer only)
 */
export const updateWorkoutPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const { planId } = req.params;
  if (!planId || !/^[0-9a-fA-F]{24}$/.test(planId)) {
    return next(new AppError('Valid workout plan ID is required', 400));
  }

  // Find the workout plan
  const workoutPlan = await WorkoutPlanModel.findById(planId);
  if (!workoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Check if the user is the trainer who created the plan
  if (workoutPlan.trainerId.toString() !== userId.toString()) {
    return next(new AppError('Unauthorized: You can only update your own workout plans', 403));
  }

  // Validate request body using Zod
  try {
    const data = workoutPlanSchema
      .partial()
      .omit({ trainerId: true, usersSubscribed: true, createdAt: true, updatedAt: true })
      .parse(req.body);

    // Update workout plan
    const updatedWorkoutPlan = await WorkoutPlanModel.findByIdAndUpdate(
      planId,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('trainerId', 'name email').populate('usersSubscribed', 'name email');

    if (!updatedWorkoutPlan) {
      return next(new AppError('Failed to update workout plan', 500));
    }

    res.status(200).json({
      status: 'success',
      data: { workoutPlan: updatedWorkoutPlan },
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const issues = error.issues.map((e) => e.message).join(", ");
      return next(new AppError(`Validation error: ${issues}`, 400));
        }

    if (error.code === 11000) {
      return next(new AppError("Workout plan with this title already exists", 400));
    }
    return next(new AppError('Failed to update workout plan', 500));
  }
});

/**
 * Gets all workout plans with optional filtering, sorting, and pagination.
 * Optionally includes subscription status for the authenticated user.
 * @route GET /api/workout-plans/all
 * @access Private (Admin only)
 */
export const getAllWorkoutPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }
  // Build query with ApiFeatures
  const features = new ApiFeatures<IWorkoutPlan>(
    WorkoutPlanModel.find()
      .populate('trainerId', 'name email')
      .populate('usersSubscribed', 'name email'), // Optional: Populate trainer and user details
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // Execute query
  const { results: workoutPlans, total, page, limit } = await features.execute();

  if (!workoutPlans || workoutPlans.length === 0) {
    return next(new AppError('No workout plans found', 404));
  }

  // Optionally check subscription status for each workout plan
  const workoutPlansWithSubscriptionStatus = await Promise.all(
    workoutPlans.map(async (plan) => {
      const subscription = await TrainerSubscriptionModel.findOne({
        userId,
        trainerId: plan.trainerId,
        status: 'active',
      });
      return {
        ...plan.toObject(),
        isSubscribed: !!subscription, // Indicates if the user has an active subscription with the trainer
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: workoutPlansWithSubscriptionStatus.length,
    total,
    page,
    limit,
    data: { workoutPlans: workoutPlansWithSubscriptionStatus },
  });
});

/**
 * Gets all workout plans for a specific trainer with optional filtering, sorting, and pagination.
 * Includes subscription status for the authenticated user.
 * @route GET /api/workout-plans/trainer/:trainerId
 * @access Private
 */
export const getTrainerWorkoutPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const { trainerId } = req.params;
  if (!trainerId || !/^[0-9a-fA-F]{24}$/.test(trainerId)) {
    return next(new AppError('Valid trainer ID is required', 400));
  }

  console.log(trainerId);
  

  // Build query with ApiFeatures, filtering by trainerId
  const features = new ApiFeatures<IWorkoutPlan>(
    WorkoutPlanModel.find({ trainerId })
      .populate('trainerId', 'name email')
      .populate('usersSubscribed', 'name email'),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // Execute query
  const { results: workoutPlans, total, page, limit } = await features.execute();

  console.log(workoutPlans);
  

  if (!workoutPlans || workoutPlans.length === 0) {
    return next(new AppError('No workout plans found for this trainer', 404));
  }

  // Check subscription status for the authenticated user
  const subscription = await TrainerSubscriptionModel.findOne({
    userId,
    trainerId,
    status: 'active',
  });

  // Add isSubscribed to each workout plan
  const workoutPlansWithSubscriptionStatus = workoutPlans.map((plan) => ({
    ...plan.toObject(),
    isSubscribed: !!subscription, // Indicates if the user has an active subscription with the trainer
  }));

  res.status(200).json({
    status: 'success',
    results: workoutPlansWithSubscriptionStatus.length,
    total,
    page,
    limit,
    data: { workoutPlans: workoutPlansWithSubscriptionStatus },
  });
});

/**
 * Gets a single workout plan by ID, with optional trainer ID validation.
 * Includes subscription status for the authenticated user.
 * @route GET /api/workout-plans/:planId
 * @access Private
 */
export const getSingleWorkoutPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const { planId } = req.params;
  if (!planId || !/^[0-9a-fA-F]{24}$/.test(planId)) {
    return next(new AppError('Valid workout plan ID is required', 400));
  }

  // Find the workout plan
  const workoutPlan = await WorkoutPlanModel.findById(planId)
    .populate('trainerId', 'name email')
    .populate('usersSubscribed', 'name email');

  if (!workoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      workoutPlan: {
        ...workoutPlan.toObject(), // Indicates if the user has an active subscription with the trainer
      },
    },
  });
});

/**
 * Deletes a workout plan by ID, restricted to the trainer who created it.
 * @route DELETE /api/workout-plans/:planId
 * @access Private (Trainer only)
 */
export const deleteWorkoutPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }
  if (req.user?.role !== 'trainer') {
    return next(new AppError('Unauthorized: Trainer access required', 403));
  }

  const { planId } = req.params;
  if (!planId || !/^[0-9a-fA-F]{24}$/.test(planId)) {
    return next(new AppError('Valid workout plan ID is required', 400));
  }

  // Find the workout plan
  const workoutPlan = await WorkoutPlanModel.findById(planId);
  if (!workoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Check if the user is the trainer who created the plan
  if (workoutPlan.trainerId.toString() !== userId.toString()) {
    return next(new AppError('Unauthorized: You can only delete your own workout plans', 403));
  }

  // Delete the workout plan
  await WorkoutPlanModel.findByIdAndDelete(planId);

  res.status(204).json({
    status: 'success',
    data: null, // No content returned for DELETE
  });
});

/**
 * Subscribes an authenticated user to a workout plan by adding their userId to usersSubscribed.
 * Requires an active subscription with the trainer of the plan.
 * @route POST /api/workout-plans/:planId/subscribe
 * @access Private
 */
export const subscribeToWorkoutPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const { planId } = req.params;
  if (!planId || !/^[0-9a-fA-F]{24}$/.test(planId)) {
    return next(new AppError('Valid workout plan ID is required', 400));
  }

  // Find the workout plan
  const workoutPlan = await WorkoutPlanModel.findById(planId).populate('trainerId', 'name email');
  if (!workoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Validate required fields (duration, level)
  if (!workoutPlan.duration || !workoutPlan.level) {
    return next(new AppError('Workout plan is missing required fields (duration or level)', 400));
  }

  // Check if user is already subscribed to the plan
  if (workoutPlan.usersSubscribed.some((id) => id.toString() === userId.toString())) {
    return next(new AppError('You are already subscribed to this workout plan', 400));
  }

  // Check if user has an active subscription with the trainer
  const subscription = await TrainerSubscriptionModel.findOne({
    userId,
    trainerId: workoutPlan.trainerId,
    status: 'active',
  });
  if (!subscription) {
    return next(new AppError('You must have an active subscription with this trainer to join their workout plan', 403));
  }

  // Update usersSubscribed using findByIdAndUpdate to avoid full schema validation
  const updatedWorkoutPlan = await WorkoutPlanModel.findByIdAndUpdate(
    planId,
    { $addToSet: { usersSubscribed: userId }, updatedAt: new Date() },
    { new: true, runValidators: false } // Skip full validation to avoid required field errors
  ).populate('trainerId', 'name email').populate('usersSubscribed', 'name email');

  if (!updatedWorkoutPlan) {
    return next(new AppError('Failed to subscribe to workout plan', 500));
  }

  res.status(200).json({
    status: 'success',
    data: { workoutPlan: updatedWorkoutPlan },
  });
});