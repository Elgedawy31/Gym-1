export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  type: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductsResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  data: {
    products: Product[];
  };
}

export interface ProductByIdResponse {
  status: string;
  data: {
    product: Product;
  };
}
