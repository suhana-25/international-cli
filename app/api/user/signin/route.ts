import { NextRequest, NextResponse } from 'next/server'
import { recordUserSignIn } from '@/lib/user-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    console.log('👤 Recording user sign in for:', email)
    
    // Record the sign in
    const user = recordUserSignIn(email)
    
    if (user) {
      console.log('✅ User sign in recorded successfully')
      return NextResponse.json({ 
        success: true, 
        message: 'Sign in recorded',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastSignIn: user.lastSignIn,
          signInCount: user.signInCount
        }
      })
    } else {
      console.log('❌ User not found for sign in recording')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
  } catch (error) {
    console.error('❌ Error recording user sign in:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
