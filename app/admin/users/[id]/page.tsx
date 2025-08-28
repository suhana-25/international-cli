import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getUserById } from '@/lib/actions/user.actions'
import { APP_NAME } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import UpdateUserForm from './update-user-form'

export const metadata: Metadata = {
  title: `User Details - ${APP_NAME}`,
}

export default async function UpdateUserPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const resolvedParams = await params
  const user = await getUserById(resolvedParams.id)
  if (!user) notFound()

  // Parse address from JSON string
  const userAddress = typeof user.address === 'string' ? JSON.parse(user.address) : user.address

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="h2-bold">User Details</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            {user.paymentMethod ? (
              <Badge variant="outline" className="text-lg">
                {user.paymentMethod}
              </Badge>
            ) : (
              <p className="text-muted-foreground">No payment method set</p>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            {userAddress ? (
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-semibold">{userAddress.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{userAddress.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p>
                    {userAddress.streetAddress}, {userAddress.city}, {userAddress.postalCode}, {userAddress.country}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No shipping address set</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateUserForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
