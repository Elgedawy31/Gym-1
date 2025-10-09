import { Order } from "../orders/types/orderTypes";

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
