// routes/trainerSubscriptionRoutes.ts
import { Router } from 'express';
import { protect, restrictTo } from '../Middlewares/auth.middleware.js';
import {
  createTrainerSubscription,
  getUserSubscriptions,
  getTrainerSubscriptions,
  updateSubscriptionStatus,
  deleteSubscription,
} from '../Controllers/trainerSubscriptionController.js';
import { getAllSubscriptions } from '../Controllers/subscriptionController.js';

const router = Router();
router.use(protect);

/**
 * @route POST /api/trainer-subscriptions
 * @description Create a new trainer subscription.
 * @access Private
 */
router.post('/', createTrainerSubscription);

/**
 * @route GET /api/trainer-subscriptions/me
 * @description Get all subscriptions for the authenticated user.
 * @access Private
 */
router.get('/me', getUserSubscriptions);

/**
 * @route GET /api/trainer-subscriptions
 * @description Get all subscriptions for the authenticated trainer.
 * @access Private (Trainer only)
 */
router.get('/trainer', restrictTo('trainer'), getTrainerSubscriptions);

/**
 * @route GET /api/trainer-subscriptions/all
 * @description Get all trainer subscriptions (Admin only).
 * @access Private (Admin only)
 */
router.get('/all', restrictTo('admin'), getAllSubscriptions);

/**
 * @route PATCH /api/trainer-subscriptions/:id
 * @description Update the status of a trainer subscription.
 * @access Private (Subscription owner or Admin)
 */
router.patch('/:id', updateSubscriptionStatus);

/**
 * @route DELETE /api/trainer-subscriptions/:id
 * @description Delete a trainer subscription.
 * @access Private (Subscription owner or Admin)
 */
router.delete('/:id', deleteSubscription);

export default router;