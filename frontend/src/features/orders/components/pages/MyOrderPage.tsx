'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyOrdersQuery } from '../../hooks/useOrder';
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';

export default function MyOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  
  const { data: ordersData, isPending, error } = useMyOrdersQuery();
  const orders = ordersData?.data?.orders || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'canceled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-t-4 border-primary border-t-primary-foreground rounded-full"></div>
          <p className="text-lg font-semibold text-foreground animate-pulse">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              {error ? 'Failed to load orders. Please try again.' : 'You haven\'t placed any orders yet.'}
            </p>
            <div className="flex gap-4">
              <Link href="/products/general">
                <Button size="lg">
                  <Package className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
              {error && (
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
            </p>
          </div>
        </div>
        
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Order placed successfully!</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    
                    <Link href={`/orders/${order._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Items */}
                  <div className="lg:col-span-2">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Items ({order.items.length})
                    </h4>
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item, itemIndex) => {
                        const product = item.productId as any;
                        return (
                          <div key={itemIndex} className="flex gap-3 p-3 border rounded-lg">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-sm line-clamp-1">
                                {product.name}
                              </h5>
                              <p className="text-xs text-muted-foreground capitalize">
                                {product.category}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-sm font-medium">
                                  ${(product.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {order.items.length > 3 && (
                        <div className="text-center py-2">
                          <span className="text-sm text-muted-foreground">
                            +{order.items.length - 3} more items
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{order.fullName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                        <p>{order.shippingAddress.postalCode}</p>
                      </div>
                    </div>

                    {/* Order Total */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Order Total
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="space-y-2">
                      <Link href={`/orders/${order._id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Order Details
                        </Button>
                      </Link>
                      
                      {order.status === 'delivered' && (
                        <Button variant="outline" className="w-full">
                          <Package className="w-4 h-4 mr-2" />
                          Reorder Items
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Continue Shopping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-center"
      >
        <Link href="/products/general">
          <Button variant="outline" size="lg">
            <Package className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
