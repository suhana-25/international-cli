import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import OrdersClient from './orders-client'

export const metadata: Metadata = {
  title: `Admin Orders - ${APP_NAME}`,
}

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-2">View and manage all customer orders</p>
      </div>
      
      <OrdersClient />
    </div>
  )
}
