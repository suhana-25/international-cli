import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

const ADMIN_CREATION_SECRET = process.env.ADMIN_CREATION_SECRET || 'ADMIN_SECRET_2024'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body

    // Verify secret key
    if (secret !== ADMIN_CREATION_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Remove all existing admin users
    const result = await sql`
      DELETE FROM users WHERE role = 'admin'
    `

    console.log('✅ Removed all existing admin users')

    return NextResponse.json(
      { 
        message: 'All admin users removed successfully',
        deletedCount: result.rowCount
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error removing admin users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 

