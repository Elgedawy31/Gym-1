import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Types, Document } from 'mongoose';
import UserModel from '../Models/userModel.js';
import { IUser } from '../types/userTypes.js';
import { AppError } from '../Utils/AppError.js';
import { catchAsync } from '../Utils/catchAsync.js';
import crypto from 'crypto';
import { uploadToCloudinary } from '../Service/imageService.js';
import ms from 'ms';
import { sendPasswordResetEmail } from '../Utils/email.js';
import { userValidationSchema } from '../Schemas/userSchema.js';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: Document<unknown, {}, IUser> & IUser & { _id: Types.ObjectId };
    }
  }
}

/**
 * Generates a JWT token for a user
 * @param userId - The user's ID as a string
 * @returns JWT token
 */
export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as ms.StringValue) || "1d", // ✅ cast
    algorithm: "HS256",
  };

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, options);

  return token;
};

/**
 * Sends a response with JWT token and user data
 * @param user - Mongoose document of the user
 * @param statusCode - HTTP status code for the response
 * @param res - Express response object
 */
const createSendToken = (
  user: any, 
  statusCode: number, 
  res: Response
) => {
  const token = generateToken(user._id.toString());

  // Remove password from output
  const userResponse = { ...user.toObject() };
  delete (userResponse as { password?: string }).password;

  res.status(statusCode).json({
    status: 'success',
    data:{
      token,
      user: userResponse 
    }
  });
};


/**
 * Registers a new user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Validate user input
  const validationResult = userValidationSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(new AppError('Invalid user data', 400));
  }

  // Handle profile picture upload
  let profilePictureUrl = '';
  if (req.file) {
    const cloudinaryResult = await uploadToCloudinary(req.file, 'gym-app');
    profilePictureUrl = cloudinaryResult.secure_url;
  }

  // Create new user
  const newUser = await UserModel.create({
    ...req.body,
    profilePicture: profilePictureUrl
  });

  // Send token response
  createSendToken(newUser, 201, res);
});

// Login user
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Find user and check password
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user || !(await (user as any).comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Send token response
  createSendToken(user, 200, res);
});

// Forgot password
export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get user based on email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // Generate reset token
  const resetToken = (user as any).generateResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // Construct reset URL (frontend will handle the reset page)
    const resetUrl = `${process.env.CORS_ORIGINS}/auth/reset-password/${resetToken}`;

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(user.email, resetUrl);

    if (!emailSent) {
      return next(new AppError('There was an error sending the email. Try again later.', 500));
    }

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email'
    });
  } catch (error) {
    // If email sending fails, clear the reset token
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});

// Reset password
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Hash the reset token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token || '')
    .digest('hex');

  // Find user with the reset token and check if token has expired
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  });

  // If token is valid and user exists, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Send token response
  createSendToken(user, 200, res);
});
