// src/app.ts
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectDB } from './Config/db.js';
import { AppError } from './Utils/AppError.js';
import { globalError } from './Middlewares/globalError.js';

// Import Routes
import authRoutes from "./Routes/authRoute.js";
import usersRoutes from "./Routes/userRoute.js";
import subscriptionRoute from "./Routes/subscriptionRoute.js"
import workoutPlanRoute from "./Routes/workoutPlanRoute.js";
import trainerSubscriptionRoute from "./Routes/trainerSubscriptionRoutes.js"
import productRoute from "./Routes/productRoute.js"
import cartRoute from "./Routes/cartRoutes.js";
import orderRoute from "./Routes/orderRoute.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'];

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

// App Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/subscription", subscriptionRoute)
app.use("/api/workout-plan", workoutPlanRoute)
app.use("/api/trainer-subscription", trainerSubscriptionRoute)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)


// Handle undefined routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(globalError);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('⏳ Shutting down server...');
      await mongoose.connection.close();
      server.close(() => {
        console.log('✅ Server and MongoDB connection closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('🚨 Failed to start server:', error);
    process.exit(1);
  }
};

startServer();