import { Suspense } from 'react'
import UserOrdersClient from './user-orders-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function UserOrdersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserOrdersClient />
    </Suspense>
  )
}
