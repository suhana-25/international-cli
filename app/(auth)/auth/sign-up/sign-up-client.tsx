'use client'

import SignUpForm from './sign-up-form'

interface SignUpClientProps {
  error?: string
  callbackUrl?: string
}

export default function SignUpClient({ error, callbackUrl }: SignUpClientProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Join Nitesh Handicraft
        </h1>
        <p className="text-muted-foreground">
          Create your account and discover our exclusive collection
        </p>
      </div>

      <SignUpForm 
        error={error}
        callbackUrl={callbackUrl}
      />

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <a 
            href="/auth/sign-in" 
            className="text-primary hover:underline font-medium"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}
