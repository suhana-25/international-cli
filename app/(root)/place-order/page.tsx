import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import PlaceOrderForm from './place-order-form'

export const metadata: Metadata = {
  title: `Review Order - ${APP_NAME}`,
}

export default function PlaceOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-poppins font-bold text-foreground mb-3 tracking-tight">Review Your Order</h1>
            <p className="text-muted-foreground font-inter">
              Please review your order details before proceeding to payment
            </p>
          </div>
          <PlaceOrderForm />
        </div>
      </div>
    </div>
  )
}

