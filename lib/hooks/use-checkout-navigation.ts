'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCheckout } from '@/lib/context/checkout-context'
import { useCart } from '@/lib/context/cart-context'
import { useToast } from '@/components/ui/use-toast'

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'place-order' | 'payment-processing'

interface CheckoutNavigation {
  currentStep: CheckoutStep | null
  canNavigateTo: (step: CheckoutStep) => boolean
  navigateTo: (step: CheckoutStep) => Promise<void>
  getNextStep: () => CheckoutStep | null
  getPreviousStep: () => CheckoutStep | null
  proceedToNext: () => Promise<void>
  goToPrevious: () => void
  validateCurrentAccess: () => Promise<boolean>
}

const stepOrder: CheckoutStep[] = ['cart', 'shipping', 'payment', 'place-order', 'payment-processing']

const stepPaths: Record<CheckoutStep, string> = {
  cart: '/cart',
  shipping: '/shipping-address',
  payment: '/place-order',
  'place-order': '/place-order',
  'payment-processing': '/payment'
}

export function useCheckoutNavigation(): CheckoutNavigation {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { state, validateAndProceed, markStepCompleted } = useCheckout()
  const { state: cartState } = useCart()
  const { toast } = useToast()

  // Determine current step based on pathname
  const getCurrentStep = (): CheckoutStep | null => {
    const pathToStep = Object.entries(stepPaths).find(([_, path]) => pathname === path)
    return pathToStep ? (pathToStep[0] as CheckoutStep) : null
  }

  const currentStep = getCurrentStep()

  const canNavigateTo = (targetStep: CheckoutStep): boolean => {
    if (!session?.user?.id && targetStep !== 'cart') {
      return false
    }

    if (cartState.items.length === 0 && targetStep !== 'cart') {
      return false
    }

    switch (targetStep) {
      case 'cart':
        return true
      case 'shipping':
        return true // Always accessible if authenticated
      case 'payment':
        return state.hasShippingAddress
             case 'place-order':
         return state.hasShippingAddress
      case 'payment-processing':
        return state.isCompleted.placeOrder
      default:
        return false
    }
  }

  const navigateTo = async (targetStep: CheckoutStep): Promise<void> => {
    try {
      // Check authentication for protected steps
      if (!session?.user?.id && targetStep !== 'cart') {
        const callbackUrl = encodeURIComponent(stepPaths[targetStep])
        router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
        return
      }

      // Check cart items
      if (cartState.items.length === 0 && targetStep !== 'cart') {
        toast({
          variant: 'destructive',
          title: 'Cart Empty',
          description: 'Please add items to your cart before proceeding.',
        })
        router.push('/cart')
        return
      }

      // Validate navigation
      if (!canNavigateTo(targetStep)) {
        const requiredSteps = []
        if (!state.hasShippingAddress && ['payment', 'place-order', 'payment-processing'].includes(targetStep)) {
          requiredSteps.push('shipping address')
        }
                 // Skip payment method validation for WhatsApp orders
         // if (!state.hasPaymentMethod && ['place-order', 'payment-processing'].includes(targetStep)) {
         //   requiredSteps.push('payment method')
         // }

        toast({
          variant: 'destructive',
          title: 'Missing Requirements',
          description: `Please complete: ${requiredSteps.join(', ')}`,
        })
        return
      }

      // Navigate to the step
      router.push(stepPaths[targetStep])
      
      // Mark previous steps as completed
      const targetIndex = stepOrder.indexOf(targetStep)
      for (let i = 0; i < targetIndex; i++) {
        markStepCompleted(stepOrder[i])
      }

    } catch (error) {
      console.error('Navigation error:', error)
      toast({
        variant: 'destructive',
        title: 'Navigation Error',
        description: 'An error occurred while navigating. Please try again.',
      })
    }
  }

  const getNextStep = (): CheckoutStep | null => {
    if (!currentStep) return null
    
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex === -1 || currentIndex === stepOrder.length - 1) {
      return null
    }
    
    return stepOrder[currentIndex + 1]
  }

  const getPreviousStep = (): CheckoutStep | null => {
    if (!currentStep) return null
    
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex <= 0) {
      return null
    }
    
    return stepOrder[currentIndex - 1]
  }

  const proceedToNext = async (): Promise<void> => {
    const nextStep = getNextStep()
    if (nextStep) {
      await navigateTo(nextStep)
    }
  }

  const goToPrevious = (): void => {
    const previousStep = getPreviousStep()
    if (previousStep) {
      router.push(stepPaths[previousStep])
    }
  }

  const validateCurrentAccess = async (): Promise<boolean> => {
    if (!currentStep) return false
    
    return canNavigateTo(currentStep)
  }

  return {
    currentStep,
    canNavigateTo,
    navigateTo,
    getNextStep,
    getPreviousStep,
    proceedToNext,
    goToPrevious,
    validateCurrentAccess
  }
}






