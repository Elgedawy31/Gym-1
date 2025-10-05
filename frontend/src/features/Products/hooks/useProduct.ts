import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/productService";

export function useProductQuery(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 10_000,
  });
}
