'use client';

import ProductsSection from "@/features/home/components/organisms/ProductsSection";
import Pagination from "@/features/Products/components/templates/pagination";
import { useProductsQuery } from "@/features/Products/hooks/useProducts";
import { useProductsStore } from "../../store/productsStore";
import { Product } from "@/features/Products/types/productTypes";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const PAGE_TITLES: Record<"general" | "men" | "woman", string> = {
  general: "Supplements & Gym Equipment",
  men: "Men's Gym Clothing & Accessories",
  woman: "Women's Gym Clothing & Accessories",
};


export default function ProductsPage() {
  const { type } = useParams<{ type: string }>();

  const { page, setPage, limit, search, setSearch, setType } = useProductsStore();
  const { data, isPending } = useProductsQuery();

  const title = PAGE_TITLES[type];
  useEffect(() => { setType(type as "general" | "men" | "woman"); }, [type, setType]);
  
  const products = data?.data?.products ?? [];
  const total = data?.total ?? 0;

  if(isPending && products.length === 0){
    return(
      <div className="flex justify-center items-center min-h-[500px] bg-card">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-t-4 border-primary border-t-primary-foreground rounded-full"></div>
          <p className="text-lg font-semibold text-foreground animate-pulse">Loading {type}&apos;s Products...</p>
        </div>
      </div>
    )
  }

  if(!isPending && products.length === 0){
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <p className="text-lg font-semibold">No products found.</p>
        {search && (
          <button
            className="px-4 py-2 rounded border"
            onClick={() => { setPage(1); setSearch(""); }}
          >
            Clear search
          </button>
        )}
      </div>
    )
  }

  console.log('====================================');
  console.log(products);
  console.log('====================================');
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          placeholder="Search products..."
          className="w-full max-w-md px-3 py-2 rounded border bg-background text-foreground"
        />
      </div>
      <ProductsSection products={products} title={title}/>
      <Pagination
        currentPage={page}
        totalItems={total}
        pageSize={limit}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}


