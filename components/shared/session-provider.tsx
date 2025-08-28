'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('🔧 SessionProvider mounted')
  }, [])

  return (
    <SessionProvider
      refetchInterval={5 * 60} // 5 minutes
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
} 
