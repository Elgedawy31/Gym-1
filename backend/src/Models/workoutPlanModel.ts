// models/workoutPlan.ts
import mongoose, { Schema, Model } from 'mongoose';
import { IWorkoutPlan } from '../types/workoutPlanTypes.js';

/**
 * Sub-schema for exercises within a workout plan.
 */
const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      minlength: [2, 'Exercise name must be at least 2 characters'],
    },
    sets: {
      type: Number,
      required: [true, 'Number of sets is required'],
      min: [1, 'Sets must be at least 1'],
    },
    reps: {
      type: Number,
      required: [true, 'Number of reps is required'],
      min: [1, 'Reps must be at least 1'],
    },
    rest: {
      type: String,
      default: '60s',
      validate: {
        validator: (value: string) => /^\d+s$/.test(value),
        message: 'Rest must be a valid time format (e.g., "60s")',
      },
    },
  },
  { _id: false }
);

/**
 * Mongoose schema for WorkoutPlan model.
 * Defines structure and validation for workout plans.
 */
const workoutPlanSchema: Schema<IWorkoutPlan> = new Schema(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Trainer ID is required'],
      validate: {
        validator: (value: string) => /^[0-9a-fA-F]{24}$/.test(value),
        message: 'Trainer ID must be a valid MongoDB ObjectId',
      },
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    level: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: '{VALUE} is not a valid level',
      },
      required: [true, 'Level is required'],
      default: 'beginner', // Added default
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1'],
      default: 1, // Added default
    },
    exercises: {
      type: [exerciseSchema],
      required: [true, 'At least one exercise is required'],
      validate: {
        validator: (exercises: unknown[]) => exercises.length > 0,
        message: 'Workout plan must include at least one exercise',
      },
    },
    usersSubscribed: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: {
          validator: (value: string) => /^[0-9a-fA-F]{24}$/.test(value),
          message: 'User ID must be a valid MongoDB ObjectId',
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for counting subscribed users
workoutPlanSchema.virtual('subscribedCount').get(function (this: IWorkoutPlan) {
  return this.usersSubscribed.length;
});

// Pre-save hook to validate trainerId
workoutPlanSchema.pre('save', async function (next) {
  if (this.isModified('trainerId')) {
    const user = await mongoose.model('User').exists({ _id: this.trainerId });
    if (!user) {
      return next(new Error('Invalid trainer ID'));
    }
  }
  next();
});

// Pre-save hook to validate usersSubscribed
workoutPlanSchema.pre('save', async function (next) {
  if (this.isModified('usersSubscribed') && this.usersSubscribed.length > 0) {
    const users = await mongoose.model('User').find({ _id: { $in: this.usersSubscribed } });
    if (users.length !== this.usersSubscribed.length) {
      return next(new Error('One or more user IDs in usersSubscribed are invalid'));
    }
  }
  next();
});

// Index for faster queries on trainerId
workoutPlanSchema.index({ trainerId: 1 });

// Mongoose model
const WorkoutPlanModel: Model<IWorkoutPlan> =
  mongoose.models.WorkoutPlan ||
  mongoose.model<IWorkoutPlan>('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlanModel;