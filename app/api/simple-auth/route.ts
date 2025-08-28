import { NextRequest, NextResponse } from 'next/server'
import { simpleAuth } from '@/lib/simple-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('📨 Simple Auth API: Login attempt for:', email)
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    const user = await simpleAuth(email, password)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('✅ Simple Auth API: Login successful for:', user.email)
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })
    
  } catch (error) {
    console.error('❌ Simple Auth API: Error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

