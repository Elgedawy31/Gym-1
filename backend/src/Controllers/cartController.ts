import { NextFunction, Request, Response } from 'express';
import { AppError } from "../Utils/AppError.js";
import { catchAsync } from "../Utils/catchAsync.js";
import { ZodError } from 'zod';
import { addToCartSchema } from '../types/cartTypes.js';
import ProductModel from '../Models/productsModel.js';
import CartModel from '../Models/cartModel.js';


const recalculateTotal = (items: { quantity: number; price: number }[]) => items.reduce((sum, i) => sum + i.quantity * i.price, 0);

/**
 * Adds a product to the user's cart or updates the quantity if it already exists.
 * @route POST /api/cart
 * @access Private
 * @returns {object} Updated cart object
 * @throws {AppError} If productId is invalid, product is not found, stock is insufficient, or operation fails
 */
export const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  try {
    // Validate request body using Zod
    const { productId, quantity = 1 } = addToCartSchema.partial({quantity: true}).parse(req.body);

    // Check if product exists and has sufficient stock
    const product = await ProductModel.findById( productId );
    if (!product) {
      return next(new AppError('Product not found or has been deleted', 404));
    }
    if (product.stock < quantity) {
      return next(new AppError(`Insufficient stock. Available: ${product.stock}`, 400));
    }

    const price = product.price;

    // Find or create cart for the user
    let cart = await CartModel.findOne({userId: userId.toString()});
    if (!cart) {
      cart = await CartModel.create({
        userId,
        items: [{ productId, quantity, price }],
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex >= 0 && itemIndex < cart.items.length) {
        const item = cart.items[itemIndex];
        if (item) {
          item.quantity += quantity;
          if (item.quantity > product.stock) {
            return next(new AppError(`Insufficient stock. Available: ${product.stock}`, 400));
          }
        }
      } else {
        cart.items.push({ productId, quantity, price });
      }

      // Validate cart items count
      if (cart.items.length > 10) {
        return next(new AppError('Cart cannot contain more than 50 items', 400));
      }
      cart.totalPrice = recalculateTotal(cart.items);
      await cart.save();
    }

    // Populate product details for response
    const populatedCart = await CartModel.findById(cart._id).populate('items.productId', 'name price imageUrl');

    res.status(200).json({
      status: 'success',
      data: { cart: populatedCart },
    });
    
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map((e) => e.message).join(", ");
      return next(new AppError(`Validation error: ${issues}`, 400));
    }
    return next(new AppError('Failed to add product to cart', 500));
  }
})

/**
 * Gets the authenticated user's cart with populated product details.
 * @route GET /api/cart
 * @access Private
 * @returns {object} Cart object with populated product details
 * @throws {AppError} If user is not authenticated or cart is not found
 */
export const getCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  // Find user's cart, excluding soft-deleted ones
  const cart = await CartModel.findOne({ userId}).populate(
    'items.productId',
    'name price imageUrl category stock'
  );
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
})

/**
 * Updates the quantity of a specific product in the user's cart.
 * @route PATCH /api/cart
 * @access Private
 * @returns {object} Updated cart object with populated product details
 * @throws {AppError} If user is not authenticated, productId is invalid, product is not in cart, or operation fails
 */
export const updateCartItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

  const { productId } = req.params;
  if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
    return next(new AppError('Valid subscription ID is required', 400));
  }

    // Validate request body using Zod
    const { quantity } = req.body;

    // Check if product exists and is not soft-deleted
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return next(new AppError('Product not found or has been deleted', 404));
    }

    // Check if stock is sufficient
    if (product.stock < quantity) {
      return next(new AppError(`Insufficient stock for this product. Available: ${product.stock}`, 400));
    }

    // Find user's cart
    const cart = await CartModel.findOne({ userId: userId.toString()});
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    // Find product in cart
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex >= 0 && itemIndex < cart.items.length) {
      const item = cart.items[itemIndex];
      if (item) {
        item.quantity = quantity;
        if (item.quantity > product.stock) {
          return next(new AppError(`Insufficient stock. Available: ${product.stock}`, 400));
        }
      }
    }
    // Update quantity
    // cart.items[itemIndex].quantity = quantity;

    cart.totalPrice = recalculateTotal(cart.items);
  // Save updated cart
    await cart.save();

    // Populate product details for response
    const populatedCart = await CartModel.findById(cart._id).populate('items.productId', 'name price imageUrl category stock');

    res.status(200).json({
      status: 'success',
      data: { cart: populatedCart },
    });
});

/**
 * Removes a specific product from the user's cart.
 * @route DELETE /api/cart
 * @access Private
 * @returns {object} Updated cart object with populated product details
 * @throws {AppError} If user is not authenticated, productId is invalid, product is not in cart, or operation fails
 */
export const removeFromCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }

    // Validate ProductId
    const { productId } = req.params;
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      return next(new AppError('Valid subscription ID is required', 400));
    }

    // Find user's cart
    const cart = await CartModel.findOne({ userId: userId.toString() });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    // Find product in cart
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex < 0) {
      return next(new AppError('Product not found in cart', 404));
    }

    // Remove product from cart
    cart.items.splice(itemIndex, 1);

    // Save updated cart
    await cart.save();

    // Populate product details for response
    const populatedCart = await CartModel.findById(cart._id).populate('items.productId', 'name price imageUrl category stock');

    res.status(200).json({
      status: 'success',
      data: { cart: populatedCart },
    });

});

/**
 * Clears all items from the user's cart (e.g., after placing an order).
 * @route DELETE /api/cart/clear
 * @access Private
 * @returns {object} Success message
 * @throws {AppError} If user is not authenticated, cart is not found, or operation fails
 */
export const clearCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId.toString())) {
    return next(new AppError('User not authenticated or invalid user ID', 401));
  }


    const cart = await CartModel.findOne({ userId: userId.toString() });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    // Clear all items
    cart.items = [];
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
    });
});