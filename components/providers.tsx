'use client'

import { CartProvider } from '@/lib/context/cart-context'
import { CheckoutProvider } from '@/lib/context/checkout-context'
import { ServiceWorkerProvider } from '@/components/providers/sw-provider'
import { InstantRouterProvider } from '@/components/providers/instant-router'
import { SWRConfig } from 'swr'
// import UserPersistenceProvider from '@/components/shared/user-persistence-provider' // Temporarily disabled

interface ProvidersProps {
  children: React.ReactNode
  session?: any
}

// SWR configuration for instant UI updates
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  fetcher: async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    })
    
    if (!response.ok) {
      const error = new Error('Fetch failed')
      // @ts-ignore
      error.status = response.status
      throw error
    }
    
    return response.json()
  },
  onError: (error: any) => {
    console.error('SWR Error:', error)
    
    // Handle specific error cases
    if (error.status === 401) {
      // Redirect to login
      window.location.href = '/auth/sign-in'
    }
  },
  onSuccess: (data: any, key: string) => {
    // Optional: Log successful data fetches
    if (process.env.NODE_ENV === 'development') {
      console.log('SWR Success:', key, data)
    }
  },
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ServiceWorkerProvider>
      <InstantRouterProvider>
        <SWRConfig value={swrConfig}>
          <CartProvider>
            <CheckoutProvider>
              {children}
            </CheckoutProvider>
          </CartProvider>
        </SWRConfig>
      </InstantRouterProvider>
    </ServiceWorkerProvider>
  )
}
