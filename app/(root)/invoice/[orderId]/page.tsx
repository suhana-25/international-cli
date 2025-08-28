import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// import { auth } from '@/auth' // Removed - using custom auth
import { getOrderById } from '@/lib/order-store'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Invoice - ${APP_NAME}`,
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const resolvedParams = await params
  // const session = null // Skip auth check - using custom auth system
  
  // Check authentication
  // // if (!session?.user) {
//   //   notFound()
//   // }

  // Get order to verify access
  const order = await getOrderById(resolvedParams.orderId)
  if (!order) {
    notFound()
  }

    // Check authorization - only customer or admin can view
  // const isCustomer = // session.user.id === order.userId
  // const isAdmin = // session.user.role === 'admin'

  // if (!isCustomer && !isAdmin) {
  //   notFound()
  // }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Invoice</h1>
          <p className="text-gray-600">Order ID: {resolvedParams.orderId}</p>
          <p className="text-gray-600">Invoice functionality coming soon...</p>
        </div>
      </div>
    </div>
  )
} 