
import { ProductsResponse } from "../types/productTypes";
import { useQuery } from "@tanstack/react-query";
import { useProductsStore } from "@/features/Products/store/productsStore";
import { getProductsByType } from "../services/productService";



export function useProductsQuery() {
  const { type, limit, page, search } = useProductsStore();
  const term = (search || '').trim();
  const effectiveSearch = term.length >= 2 ? term : undefined;
  return useQuery<ProductsResponse>({
    queryKey: ["products", { type, limit, page, search }],
    queryFn: () => getProductsByType(type, limit, page, effectiveSearch),
    placeholderData: (prev) => prev,
    staleTime: 10_000,
  });
}