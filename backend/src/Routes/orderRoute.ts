// routes/orderRoutes.ts
import { Router } from 'express';
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from '../Controllers/orderController.js';
import { protect, restrictTo } from '../Middlewares/auth.middleware.js';

const router = Router();
router.use(protect);

/**
 * @route POST /api/orders
 * @description Create a new order from the user's cart with shipping address.
 * @access Private
 */
router.post('/', createOrder);

/**
 * @route GET /api/orders
 * @description Get all orders for the authenticated user with populated product details.
 * @access Private
 */
router.get('/me', getMyOrders);

/**
 * @route GET /api/orders/:orderId
 * @description Get a specific order by ID for the authenticated user with populated product details.
 * @access Private
 */
router.get('/:orderId', getOrderById);

// Admin routes
router.use('/admin', restrictTo('admin'));

/**
 * @route GET /api/admin/orders
 * @description Get all orders in the system with optional status filtering (Admin only).
 * @access Private (Admin only)
 */
router.get('/', getAllOrders);

/**
 * @route PATCH /api/admin/orders/:orderId
 * @description Update the status of a specific order (Admin only).
 * @access Private (Admin only)
 */
router.patch('/:orderId', updateOrderStatus);

export default router;