'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { CreditCard, CheckCircle, XCircle, Loader } from 'lucide-react'

interface PaymentProcessorProps {
  method: string
  orderId: string
}

export default function PaymentProcessor({ method, orderId }: PaymentProcessorProps) {
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing')
  const [orderData, setOrderData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const { toast } = useToast()

  const paymentMethodNames: { [key: string]: string } = {
    'paypal': 'PayPal',
    'stripe': 'Stripe Payment'
  }

  useEffect(() => {
    processPayment()
  }, [method, orderId])

  const processPayment = async () => {
    try {
      setPaymentStatus('processing')

      // First get order details
      const orderResponse = await fetch(`/api/payment?orderId=${orderId}`)
      const orderResult = await orderResponse.json()

      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to fetch order details')
      }

      setOrderData(orderResult.data)

      // Simulate payment processing delay (2-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Process payment
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: method,
          amount: orderResult.data.total
        }),
      })

      const paymentResult = await paymentResponse.json()

      if (paymentResult.success) {
        setPaymentStatus('success')
        
        // Clear localStorage
        localStorage.removeItem('order-placed')
        localStorage.removeItem('order-id')
        localStorage.removeItem('selected-payment-method')
        localStorage.removeItem('guestShippingAddress')
        localStorage.removeItem('buyNowProduct')

        toast({
          description: 'Payment completed successfully!',
          className: "bg-white border-border text-foreground shadow-lg",
        })

        // Redirect to success page after 3 seconds
        setTimeout(() => {
          router.push(`/order-success?orderId=${orderId}`)
        }, 3000)

      } else {
        throw new Error(paymentResult.message || 'Payment failed')
      }

    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('failed')
      setError((error as Error).message)
      
      toast({
        variant: 'destructive',
        description: 'Payment failed. Please try again.',
      })
    }
  }

  const handleRetry = () => {
    setError('')
    processPayment()
  }

  const handleBackToCart = () => {
    router.push('/cart')
  }

  return (
    <Card className="bg-white border-border">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-foreground">
          <CreditCard className="h-6 w-6" />
          {paymentMethodNames[method] || method} Payment
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {orderData && (
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono text-foreground">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold mt-2">
              <span className="text-foreground">Total Amount:</span>
              <span className="text-foreground">${orderData.total?.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="text-center py-8">
          {paymentStatus === 'processing' && (
            <div className="space-y-4">
              <Loader className="h-16 w-16 animate-spin text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">Processing Payment...</h3>
              <p className="text-muted-foreground">
                Please wait while we process your {paymentMethodNames[method]} payment.
                <br />
                Do not close this page.
              </p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-success mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">Payment Successful!</h3>
              <p className="text-muted-foreground">
                Your payment has been processed successfully.
                <br />
                Redirecting to confirmation page...
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="space-y-4">
              <XCircle className="h-16 w-16 text-destructive mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">Payment Failed</h3>
              <p className="text-muted-foreground">
                {error || 'Something went wrong with your payment.'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleRetry} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleBackToCart}>
                  Back to Cart
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method Info */}
        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {method === 'stripe' && 'Secure payment processing powered by Stripe'}
            {method === 'paypal' && 'Secure payment processing powered by PayPal'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your payment information is encrypted and secure
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
