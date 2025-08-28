import { Suspense } from 'react'
import { Metadata } from 'next'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Customer Order - Nitesh Handicraft',
  description: 'Customer order management',
}

function CustomerOrderPageContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Orders</h1>
      <p className="text-gray-600">Customer order management will be available here soon.</p>
    </div>
  )
}

export default function CustomerOrderPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CustomerOrderPageContent />
    </Suspense>
  )
}
