'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'
import { signInFormSchema } from '@/lib/validator'
import { signInDefaultValues } from '@/lib/constants'

export default function AdminSignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const validatedFields = signInFormSchema.parse({
        email,
        password,
      })

      const result = await signIn('credentials', {
        email: validatedFields.email,
        password: validatedFields.password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password. Please check your credentials.')
        } else {
          setError('Authentication failed. Please try again.')
        }
        return
      }

      // Check if user exists and has admin role
      const userCheck = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: validatedFields.email }),
      })

      if (userCheck.ok) {
        const userData = await userCheck.json()
        if (userData.role !== 'admin') {
          setError('This account is not authorized for administrative access.')
          return
        }
      } else {
        setError('Account not found. Please check your credentials.')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Admin Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="admin-email"
            name="email"
            type="email"
            placeholder="Enter admin email address"
            defaultValue={signInDefaultValues.email}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="admin-password">Admin Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="admin-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter admin password"
            defaultValue={signInDefaultValues.password}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in as Admin...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Sign In as Admin
          </>
        )}
      </Button>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Admin access only. Contact system administrator for account creation.
        </p>
      </div>
    </form>
  )
} 
