import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Product } from '@/features/Products/types/productTypes'
import dayjs from 'dayjs'
import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type ProductsTableProps = {
  filteredProducts: Product[];
  deleteProduct: (id: string) => void;
};

export default function ProductsTable({filteredProducts, deleteProduct}: ProductsTableProps) {
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.length ? (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className='flex gap-4 items-center'>
                    <div className="w-14 h-14 rounded-2xl relative">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          P
                        </div>
                      )}
                    </div>
                    <h1 className='font-medium'>{product.name}</h1>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{product.type}</TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{dayjs(product.createdAt).format()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/products/edit-product/${product._id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => deleteProduct(product._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
