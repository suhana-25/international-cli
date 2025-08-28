'use client'

import { useCheckoutGuard, CheckoutStep } from '@/lib/hooks/use-checkout-guard'
import { Loader2 } from 'lucide-react'

interface CheckoutRouteGuardProps {
  children: React.ReactNode
  requiredStep: CheckoutStep
  fallback?: React.ReactNode
}

export default function CheckoutRouteGuard({ 
  children, 
  requiredStep, 
  fallback 
}: CheckoutRouteGuardProps) {
  const { isValidating, canAccess } = useCheckoutGuard(requiredStep)

  // Show loading while validating
  if (isValidating) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-inter text-muted-foreground">
            Validating checkout step...
          </p>
        </div>
      </div>
    )
  }

  // Show content if user can access this step
  if (canAccess) {
    return <>{children}</>
  }

  // This shouldn't happen as the hook redirects, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 font-inter">
          Redirecting to the appropriate checkout step...
        </p>
      </div>
    </div>
  )
}






