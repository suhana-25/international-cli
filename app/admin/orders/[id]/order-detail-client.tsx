'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  MapPin, 
  MessageCircle, 
  ArrowLeft, 
  User,
  Calendar,
  Hash,
  Truck,
  Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistance } from 'date-fns'

interface OrderDetailClientProps {
  order: {
    id: string
    userId: string
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
      image?: string
    }>
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
    paidAt?: string
    isDelivered: boolean
    deliveredAt?: string
    createdAt: string
    updatedAt?: string
  }
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-emerald-100 text-emerald-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  const handleDeleteOrder = async () => {
    if (!confirm(`Are you sure you want to delete order ${order.id}?\n\nThis action cannot be undone and will permanently remove the order and all its items.`)) {
      return
    }

    setDeleting(true)
    
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        alert('Order deleted successfully!')
        router.push('/admin/orders')
      } else {
        alert(`Failed to delete order: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <Badge className={getPaymentStatusColor(order.isPaid)}>
              {order.isPaid ? 'Paid' : 'Pending'}
            </Badge>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteOrder}
            disabled={deleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Deleting...' : 'Delete Order'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <p className="capitalize">{order.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Order Date:</span>
                  <p>{formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <Badge className={getPaymentStatusColor(order.isPaid)}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.items.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No items found for this order</p>
              ) : (
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Unit Price: ${item.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Customer Name:</span>
                  <p className="font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">User ID:</span>
                  <p className="font-mono text-sm">
                    {order.userId.startsWith('guest-') ? 'Guest User' : order.userId}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">User Type:</span>
                  <p className="font-medium">
                    {order.userId.startsWith('guest-') ? 'Guest User' : 'Registered User'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress.streetAddress}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Method:</span>
                  <p className="font-medium capitalize">
                    {order.paymentMethod === 'whatsapp' ? (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-green-600" />
                        <span>WhatsApp Order</span>
                      </div>
                    ) : (
                      order.paymentMethod
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={getPaymentStatusColor(order.isPaid)}>
                    {order.isPaid ? 'Confirmed' : 'Pending'}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Amount:</span>
                  <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                </div>
                {order.isPaid && order.paidAt && (
                  <div>
                    <span className="text-sm text-gray-600">Confirmed At:</span>
                    <p className="text-sm">{formatDistance(new Date(order.paidAt), new Date(), { addSuffix: true })}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
