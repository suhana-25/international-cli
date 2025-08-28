// Simple category storage for admin-managed categories
// Direct file operations without complex sync for reliability
// Now with real-time notifications via Pusher

import fs from 'fs'
import path from 'path'
import { notifyCategoryChange } from './pusher'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

// File-based storage path
const STORAGE_PATH = path.join(process.cwd(), 'data', 'categories.json')

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
const readCategoriesFile = (): Category[] => {
  try {
    ensureDataDir()
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8')
      const categories = JSON.parse(data)
      // Parse dates
      return categories.map((cat: any) => ({
        ...cat,
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt)
      }))
    }
  } catch (error) {
    console.error('❌ Error reading categories file:', error)
  }
  return []
}

const writeCategoriesFile = (categories: Category[]): boolean => {
  try {
    ensureDataDir()
    
    // Create backup before writing
    if (fs.existsSync(STORAGE_PATH)) {
      const backupPath = STORAGE_PATH + '.backup'
      fs.copyFileSync(STORAGE_PATH, backupPath)
    }
    
    // Write with atomic operation
    const tempPath = STORAGE_PATH + '.tmp'
    fs.writeFileSync(tempPath, JSON.stringify(categories, null, 2))
    fs.renameSync(tempPath, STORAGE_PATH)
    
    console.log(`✅ Categories saved successfully: ${categories.length} categories`)
    return true
  } catch (error) {
    console.error('❌ Error saving categories:', error)
    return false
  }
}

// In-memory storage
let categories: Category[] = readCategoriesFile()

// Force reload categories from file
export const reloadCategories = (): Category[] => {
  console.log('🔄 Force reloading categories from file...')
  categories = readCategoriesFile()
  console.log(`✅ Reloaded ${categories.length} categories`)
  return categories
}

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Category functions
export const getCategories = (): Category[] => {
  // Always get fresh data from file
  categories = readCategoriesFile()
  return categories
}

export const getCategoryById = (id: string): Category | null => {
  const freshCategories = readCategoriesFile()
  return freshCategories.find(category => category.id === id) || null
}

export const getCategoryBySlug = (slug: string): Category | null => {
  const freshCategories = readCategoriesFile()
  return freshCategories.find(category => category.slug === slug) || null
}

export const createCategory = async (data: Omit<Category, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
  // Get fresh data
  categories = readCategoriesFile()
  
  // Generate unique slug
  let slug = generateSlug(data.name)
  let counter = 1
  while (categories.some(cat => cat.slug === slug)) {
    slug = `${generateSlug(data.name)}-${counter}`
    counter++
  }
  
  const newCategory: Category = {
    ...data,
    slug,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  categories.push(newCategory)
  
  // Save to file
  if (writeCategoriesFile(categories)) {
    console.log(`✅ Category created: ${newCategory.name} (ID: ${newCategory.id})`)
    console.log(`📁 Total categories after creation: ${categories.length}`)
    
    // Send real-time notification
    try {
      await notifyCategoryChange('created', newCategory)
      console.log('📡 Real-time: Category creation notification sent')
    } catch (error) {
      console.error('❌ Real-time: Failed to send category creation notification:', error)
    }
  } else {
    console.error('❌ Failed to save category to file')
  }
  
  return newCategory
}

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category | null> => {
  categories = readCategoriesFile()
  const index = categories.findIndex(category => category.id === id)
  if (index === -1) return null
  
  // Generate new slug if name changed
  let slug = categories[index].slug
  if (data.name && data.name !== categories[index].name) {
    slug = generateSlug(data.name)
    let counter = 1
    while (categories.some(cat => cat.slug === slug && cat.id !== id)) {
      slug = `${generateSlug(data.name)}-${counter}`
      counter++
    }
  }
  
  categories[index] = {
    ...categories[index],
    ...data,
    slug,
    updatedAt: new Date(),
  }
  
  if (writeCategoriesFile(categories)) {
    console.log(`✅ Category updated: ${categories[index].name}`)
    
    // Send real-time notification
    try {
      await notifyCategoryChange('updated', categories[index])
      console.log('📡 Real-time: Category update notification sent')
    } catch (error) {
      console.error('❌ Real-time: Failed to send category update notification:', error)
    }
  }
  
  return categories[index]
}

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    console.log(`🔍 Attempting to delete category with ID: ${id}`)
    
    // Get fresh data
    categories = readCategoriesFile()
    console.log(`📁 Current categories: ${categories.length}`)
    
    const index = categories.findIndex(category => category.id === id)
    if (index === -1) {
      console.log(`❌ Category with ID ${id} not found`)
      return false
    }
    
    console.log(`🗑️ Found category at index ${index}, deleting...`)
    const deletedCategory = categories[index]
    categories.splice(index, 1)
    
    // Save to file
    if (writeCategoriesFile(categories)) {
      console.log(`✅ Category deleted: ${deletedCategory.name}`)
      console.log(`📁 Remaining categories: ${categories.length}`)
      
      // Send real-time notification
      try {
        await notifyCategoryChange('deleted', deletedCategory)
        console.log('📡 Real-time: Category deletion notification sent')
      } catch (error) {
        console.error('❌ Real-time: Failed to send category deletion notification:', error)
      }
      
      return true
    } else {
      console.error('❌ Failed to save after deletion')
      return false
    }
    
  } catch (error) {
    console.error(`❌ Error in deleteCategory for ID ${id}:`, error)
    return false
  }
}

// Search categories
export const searchCategories = (query: string): Category[] => {
  if (!query.trim()) return getCategories()
  
  const searchTerm = query.toLowerCase()
  return categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm) ||
    category.description?.toLowerCase().includes(searchTerm)
  )
}

// Initialize with default categories if empty
export const initializeDefaultCategories = () => {
  const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production'
  
  if (categories.length === 0) {
    const defaultCategories = [
      { name: 'Statues', description: 'Beautiful handcrafted statues and sculptures' },
      { name: 'Murtiya', description: 'Traditional religious figurines and idols' },
      { name: 'Handicrafts', description: 'Unique handmade crafts and artifacts' },
      { name: 'Figurines', description: 'Decorative figurines and collectibles' }
    ]

    console.log(`🚀 Initializing ${defaultCategories.length} default categories`)
    
    defaultCategories.forEach(categoryData => {
      try {
        createCategory(categoryData)
      } catch (error) {
        // Ignore errors for existing categories
      }
    })
  }
}

// Initialize default categories on module load
initializeDefaultCategories()
