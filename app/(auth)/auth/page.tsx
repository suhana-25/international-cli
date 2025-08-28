import { Suspense } from 'react'
import { AuthPageClient } from './auth-page-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering to prevent export errors
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthPageClient />
    </Suspense>
  )
} 
