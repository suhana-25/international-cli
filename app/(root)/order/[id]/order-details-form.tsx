'use client'

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import { Order } from '@/lib/order-store'
import Image from 'next/image'
import Link from 'next/link'
import {
  deliverOrder,
  updateOrderToConfirmedByWhatsApp,
} from '@/lib/actions/order.actions'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import StripePayment from './stripe-payment'
import jsPDF from 'jspdf'

export default function OrderDetailsForm({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Order
  paypalClientId: string
  isAdmin: boolean
  stripeClientSecret: string | null
}) {
  // Parse order items from the items array with proper error handling
  const orderItems = (() => {
    try {
      if (!order?.items) {
        console.log('Order items is null or undefined')
        return []
      }
      
      if (!Array.isArray(order.items)) {
        console.log('Order items is not an array:', order.items)
        return []
      }
      
      const parsedItems = order.items.map((item: any, index: number) => {
        try {
          if (typeof item === 'string') {
            return JSON.parse(item)
          }
          return item
        } catch (error) {
          console.error(`Error parsing order item at index ${index}:`, error, item)
          return null
        }
      }).filter(Boolean) // Remove any null items
      
      console.log('Parsed order items:', parsedItems)
      return parsedItems
    } catch (error) {
      console.error('Error parsing order items:', error)
      return []
    }
  })()
  
  // Parse shipping address with proper error handling
  const shippingAddress = (() => {
    try {
      if (!order?.shippingAddress) {
        console.log('Shipping address is null or undefined')
        return null
      }
      
      if (typeof order.shippingAddress === 'string') {
        return JSON.parse(order.shippingAddress)
      }
      
      return order.shippingAddress
    } catch (error) {
      console.error('Error parsing shipping address:', error)
      return null
    }
  })()

  // Adapt our order structure to the expected format
  const {
    total,
    paymentMethod,
    isPaid,
    status,
  } = order
  
  // Calculate derived values for compatibility
  const itemsPrice = total || 0
  const taxPrice = 0
  const shippingPrice = 0
  const totalPrice = total || 0
  const paymentStatus = isPaid ? 'paid' : 'pending'

  const { toast } = useToast()

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    } else if (isRejected) {
      status = 'Failed to load PayPal'
    }
    return <div className="text-center">{status}</div>
  }

  const handleDownloadInvoice = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('Invoice', 105, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text(`Order ID: ${formatId(order.id)}`, 20, 40)
    doc.text(`Date: ${formatDateTime(order.createdAt).dateTime}`, 20, 50)
    doc.text(`Total: ${formatCurrency(totalPrice || 0)}`, 20, 60)
    doc.save(`invoice-${formatId(order.id)}.pdf`)
  }

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition()
    return (
      <Button
        onClick={() => {
          startTransition(async () => {
            try {
              await updateOrderToConfirmedByWhatsApp(order.id)
              toast({
                description: 'Order marked as paid',
              })
              window.location.reload()
            } catch (error) {
              toast({
                variant: 'destructive',
                description: 'Failed to mark order as paid',
              })
            }
          })
        }}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Updating...' : 'Mark as Paid (COD)'}
      </Button>
    )
  }

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition()
    return (
      <Button
        onClick={() => {
          startTransition(async () => {
            try {
              await deliverOrder(order.id)
              toast({
                description: 'Order marked as delivered',
              })
              window.location.reload()
            } catch (error) {
              toast({
                variant: 'destructive',
                description: 'Failed to mark order as delivered',
              })
            }
          })
        }}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Updating...' : 'Mark as Delivered'}
      </Button>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <div className="flex gap-2">
            <Button onClick={handleDownloadInvoice} variant="outline">
              Download Invoice
            </Button>
            <Button asChild variant="outline">
              <Link href={`/invoice/${order.id}`}>
                View Invoice
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 md:gap-5">
          <div className="overflow-x-auto md:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-4 gap-4">
                <h2 className="text-xl pb-4">Shipping Address</h2>
                {shippingAddress ? (
                  <>
                    <p className="font-medium">{shippingAddress.fullName}</p>
                    <p className="text-muted-foreground">{shippingAddress.phone}</p>
                    <p className="text-muted-foreground">
                      {shippingAddress.streetAddress}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No shipping address available</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 gap-4">
                <h2 className="text-xl pb-4">Payment Method</h2>
                <p className="font-medium">{paymentMethod}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 gap-4">
                <h2 className="text-xl pb-4">Order Status</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Payment Status:</span>
                    {paymentStatus === 'paid' ? (
                      <Badge variant="default">Paid</Badge>
                    ) : (
                      <Badge variant="destructive">Not paid</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Delivery Status:</span>
                    {status === 'delivered' ? (
                      <Badge variant="secondary">Delivered</Badge>
                    ) : (
                      <Badge variant="destructive">Not delivered</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 gap-4">
                <h2 className="text-xl pb-4">Order Items</h2>
                {orderItems && orderItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Link
                              href={`/product/${item.slug}`}
                              className="flex items-center"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              ></Image>
                              <span className="px-2">{item.name}</span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span className="px-2">{item.qty}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No items found</p>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-4 space-y-4 gap-4">
                <h2 className="text-xl pb-4">Order Summary</h2>
                <div className="flex justify-between">
                  <div>Items</div>
                  <div>{formatCurrency(itemsPrice || 0)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Shipping</div>
                  <div>{formatCurrency(shippingPrice || 0)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Tax</div>
                  <div>{formatCurrency(taxPrice || 0)}</div>
                </div>
                <div className="flex justify-between font-bold">
                  <div>Total</div>
                  <div>{formatCurrency(totalPrice || 0)}</div>
                </div>

                {paymentStatus !== 'paid' && (
                  <div className="space-y-2">
                    {paymentMethod === 'PayPal' && (
                      <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                        <PrintLoadingState />
                        <PayPalButtons
                          createOrder={() => Promise.resolve('test-order-id')}
                          onApprove={() => Promise.resolve()}
                        />
                      </PayPalScriptProvider>
                    )}

                    {paymentMethod === 'Stripe' && stripeClientSecret && (
                      <StripePayment 
                        priceInCents={Math.round(Number(totalPrice) * 100)}
                        orderId={order.id}
                        clientSecret={stripeClientSecret} 
                      />
                    )}

                    {paymentMethod === 'COD' && isAdmin && <MarkAsPaidButton />}
                  </div>
                )}

                {paymentStatus === 'paid' && status !== 'delivered' && isAdmin && <MarkAsDeliveredButton />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}