import { Suspense } from 'react'
import PlaceOrderClient from './place-order-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: `Review Order - ${APP_NAME}`,
}

export default function PlaceOrderPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PlaceOrderClient />
    </Suspense>
  )
}

