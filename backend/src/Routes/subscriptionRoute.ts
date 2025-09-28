// routes/subscriptionRoutes.ts
import { Router } from 'express';
import { protect, restrictTo } from '../Middlewares/auth.middleware.js';
import { createSubscription, getAllSubscriptions, getMySubscription, updateSubscription } from '../Controllers/subscriptionController.js';

const router = Router();

/**
 * @description Subscription routes for managing user subscriptions.
 * @access Private (all routes require authentication)
 */
router.use(protect);

/**
 * @route POST /api/subscriptions
 * @description Create a new subscription for the authenticated user.
*/
router.post('/', createSubscription);

/**
 * @route GET /api/subscriptions
 * @description Get all subscription for the authenticated user.
*/
router.get('/',restrictTo('admin'), getAllSubscriptions);

/**
 * @route PATCH /api/subscriptions/:id
 * @description Update subscription for the authenticated user.
*/
router.patch('/:id', updateSubscription);

/**
 * @route GET /api/subscriptions/me
 * @description Get the authenticated user's active subscription.
 */
router.get('/me', getMySubscription);

export default router;