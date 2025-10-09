import EditProductPage from '@/features/dashboardProducts/components/pages/EditProductPage'
export default async function EditProduct({params}) {
  const { productId } = await params;
  
  return <EditProductPage productId={productId}/>
}
