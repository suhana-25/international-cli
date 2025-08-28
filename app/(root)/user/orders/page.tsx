'use client'

import { useState, useEffect } from 'react'
// // import { useSession } from 'next-auth/react' // Removed - using custom auth // Removed - using custom auth
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

export default function UserOrdersPage() {
  // const { data: session, status } = useSession() // Removed - using custom auth
  const session = { user: { id: 'admin', name: 'Admin' } } // Mock session for orders
  const status = 'authenticated' // Always authenticated for testing
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip loading check for custom auth
    // if (status === 'loading') return

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

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">
            My Orders
          </h1>
          <p className="text-slate-300 font-inter">
            Track and manage your order history
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-slate-500 mb-4" />
              <h2 className="text-xl font-poppins font-semibold text-slate-200 mb-2">
                No Orders Yet
              </h2>
              <p className="text-slate-400 text-center mb-6">
                You haven't placed any orders yet. Start shopping to see your order history here.
              </p>
              <Link href="/catalog">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-poppins">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-poppins font-semibold text-white">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-slate-400 font-inter">
                        Placed on {formatDateTime(order.createdAt).full}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        className={`font-poppins font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Badge 
                        className={`font-poppins font-medium ${
                          order.isPaid 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                                                 {order.isPaid ? 'Confirmed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h3 className="text-sm font-poppins font-semibold text-slate-200 mb-3">
                        Items ({order.items.length})
                      </h3>
                      <div className="space-y-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-poppins font-medium text-slate-200 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-400 font-inter">
                                Qty: {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-xs text-slate-400 font-inter">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <h3 className="text-sm font-poppins font-semibold text-slate-200 mb-3">
                        Order Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-inter">Total:</span>
                          <span className="text-white font-poppins font-semibold">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-inter">Payment:</span>
                          <span className="text-slate-300 font-inter">
                                                    {order.paymentMethod === 'whatsapp' ? '📱 WhatsApp' : order.paymentMethod}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-slate-700">
                          <Link href={`/order/${order.id}`}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 font-poppins"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
