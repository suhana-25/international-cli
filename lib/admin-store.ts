// Centralized admin storage for managing admin users
// This replaces database storage for now to avoid migration issues

import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

export interface AdminUser {
  id: string
  name: string
  email: string
  password: string // Hashed password
  role: 'admin' | 'super_admin'
  created_at: Date
  updated_at: Date
}

// File-based storage path
const STORAGE_PATH = path.join(process.cwd(), 'data', 'admins.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 })
      console.log('✅ Data directory created successfully')
    } catch (error) {
      console.error('❌ Error creating data directory:', error)
      // Try alternative approach
      try {
        fs.mkdirSync(dataDir, { recursive: true })
        console.log('✅ Data directory created with alternative method')
      } catch (altError) {
        console.error('❌ Failed to create data directory:', altError)
      }
    }
  }
}

// Load admin users from file
const loadAdminUsers = (): AdminUser[] => {
  try {
    ensureDataDir()
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8')
      const parsedAdmins = JSON.parse(data)
      return parsedAdmins.map((admin: any) => ({
        ...admin,
        created_at: new Date(admin.created_at),
        updated_at: new Date(admin.updated_at)
      }))
    }
  } catch (error) {
    console.log('Error loading admin users:', error)
  }
  return [] // Start with empty array if no file or error
}

// Save admin users to file
const saveAdminUsers = (admins: AdminUser[]) => {
  try {
    console.log(`💾 Attempting to save ${admins.length} admin users to file...`)
    ensureDataDir()
    
    // Try to save directly without permission check
    const data = JSON.stringify(admins, null, 2)
    fs.writeFileSync(STORAGE_PATH, data)
    console.log(`✅ Successfully saved ${admins.length} admin users to ${STORAGE_PATH}`)
  } catch (error) {
    console.error('❌ Error saving admin users to file:', error)
    
    // If write fails, try to create the file with different permissions
    try {
      console.log('🔄 Attempting to save admin users with alternative method...')
      
      // Try to create parent directory if it doesn't exist
      const dataDir = path.dirname(STORAGE_PATH)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 })
      }
      
      // Try writing again
      const data = JSON.stringify(admins, null, 2)
      fs.writeFileSync(STORAGE_PATH, data, { mode: 0o644 })
      console.log(`✅ Successfully saved ${admins.length} admin users with alternative method`)
    } catch (retryError) {
      console.error('❌ Failed to save admin users even with retry:', retryError)
      // Don't throw error, just log it and continue with in-memory storage
      console.log('⚠️ Continuing with in-memory storage only')
    }
  }
}

// In-memory storage - Load from file or start empty
let adminUsers: AdminUser[] = loadAdminUsers()

// Initialize with default admin if no admins exist
if (adminUsers.length === 0) {
  console.log('🔧 No admin users found, creating default admin...')
  const defaultAdmin: AdminUser = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@niteshhandicraft.com',
    password: '$2a$10$default.hash.for.admin.password', // This will be updated
    role: 'super_admin',
    created_at: new Date(),
    updated_at: new Date()
  }
  adminUsers = [defaultAdmin]
  saveAdminUsers(adminUsers)
  console.log('✅ Default admin created')
}

// Force reload admin users from file (for cache busting)
export const reloadAdminUsers = (): AdminUser[] => {
  console.log('🔄 Force reloading admin users from file...')
  adminUsers = loadAdminUsers()
  console.log(`✅ Reloaded ${adminUsers.length} admin users`)
  return adminUsers
}

// Admin functions
export const getAdminUsers = (): AdminUser[] => {
  return adminUsers
}

export const getAdminUserById = (id: string): AdminUser | null => {
  return adminUsers.find(admin => admin.id === id) || null
}

export const getAdminUserByEmail = (email: string): AdminUser | null => {
  return adminUsers.find(admin => admin.email.toLowerCase() === email.toLowerCase()) || null
}

export const createAdminUser = async (data: Omit<AdminUser, 'id' | 'created_at' | 'updated_at' | 'password'> & { password: string }): Promise<AdminUser> => {
  // Check if email already exists
  const existingAdmin = getAdminUserByEmail(data.email)
  if (existingAdmin) {
    throw new Error('Admin user with this email already exists')
  }

  // Hash the password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(data.password, saltRounds)

  const newAdmin: AdminUser = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date()
  }
  
  adminUsers.push(newAdmin)
  saveAdminUsers(adminUsers)
  console.log('✅ Admin user created:', newAdmin.id)
  return newAdmin
}

export const updateAdminUser = (id: string, updates: Partial<Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>>): AdminUser | null => {
  const index = adminUsers.findIndex(admin => admin.id === id)
  if (index === -1) return null
  
  adminUsers[index] = {
    ...adminUsers[index],
    ...updates,
    updated_at: new Date()
  }
  
  saveAdminUsers(adminUsers)
  console.log('✅ Admin user updated:', id)
  return adminUsers[index]
}

export const deleteAdminUser = (id: string): boolean => {
  try {
    console.log(`🔍 Attempting to delete admin user with ID: ${id}`)
    console.log(`👥 Current admin users in memory: ${adminUsers.length}`)
    
    // Don't allow deletion if this is the last admin
    if (adminUsers.length <= 1) {
      console.log('❌ Cannot delete the last admin user')
      return false
    }
    
    // Force reload to ensure we have latest data
    adminUsers = loadAdminUsers()
    console.log(`👥 After reload: ${adminUsers.length} admin users`)
    
    const index = adminUsers.findIndex(admin => admin.id === id)
    if (index === -1) {
      console.log(`❌ Admin user with ID ${id} not found`)
      return false
    }
    
    console.log(`🗑️ Found admin user at index ${index}, deleting...`)
    const deletedAdmin = adminUsers[index]
    adminUsers.splice(index, 1)
    
    console.log(`💾 Saving updated admin users list to file...`)
    saveAdminUsers(adminUsers)
    
    // Force reload from file to ensure consistency
    adminUsers = loadAdminUsers()
    console.log(`✅ Admin user deleted. Remaining users: ${adminUsers.length}`)
    
    // Verify deletion
    const verifyAdmin = adminUsers.find(a => a.id === id)
    if (verifyAdmin) {
      console.log(`⚠️ Admin user still exists after deletion! File save may have failed.`)
      return false
    }
    
    console.log(`✅ Admin user deletion verified successfully`)
    return true
    
  } catch (error) {
    console.error(`❌ Error in deleteAdminUser for ID ${id}:`, error)
    return false
  }
}

export const verifyAdminPassword = async (email: string, password: string): Promise<AdminUser | null> => {
  const admin = getAdminUserByEmail(email)
  if (!admin) return null
  
  const isValidPassword = await bcrypt.compare(password, admin.password)
  return isValidPassword ? admin : null
}

export const changeAdminPassword = async (id: string, newPassword: string): Promise<boolean> => {
  try {
    const admin = getAdminUserById(id)
    if (!admin) return false
    
    // Hash the new password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
    
    // Update the password
    const success = updateAdminUser(id, { password: hashedPassword })
    return success !== null
  } catch (error) {
    console.error('Error changing admin password:', error)
    return false
  }
}

export const recordUserSignIn = (email: string): void => {
  console.log(`📝 Recording admin sign in for: ${email}`)
  // This function is called when an admin signs in
  // We can add logging or tracking here if needed
}
