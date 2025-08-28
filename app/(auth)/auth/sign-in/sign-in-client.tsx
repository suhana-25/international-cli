'use client'

import SignInForm from './sign-in-form'

interface SignInClientProps {
  error?: string
  callbackUrl?: string
}

export default function SignInClient({ error, callbackUrl }: SignInClientProps) {
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
        error={error}
        callbackUrl={callbackUrl}
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
