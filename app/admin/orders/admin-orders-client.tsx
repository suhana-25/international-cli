'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { Order } from '@/lib/order-store'
import { Trash2, Eye, RefreshCw } from 'lucide-react'

interface AdminOrdersClientProps {
  currentPage: number
}

export default function AdminOrdersClient({ currentPage }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const ordersPerPage = 10
  const startIndex = (currentPage - 1) * ordersPerPage
  const endIndex = startIndex + ordersPerPage
  const paginatedOrders = orders.slice(startIndex, endIndex)
  const totalPages = Math.ceil(orders.length / ordersPerPage)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data || [])
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to fetch orders'
        })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        variant: 'destructive',
        description: 'Error fetching orders'
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return
    }

    try {
      setDeleting(orderId)
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          description: 'Order deleted successfully'
        })
        // Refresh orders
        fetchOrders()
      } else {
        throw new Error('Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to delete order'
      })
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="h2-bold">Orders</h1>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading orders...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="h2-bold">Orders ({orders.length})</h1>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No orders found</div>
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Orders
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ORDER ID</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>CUSTOMER</TableHead>
                  <TableHead>ITEMS</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>PAYMENT</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {formatId(order.id)}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateTime}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.shippingAddress?.fullName || 'No name'}</p>
                        <p className="text-sm text-gray-500">{order.shippingAddress?.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        <div className="text-xs text-gray-500">
                          {order.items.map(item => item.name).join(', ').substring(0, 50)}
                          {order.items.map(item => item.name).join(', ').length > 50 ? '...' : ''}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={order.isPaid ? "default" : "secondary"}>
                          {order.isPaid ? "Confirmed" : "Pending"}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {order.paymentMethod === 'whatsapp' ? (
                            <div className="flex items-center gap-1">
                              <span className="text-green-600">📱 WhatsApp</span>
                            </div>
                          ) : (
                            order.paymentMethod
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === 'delivered' ? "default" : 
                          order.status === 'shipped' ? "secondary" : 
                          order.status === 'confirmed' ? "outline" : 
                          "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/order/${order.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteOrder(order.id)}
                          disabled={deleting === order.id}
                        >
                          {deleting === order.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination page={currentPage.toString()} totalPages={totalPages} />
          )}
        </>
      )}
    </div>
  )
}
