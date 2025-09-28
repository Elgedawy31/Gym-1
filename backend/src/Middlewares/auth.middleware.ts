import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/userModel.js';
import { AppError } from '../Utils/AppError.js';
import { catchAsync } from '../Utils/catchAsync.js';
import { IUser } from '../types/userTypes.js';
import { Document, Types } from 'mongoose';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: Document<unknown, {}, IUser> & IUser & { _id: Types.ObjectId };
    }
  }
}

/**
 * Middleware to protect routes by verifying JWT token
 */
export const protect = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  // Get token and check if it exists
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access', 401));
  }

  // Verify token with proper error handling
  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch (_err) {
    return next(new AppError('Invalid or expired token', 401));
  }

  // Check if user still exists
  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists', 401));
  }

  // Attach user to request (cast to avoid union complexity on assignment)
  (req as any).user = currentUser;
  next();
});

/**
 * Middleware to restrict route access to specific roles
 * @param roles - Allowed user roles
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
