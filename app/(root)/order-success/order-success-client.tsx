'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'
import { useCart } from '@/lib/context/cart-context'

interface OrderSuccessClientProps {
  orderId?: string
}

export default function OrderSuccessClient({ orderId }: OrderSuccessClientProps) {
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear cart when success page loads
    clearCart()

    if (orderId) {
      fetchOrderDetails()
    } else {
      setLoading(false)
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/payment?orderId=${orderId}`)
      const result = await response.json()

      if (result.success) {
        setOrderData(result.data)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Order</h1>
        <p className="text-muted-foreground mb-6">No order ID provided.</p>
        <Button onClick={() => router.push('/')}>
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="bg-white border-border text-center">
        <CardContent className="pt-6">
          <CheckCircle className="h-20 w-20 text-success mx-auto mb-4" />
          <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground font-inter text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </CardContent>
      </Card>

      {/* Order Details */}
      {orderData && (
        <Card className="bg-white border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Order ID:</span>
                <p className="font-mono text-foreground font-medium">{orderData.orderId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Amount:</span>
                <p className="font-bold text-foreground">${orderData.total?.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Method:</span>
                <p className="text-foreground capitalize">{orderData.paymentMethod}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Status:</span>
                <p className="text-success font-medium capitalize">{orderData.paymentStatus}</p>
              </div>
            </div>

            {orderData.paymentId && (
              <div className="bg-secondary rounded-lg p-3">
                <span className="text-muted-foreground text-sm">Transaction ID:</span>
                <p className="font-mono text-foreground text-sm">{orderData.paymentId}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="bg-white border-border">
        <CardHeader>
          <CardTitle className="text-foreground">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              • You will receive an order confirmation email shortly
            </p>
            <p className="text-muted-foreground">
              • We'll notify you when your order ships
            </p>
            <p className="text-muted-foreground">
              • Track your order status in your account
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={() => router.push('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => router.push('/user/orders')}>
              View Order History
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Info */}
      <Card className="bg-secondary border-border">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Need help with your order? Contact us at{' '}
            <a href="mailto:support@niteshhandicraft.com" className="text-accent hover:underline">
              support@niteshhandicraft.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
