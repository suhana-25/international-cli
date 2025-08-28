import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { APP_NAME } from '@/lib/constants'
// // import { auth } from '@/lib/auth' // Removed - using custom auth // Removed - using custom auth
import SignUpForm from './sign-up-form'

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
  // Skip session check - using custom auth system
  // const session = null
  
  // If user is already signed in, redirect to appropriate page
  // // if (session?.user) {
//   //   if (// session?.user.role === 'admin') {
//   //     redirect('/admin')
//   //   } else {
  //     redirect('/')
  //   }
  // }

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
        error={params.error}
        callbackUrl={params.callbackUrl}
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

