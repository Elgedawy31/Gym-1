import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserMethods, IUserModel } from "../types/userTypes.js";
import { userValidationSchema } from '../Schemas/userSchema.js';
import * as crypto from 'crypto';

// Mongoose schema
const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Prevent password from being returned in queries
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'trainer', 'member'],
        message: 'Role must be admin, trainer, or member',
      },
      default: 'member',
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['male', 'female', 'other'],
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);


// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
userSchema.methods.generateResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

// Static method to validate user data
userSchema.statics.validateUser = (data: Partial<IUser>) => {
  return userValidationSchema.safeParse(data);
};

const UserModel = model<IUser>("User", userSchema);

export default UserModel;