'use client';

import { useUpdateProduct } from '../../hooks/dashboardProducts';
import ProductForm from '../organisms/ProductForm';
import { useProductQuery } from '@/features/Products/hooks/useProduct';

export default function EditProductTemplate({productId}: {productId: string}) {


  const { data: productData, isLoading: loadingProduct } = useProductQuery(productId);
  const { mutateAsync } = useUpdateProduct();

  const product = productData?.data.product;

  const allowedCategories = ['equipment', 'supplements', 'clothing', 'other'] as const;
  const initialValues = product
    ? {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        type: product.type as 'women' | 'men' | 'general',
        category: allowedCategories.includes(product.category as any)
          ? (product.category as (typeof allowedCategories)[number])
          : undefined,
      }
    : undefined;

  if (loadingProduct) return <div>Loading...</div>;

  return (
    <ProductForm
      title="Edit Product"
      submitLabel="Update Product"
      initialValues={initialValues}
      previewImageUrl={product?.imageUrl}
      onSubmit={async (formData) => await mutateAsync({ productId, formData })}
    />
  );
}
