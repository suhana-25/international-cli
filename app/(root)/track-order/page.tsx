import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Order - Nitesh Handicraft',
  description: 'Track your order status',
}

export default function TrackOrderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Track Your Order</h1>
      <p className="text-gray-600">Order tracking functionality will be available here soon.</p>
    </div>
  )
}
