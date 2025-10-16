"use client";

import React, { useEffect, useState } from 'react'
import ProductsSection from '../organisms/ProductsSection'
import toast from 'react-hot-toast';
import { Product } from '@/features/Products/types/productTypes';
import { getHomeProductsByType } from '../../hooks/useHome';
import { motion } from 'framer-motion';

export default function MenSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  useEffect(() => {
    async function getTopProducts() {
      setIsPending(true);

      try {
        const res = await getHomeProductsByType("men", 6, 1);
        if(res){
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsPending(false);
      }
    }
    getTopProducts();
  },[])

  if(isPending){
    return(
      <div className="flex justify-center items-center min-h-[500px] bg-card">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-t-4 border-primary border-t-primary-foreground rounded-full"></div>
          <p className="text-lg font-semibold text-card-foreground animate-pulse">Loading Men&apos;s Products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted/50 pt-16 pb-8">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
          Top Products For Men
        </motion.h2>
      </div>
    <ProductsSection products={products} />
  </div>
  )
}
