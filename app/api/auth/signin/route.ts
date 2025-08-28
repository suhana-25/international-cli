import { NextRequest, NextResponse } from 'next/server'
import { updateLastSignIn } from '@/lib/user-store'
import { authenticateUser } from '@/lib/auth-helper'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Sign In API: Authentication attempt started')
    
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      console.log('❌ Sign In API: Missing email or password')
      return NextResponse.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, { status: 400 })
    }
    
    console.log('🔍 Sign In API: Verifying credentials for:', email)
    
    // Authenticate user using helper
    console.log('🔐 Sign In API: Calling authenticateUser...')
    const authResult = await authenticateUser(email, password)
    
    if (!authResult.success || !authResult.user) {
      console.log('❌ Sign In API: Authentication failed:', authResult.message)
      return NextResponse.json({ 
        success: false, 
        message: authResult.message 
      }, { status: 401 })
    }
    
    console.log('✅ Sign In API: Authentication successful for:', email)
    console.log('👤 User details:', { id: authResult.user.id, name: authResult.user.name, role: authResult.user.role })
    
    // Record the sign in
    console.log('📝 Sign In API: Recording sign in...')
    if (authResult.user?.id) {
      await updateLastSignIn(authResult.user.id)
    }
    
    // Return user data (without password)
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: authResult.user
    })
    
    console.log('✅ Sign In API: Response sent successfully')
    return response
    
  } catch (error) {
    console.error('❌ Sign In API: Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error. Please try again.' 
    }, { status: 500 })
  }
}
