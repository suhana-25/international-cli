'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { CheckCircle, Package, MapPin, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Order } from '@/lib/order-store'

interface OrderConfirmationClientProps {
  order: Order
}

export default function OrderConfirmationClient({ order }: OrderConfirmationClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900 tracking-tight">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 font-inter">
              Thank you for your order. We'll contact you via WhatsApp shortly for confirmation.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 font-poppins">
                <Package className="h-5 w-5 text-gray-600" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Order Date</p>
                  <p className="font-inter text-sm text-gray-900">
                    {formatDateTime(order.createdAt).dateTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                  <p className="font-bold text-lg text-gray-900">{formatCurrency(order.total)}</p>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shipping Address */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-1 text-gray-700 font-inter">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.streetAddress}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-500">Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    Order Method: {order.paymentMethod === 'whatsapp' ? '📱 WhatsApp' : order.paymentMethod}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={order.isPaid ? "default" : "secondary"}>
                      {order.isPaid ? "Confirmed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Delivery:</span>
                    <Badge variant={order.isDelivered ? "default" : "secondary"}>
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-medium">
              <Link href={`/order/${order.id}`}>
                View Order Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-medium">
              <Link href="/catalog">
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* What's Next */}
          <Card className="bg-blue-50 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-poppins font-semibold text-blue-900 mb-3">What happens next?</h3>
              <div className="space-y-2 text-blue-800 font-inter">
                <p>✅ We've received your order and will process it shortly</p>
                <p>📱 Admin will contact you via WhatsApp for confirmation</p>
                <p>📦 Your order will be shipped within 1-2 business days</p>
                <p>🚚 Track your order status anytime from your account</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
