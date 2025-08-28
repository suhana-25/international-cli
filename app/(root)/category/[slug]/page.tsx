import { Suspense } from 'react'
import { CategoryPageClient } from './category-page-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function CategoryPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CategoryPageClient />
    </Suspense>
  )
}
