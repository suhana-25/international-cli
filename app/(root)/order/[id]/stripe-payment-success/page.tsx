import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'

import { Button } from '@/components/ui/button'
import { getOrderById } from '@/lib/actions/order.actions'
import { APP_NAME } from '@/lib/constants'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const metadata: Metadata = {
  title: `Stripe Payment Success - ${APP_NAME}`,
}

export default async function SuccessPage({
  searchParams,
  params,
}: {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ payment_intent: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const order = await getOrderById(resolvedParams.id)
  if (!order) notFound()

  const paymentIntent = await stripe.paymentIntents.retrieve(
    resolvedSearchParams.payment_intent
  )
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  )
    return notFound()

  const isSuccess = paymentIntent.status === 'succeeded'
  if (!isSuccess) return redirect(`/order/${resolvedParams.id}`)

  // Add this check before using Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  let resend: Resend | null = null;
  if (resendApiKey) {
    resend = new Resend(resendApiKey);
  } else {
    // Optionally log or mock for non-production
    // console.warn('RESEND_API_KEY not set, skipping Resend integration.');
  }
  // Use 'resend' only if it's not null

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center ">
        <h1 className="h1-bold">Thanks for your purchase</h1>
        <div>We are now processing your order.</div>
        <Button asChild>
          <Link href={`/order/${resolvedParams.id}`}>View order</Link>
        </Button>
      </div>
    </div>
  )
}
