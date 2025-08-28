import { verifyAdminPassword, recordUserSignIn } from './admin-store'

export async function simpleAuth(email: string, password: string) {
  try {
    console.log('🔐 Simple Auth: Checking credentials for:', email)
    
    // Verify admin credentials using admin store
    const admin = await verifyAdminPassword(email, password)
    
    if (!admin) {
      console.log('❌ Simple Auth: Invalid credentials')
      return null
    }

    console.log('✅ Simple Auth: Authentication successful!')
    
    // Record the sign in
    recordUserSignIn(email)
    
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    }
  } catch (error) {
    console.error('❌ Simple Auth: Error:', error)
    return null
  }
}
