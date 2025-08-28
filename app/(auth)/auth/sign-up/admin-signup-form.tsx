'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle } from 'lucide-react'
import { signUpFormSchema } from '@/lib/validator'
import { signUpDefaultValues } from '@/lib/constants'

export default function AdminSignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validate admin code
    if (adminCode !== 'ADMIN2024') {
      setError('Invalid admin registration code. Please contact system administrator.')
      setIsLoading(false)
      return
    }

    try {
      const validatedFields = signUpFormSchema.parse({
        name,
        email,
        password,
        confirmPassword,
      })

      // Create admin account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedFields.name,
          email: validatedFields.email,
          password: validatedFields.password,
          role: 'admin',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to create admin account')
        return
      }

      setSuccess('Admin account created successfully! Signing you in...')

      // Sign in the admin automatically
      const result = await signIn('credentials', {
        email: validatedFields.email,
        password: validatedFields.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account created but sign-in failed. Please try signing in.')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-name">Admin Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="admin-name"
            name="name"
            type="text"
            placeholder="Enter admin full name"
            defaultValue={signUpDefaultValues.name}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-email">Admin Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="admin-email"
            name="email"
            type="email"
            placeholder="Enter admin email address"
            defaultValue={signUpDefaultValues.email}
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
            placeholder="Create a strong admin password"
            defaultValue={signUpDefaultValues.password}
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
        <p className="text-xs text-muted-foreground">
          Admin password must be at least 8 characters long
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-confirm-password">Confirm Admin Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="admin-confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm admin password"
            defaultValue={signUpDefaultValues.confirmPassword}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-code">Admin Registration Code</Label>
        <div className="relative">
          <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="admin-code"
            type="text"
            placeholder="Enter admin registration code"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Contact system administrator for the admin registration code
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating admin account...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Create Admin Account
          </>
        )}
      </Button>
    </form>
  )
} 
