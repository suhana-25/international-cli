import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/lib/auth' // Removed - using custom auth
import { 
  getUserData, 
  saveUserInfo, 
  saveUserCart, 
  getUserCart,
  saveUserShippingAddress,
  saveUserPaymentMethod 
} from '@/lib/user-data-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    // if (!session?.user?.id) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    // }

    const userData = getUserData("admin")
    return NextResponse.json({ 
      success: true, 
      data: userData 
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch user data' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    // if (!session?.user?.id) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'cart':
        saveUserCart("admin", data)
        break
      case 'shipping-address':
        saveUserShippingAddress("admin", data)
        break
      case 'payment-method':
        // Skip payment method for WhatsApp orders
        // saveUserPaymentMethod("admin", data)
        break
      case 'preferences':
        saveUserInfo("admin", { preferences: data })
        break
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid data type' 
        }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User data saved successfully' 
    })
  } catch (error) {
    console.error('Error saving user data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save user data' 
    }, { status: 500 })
  }
}

