
import { ProductsResponse } from "../types/productTypes";
import { useQuery } from "@tanstack/react-query";
import { useProductsStore } from "@/features/Products/store/productsStore";
import { getProductsByType } from "../services/productService";



export function useProductsQuery() {
  const { type, limit, page, category } = useProductsStore();
  const effectiveCategory = category || undefined;
  return useQuery<ProductsResponse>({
    queryKey: ["products", { type, limit, page, category }],
    queryFn: () => getProductsByType(type, limit, page, effectiveCategory),
    placeholderData: (prev) => prev,
    staleTime: 10_000,
  });
}

