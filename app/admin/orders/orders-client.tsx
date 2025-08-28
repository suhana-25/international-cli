'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Package, Eye, RefreshCw, Trash2, MessageCircle, CheckCircle } from 'lucide-react'
import { formatDistance } from 'date-fns'

interface Order {
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

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const result = await response.json()

      if (result.success) {
        setOrders(result.data || [])
      } else {
        console.error('Failed to fetch orders:', result.message)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderNumber}?\n\nThis action cannot be undone and will permanently remove the order and all its items.`)) {
      return
    }

    setDeletingId(orderId)
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Remove the deleted order from the list
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))
        alert('Order deleted successfully!')
      } else {
        alert(`Failed to delete order: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirm('Confirm this order via WhatsApp? This will mark it as confirmed.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'PUT',
      })

      const result = await response.json()

      if (result.success) {
        // Update the order status locally
        setOrders(prevOrders => prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'confirmed', isPaid: true }
            : order
        ))
        alert('Order confirmed successfully!')
      } else {
        alert(`Failed to confirm order: ${result.message}`)
      }
    } catch (error) {
      console.error('Error confirming order:', error)
      alert('Error confirming order. Please try again.')
    }
  }

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

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const parseAddress = (addressStr: string) => {
    try {
      const address = JSON.parse(addressStr)
      return `${address.fullName}, ${address.city}, ${address.country}`
    } catch {
      return 'Invalid Address'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Orders</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{orders.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {orders.filter(o => o.isPaid).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {orders.filter(o => !o.isPaid).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ${orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.total, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            All Orders
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">No orders have been placed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                                        <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.id}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {order.shippingAddress.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.userId.startsWith('guest-') ? 'Guest User' : `ID: ${order.userId.slice(0, 8)}...`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items[0]?.name}
                          {order.items.length > 1 && ` +${order.items.length - 1} more`}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(order.isPaid ? 'completed' : 'pending')}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {order.paymentMethod === 'whatsapp' ? (
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3 text-green-600" />
                            <span>WhatsApp</span>
                          </div>
                        ) : (
                          order.paymentMethod
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                           <Button 
                             variant="ghost" 
                             size="sm"
                             onClick={() => window.location.href = `/admin/orders/${order.id}`}
                             title="View Order Details"
                           >
                             <Eye className="h-4 w-4" />
                           </Button>
                           
                           {order.status === 'pending' && order.paymentMethod === 'whatsapp' && (
                             <Button 
                               variant="ghost" 
                               size="sm"
                               onClick={() => handleConfirmOrder(order.id)}
                               className="text-green-600 hover:text-green-700 hover:bg-green-50"
                               title="Confirm Order via WhatsApp"
                             >
                               <CheckCircle className="h-4 w-4" />
                             </Button>
                           )}
                           
                           <Button 
                             variant="ghost" 
                             size="sm"
                             onClick={() => handleDeleteOrder(order.id, order.id)}
                             disabled={deletingId === order.id}
                             className="text-red-600 hover:text-red-700 hover:bg-red-50"
                             title="Delete Order"
                           >
                             {deletingId === order.id ? (
                               <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                             ) : (
                               <Trash2 className="h-4 w-4" />
                             )}
                           </Button>
                         </div>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
