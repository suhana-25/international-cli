import { Suspense } from 'react'
import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import OrderSuccessClient from './order-success-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: `Order Confirmation - ${APP_NAME}`,
}

interface OrderSuccessPageProps {
  searchParams: Promise<{
    orderId?: string
  }>
}

async function OrderSuccessPageContent({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams
  const { orderId } = params

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <OrderSuccessClient orderId={orderId} />
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderSuccessPageContent searchParams={searchParams} />
    </Suspense>
  )
}
