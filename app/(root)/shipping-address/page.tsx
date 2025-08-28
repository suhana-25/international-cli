// // import { auth } from '@/lib/auth' // Removed - using custom auth // Removed - using custom auth
import { getUserById } from '@/lib/actions/user.actions'
import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import ShippingAddressForm from './shipping-address-form'
import CheckoutRouteGuard from '@/components/shared/checkout-route-guard'

export const metadata: Metadata = {
  title: `Shipping Address - ${APP_NAME}`,
}

export default async function ShippingPage() {
  const session = null // Skip auth check - using custom auth system
  // Remove auth check for now - let the component handle it
  // if (!session || !session?.user?.id) {
  //   return <div>Please sign in to continue</div>
  // }
  
  try {
    const user = null // session?.user?.id ? await getUserById(session?.user.id) : null
    
    // if (!user) {
    //   throw new Error('User not found')
    // }
    
    // Provide empty address object if user doesn't have address
    const userAddress = null
    
    return (
      <CheckoutRouteGuard requiredStep="shipping">
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-3 tracking-tight">Shipping Address</h1>
                <p className="text-muted-foreground font-inter">
                  Enter your delivery address to continue with checkout
                </p>
              </div>
              <ShippingAddressForm address={userAddress} />
            </div>
          </div>
        </div>
      </CheckoutRouteGuard>
    )
  } catch (error) {
    console.error('Error in shipping address page:', error)
    throw error
  }
}

