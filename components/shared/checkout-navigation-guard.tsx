'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCheckout } from '@/lib/context/checkout-context'
import { Loader2 } from 'lucide-react'

interface CheckoutNavigationGuardProps {
  children: React.ReactNode
  requiredStep: 'shipping' | 'payment' | 'place-order'
}

export default function CheckoutNavigationGuard({ 
  children, 
  requiredStep 
}: CheckoutNavigationGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { state } = useCheckout()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    // Check authentication
    if (!session || !session?.user) {
      router.push('/auth/sign-in')
      return
    }

    // Check step requirements
    switch (requiredStep) {
      case 'shipping':
        // Shipping step is always accessible if authenticated
        setIsChecking(false)
        break
      
      case 'payment':
        if (!state.hasShippingAddress) {
          router.push('/shipping-address')
          return
        }
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
        setIsChecking(false)
        break
    }
  }, [session, status, state, requiredStep, router])

  if (status === 'loading' || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking checkout requirements...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 

