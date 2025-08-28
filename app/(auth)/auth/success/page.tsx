import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Shield, Users } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: `Authentication Success - ${APP_NAME}`,
  description: 'Successfully authenticated',
}

async function AuthSuccessPageContent({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; role?: string }>
}) {
  const params = await searchParams
  const userType = params.type || params.role || 'user'
  const isAdmin = userType === 'admin'

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to {APP_NAME}!
        </h1>
        <p className="text-muted-foreground">
          You have successfully signed in to your {isAdmin ? 'admin' : 'customer'} account
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            {isAdmin ? (
              <Shield className="h-8 w-8 text-purple-600" />
            ) : (
              <Users className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {isAdmin ? 'Administrator Account' : 'Customer Account'}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'You now have access to the admin dashboard and management tools.'
              : 'You can now browse products, manage your cart, and place orders.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">What you can do now:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {isAdmin ? (
                <>
                  <li>• Manage products and inventory</li>
                  <li>• Process customer orders</li>
                  <li>• Update website content</li>
                  <li>• View analytics and reports</li>
                </>
              ) : (
                <>
                  <li>• Browse our product catalog</li>
                  <li>• Add items to your cart</li>
                  <li>• Place orders and track them</li>
                  <li>• Manage your profile</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="flex space-x-2">
            <Button asChild className="flex-1">
              <Link href={isAdmin ? '/admin' : '/'}>
                {isAdmin ? 'Go to Admin Dashboard' : 'Start Shopping'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={isAdmin ? '/admin/overview' : '/catalog'}>
                {isAdmin ? 'View Overview' : 'Browse Catalog'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Need help?{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function AuthSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; role?: string }>
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthSuccessPageContent searchParams={searchParams} />
    </Suspense>
  )
} 
