// Client-safe user store that calls API endpoints
// No file system operations - all data handled via HTTP requests

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: Date
  updatedAt: Date
  lastSignIn?: Date
  signInCount: number
}

// API base URL
const API_BASE = '/api/users'

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  return response.json()
}

// User functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(API_BASE)
    const data = await handleResponse(response)
    return data.users || []
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    return []
  }
}

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE}?id=${id}`)
    const data = await handleResponse(response)
    return data.user || null
  } catch (error) {
    console.error('❌ Error fetching user by ID:', error)
    return null
  }
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const users = await getUsers()
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  } catch (error) {
    console.error('❌ Error fetching user by email:', error)
    return null
  }
}

export const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'signInCount'>): Promise<User | null> => {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    const result = await handleResponse(response)
    return result.user || null
  } catch (error) {
    console.error('❌ Error creating user:', error)
    return null
  }
}

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  try {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    })
    
    const result = await handleResponse(response)
    return result.user || null
  } catch (error) {
    console.error('❌ Error updating user:', error)
    return null
  }
}

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: 'DELETE',
    })
    
    await handleResponse(response)
    return true
  } catch (error) {
    console.error('❌ Error deleting user:', error)
    return false
  }
}

export const updateLastSignIn = async (email: string): Promise<boolean> => {
  try {
    const user = await getUserByEmail(email)
    if (user) {
      const updated = await updateUser(user.id, {
        lastSignIn: new Date(),
        signInCount: (user.signInCount || 0) + 1,
      })
      return updated !== null
    }
    return false
  } catch (error) {
    console.error('❌ Error updating last sign in:', error)
    return false
  }
}

export const initializeDefaultAdmin = async (): Promise<User | null> => {
  try {
    const users = await getUsers()
    
    // Check if admin already exists
    const existingAdmin = users.find(u => u.role === 'admin')
    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return existingAdmin
    }
    
    // Create default admin
    const defaultAdmin = await createUser({
      email: 'admin@niteshhandicraft.com',
      name: 'Admin',
      role: 'admin',
    })
    
    if (defaultAdmin) {
      console.log('✅ Default admin user created')
      return defaultAdmin
    } else {
      console.error('❌ Failed to create default admin')
      return null
    }
  } catch (error) {
    console.error('❌ Error initializing default admin:', error)
    return null
  }
}

// Additional functions needed by the system
export const getAllUsers = async (options?: { page?: number; limit?: number }) => {
  try {
    const page = options?.page || 1
    const limit = options?.limit || 50
    const offset = (page - 1) * limit
    
    const allUsers = await getUsers()
    const sortedUsers = allUsers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit)
      .map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastSignIn: user.lastSignIn?.toISOString()
      }))
    
    return {
      data: sortedUsers,
      totalPages: Math.ceil(allUsers.length / limit),
      currentPage: page,
      totalUsers: allUsers.length
    }
  } catch (error) {
    console.error('❌ Error getting all users:', error)
    return {
      data: [],
      totalPages: 0,
      currentPage: options?.page || 1,
      totalUsers: 0
    }
  }
}

export const updateUserRole = async (id: string, newRole: 'user' | 'admin' | 'moderator'): Promise<User | null> => {
  try {
    const user = await getUserById(id)
    if (!user) return null
    
    return await updateUser(id, { role: newRole })
  } catch (error) {
    console.error('❌ Error updating user role:', error)
    return null
  }
}

export const recordUserSignIn = async (email: string): Promise<User | null> => {
  try {
    const user = await getUserByEmail(email)
    if (!user) return null
    
    // Update sign in stats
    const updated = await updateUser(user.id, {
      lastSignIn: new Date(),
      signInCount: (user.signInCount || 0) + 1,
    })
    
    if (updated) {
      console.log(`✅ User sign in recorded for: ${email}`)
      return updated
    }
    return null
  } catch (error) {
    console.error('❌ Error recording user sign in:', error)
    return null
  }
}

// Force reload users from API (for admin panel refresh)
export const reloadUsers = async (): Promise<User[]> => {
  console.log('🔄 Force reloading users from API...')
  const users = await getUsers()
  console.log(`✅ Reloaded ${users.length} users`)
  return users
}
