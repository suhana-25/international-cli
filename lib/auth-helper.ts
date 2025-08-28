// Authentication helper functions for Vercel compatibility

import { cookies } from 'next/headers'
import { getUserByEmail } from './user-store'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: Date
  updatedAt: Date
  lastSignIn?: Date
}

export interface AuthResult {
  success: boolean
  message: string
  user?: AuthUser
}

/**
 * Authenticate user with email (simplified for now)
 * This function is designed to work reliably on Vercel
 */
export async function authenticateUser(email: string, password?: string): Promise<AuthResult> {
  try {
    console.log('🔐 Auth Helper: Starting authentication for:', email)

    // Find user by email
    const user = await getUserByEmail(email.toLowerCase().trim())
    if (!user) {
      console.log('❌ Auth Helper: User not found for email:', email)
      return {
        success: false,
        message: 'Invalid email or password'
      }
    }
    
    console.log('✅ Auth Helper: User found:', user.name)
    
    // For now, just check if user exists (no password verification)
    // Return user data
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSignIn: user.lastSignIn
    }
    
    return {
      success: true,
      message: 'Authentication successful',
      user: authUser
    }
    
  } catch (error) {
    console.error('❌ Auth Helper: Authentication error:', error)
    return {
      success: false,
      message: 'Authentication failed. Please try again.'
    }
  }
}

/**
 * Get user by email (for verification purposes)
 */
export async function getUserByEmailSafe(email: string): Promise<AuthUser | null> {
  try {
    const user = await getUserByEmail(email.toLowerCase().trim())

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSignIn: user.lastSignIn
    }
  } catch (error) {
    console.error('❌ Auth Helper: Error getting user by email:', error)
    return null
  }
}

/**
 * Check if user exists and return basic info
 */
export async function checkUserExists(email: string): Promise<AuthResult> {
  try {
    console.log('🔐 Auth Helper: Checking if user exists:', email)

    const user = await getUserByEmail(email.toLowerCase().trim())
    if (!user) {
      console.log('❌ Auth Helper: User not found for email:', email)
      return {
        success: false,
        message: 'User not found'
      }
    }
    
    console.log('✅ Auth Helper: User found:', user.name)
    
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSignIn: user.lastSignIn
    }
    
    return {
      success: true,
      message: 'User found',
      user: authUser
    }
    
  } catch (error) {
    console.error('❌ Auth Helper: Error checking user:', error)
    return {
      success: false,
      message: 'Error checking user. Please try again.'
    }
  }
}
