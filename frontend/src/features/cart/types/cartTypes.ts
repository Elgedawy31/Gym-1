import { Product } from '@/features/Products/types/productTypes';

export interface CartItem {
  productId: string | Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalItems?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  status: string;
  data: {
    cart: Cart;
  };
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
