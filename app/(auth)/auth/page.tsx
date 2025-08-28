import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Shield, ArrowRight, ShoppingCart, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: `Choose Account Type - ${APP_NAME}`,
  description: 'Select your account type to continue',
}

export default function AuthSelectionPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to {APP_NAME}
        </h1>
        <p className="text-muted-foreground">
          Choose your account type to get started
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* User Account Card */}
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">Customer Account</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Customer
              </Badge>
            </div>
            <CardDescription>
              Shop our premium collection of art statues and handicrafts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Browse and purchase products</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span>Track your orders</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span>Manage your profile</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild className="flex-1">
                <Link href="/auth/sign-in?type=user">
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/auth/sign-up?type=user">
                  Sign Up
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Account Card */}
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-xl">Admin Account</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Administrator
              </Badge>
            </div>
            <CardDescription>
              Manage products, orders, and website content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Manage products and inventory</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span>Process customer orders</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span>Update website content</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild className="flex-1">
                <Link href="/auth/sign-in?type=admin">
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/auth/sign-up?type=admin">
                  Sign Up
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
} 
