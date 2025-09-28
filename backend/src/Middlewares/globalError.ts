// src/middlewares/globalError.ts
import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../Utils/AppError.js';

export const globalError = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('🚨 Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
  return; // Explicitly return to ensure all code paths return a value
};