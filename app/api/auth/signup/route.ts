import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/user-store'
import { signUpFormSchema } from '@/lib/validator'

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Signup API: Registration attempt started')
    
    const body = await request.json()
    console.log('📋 Signup API: Request body received:', { 
      email: body.email, 
      name: body.name,
      role: body.role 
    })

    // Validate input
    const validation = signUpFormSchema.safeParse(body)
    if (!validation.success) {
      console.log('❌ Signup API: Validation failed:', validation.error.errors)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid input data',
          errors: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { name, email, role = 'user' } = validation.data

    // Create user using file-based storage
    console.log('💾 Signup API: Creating user in file storage...')
    const newUser = await createUser({
      name,
      email,
      role,
    })
    
    // Force reload users to update global cache
    const { reloadUsers } = await import('@/lib/user-store')
    console.log('🔄 Signup API: Reloading users after creation...')
    reloadUsers()

    console.log('✅ Signup API: User created successfully:', { 
      id: newUser.id, 
      email: newUser.email,
      role: newUser.role 
    })

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      }
    })

  } catch (error) {
    console.error('❌ Signup API: Error:', error)
    
    // Handle specific errors
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
