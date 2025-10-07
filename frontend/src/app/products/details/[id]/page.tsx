'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { useProductQuery } from '@/features/Products/hooks/useProduct';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useCartStore } from '@/features/cart/store/cartStore';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data, isPending, error } = useProductQuery(id);
  const addToCart = useAddToCart();
  const { addItem, getItemQuantity } = useCartStore();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-t-4 border-primary border-t-primary-foreground rounded-full"></div>
          <p className="text-lg font-semibold text-foreground animate-pulse">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data?.product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const product = data.data.product;
  const images = [product.imageUrl]; // In a real app, you might have multiple images

  const handleAddToCart = () => {
    // Add to Zustand store immediately for optimistic UI
    addItem({
      productId: product._id,
      quantity: quantity,
      price: product.price
    });
    
    // Then sync with server
    addToCart.mutate({
      productId: product._id,
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { productId: product._id, quantity });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-square relative overflow-hidden rounded-lg border"
          >
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Category Badge */}
          <div className="inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold w-fit">
            {product.category}
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-primary">${product.price}</span>
            {product.stock > 0 ? (
              <div className="inline-flex items-center rounded-full border border-green-600 text-green-600 px-2.5 py-0.5 text-xs font-semibold">
                In Stock ({product.stock})
              </div>
            ) : (
              <div className="inline-flex items-center rounded-full border border-transparent bg-destructive text-destructive-foreground px-2.5 py-0.5 text-xs font-semibold">
                Out of Stock
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Quantity:</label>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCart.isPending}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex-shrink-0"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="w-full"
            size="lg"
          >
            Buy Now
          </Button>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-primary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="w-4 h-4 text-primary" />
              <span>Easy Returns</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 space-y-8"
      >
        {/* Product Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Category:</span>
                <span className="ml-2 capitalize">{product.category}</span>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <span className="ml-2 capitalize">{product.type}</span>
              </div>
              <div>
                <span className="font-medium">Stock:</span>
                <span className="ml-2">{product.stock} units</span>
              </div>
              <div>
                <span className="font-medium">SKU:</span>
                <span className="ml-2">{product._id.slice(-8)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
