"use client";

import React from 'react'
import { useGetAllProducts } from '../../hooks/dashboardProducts'
import ProductsTemplates from '../templates/ProductsTemplates';

export default function DashboardProducts() {
  return (
    <div className='py-10 px-6'>
      <ProductsTemplates />
    </div>
  )
}
