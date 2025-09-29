// routes/cartRoutes.ts
import { Router } from 'express';
import { protect } from '../Middlewares/auth.middleware.js';
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '../Controllers/cartController.js';

const router = Router();
router.use(protect);

/**
 * @route POST /api/cart
 * @description Add a product to the user's cart.
 * @access Private
 */
router.post('/', addToCart);

/**
 * @route GET /api/cart
 * @description Get the authenticated user's cart with populated product details.
 * @access Private
 */
router.get('/', getCart);

/**
 * @route PATCH /api/cart
 * @description Update the quantity of a product in the authenticated user's cart.
 * @access Private
 */
router.patch('/', updateCartItem);

/**
 * @route DELETE /api/cart
 * @description Remove a product from the authenticated user's cart.
 * @access Private
 */
router.delete('/', removeFromCart);

/**
 * @route DELETE /api/cart/clear
 * @description Clear all items from the authenticated user's cart.
 * @access Private
 */
router.delete('/clear', clearCart);

export default router;