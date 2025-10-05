'use client';

import ProductsSection from "@/features/home/components/organisms/ProductsSection";
import Pagination from "@/features/Products/components/templates/pagination";
import { useProductsQuery } from "@/features/Products/hooks/useProducts";
import { useProductsStore } from "../../store/productsStore";
import { Product } from "@/features/Products/types/productTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';


const PAGE_TITLES: Record<"general" | "men" | "woman", string> = {
  general: "Supplements & Gym Equipment",
  men: "Men's Gym Clothing & Accessories",
  woman: "Women's Gym Clothing & Accessories",
};


export default function ProductsPage() {
  const { type } = useParams<{ type: string }>();
  const [showFilter, setShowFilter] = useState(false);

  const { page, setPage, limit, category, setCategory, setType } = useProductsStore();
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
        {category && (
          <button
            className="px-4 py-2 rounded border"
            onClick={() => { setPage(1); setCategory(""); }}
          >
            Clear filter
          </button>
        )}
      </div>
    )
  }
  
  return (
    <div>
      <div className="container mx-auto max-w-6xl mt-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          {title}
        </motion.h2>
        
        <div className="flex justify-end mb-2">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background text-foreground hover:bg-accent transition-colors shadow-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
              </svg>
              Filter
              {category && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {category}
                </span>
              )}
            </button>
            
            {showFilter && (
              <div className="absolute right-0 top-full mt-2 w-64 p-4 border rounded-lg bg-card shadow-lg z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Filter by Category</h3>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <select
                  value={category}
                  onChange={(e) => { setPage(1); setCategory(e.target.value); }}
                  className="w-full px-3 py-2 rounded border bg-background text-foreground"
                >
                  <option value="">All Categories</option>
                  <option value="equipment">Equipment</option>
                  <option value="supplements">Supplements</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ProductsSection products={products}/>
      <Pagination
        currentPage={page}
        totalItems={total}
        pageSize={limit}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}


