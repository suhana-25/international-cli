import { Suspense } from 'react'
import { ProductDetailClient } from './product-detail-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductDetailClient />
    </Suspense>
  )
} 