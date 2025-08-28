import { Suspense } from 'react'
import ReviewsClient from './reviews-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReviewsClient />
    </Suspense>
  )
} 
