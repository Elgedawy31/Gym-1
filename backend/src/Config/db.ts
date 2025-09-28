// src/config/db.ts
import mongoose from 'mongoose';
import { AppError } from '../Utils/AppError.js';

export const connectDB = async (): Promise<void> => {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) throw new AppError('MONGO_URL not defined', 500);

  const connect = async (retries = 5, delay = 5000): Promise<void> => {
    try {
      const conn = await mongoose.connect(MONGO_URL, {
        dbName: process.env.DB_NAME,
        maxPoolSize: 10,
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
      console.error(`❌ Connection failed: ${error.message}, Retries: ${retries}`);
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return connect(retries - 1, delay * 2);
      }
      throw new AppError('Failed to connect to MongoDB', 500);
    }
  };

  await connect();
};