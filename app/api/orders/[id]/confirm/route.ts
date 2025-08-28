import { NextRequest, NextResponse } from 'next/server'
import { updateOrderToConfirmedByWhatsApp } from '@/lib/actions/order.actions'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      )
    }

    const result = await updateOrderToConfirmedByWhatsApp(orderId)
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Error confirming order:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to confirm order' },
      { status: 500 }
    )
  }
}
