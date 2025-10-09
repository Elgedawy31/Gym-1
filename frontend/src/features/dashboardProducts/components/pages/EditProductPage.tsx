import EditProductTemplate from '../templates/EditProductTemplate'

export default function EditProductPage({productId}:{productId: string}) {
  return (
    <div className='p-8'>
      <EditProductTemplate productId={productId}/>
    </div>
  )
}
