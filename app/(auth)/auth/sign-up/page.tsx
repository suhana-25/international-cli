import { Suspense } from 'react'
import SignUpClient from './sign-up-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: `Sign Up - ${APP_NAME}`,
  description: 'Create your account',
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const params = await searchParams

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignUpClient 
        error={params.error}
        callbackUrl={params.callbackUrl}
      />
    </Suspense>
  )
} 

