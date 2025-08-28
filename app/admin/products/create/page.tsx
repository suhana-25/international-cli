import { Suspense } from 'react'
import CreateProductClient from './create-product-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function CreateProductPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateProductClient />
    </Suspense>
  )
} 
