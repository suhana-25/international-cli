'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCheckout } from '@/lib/context/checkout-context'
import { useCart } from '@/lib/context/cart-context'
import { Loader2, ShoppingCart, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'place-order' | 'payment-processing'

interface EnhancedCheckoutGuardProps {
  children: React.ReactNode
  requiredStep: CheckoutStep
  allowBypass?: boolean
  title?: string
}

const stepConfig = {
  cart: { index: 0, label: 'Cart', path: '/cart' },
  shipping: { index: 1, label: 'Shipping Address', path: '/shipping-address' },
          payment: { index: 2, label: 'Order Details', path: '/place-order' },
  'place-order': { index: 3, label: 'Place Order', path: '/place-order' },
  'payment-processing': { index: 4, label: 'Payment Processing', path: '/payment' }
}

export default function EnhancedCheckoutGuard({ 
  children, 
  requiredStep,
  allowBypass = false,
  title
}: EnhancedCheckoutGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { state, validateAndProceed, markStepCompleted } = useCheckout()
  const { state: cartState } = useCart()
  const [isChecking, setIsChecking] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') {
        return
      }

      // Special case for cart - always accessible
      if (requiredStep === 'cart') {
        markStepCompleted('cart')
        setIsChecking(false)
        return
      }

      // Check authentication first
      if (!session || !session?.user) {
        const callbackUrl = encodeURIComponent(pathname || '/')
        router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
        return
      }

      // Check if cart has items (except for cart page itself)
      if (cartState.items.length === 0) {
        setValidationError('Your cart is empty. Please add items before proceeding.')
        setIsChecking(false)
        return
      }

      try {
        // Validate access to current step
        switch (requiredStep) {
          case 'shipping':
            // Always accessible if authenticated and cart has items
            markStepCompleted('cart')
            setIsChecking(false)
            break
            
          case 'payment':
            if (!state.hasShippingAddress) {
              router.push('/shipping-address')
              return
            }
            markStepCompleted('shipping')
            setIsChecking(false)
            break
            
          case 'place-order':
            if (!state.hasShippingAddress) {
              router.push('/shipping-address')
              return
            }
                         // Skip payment method validation for WhatsApp orders
             // if (!state.hasPaymentMethod) {
             //   router.push('/place-order')
             //   return
             // }
            markStepCompleted('payment')
            setIsChecking(false)
            break
            
          case 'payment-processing':
            if (!state.isCompleted.placeOrder) {
              router.push('/place-order')
              return
            }
            setIsChecking(false)
            break
            
          default:
            setIsChecking(false)
        }
      } catch (error) {
        console.error('Navigation guard error:', error)
        setValidationError('An error occurred while validating checkout requirements.')
        setIsChecking(false)
      }
    }

    checkAccess()
  }, [session, status, requiredStep, router, pathname, state, cartState.items.length, markStepCompleted])

  // Loading state
  if (status === 'loading' || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md mx-4 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
                <div className="absolute inset-0 animate-ping">
                  <div className="w-12 h-12 rounded-full bg-blue-200 opacity-25 mx-auto"></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Validating Checkout</h3>
                <p className="text-gray-600 mt-1">
                  Checking your progress and requirements...
                </p>
                <div className="mt-3">
                  <Badge variant="secondary" className="text-xs">
                    Step {stepConfig[requiredStep].index + 1}: {stepConfig[requiredStep].label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state - empty cart or validation error
  if (validationError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md mx-4 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              {cartState.items.length === 0 ? (
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            <CardTitle className="text-lg text-gray-900">
              {cartState.items.length === 0 ? 'Cart Empty' : 'Access Restricted'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">{validationError}</p>
            
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2">
              {Object.entries(stepConfig).map(([step, config]) => (
                <div 
                  key={step}
                  className={`w-2 h-2 rounded-full ${
                    config.index <= stepConfig[requiredStep].index 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button 
                onClick={() => router.push(cartState.items.length === 0 ? '/catalog' : '/cart')}
                className="flex-1"
              >
                {cartState.items.length === 0 ? 'Shop Now' : 'View Cart'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

