'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { useCreateProduct } from '../../hooks/dashboardProducts';
import ProductForm from '../organisms/ProductForm';

export default function CreateProductTemplate() {
  const { mutateAsync } = useCreateProduct();

  return (
    <ProductForm
      title="Create Product"
      submitLabel="Create Product"
      onSubmit={async (formData) => await mutateAsync(formData)}
    />
  );
}
