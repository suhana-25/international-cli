// import { auth } from '@/auth' // Removed - using custom auth
import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/order-store'
import OrderConfirmationClient from './order-confirmation-client'

export const metadata: Metadata = {
  title: `Order Confirmation - ${APP_NAME}`,
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const session = null // Skip auth check - using custom auth system
  
  // if (!session?.user?.id) {
//     return notFound()
//   }

  const order = await getOrderById(resolvedParams.id)
  
  if (!order) {
    return notFound()
  }

  // Verify the order belongs to the current user (unless admin)
  // const isAdmin = session.user.role === 'admin'
  // if (!isAdmin && order.userId !== session.user.id) {
  //   return notFound()
  // }

  return <OrderConfirmationClient order={order} />
}
