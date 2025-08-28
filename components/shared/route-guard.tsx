'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function RouteGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/sign-in' 
}: RouteGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (requireAuth && (!session || !session?.user)) {
      router.push(redirectTo)
      return
    }

    setIsChecking(false)
  }, [session, status, requireAuth, redirectTo, router])

  if (status === 'loading' || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && (!session || !session?.user)) {
    return null // Will redirect
  }

  return <>{children}</>
} 

