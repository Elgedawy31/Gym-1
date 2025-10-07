import { Request, Response, NextFunction } from 'express';
import UserModel from '../Models/userModel.js';
import { AppError } from '../Utils/AppError.js';
import { catchAsync } from '../Utils/catchAsync.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../Service/imageService.js';
import { filterObj } from '../Utils/FilterObj.js';
import ApiFeatures from '../Utils/ApiFeatures.js';
import { IUser } from '../types/userTypes.js';
import { UserQueryType, userQuerySchema } from '../Schemas/userSchema.js';
import SubscriptionModel from '../Models/subscriptionModel.js';

/**
 * Get current user profile with active subscription (if any).
 * @route GET /api/users/me
 * @access Private
 * @returns {object} User object with optional subscription
 * @throws {AppError} If user is not authenticated or operation fails
 */
export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  try {
    // Find user by ID, excluding sensitive fields
    const user = await UserModel.findById(userId, '-password -__v').lean();
    if (!user) {
      return next(new AppError('User not found or deleted', 404));
    }

    // Find active subscription for the user
    const subscription = await SubscriptionModel.findOne({
      userId,
      status: 'active',
    }).select('planType status createdAt updatedAt');

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          ...user,
          subscription: subscription || null,
        },
      },
    });
  } catch (error) {
    return next(new AppError('Failed to fetch user profile', 500));
  }
});

/**
 * Update current user profile
 */
export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Prevent password update
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /update-password', 400));
  }

  // Filter out unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email', 'phoneNumber', 'gender');

  // Handle profile picture upload
  if (req.file) {
    const cloudinaryResult = await uploadToCloudinary(req.file, 'profile-pictures');
    
    // If user already has a profile picture, delete the old one
    if (req.user?.profilePicture) {
      const publicId = req.user.profilePicture.split('/').pop()?.split('.')[0];
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    filteredBody.profilePicture = cloudinaryResult.secure_url;
  }

  // Update user
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user?._id, 
    filteredBody, 
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

/**
 * Delete current user account (soft delete)
 */
export const deleteMe = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  await UserModel.findByIdAndUpdate(req.user?._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Get all users (admin only)
 */
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const queryParams: UserQueryType = userQuerySchema.parse(req.query);

  const features = new ApiFeatures<IUser>(UserModel.find(), queryParams)
  .filter()
  .sort()
  .paginate();

// Execute query
const { results: users, total, page, limit } = await features.execute();

if (!users || users.length === 0) {
  return next(new AppError('No users found', 404));
}

res.status(200).json({
  status: 'success',
  results: users.length,
  total,
  page,
  limit,
  data: { users },
});
});

/**
 * Get all users (admin only)
 */
export const getAllTrainer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Validate and coerce query params, then force role=trainer
  const queryParams: UserQueryType = userQuerySchema.parse({ ...req.query, role: 'trainer' });

  const features = new ApiFeatures<IUser>(UserModel.find(), queryParams)
    .filter()
    .sort()
    .paginate();

  const { results: trainers, total, page, limit } = await features.execute();

  if (!trainers || trainers.length === 0) {
    return next(new AppError('No trainers found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: trainers.length,
    total,
    page,
    limit,
    data: { trainers },
  });
});

/**
 * Get a specific user by ID (admin only)
 */
export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

/**
 * Update user by ID (admin only)
 */
export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Prevent certain updates
  const filteredBody = filterObj(req.body, 'name', 'email', 'role', 'phoneNumber', 'gender');

  const user = await UserModel.findByIdAndUpdate(
    req.params.id, 
    filteredBody, 
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

/**
 * Delete user by ID (admin only)
 */
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Delete profile picture from Cloudinary if exists
  if (user.profilePicture) {
    const publicId = user.profilePicture.split('/').pop()?.split('.')[0];
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
