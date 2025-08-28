import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import { getOrderById } from '@/lib/order-store'
import { notFound } from 'next/navigation'
import OrderDetailClient from './order-detail-client'

export const metadata: Metadata = {
  title: `Order Details - ${APP_NAME}`,
}

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = await params
  const order = getOrderById(resolvedParams.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600 mt-2">View complete order information</p>
      </div>
      
      <OrderDetailClient order={order} />
    </div>
  )
}
