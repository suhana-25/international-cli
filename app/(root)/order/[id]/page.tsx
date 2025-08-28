import Stripe from 'stripe'
import { getOrderById } from '@/lib/order-store'
import { APP_NAME } from '@/lib/constants'
import { notFound } from 'next/navigation'
import OrderDetailsForm from './order-details-form'
// import { auth } from '@/auth' // Removed - using custom auth

export const metadata = {
  title: `Order Details - ${APP_NAME}`,
}

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const resolvedParams = await params
  const session = null // Skip auth check - using custom auth system
  const order = await getOrderById(resolvedParams.id)
  if (!order) notFound()

  let client_secret = null
  if (order.paymentMethod === 'stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.total) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    })
    client_secret = paymentIntent.client_secret
  }

  return (
    <OrderDetailsForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={false}
      stripeClientSecret={client_secret}
    />
  )
}

export default OrderDetailsPage
