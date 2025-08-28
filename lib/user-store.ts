// Simple user storage for admin-managed users
// Direct file operations without complex sync for reliability

import fs from 'fs'
import path from 'path'

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

// File-based storage path
const STORAGE_PATH = path.join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 })
      console.log('✅ Data directory created successfully')
    } catch (error) {
      console.error('❌ Error creating data directory:', error)
    }
  }
}

// Simple file operations
const readUsersFile = (): User[] => {
  try {
    ensureDataDir()
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8')
      const users = JSON.parse(data)
      // Parse dates and ensure all required fields exist
      return users.map((u: any) => ({
        ...u,
        role: u.role || 'user',
        signInCount: u.signInCount || 0,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
        lastSignIn: u.lastSignIn ? new Date(u.lastSignIn) : undefined
      }))
    }
  } catch (error) {
    console.error('❌ Error reading users file:', error)
  }
  return []
}

const writeUsersFile = (users: User[]): boolean => {
  try {
    ensureDataDir()
    
    // Create backup before writing
    if (fs.existsSync(STORAGE_PATH)) {
      const backupPath = STORAGE_PATH + '.backup'
      fs.copyFileSync(STORAGE_PATH, backupPath)
    }
    
    // Write with atomic operation
    const tempPath = STORAGE_PATH + '.tmp'
    fs.writeFileSync(tempPath, JSON.stringify(users, null, 2))
    fs.renameSync(tempPath, STORAGE_PATH)
    
    console.log(`✅ Users saved successfully: ${users.length} users`)
    return true
  } catch (error) {
    console.error('❌ Error saving users:', error)
    return false
  }
}

// In-memory storage
let users: User[] = readUsersFile()

// Force reload users from file
export const reloadUsers = (): User[] => {
  console.log('🔄 Force reloading users from file...')
  users = readUsersFile()
  console.log(`✅ Reloaded ${users.length} users`)
  return users
}

// User functions
export const getUsers = (): User[] => {
  // Always get fresh data from file
  users = readUsersFile()
  return users
}

export const getUserById = (id: string): User | null => {
  const freshUsers = readUsersFile()
  return freshUsers.find(user => user.id === id) || null
}

export const getUserByEmail = (email: string): User | null => {
  const freshUsers = readUsersFile()
  return freshUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

export const createUser = (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'signInCount'>): User => {
  // Get fresh data
  users = readUsersFile()
  
  const newUser: User = {
    ...data,
    id: Date.now().toString(),
    signInCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  users.push(newUser)
  
  // Save to file
  if (writeUsersFile(users)) {
    console.log(`✅ User created: ${newUser.email} (ID: ${newUser.id})`)
    console.log(`👥 Total users after creation: ${users.length}`)
  } else {
    console.error('❌ Failed to save user to file')
  }
  
  return newUser
}

export const updateUser = (id: string, data: Partial<User>): User | null => {
  users = readUsersFile()
  const index = users.findIndex(user => user.id === id)
  if (index === -1) return null
  
  users[index] = {
    ...users[index],
    ...data,
    updatedAt: new Date(),
  }
  
  if (writeUsersFile(users)) {
    console.log(`✅ User updated: ${users[index].email}`)
  }
  
  return users[index]
}

export const deleteUser = (id: string): boolean => {
  try {
    console.log(`🔍 Attempting to delete user with ID: ${id}`)
    
    // Get fresh data
    users = readUsersFile()
    console.log(`👥 Current users: ${users.length}`)
    
    const index = users.findIndex(user => user.id === id)
    if (index === -1) {
      console.log(`❌ User with ID ${id} not found`)
      return false
    }
    
    console.log(`🗑️ Found user at index ${index}, deleting...`)
    const deletedUser = users[index]
    users.splice(index, 1)
    
    // Save to file
    if (writeUsersFile(users)) {
      console.log(`✅ User deleted: ${deletedUser.email}`)
      console.log(`👥 Remaining users: ${users.length}`)
      return true
    } else {
      console.error('❌ Failed to save after deletion')
      return false
    }
    
  } catch (error) {
    console.error(`❌ Error in deleteUser for ID ${id}:`, error)
    return false
  }
}

export const updateLastSignIn = (email: string): boolean => {
  try {
    users = readUsersFile()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (user) {
      user.lastSignIn = new Date()
      user.signInCount = (user.signInCount || 0) + 1
      user.updatedAt = new Date()
      return writeUsersFile(users)
    }
    return false
  } catch (error) {
    console.error('❌ Error updating last sign in:', error)
    return false
  }
}

export const initializeDefaultAdmin = (): User | null => {
  try {
    users = readUsersFile()
    
    // Check if admin already exists
    const existingAdmin = users.find(u => u.role === 'admin')
    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return existingAdmin
    }
    
    // Create default admin
    const defaultAdmin: User = {
      id: Date.now().toString(),
      email: 'admin@niteshhandicraft.com',
      name: 'Admin',
      role: 'admin',
      signInCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    users.push(defaultAdmin)
    
    if (writeUsersFile(users)) {
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
export const getAllUsers = (options?: { page?: number; limit?: number }) => {
  const page = options?.page || 1
  const limit = options?.limit || 50
  const offset = (page - 1) * limit
  
  const allUsers = getUsers()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(offset, offset + limit)
    .map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastSignIn: user.lastSignIn?.toISOString()
    }))
  
  return {
    data: allUsers,
    totalPages: Math.ceil(getUsers().length / limit),
    currentPage: page,
    totalUsers: getUsers().length
  }
}

export const updateUserRole = (id: string, newRole: 'user' | 'admin' | 'moderator'): User | null => {
  const user = getUserById(id)
  if (!user) return null
  
  return updateUser(id, { role: newRole })
}

export const recordUserSignIn = (email: string): User | null => {
  try {
    users = readUsersFile()
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return null
    
    // Update sign in stats
    user.lastSignIn = new Date()
    user.signInCount = (user.signInCount || 0) + 1
    user.updatedAt = new Date()
    
    if (writeUsersFile(users)) {
      console.log(`✅ User sign in recorded for: ${email}`)
      return user
    }
    return null
  } catch (error) {
    console.error('❌ Error recording user sign in:', error)
    return null
  }
}
