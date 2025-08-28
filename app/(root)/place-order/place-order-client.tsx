'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/lib/context/cart-context'
// // import { useSession } from 'next-auth/react' // Removed - using custom auth // Removed - using custom auth
import Link from 'next/link'
import { MapPin, MessageCircle, Package, User, Phone, Mail } from 'lucide-react'
import PlaceOrderForm from './place-order-form'
import { useEffect, useState } from 'react'

interface PlaceOrderClientProps {
  user: any
  userAddress: any
  session: any
}

export default function PlaceOrderClient({ user, userAddress, session }: PlaceOrderClientProps) {
  const { state: cart, isLoading: cartLoading } = useCart()
  // const { data: sessionData } = useSession() // Removed - using custom auth
  const sessionData = null // Using custom auth system
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Debug cart data
  useEffect(() => {
    console.log('Cart state:', cart)
    console.log('Cart items:', cart.items)
    console.log('Cart items length:', cart.items.length)
  }, [cart])

  // Calculate totals with new shipping logic
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Calculate total weight
  const totalWeight = cart.items.reduce((sum, item) => {
    const itemWeight = item.weight || 0
    return sum + (itemWeight * item.quantity)
  }, 0)

  // Shipping logic: Free for 1-20kg, 15% charge for below 1kg or above 20kg
  let shipping = 0
  let shippingType = 'Free'
  
  if (totalWeight < 1 || totalWeight > 20) {
    shipping = subtotal * 0.15 // 15% of subtotal
    shippingType = '15% of order'
  } else {
    shipping = 0
    shippingType = 'Free'
  }
  
  const total = subtotal + shipping

  // Show loading state while client-side hydration is happening or cart is loading
  if (!isClient || cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column - Order Details */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{userAddress?.phone || 'No phone'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="font-medium">{userAddress?.fullName}</p>
              <p className="text-muted-foreground">{userAddress?.streetAddress}</p>
              <p className="text-muted-foreground">
                {userAddress?.city}, {userAddress?.postalCode}
              </p>
              <p className="text-muted-foreground">{userAddress?.country}</p>
            </div>
            <div>
              <Link href="/shipping-address">
                <Button variant="outline" size="sm">Edit Address</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Order */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                📱 WhatsApp
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Your order will be sent to admin via WhatsApp for confirmation and payment instructions.
            </div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 No online payment required. Admin will contact you via WhatsApp for payment details.
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items ({cart.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.items.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Debug: Cart items count: {cart.items.length}
                </p>
                <Link href="/catalog">
                  <Button className="mt-4">Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} | Weight: {(item.weight || 0) * item.quantity}kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link href="/cart">
                    <Button variant="outline">Edit Cart</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Order Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Items ({cart.items.length})</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Weight</span>
                <span>{totalWeight.toFixed(1)}kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="text-xs text-muted-foreground p-3 bg-gray-50 rounded-lg">
              <p className="font-medium mb-1">Shipping Policy:</p>
              <p>• Free shipping for 1-20kg orders</p>
              <p>• 15% charge for below 1kg or above 20kg</p>
              <p>• Current weight: {totalWeight.toFixed(1)}kg</p>
            </div>

            {/* Place Order Button */}
            {cart.items.length > 0 ? (
              <PlaceOrderForm />
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">
                  Add items to cart to place order
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• WhatsApp order confirmation</p>
              <p>• 30-day return policy</p>
              <p>• Fast delivery</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
