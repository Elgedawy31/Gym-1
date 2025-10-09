import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProductService, deleteProduct, getAllProductsService } from "../service/dashboardProductsService";
import { Product, ProductsResponse } from "@/features/Products/types/productTypes";
import { ProductRequest } from "../types";

export function useGetAllProducts(page: number, type?: string) {
  return useQuery<ProductsResponse>({
    queryKey: ["dashboard-products", { page, type }],
    queryFn: () => getAllProductsService(page, type),
    staleTime: 10_000,
  });
}


export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, FormData>({
    mutationFn: (formData) => createProductService(formData),
    onSuccess: () => {
      // Invalidate and refetch dashboard products after creation
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
    },
    onError: (error) => {
      // Optionally, you can show a toast or log the error
      console.error("Error creating product:", error);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, { productId: string; formData: FormData }>({
    mutationFn: ({ productId, formData }) => 
      import("../service/dashboardProductsService").then(mod => mod.updateProductService(productId, formData)),
    onSuccess: () => {
      // Invalidate and refetch dashboard products after update
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
    },
    onError: (error) => {
      // Optionally, you can show a toast or log the error
      console.error("Error updating product:", error);
    },
  });
}


export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      // Invalidate and refetch dashboard products after deletion
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
    },
  });
}
