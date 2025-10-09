import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../Utils/catchAsync.js";
import UserModel from "../Models/userModel.js";
import ProductModel from "../Models/productsModel.js";
import OrderModel from "../Models/orderModel.js";
import SubscriptionModel from "../Models/subscriptionModel.js";
import WorkoutPlanModel from "../Models/workoutPlanModel.js";
import TrainerSubscriptionModel from "../Models/trainerSubscriptionModel.js";
import CartModel from "../Models/cartModel.js";

export const getDashboardStats = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const users = await UserModel.countDocuments();
  const trainers = await UserModel.countDocuments({ role: 'trainer' });
  const newCustomers = await UserModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
  const activeAccounts = await UserModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
  const products = await ProductModel.countDocuments();
  const orders = await OrderModel.countDocuments();
  const subscriptions = await SubscriptionModel.countDocuments();
  const trainerSubscriptions = await TrainerSubscriptionModel.countDocuments();
  const workoutPlans = await WorkoutPlanModel.countDocuments();
  const carts = await CartModel.countDocuments();
  const stats = {
    users,
    trainers,
    newCustomers,
    activeAccounts,
    products,
    orders,
    subscriptions,
    trainerSubscriptions,
    workoutPlans,
    carts,
  };

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});