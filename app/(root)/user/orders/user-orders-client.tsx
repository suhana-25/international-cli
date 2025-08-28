'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Loader2, Package, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  shippingAddress: {
    fullName: string
    streetAddress: string
    city: string
    country: string
    postalCode: string
    phone?: string
  }
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  isPaid: boolean
  createdAt: string
  updatedAt: string
}

export default function UserOrdersClient() {
  const session = { user: { id: 'admin', name: 'Admin' } } // Mock session for orders
  const status = 'authenticated' // Always authenticated for testing
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/sign-in?callbackUrl=/user/orders')
      return
    }

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user/orders')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setOrders(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-300">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-poppins">Loading your orders...</span>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-300 mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-6">You need to be signed in to view your orders.</p>
          <Button onClick={() => router.push('/auth/sign-in')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Your Orders</h1>
            <p className="text-slate-400">Track and manage your orders</p>
          </div>

          {orders.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Orders Yet</h3>
                <p className="text-slate-400 mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link href="/catalog">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-slate-100">Order #{order.id}</CardTitle>
                        <p className="text-slate-400 text-sm">
                          Placed on {formatDateTime(order.createdAt).full}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge variant={order.isPaid ? 'default' : 'secondary'}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-slate-300 mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-slate-800 rounded-lg">
                              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="rounded-lg object-cover"
                                  />
                                ) : (
                                  <Package className="h-8 w-8 text-slate-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-slate-200">{item.name}</h5>
                                <p className="text-slate-400 text-sm">
                                  Qty: {item.quantity} × {formatCurrency(item.price)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-200">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-slate-300 mb-3">Shipping Address</h4>
                          <div className="bg-slate-800 p-4 rounded-lg">
                            <p className="text-slate-200 font-medium">{order.shippingAddress.fullName}</p>
                            <p className="text-slate-400">{order.shippingAddress.streetAddress}</p>
                            <p className="text-slate-400">
                              {order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.postalCode}
                            </p>
                            {order.shippingAddress.phone && (
                              <p className="text-slate-400">Phone: {order.shippingAddress.phone}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-300 mb-3">Order Summary</h4>
                          <div className="bg-slate-800 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Payment Method:</span>
                              <span className="text-slate-200">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Total:</span>
                              <span className="text-slate-200 font-semibold text-lg">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                        <Link href={`/order-success?orderId=${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
