import { Suspense } from 'react'
import SignInClient from './sign-in-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: `Sign In - ${APP_NAME}`,
  description: 'Sign in to your account',
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const params = await searchParams

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignInClient 
        error={params.error}
        callbackUrl={params.callbackUrl}
      />
    </Suspense>
  )
} 
