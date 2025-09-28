import { NextFunction, Response, Request } from "express";
import { catchAsync } from "../Utils/catchAsync.js";
import { productSchema } from "../Schemas/productSchema.js";
import ProductModel from "../Models/productsModel.js";
import { AppError } from "../Utils/AppError.js";
import { ZodError } from "zod";
import ApiFeatures from "../Utils/ApiFeatures.js";
import { ProductQueryType, productQuerySchema } from '../Schemas/productQuery.js';
import { IProduct } from "../types/productsTypes.js";

/**
 * Creates a new product in the database.
 * @route POST /api/products
 * @access Private (Admin only)
 */
export const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body using Zod
    const data = productSchema
      .omit({ createdAt: true, updatedAt: true }) // Exclude timestamps
      .parse(req.body);

    // Create product in database
    const product = await ProductModel.create(data);

    res.status(201).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map((e) => e.message).join(", ");
      return next(new AppError(`Validation error: ${issues}`, 400));
    }
    return next(new AppError('Failed to create product', 500));
  }
});

/**
 * Gets all products with optional filtering, sorting, and pagination.
 * Accessible to everyone (public endpoint).
 * @route GET /api/products
 * @access Public
 */
export const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate query parameters using Zod
    const queryParams: ProductQueryType = productQuerySchema.parse(req.query);

    // Build query with ApiFeatures
    const features = new ApiFeatures<IProduct>(ProductModel.find(), queryParams)
      .filter()
      .sort()
      .paginate();

    // Execute query
    const { results: products, total, page, limit } = await features.execute();

    if (!products || products.length === 0) {
      return next(new AppError('No products found', 404));
    }

    res.status(200).json({
      status: 'success',
      results: products.length,
      total,
      page,
      limit,
      data: { products },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map((e) => e.message).join(", ");
      return next(new AppError(`Validation error: ${issues}`, 400));
    }
    return next(new AppError('Failed to fetch products', 500));
  }
});

/**
 * Get product by id.
 * Accessible to everyone (public endpoint).
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
    return next(new AppError('Valid subscription ID is required', 400));
  }

  const product = await ProductModel.findById(productId);
  if(!product) return next( new AppError("Product not found", 404));

  res.status(200).json({
    status: 'success',
    data: { product },
  });
})

/**
 * Updates a product by ID with partial data.
 * Accessible to admins only.
 * @route PATCH /api/products/:productId
 * @access Private (Admin only)
 * @returns {object} Updated product object
 * @throws {AppError} If productId is invalid, product is not found, or validation fails
 */
export const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
    return next(new AppError('Valid subscription ID is required', 400));
  }

  // Find and update product, excluding soft-deleted ones
  const product = await ProductModel.findByIdAndUpdate(
    productId,
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new AppError('Product not found or has been deleted', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
})

/**
 * Deletes a product by ID (soft delete if supported, otherwise hard delete).
 * Accessible to admins only.
 * @route DELETE /api/products/:productId
 * @access Private (Admin only)
 * @returns {object} Success message
 * @throws {AppError} If productId is invalid, product is not found, or deletion fails
 */
export const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const { productId } = req.params;
  if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
    return next(new AppError('Valid subscription ID is required', 400));
  }

  const product = await ProductModel.findByIdAndDelete(productId);

  if(!product) return next( new AppError("Product not found", 404))

  res.status(204).json({
    status: 'success',
    message: 'Product deleted successfully',
  });

})