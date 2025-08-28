import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrders } from '@/lib/order-store'

export async function POST(request: NextRequest) {
  try {
    const { items, total, shippingAddress, paymentMethod, userId } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No items in order'
      }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({
        success: false,
        message: 'Shipping address is required'
      }, { status: 400 })
    }

    if (!paymentMethod) {
      return NextResponse.json({
        success: false,
        message: 'Payment method is required'
      }, { status: 400 })
    }

    // Create order data for the file-based store
    const orderData = {
      userId: userId || `guest-${Date.now()}`,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price.toString()),
        quantity: item.quantity,
        image: item.image
      })),
      total: parseFloat(total.toString()),
      shippingAddress: {
        fullName: shippingAddress.fullName || shippingAddress.name || 'Guest User',
        streetAddress: shippingAddress.streetAddress || shippingAddress.address || '',
        city: shippingAddress.city || '',
        country: shippingAddress.country || '',
        postalCode: shippingAddress.postalCode || '',
        phone: shippingAddress.phone || ''
      },
      paymentMethod: paymentMethod
    }

    // Create order using file-based store
    const order = createOrder(orderData)

    console.log('Order created successfully:', {
      orderId: order.id,
      userId: order.userId,
      total: order.total,
      status: order.status
    })

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      id: order.id,
      orderId: order.id,
      orderNumber: order.id,
      total: order.total,
      status: order.status
    })

  } catch (error) {
    console.error('Error creating order:', error) 
    return NextResponse.json({
      success: false,
      message: 'Failed to create order'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all orders from file-based store
    const allOrders = getOrders()

    return NextResponse.json({
      success: true,
      data: allOrders
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch orders'
    }, { status: 500 })
  }
}