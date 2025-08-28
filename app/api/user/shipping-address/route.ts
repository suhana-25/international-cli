import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/lib/auth' // Removed - using custom auth
import { getUserById } from '@/lib/actions/user.actions'

export async function GET(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // For guest users, check localStorage (this will be handled on frontend)
    // if (!session?.user?.id) {
      // Check if guest has saved address in localStorage
      // This will be handled by frontend, return success for now
          //   return NextResponse.json({
    //     success: true,
    //     message: 'Guest checkout - address will be checked on frontend',
    //     isGuest: true
    //   })
    // }

    const user = await getUserById("admin")
    
    if (!user) {
      // User not found but session exists (OAuth user)
      return NextResponse.json({ 
        success: true, 
        message: 'Temporary user - address will be checked on frontend',
        isGuest: true 
      })
    }

    // Check if user has address
    if (user.address) {
      return NextResponse.json({ 
        success: true, 
        message: 'Shipping address found',
        data: user.address 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'No shipping address found' 
      }, { status: 404 })
    }
  } catch (error) {
    console.error('Error checking shipping address:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to check shipping address' 
    }, { status: 500 })
  }
}

