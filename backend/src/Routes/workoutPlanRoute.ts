// routes/subscriptionRoutes.ts
import { Router } from 'express';
import { protect, restrictTo } from '../Middlewares/auth.middleware.js';
import { createWorkoutPlan, deleteWorkoutPlan, getAllWorkoutPlans, getSingleWorkoutPlan, getTrainerWorkoutPlans, subscribeToWorkoutPlan, updateWorkoutPlan } from '../Controllers/workoutPlanController.js';

const router = Router();

/**
 * @description Subscription routes for managing user subscriptions.
 * @access Private (all routes require authentication)
 */
router.use(protect);

/**
 * @route POST /api/workout plan
 * @description Create a new workout plan for the authenticated user.
*/
router.post('/', restrictTo("trainer"), createWorkoutPlan);

/**
 * @route PATCH /api/workout-plans/:planId
 * @description Update a workout plan by ID (Trainer only).
 * @access Private (Trainer only)
 */
router.patch('/:planId', restrictTo('trainer'), updateWorkoutPlan);


/**
 * @route GET /api/workout-plans/all
 * @description Get all workout plans with optional filtering and pagination (Admin only).
 * @access Private (Admin only)
 */
router.get('/all', restrictTo('admin'), getAllWorkoutPlans);

/**
 * @route GET /api/workout-plans/trainer/:trainerId
 * @description Get all workout plans for a specific trainer with optional filtering and pagination.
 * @access Private
 */
router.get('/trainer/:trainerId', getTrainerWorkoutPlans);

/**
 * @route GET /api/workout-plans/:planId
 * @description Get a single workout plan by ID.
 * @access Private
 */
router.get('/:planId', getSingleWorkoutPlan);

/**
 * @route DELETE /api/workout-plans/:planId
 * @description Delete a workout plan by ID (Trainer only).
 * @access Private (Trainer only)
 */
router.delete('/:planId', restrictTo('trainer'), deleteWorkoutPlan);

/**
 * @route POST /api/workout-plans/:planId/subscribe
 * @description Subscribe a user to a workout plan by adding their userId to usersSubscribed.
 * @access Private
 */
router.post('/:planId/subscribe', subscribeToWorkoutPlan);


export default router;