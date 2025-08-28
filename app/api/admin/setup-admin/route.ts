import { NextRequest, NextResponse } from 'next/server'
import { initializeDefaultAdmin } from '@/lib/user-store'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Setting up admin user...')

    await initializeDefaultAdmin()

    return NextResponse.json({
      success: true,
      message: 'Admin user setup completed'
    })

  } catch (error) {
    console.error('❌ Failed to setup admin user:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to setup admin user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
