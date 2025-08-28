// Simple categories sync for Vercel deployment
// This ensures categories are available across all instances

import { Category } from './category-store'

// Global categories cache
let globalCategories: Category[] = []

// Default categories that should always be available
const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Statues', slug: 'statues', description: 'Beautiful handcrafted statues and sculptures' },
  { name: 'Murtiya', slug: 'murtiya', description: 'Traditional religious figurines and idols' },
  { name: 'Handicrafts', slug: 'handicrafts', description: 'Unique handmade crafts and artifacts' },
  { name: 'Figurines', slug: 'figurines', description: 'Decorative figurines and collectibles' }
]

// Initialize default categories
export const initializeDefaultCategories = (): Category[] => {
  if (globalCategories.length === 0) {
    console.log('🚀 CategoriesSync: Initializing default categories')
    
    globalCategories = DEFAULT_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `default-${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    
    console.log(`🚀 CategoriesSync: Created ${globalCategories.length} default categories`)
  }
  
  return [...globalCategories]
}

// Get all categories
export const getGlobalCategories = (): Category[] => {
  if (globalCategories.length === 0) {
    return initializeDefaultCategories()
  }
  return [...globalCategories]
}

// Add a new category
export const addGlobalCategory = (category: Category): void => {
  const existingIndex = globalCategories.findIndex(c => c.id === category.id)
  
  if (existingIndex >= 0) {
    // Update existing
    globalCategories[existingIndex] = category
    console.log(`🚀 CategoriesSync: Updated category ${category.name}`)
  } else {
    // Add new
    globalCategories.push(category)
    console.log(`🚀 CategoriesSync: Added new category ${category.name}`)
  }
}

// Sync categories from external source
export const syncCategories = (categories: Category[]): void => {
  globalCategories = [...categories]
  console.log(`🚀 CategoriesSync: Synced ${categories.length} categories`)
}

// Get categories count
export const getCategoriesCount = (): number => {
  return globalCategories.length
}

// Clear all categories
export const clearGlobalCategories = (): void => {
  globalCategories = []
  console.log('🚀 CategoriesSync: Cleared all categories')
}
