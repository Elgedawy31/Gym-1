import { Request, Response, NextFunction } from 'express';
import UserModel from '../Models/userModel.js';
import { AppError } from '../Utils/AppError.js';
import { catchAsync } from '../Utils/catchAsync.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../Service/imageService.js';
import { filterObj } from '../Utils/FilterObj.js';

/**
 * Get current user profile
 */
export const getMe = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const user = await UserModel.findById(req.user?._id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
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
export const getAllUsers = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const users = await UserModel.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
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
