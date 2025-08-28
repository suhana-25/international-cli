import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcrypt-ts-edge'
import { sql } from '@vercel/postgres'
import crypto from 'crypto'

const ADMIN_CREATION_SECRET = process.env.ADMIN_CREATION_SECRET || 'ADMIN_SECRET_2024'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, email, password, name } = body

    // Verify secret key
    if (secret !== ADMIN_CREATION_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE role = 'admin' LIMIT 1
    `
    
    if (existingAdmin.rows.length > 0) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 409 }
      )
    }

    // Check if email already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new admin user
    const adminId = crypto.randomUUID()
    const hashedPassword = await hash(password, 12)

    await sql`
      INSERT INTO users (id, name, email, password, role, created_at, updated_at)
      VALUES (${adminId}, ${name}, ${email}, ${hashedPassword}, 'admin', NOW(), NOW())
    `

    console.log('✅ Admin user created successfully:', { email, name })

    return NextResponse.json(
      { 
        message: 'Admin user created successfully',
        admin: { id: adminId, name, email, role: 'admin' }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 

