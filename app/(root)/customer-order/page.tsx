import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Order - Nitesh Handicraft',
  description: 'Customer order management',
}

export default function CustomerOrderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Orders</h1>
      <p className="text-gray-600">Customer order management will be available here soon.</p>
    </div>
  )
}
