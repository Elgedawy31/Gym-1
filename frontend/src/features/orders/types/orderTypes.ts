import { Product } from '@/features/Products/types/productTypes';

export interface OrderItem {
  productId: string | Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  fullName: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled';
  shippingAddress: ShippingAddress;
  totalItems?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  fullName: string;
  shippingAddress: ShippingAddress;
}

export interface OrderResponse {
  status: string;
  data: {
    order: Order;
  };
}

export interface OrdersResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  data: {
    orders: Order[];
  };
}
