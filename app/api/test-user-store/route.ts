import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, getUsers } from '@/lib/user-store'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing enhanced user store...')
    
    // Test getting all users
    const allUsers = await getUsers()
    console.log('📊 All users:', allUsers.length)
    
    // Test getting admin user by email
    const adminUser = await getUserByEmail('admin@niteshhandicraft.com')
    console.log('👑 Admin user found:', !!adminUser)
    
    if (adminUser) {
      console.log('✅ Admin user details:', {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      })
    }
    
    return NextResponse.json({
      success: true,
      totalUsers: allUsers.length,
      adminUserFound: !!adminUser,
      adminUser: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      } : null
    })
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
