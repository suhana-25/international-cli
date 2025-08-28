import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { APP_NAME } from '@/lib/constants'

import SignInForm from './sign-in-form'

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
  // No server-side session check - let client handle redirects

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Nitesh Handicraft
        </h1>
        <p className="text-muted-foreground">
          Sign in to access your account and explore our collection
        </p>
      </div>

      <SignInForm 
        error={params.error}
        callbackUrl={params.callbackUrl}
      />

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a 
            href="/auth/sign-up" 
            className="text-primary hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
} 
