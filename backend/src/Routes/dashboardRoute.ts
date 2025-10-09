import { Router } from "express";
import { protect, restrictTo } from "../Middlewares/auth.middleware.js";
import { getDashboardStats } from "../Controllers/dashboardController.js";

const router = Router();

router.get("/stats", protect, restrictTo('admin'), getDashboardStats);

export default router;