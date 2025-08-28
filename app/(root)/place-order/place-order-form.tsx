'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useCart } from '@/lib/context/cart-context'
import { ArrowRight, Package, MessageCircle, MapPin, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { redirectToWhatsAppMobile, OrderDetails } from '@/lib/whatsapp-order'

interface BuyNowProduct {
  id: string
  name: string
  price: number
  weight: number
  image: string
  quantity: number
  stock: number
  slug: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  address?: any
}

export default function PlaceOrderForm() {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [additionalNotes, setAdditionalNotes] = useState<string>('')
  const [buyNowProduct, setBuyNowProduct] = useState<BuyNowProduct | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { state: cartState, clearCart } = useCart()

  // Load current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setCurrentUser(user)
        console.log('👤 PlaceOrder: Current user loaded:', user)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  // Load buy now product from localStorage
  useEffect(() => {
    // Check for buy now product
    const storedProduct = localStorage.getItem('buyNowProduct')
    if (storedProduct) {
      try {
        setBuyNowProduct(JSON.parse(storedProduct))
      } catch (error) {
        console.error('Error parsing buy now product:', error)
      }
    }
  }, [])

  const [shippingAddress, setShippingAddress] = useState<any>(null)
  
  // Load shipping address from user or localStorage
  useEffect(() => {
    console.log('🏠 PlaceOrder: Loading shipping address...')
    console.log('🏠 PlaceOrder: Current user:', currentUser)
    
    if (currentUser?.address) {
      // Authenticated user with address
      console.log('🏠 PlaceOrder: Found user address:', currentUser.address)
      const address = typeof currentUser.address === 'string' ? JSON.parse(currentUser.address) : currentUser.address
      setShippingAddress(address)
      console.log('🏠 PlaceOrder: Set authenticated user address:', address)
    } else {
      // Guest user - check localStorage
      const guestAddress = localStorage.getItem('guestShippingAddress')
      console.log('🏠 PlaceOrder: Guest address from localStorage:', guestAddress)
      
      if (guestAddress) {
        try {
          const parsedAddress = JSON.parse(guestAddress)
          setShippingAddress(parsedAddress)
          console.log('🏠 PlaceOrder: Set guest address:', parsedAddress)
        } catch (error) {
          console.error('Error parsing guest address:', error)
        }
      } else {
        console.log('🏠 PlaceOrder: No address found in localStorage')
      }
    }
  }, [currentUser])

  // WhatsApp order flow - no payment method needed

  // Determine if this is a buy now purchase or cart checkout
  const isBuyNow = buyNowProduct !== null
  const orderItems = isBuyNow ? [buyNowProduct] : cartState.items
  const orderTotal = isBuyNow ? (buyNowProduct.price * buyNowProduct.quantity) : cartState.total

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast({
        variant: 'destructive',
        description: 'Shipping address not found. Please add your address first.'
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        variant: 'destructive',
        description: isBuyNow ? 'Product not found.' : 'Your cart is empty.'
      })
      return
    }

    if (!shippingAddress) {
      toast({
        variant: 'destructive',
        description: 'Shipping address not found. Please add your address first.'
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      // Create order data with user information
      const orderData = {
        items: orderItems,
        total: orderTotal,
        shippingAddress: {
          ...shippingAddress,
          fullName: currentUser?.name || shippingAddress.fullName || shippingAddress.name || 'Guest User'
        },
        paymentMethod: 'whatsapp',
        userId: currentUser?.id || `guest-${Date.now()}`
      }

      console.log('📦 PlaceOrder: Creating order with data:', {
        ...orderData,
        items: orderData.items.length,
        user: currentUser?.name || 'Guest'
      })

      // Place order API call
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const order = await response.json()

      // Mark order as placed
      localStorage.setItem('order-placed', 'true')
      localStorage.setItem('order-id', order.id)

      // Clear buy now product if this was a buy now purchase
      if (isBuyNow) {
        localStorage.removeItem('buyNowProduct')
      }

      toast({
        description: 'Order placed successfully!',
        className: "bg-white border-border text-foreground shadow-lg",
      })

      console.log('✅ PlaceOrder: Order created successfully:', order)

      // Redirect to WhatsApp with order details
      const whatsappOrder: OrderDetails = {
        orderId: order.id,
        customerName: currentUser?.name || shippingAddress.fullName || 'Guest User',
        customerEmail: currentUser?.email || 'guest@example.com',
        customerPhone: shippingAddress.phone,
        shippingAddress: {
          street: shippingAddress.street || shippingAddress.address || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          zipCode: shippingAddress.zipCode || shippingAddress.postalCode || '',
          country: shippingAddress.country || 'India'
        },
        items: orderItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: orderTotal,
        additionalNotes: additionalNotes
      }

      // Redirect to WhatsApp
      redirectToWhatsAppMobile(whatsappOrder)
      
      // Clear cart AFTER WhatsApp redirect (only if not buy now)
      if (!isBuyNow) {
        setTimeout(() => {
          clearCart()
        }, 2000)
      }
    } catch (error) {
      console.error('Place order error:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to place order. Please try again.'
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handleCancelBuyNow = () => {
    localStorage.removeItem('buyNowProduct')
    setBuyNowProduct(null)
    router.push('/catalog')
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div className="space-y-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {isBuyNow ? (
                <ShoppingCart className="mr-3 h-6 w-6 text-accent" />
              ) : (
                <Package className="mr-3 h-6 w-6 text-muted-foreground" />
              )}
              <h2 className="text-xl font-poppins font-bold text-foreground tracking-tight">
                {isBuyNow ? 'Buy Now Product' : `Order Items (${orderItems.length})`}
              </h2>
            </div>
            
            {isBuyNow && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelBuyNow}
                className="border-border text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-secondary rounded-lg">
                <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {item.image && item.image !== '/placeholder-product.jpg' ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-poppins font-medium text-foreground truncate">
                    {item.name}
                  </h4>
                  <p className="text-sm text-muted-foreground font-inter">
                    Quantity: {item.quantity}
                  </p>
                  {isBuyNow && (
                    <p className="text-xs text-accent font-inter">
                      Buy Now Purchase
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="font-poppins font-bold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="border-t border-border pt-4">
              <div className="space-y-3">
                <div className="flex justify-between font-inter text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-inter text-muted-foreground">
                  <span>Shipping:</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between font-poppins font-bold text-xl text-foreground">
                  <span>Total:</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery & Payment Info */}
      <div className="space-y-6">
        {/* Shipping Address */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MapPin className="mr-3 h-6 w-6 text-muted-foreground" />
            <h2 className="text-xl font-poppins font-bold text-foreground tracking-tight">
              Delivery Address
            </h2>
          </div>
          
          {shippingAddress ? (
            <div className="font-inter text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{shippingAddress.fullName}</p>
              {shippingAddress.email && <p className="text-muted-foreground">Email: {shippingAddress.email}</p>}
              <p>{shippingAddress.streetAddress}</p>
              <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phone && <p className="text-muted-foreground">Phone: {shippingAddress.phone}</p>}
            </div>
          ) : (
            <p className="text-destructive font-inter">No address found</p>
          )}
        </div>

        {/* WhatsApp Order */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="mr-3 h-6 w-6 text-muted-foreground" />
            <h2 className="text-xl font-poppins font-bold text-foreground tracking-tight">
              Order via WhatsApp
            </h2>
          </div>
          
          <p className="font-inter text-foreground text-lg">
            📱 WhatsApp Order
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Your order will be sent to admin via WhatsApp for confirmation and payment instructions.
          </p>
        </div>

        {/* Additional Notes */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="mr-3 h-6 w-6 text-muted-foreground" />
            <h2 className="text-xl font-poppins font-bold text-foreground tracking-tight">
              Additional Notes
            </h2>
          </div>
          
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Add any special instructions or notes for your order..."
            className="w-full p-3 border border-border rounded-lg font-inter text-foreground bg-background resize-none"
            rows={3}
          />
        </div>

        {/* Place Order Button */}
        <div className="bg-white border border-border rounded-lg p-6">
          <Button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || !shippingAddress || orderItems.length === 0}
            className="w-full h-14 text-lg font-manrope font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isPlacingOrder ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground mr-2" />
                Placing Order...
              </>
            ) : (
              <>
                {isBuyNow ? 'Buy Now' : 'Place Order via WhatsApp'} - ${orderTotal.toFixed(2)}
                <MessageCircle className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground font-inter text-center mt-4">
            By placing your order, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  )
}
