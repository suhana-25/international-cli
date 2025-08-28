import { Suspense } from 'react'
import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import OrdersClient from './orders-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: `Admin Orders - ${APP_NAME}`,
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">View and manage all customer orders</p>
        </div>
        
        <OrdersClient />
      </div>
    </Suspense>
  )
}
