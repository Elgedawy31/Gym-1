import { Router } from 'express';
import { protect, restrictTo } from '../Middlewares/auth.middleware.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../Controllers/productController.js';

const router = Router();
router.use(protect);

/**
 * @route POST /api/products
 * @description Create a new product.
 * @access Private (Admin only)
 */
router.post('/', restrictTo('admin'), createProduct);

/**
 * @route GET /api/products
 * @description Get all products with optional filtering and pagination.
 * @access Public
 */
router.get('/', getAllProducts);

/**
 * @route GET /api/products/:productId
 * @description Get a product by ID.
 * @access Public
 */
router.get('/:productId', getProductById);

/**
 * @route PATCH /api/products/:productId
 * @description Update a product by ID.
 * @access Private (Admin only)
 */
router.patch('/:productId', protect, restrictTo('admin'), updateProduct);

/**
 * @route DELETE /api/products/:productId
 * @description Delete a product by ID.
 * @access Private (Admin only)
 */
router.delete('/:productId', protect, restrictTo('admin'), deleteProduct);

export default router;