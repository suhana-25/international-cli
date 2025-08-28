import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import SignUpForm from './signup-form'

export const metadata: Metadata = {
  title: `Sign Up - ${APP_NAME}`,
}

export default function SignUpPage() {
  return (
    <div className="wrapper flex-center min-h-screen">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">
            Join {APP_NAME}
          </h2>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        <SignUpForm />
      </div>
    </div>
  )
}
