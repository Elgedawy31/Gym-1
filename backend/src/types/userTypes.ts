import { Model } from "mongoose";
import { ZodError } from "zod";

/**
 * Interface for User document properties
 */
export interface IUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string; // Changed to CamelCase from "phone"
  profilePicture: string; // Changed to CamelCase from "profilePic"
  role: 'admin' | 'trainer' | 'member';
  gender: 'male' | 'female' | 'other';
  createdAt?: Date;
  updatedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

/**
 * Interface for User methods
 */
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateResetToken(): string;
}

/**
 * Interface for User Model (static methods)
 */
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  validateUser(data: Partial<IUser>): { success: boolean; data?: IUser; error?: ZodError };
}