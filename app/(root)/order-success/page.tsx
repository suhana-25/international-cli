import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import OrderSuccessClient from './order-success-client'

export const metadata: Metadata = {
  title: `Order Confirmation - ${APP_NAME}`,
}

interface OrderSuccessPageProps {
  searchParams: Promise<{
    orderId?: string
  }>
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
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
