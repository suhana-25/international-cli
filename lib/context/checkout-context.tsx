'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'place-order' | 'payment-processing'

interface CheckoutState {
  hasShippingAddress: boolean
  hasPaymentMethod: boolean
  currentStep: number
  stepNames: CheckoutStep[]
  isCompleted: {
    cart: boolean
    shipping: boolean
    payment: boolean
    placeOrder: boolean
  }
  lastValidatedStep: CheckoutStep
}

interface CheckoutContextType {
  state: CheckoutState
  setShippingAddress: (hasAddress: boolean) => void
  setPaymentMethod: (hasPayment: boolean) => void
  setCurrentStep: (step: number) => void
  validateAndProceed: (targetStep: CheckoutStep) => Promise<boolean>
  canProceedToPayment: boolean
  canProceedToPlaceOrder: boolean
  canProceedToPaymentProcessing: boolean
  resetCheckout: () => void
  markStepCompleted: (step: CheckoutStep) => void
}

const CheckoutContext = createContext<CheckoutContextType | null>(null)

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [state, setState] = useState<CheckoutState>({
    hasShippingAddress: false,
    hasPaymentMethod: false,
    currentStep: 1,
    stepNames: ['cart', 'shipping', 'payment', 'place-order', 'payment-processing'],
    isCompleted: {
      cart: false,
      shipping: false,
      payment: false,
      placeOrder: false
    },
    lastValidatedStep: 'cart'
  })

  // Get session from localStorage
  useEffect(() => {
    const userSession = getSession()
    setSession(userSession)
  }, [])

  const setShippingAddress = (hasAddress: boolean) => {
    setState(prev => ({ 
      ...prev, 
      hasShippingAddress: hasAddress,
      isCompleted: { ...prev.isCompleted, shipping: hasAddress }
    }))
  }

  const setPaymentMethod = (hasPayment: boolean) => {
    setState(prev => ({ 
      ...prev, 
      hasPaymentMethod: hasPayment,
      isCompleted: { ...prev.isCompleted, payment: hasPayment }
    }))
  }

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }))
  }

  const markStepCompleted = (step: CheckoutStep) => {
    setState(prev => ({
      ...prev,
      isCompleted: {
        ...prev.isCompleted,
        [step === 'place-order' ? 'placeOrder' : step]: true
      },
      lastValidatedStep: step
    }))
  }

  const resetCheckout = () => {
    setState(prev => ({
      ...prev,
      isCompleted: {
        cart: false,
        shipping: false,
        payment: false,
        placeOrder: false
      },
      lastValidatedStep: 'cart',
      currentStep: 1
    }))
  }

  // Enhanced validation with server-side checks
  const validateAndProceed = async (targetStep: CheckoutStep): Promise<boolean> => {
    if (!session?.user?.id) {
      router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return false
    }

    try {
      switch (targetStep) {
        case 'cart':
          return true

        case 'shipping':
          // Check if user is authenticated
          markStepCompleted('cart')
          return true

        case 'payment':
          // Check if shipping address is completed
          if (!state.hasShippingAddress) {
            router.push('/shipping-address')
            return false
          }
          const addressResponse = await fetch('/api/user/shipping-address')
          if (!addressResponse.ok) {
            router.push('/shipping-address')
            return false
          }
          markStepCompleted('shipping')
          return true

        case 'place-order':
          // Check both shipping and payment
          if (!state.hasShippingAddress) {
            router.push('/shipping-address')
            return false
          }
          // Skip payment method check for WhatsApp orders
          // if (!state.hasPaymentMethod) {
          //   router.push('/place-order')
          //   return false
          // }
          // const paymentResponse = await fetch('/api/user/payment-method')
          // if (!paymentResponse.ok) {
          //   router.push('/place-order')
          //   return false
          // }
          markStepCompleted('payment')
          return true

        case 'payment-processing':
          // Check all previous steps
          if (!state.isCompleted.shipping || !state.isCompleted.payment) {
            router.push('/cart')
            return false
          }
          markStepCompleted('place-order')
          return true

        default:
          return false
      }
    } catch (error) {
      console.error('Checkout validation error:', error)
      return false
    }
  }

  const canProceedToPayment = state.hasShippingAddress && state.isCompleted.shipping
  const canProceedToPlaceOrder = state.hasShippingAddress && state.isCompleted.shipping
  const canProceedToPaymentProcessing = canProceedToPlaceOrder && state.isCompleted.placeOrder

  // Load user data when session changes
  useEffect(() => {
    if (session?.user?.id) {
      // You can load user's shipping address and payment method here
      // For now, we'll use localStorage to persist the state
      const savedState = localStorage.getItem('checkout-state')
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState)
          setState(prev => ({ ...prev, ...parsed }))
        } catch (error) {
          console.error('Error parsing checkout state:', error)
        }
      }
    }
  }, [session])

  // Save state to localStorage
  useEffect(() => {
    if (session?.user?.id) {
      localStorage.setItem('checkout-state', JSON.stringify(state))
    }
  }, [state, session])

  return (
    <CheckoutContext.Provider value={{
      state,
      setShippingAddress,
      setPaymentMethod,
      setCurrentStep,
      validateAndProceed,
      canProceedToPayment,
      canProceedToPlaceOrder,
      canProceedToPaymentProcessing,
      resetCheckout,
      markStepCompleted
    }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
} 
