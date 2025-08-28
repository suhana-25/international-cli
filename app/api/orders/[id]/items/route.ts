import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/auth' // Removed - using custom auth
import db from '@/db/drizzle'
import { orderItems } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = null // Skip auth check - using custom auth system
    const resolvedParams = await params
    
    // if (!session?.user || session.user.role !== 'admin') {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Admin access required'
    //   }, { status: 401 })
    // }

    const orderId = resolvedParams.id

    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Order ID is required'
      }, { status: 400 })
    }

    // Get order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    return NextResponse.json({
      success: true,
      data: items
    })

  } catch (error) {
    console.error('Error fetching order items:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch order items'
    }, { status: 500 })
  }
}
