import { catchAsync } from '../Utils/catchAsync.js';
import { Request, Response, NextFunction } from 'express';
import OrderModel from '../Models/orderModel.js';
import CartModel from '../Models/cartModel.js';
import { IOrder, OrderQueryType, createOrderSchema, orderIdSchema, orderQuerySchema, updateOrderStatusSchema } from '../types/orderTypes.js';
import { AppError } from '../Utils/AppError.js';
import { IProduct } from '../types/productsTypes.js';
import { ZodError } from 'zod';
import ApiFeatures from '../Utils/ApiFeatures.js';

/**
 * Creates a new order from the user's cart and clears the cart.
 * @route POST /api/orders
 * @access Private
 * @returns {object} Created order object
 * @throws {AppError} If user is not authenticated, cart is empty, or operation fails
 */
export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  try {
    // Validate shippingAddress using Zod
    const { fullName, shippingAddress } = createOrderSchema.parse(req.body);

    // Find user's cart
    const cart = await CartModel.findOne({ userId: userId.toString()}).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty or not found', 404));
    }

    // Map cart items to order items
    const items = cart.items.map((item) => ({
      productId: (item.productId as IProduct)._id,
      quantity: item.quantity,
      price: (item.productId as IProduct).price,
    }));

    // Create order
    const order = await OrderModel.create({
      fullName,
      userId,
      items,
      status: 'pending',
      shippingAddress,
    });

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    // Populate product details for response
    const populatedOrder = await OrderModel.findById(order._id).populate('items.productId', 'name price imageUrl category stock');

    res.status(201).json({
      status: 'success',
      data: { order: populatedOrder },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map((e) => e.message).join(", ");
      return next(new AppError(`Validation error: ${issues}`, 400));
    }
    return next(new AppError('Failed to create order', 500));
  }
});

/**
 * Gets all orders for the authenticated user or a specific order by ID.
 * @route GET /api/orders/:orderId?
 * @access Private
 * @returns {object} Array of orders or a single order with populated product details
 * @throws {AppError} If user is not authenticated, orderId is invalid, or order is not found
 */
export const getMyOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const orders = await OrderModel.find({userId});
  if (!orders) {
    return next(new AppError('Orders not found or you do not have access to it', 404));
  }

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders },
  })
})

/**
 * Gets a specific order by ID for the authenticated user with populated product details.
 * @route GET /api/orders/:orderId
 * @access Private
 * @returns {object} Order object with populated product details
 * @throws {AppError} If user is not authenticated, orderId is invalid, order not found, or operation fails
 */
export const getOrderById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const {orderId} = req.params;
  if (!orderId || !/^[0-9a-fA-F]{24}$/.test(orderId)) {
    return next(new AppError('Valid Order ID is required', 400));
  }

  const order = await OrderModel.findById(orderId).populate(
    'items.productId',
    'name price imageUrl category stock'
  );

  if (!order) {
    return next(new AppError('Order not found or you do not have access to this order', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });

})

/**
 * Gets all orders in the system with optional status filtering (Admin only).
 * Supports filtering, sorting, pagination, and field limiting via APIFeatures.
 * @route GET /api/admin/orders
 * @access Private (Admin only)
 * @returns {object} Array of all orders with populated product and user details
 * @throws {AppError} If user is not authenticated, not an admin, or operation fails
 */
export const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const queryParams: OrderQueryType = orderQuerySchema.parse(req.query);


  const features = new ApiFeatures<IOrder>( OrderModel.find(), queryParams)
    .filter()
    .sort()
    .paginate();

    const { results: orders, total, page, limit } = await features.execute();

    if (!orders || orders.length === 0) {
      return next(new AppError('No orders found', 404));
    }

    // Execute query

    res.status(200).json({
      status: 'success',
      results: orders.length,
      total,
      page,
      limit,
      data: { orders },
    });
});

/**
 * Updates the status of a specific order (Admin only).
 * @route PATCH /api/admin/orders/:orderId
 * @access Private (Admin only)
 * @returns {object} Updated order object with populated product details
 * @throws {AppError} If user is not authenticated, not an admin, orderId is invalid, status is invalid, or operation fails
 */
export const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate orderId and status using Zod
    const { orderId } = orderIdSchema.parse(req.params);
    const { status } = updateOrderStatusSchema.parse(req.body);

    // Find order by ID, ensuring it is not soft-deleted
    const order = await OrderModel.findOne({ _id: orderId});
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Update status
    order.status = status;
    await order.save();

    // Populate product details for response
    const populatedOrder = await OrderModel.findById(order._id)
      .populate('items.productId', 'name price imageUrl category stock')
      .populate('userId', 'name email');

    res.status(200).json({
      status: 'success',
      data: { order: populatedOrder },
    });
  } catch (error) {
    console.log(error);
    
    if (error instanceof ZodError) {
      const issues = error.issues.map((e) => e.message).join(", ");
      return next(new AppError(`Validation error: ${issues}`, 400));
    }
    return next(new AppError('Failed to update order status', 500));
  }
});