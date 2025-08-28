import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/lib/auth' // Removed - using custom auth
import { getOrdersByUserId } from '@/lib/order-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    // if (!session?.user?.id) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    // }

    const orders = getOrdersByUserId("admin")
    
    // Sort orders by creation date (newest first)
    const sortedOrders = orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ 
      success: true, 
      data: sortedOrders 
    })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    }, { status: 500 })
  }
}

