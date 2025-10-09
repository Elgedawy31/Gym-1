'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useDeleteProduct, useGetAllProducts } from '../../hooks/dashboardProducts';
import Link from 'next/link';
import Pagination from '@/features/mainComponents/Pagination';
import ProductsTable from '../organisms/ProductsTable';
import FilterAndSearchProduct from '../organisms/Filter&SearchProduct';
import { Button } from '@/components/ui/button';


const ProductsTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'men' | 'women' | 'general'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // call API with page & type
  const { data: productsResponse, isLoading } = useGetAllProducts(currentPage, filterType);
  const deleteProduct = useDeleteProduct();

  const products = productsResponse?.data.products ?? [];

  // local search filter (optional)
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [products, searchTerm]);

  const totalPages = productsResponse?.total
    ? Math.ceil(productsResponse.total / productsResponse.limit)
    : 1;

  return (
    <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-xl font-semibold">Products</CardTitle>
      <Link href="/dashboard/products/create-product">
        <Button className="flex items-center gap-2"> 
          <Plus className="h-4 w-4" /> Create Product 
        </Button> 
      </Link>
    </CardHeader>

      <CardContent>
        {/* Filter & Search */}
        <FilterAndSearchProduct searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFilterType={setFilterType} setCurrentPage={setCurrentPage}/>

        {/* Loading */}
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Table */}
            <ProductsTable filteredProducts={filteredProducts} deleteProduct={deleteProduct.mutate}/>

            {/* Pagination */}
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsTemplates;
