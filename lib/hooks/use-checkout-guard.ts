'use client'

// import { useSession } from 'next-auth/react' // Removed NextAuth
import { getSession } from '@/lib/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/context/cart-context'

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'place-order' | 'payment-processing'

interface CheckoutValidation {
  hasCart: boolean
  hasShippingAddress: boolean
  hasPaymentMethod: boolean
  isOrderPlaced: boolean
}

export function useCheckoutGuard(requiredStep: CheckoutStep) {
  const router = useRouter()
  const { state: cartState } = useCart()
  const [session, setSession] = useState<any>(null)
  const [status, setStatus] = useState('loading')
  const [validation, setValidation] = useState<CheckoutValidation>({
    hasCart: false,
    hasShippingAddress: false,
    hasPaymentMethod: false,
    isOrderPlaced: false
  })
  const [isValidating, setIsValidating] = useState(true)

  // Load session from custom auth
  useEffect(() => {
    const userSession = getSession()
    if (userSession) {
      setSession({ user: userSession })
      setStatus('authenticated')
    } else {
      setSession(null)
      setStatus('unauthenticated')
    }
  }, [])

  // Check if user has items in cart
  const hasCart = cartState.items.length > 0

  // Validate checkout prerequisites
  useEffect(() => {
    async function validateCheckoutStep() {
      setIsValidating(true)
      
      try {
        // 1. Check authentication first
        if (status === 'loading') return
        
        if (!session?.user && requiredStep !== 'cart') {
          // For now, allow shipping address access and let the page handle auth
          if (requiredStep === 'shipping') {
            // Continue with validation for shipping page
          } else {
            const callbackUrl = encodeURIComponent(window.location.pathname)
            router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
            return
          }
        }

        // 2. Check cart items for all steps
        if (!hasCart && requiredStep !== 'payment-processing') {
          router.push('/cart')
          return
        }

        // 3. Step-specific validations
        let validation: CheckoutValidation = {
          hasCart,
          hasShippingAddress: false,
          hasPaymentMethod: false,
          isOrderPlaced: false
        }

        // Check shipping address if needed
        if (['payment', 'place-order', 'payment-processing'].includes(requiredStep)) {
          try {
            const shippingResponse = await fetch('/api/user/shipping-address')
            
            if (shippingResponse.ok) {
              const result = await shippingResponse.json()
              
              // For guest users, check localStorage
              if (result.isGuest) {
                const guestAddress = localStorage.getItem('guestShippingAddress')
                validation.hasShippingAddress = !!guestAddress
              } else {
                validation.hasShippingAddress = result.success
              }
            } else {
              // If API fails, check localStorage for guest users
              const guestAddress = localStorage.getItem('guestShippingAddress')
              validation.hasShippingAddress = !!guestAddress
            }
            
            if (!validation.hasShippingAddress) {
              router.push('/shipping-address')
              return
            }
          } catch (error) {
            // Fallback to localStorage check for guest users
            const guestAddress = localStorage.getItem('guestShippingAddress')
            if (!guestAddress) {
              router.push('/shipping-address')
              return
            }
            validation.hasShippingAddress = true
          }
        }

        // Check payment method if needed
        if (['place-order', 'payment-processing'].includes(requiredStep)) {
          try {
            const paymentResponse = await fetch('/api/user/payment-method')
            
            if (paymentResponse.ok) {
              const result = await paymentResponse.json()
              
              // For guest users, check localStorage
              if (result.isGuest) {
                const guestPaymentMethod = localStorage.getItem('selected-payment-method')
                validation.hasPaymentMethod = !!guestPaymentMethod
              } else {
                validation.hasPaymentMethod = result.success
              }
            } else {
              // If API fails, check localStorage for guest users
              const guestPaymentMethod = localStorage.getItem('selected-payment-method')
              validation.hasPaymentMethod = !!guestPaymentMethod
            }
            
            // Skip payment method validation for WhatsApp orders
            // if (!validation.hasPaymentMethod) {
            //   router.push('/place-order')
            //   return
            // }
          } catch (error) {
            // Fallback to localStorage check for guest users
            // Skip payment method validation for WhatsApp orders
            // const guestPaymentMethod = localStorage.getItem('selected-payment-method')
            // if (!guestPaymentMethod) {
            //   router.push('/place-order')
            //   return
            // }
            validation.hasPaymentMethod = true
          }
        }

        // Check if order is placed for payment processing
        if (requiredStep === 'payment-processing') {
          const orderPlaced = localStorage.getItem('order-placed')
          validation.isOrderPlaced = !!orderPlaced
          
          if (!validation.isOrderPlaced) {
            router.push('/place-order')
            return
          }
        }

        setValidation(validation)
      } catch (error) {
        console.error('Checkout validation error:', error)
        router.push('/cart')
      } finally {
        setIsValidating(false)
      }
    }

    validateCheckoutStep()
  }, [session, status, hasCart, requiredStep, router])

  return {
    isValidating,
    validation,
    canAccess: !isValidating && (
      requiredStep === 'cart' || 
      (requiredStep === 'shipping' && hasCart) || // Allow guest access to shipping
      (requiredStep === 'payment' && validation.hasShippingAddress) ||
      (requiredStep === 'place-order' && validation.hasShippingAddress && validation.hasPaymentMethod) ||
      (requiredStep === 'payment-processing' && validation.isOrderPlaced)
    )
  }
}
