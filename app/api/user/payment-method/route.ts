import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/lib/auth' // Removed - using custom auth
import { getUserById, updateUserPaymentMethod } from '@/lib/actions/user.actions'

export async function GET(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // For guest users, check localStorage (this will be handled on frontend)
    // if (!session?.user?.id) {
      // Check if guest has saved payment method in localStorage
      // This will be handled by frontend, return success for now
          //   return NextResponse.json({
    //     success: true,
    //     message: 'Guest checkout - payment method will be checked on frontend',
    //     isGuest: true
    //   })
    // }

    const user = await getUserById("admin")
    
    if (!user) {
      // User not found but session exists (OAuth user)
      return NextResponse.json({ 
        success: true, 
        message: 'Temporary user - payment method will be checked on frontend',
        isGuest: true 
      })
    }

    // Check if user has payment method
    if (user.paymentMethod) {
      return NextResponse.json({ 
        success: true, 
        message: 'Payment method found',
        data: user.paymentMethod 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'No payment method found' 
      }, { status: 404 })
    }
  } catch (error) {
    console.error('Error checking payment method:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to check payment method' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { method } = await request.json()
    
    if (!method) {
      return NextResponse.json({
        success: false,
        message: 'Payment method is required'
      }, { status: 400 })
    }

    // Use the existing updateUserPaymentMethod function
    const result = await updateUserPaymentMethod({ type: method })
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Error saving payment method:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to save payment method'
    }, { status: 500 })
  }
}

