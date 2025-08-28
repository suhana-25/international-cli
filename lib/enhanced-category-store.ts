// Enhanced category store with database integration and real-time sync
// This replaces the file-based storage for better persistence and real-time updates

import { db } from '@/lib/db'
import { categories } from '@/db/schema'
import { eq, desc, asc, like } from 'drizzle-orm'
import { realtimeSync } from '@/lib/realtime-sync'
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/category'

export class EnhancedCategoryStore {
  private static instance: EnhancedCategoryStore
  private cache: Map<string, Category> = new Map()
  private lastUpdate = 0
  private cacheExpiry = 5 * 60 * 1000 // 5 minutes

  private constructor() {
    this.initializeSync()
  }

  public static getInstance(): EnhancedCategoryStore {
    if (!EnhancedCategoryStore.instance) {
      EnhancedCategoryStore.instance = new EnhancedCategoryStore()
    }
    return EnhancedCategoryStore.instance
  }

  private initializeSync() {
    // Subscribe to real-time category updates
    realtimeSync.subscribe('category', (event) => {
      console.log('📡 Category sync event received:', event)
      
      switch (event.action) {
        case 'create':
        case 'update':
          if (event.data) {
            this.cache.set(event.id, event.data)
            this.lastUpdate = Date.now()
          }
          break
        case 'delete':
          this.cache.delete(event.id)
          this.lastUpdate = Date.now()
          break
      }
    })
  }

  // Check if cache is valid
  private isCacheValid(): boolean {
    return Date.now() - this.lastUpdate < this.cacheExpiry
  }

  // Load categories from database
  private async loadFromDatabase(): Promise<Category[]> {
    try {
      const dbResults = await db.select().from(categories).orderBy(desc(categories.createdAt))
      
      // Convert Drizzle results to Category interface, handling null values
      const categoryList = dbResults.map(result => ({
        id: result.id,
        name: result.name,
        slug: result.slug,
        description: result.description, // Keep as null if null, this is now compatible
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      }))
      
      // Update cache
      this.cache.clear()
      categoryList.forEach(category => {
        this.cache.set(category.id, category)
      })
      this.lastUpdate = Date.now()
      
      return categoryList
    } catch (error) {
      console.error('Error loading categories from database:', error)
      return []
    }
  }

  // Get all categories (with caching)
  public async getCategories(): Promise<Category[]> {
    if (this.isCacheValid() && this.cache.size > 0) {
      console.log('🚀 Using cached categories')
      return Array.from(this.cache.values())
    }

    return await this.loadFromDatabase()
  }

  // Get category by ID
  public async getCategoryById(id: string): Promise<Category | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id) || null
    }

    try {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1)

      if (result.length === 0) return null

      const category = result[0]
      const categoryData = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }

      // Update cache
      this.cache.set(id, categoryData)
      return categoryData
    } catch (error) {
      console.error('❌ Failed to get category by ID:', error)
      return null
    }
  }

  // Get category by slug
  public async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1)

      if (result.length === 0) return null

      const category = result[0]
      const categoryData = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }

      // Update cache
      this.cache.set(category.id, categoryData)
      return categoryData
    } catch (error) {
      console.error('❌ Failed to get category by slug:', error)
      return null
    }
  }

  // Create new category
  public async createCategory(data: CreateCategoryInput): Promise<Category> {
    try {
      console.log('📝 Creating new category:', data.name)

      // Check if category with same name already exists
      const existingCategory = await this.getCategoryBySlug(this.generateSlug(data.name))
      if (existingCategory) {
        throw new Error('Category with this name already exists')
      }

      // Generate ID and insert into database
      const categoryId = crypto.randomUUID()
      const result = await db.insert(categories).values({
        id: categoryId,
        name: data.name.trim(),
        slug: data.slug,
        description: data.description ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning()

      // Create the category object with proper typing
      const newCategory: Category = {
        id: result[0].id,
        name: result[0].name,
        slug: result[0].slug,
        description: result[0].description,
        createdAt: result[0].createdAt,
        updatedAt: result[0].updatedAt
      }

      // Update cache
      this.cache.set(newCategory.id, newCategory)
      this.lastUpdate = Date.now()

      // Emit real-time sync event
      realtimeSync.emit({
        type: 'category',
        action: 'create',
        id: newCategory.id,
        data: newCategory,
        timestamp: Date.now()
      })

      console.log('✅ Category created successfully:', newCategory.id)
      return newCategory
    } catch (error) {
      console.error('❌ Failed to create category:', error)
      throw new Error('Failed to create category')
    }
  }

  // Update category
  public async updateCategory(id: string, data: UpdateCategoryInput): Promise<Category | null> {
    try {
      console.log('📝 Updating category:', id)

      const existingCategory = await this.getCategoryById(id)
      if (!existingCategory) {
        throw new Error('Category not found')
      }

      // Check if updating name to an existing name
      if (data.name && data.name !== existingCategory.name) {
        const slug = this.generateSlug(data.name)
        const existingWithSlug = await this.getCategoryBySlug(slug)
        if (existingWithSlug && existingWithSlug.id !== id) {
          throw new Error('Category with this name already exists')
        }
      }

      const updatedCategory = {
        ...existingCategory,
        ...data,
        description: data.description ?? existingCategory.description, // Ensure description is never undefined
        updatedAt: new Date()
      } as Category

      // Update slug if name changed
      if (data.name && data.name !== existingCategory.name) {
        updatedCategory.slug = this.generateSlug(data.name)
      }

      // Update database
      await db
        .update(categories)
        .set({
          name: updatedCategory.name,
          slug: updatedCategory.slug,
          description: updatedCategory.description,
          updatedAt: updatedCategory.updatedAt
        })
        .where(eq(categories.id, id))

      // Update cache
      this.cache.set(id, updatedCategory)
      this.lastUpdate = Date.now()

      // Emit real-time sync event
      realtimeSync.emit({
        type: 'category',
        action: 'update',
        id: updatedCategory.id,
        data: updatedCategory,
        timestamp: Date.now()
      })

      console.log('✅ Category updated successfully:', id)
      return updatedCategory
    } catch (error) {
      console.error('❌ Failed to update category:', error)
      throw new Error('Failed to update category')
    }
  }

  // Delete category
  public async deleteCategory(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting category:', id)

      // Check if category exists
      const existingCategory = await this.getCategoryById(id)
      if (!existingCategory) {
        throw new Error('Category not found')
      }

      // Delete from database
      await db.delete(categories).where(eq(categories.id, id))

      // Remove from cache
      this.cache.delete(id)
      this.lastUpdate = Date.now()

      // Emit real-time sync event
      realtimeSync.emit({
        type: 'category',
        action: 'delete',
        id: id,
        timestamp: Date.now()
      })

      console.log('✅ Category deleted successfully:', id)
      return true
    } catch (error) {
      console.error('❌ Failed to delete category:', error)
      throw new Error('Failed to delete category')
    }
  }

  // Search categories
  public async searchCategories(query: string): Promise<Category[]> {
    try {
      const allCategories = await this.getCategories()
      
      if (!query.trim()) return allCategories

      const searchTerm = query.toLowerCase()
      return allCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm) ||
        category.description?.toLowerCase().includes(searchTerm)
      )
    } catch (error) {
      console.error('❌ Failed to search categories:', error)
      return []
    }
  }

  // Get categories with products count
  public async getCategoriesWithProductCount(): Promise<(Category & { productCount: number })[]> {
    try {
      const allCategories = await this.getCategories()
      
      // This would need to be implemented with a proper JOIN query
      // For now, return categories with placeholder count
      return allCategories.map(category => ({
        ...category,
        productCount: 0 // TODO: Implement actual product count
      }))
    } catch (error) {
      console.error('❌ Failed to get categories with product count:', error)
      return []
    }
  }

  // Initialize default categories
  public async initializeDefaultCategories(): Promise<void> {
    try {
      const existingCategories = await this.getCategories()
      
      if (existingCategories.length === 0) {
        console.log('🚀 Initializing default categories...')
        
        const defaultCategories = [
          { name: 'Statues', slug: 'statues', description: 'Beautiful handcrafted statues and sculptures' },
          { name: 'Murtiya', slug: 'murtiya', description: 'Traditional religious figurines and idols' },
          { name: 'Handicrafts', slug: 'handicrafts', description: 'Unique handmade crafts and artifacts' },
          { name: 'Figurines', slug: 'figurines', description: 'Decorative figurines and collectibles' }
        ]

        for (const categoryData of defaultCategories) {
          try {
            await this.createCategory(categoryData)
          } catch (error) {
            // Ignore errors for existing categories
            console.log('⚠️ Category already exists:', categoryData.name)
          }
        }
        
        console.log('✅ Default categories initialized')
      }
    } catch (error) {
      console.error('❌ Failed to initialize default categories:', error)
    }
  }

  // Force refresh cache
  public async refreshCache(): Promise<void> {
    console.log('🔄 Force refreshing category cache...')
    this.cache.clear()
    this.lastUpdate = 0
    await this.loadFromDatabase()
  }

  // Get cache statistics
  public getCacheStats() {
    return {
      cacheSize: this.cache.size,
      lastUpdate: this.lastUpdate,
      isCacheValid: this.isCacheValid(),
      cacheAge: Date.now() - this.lastUpdate
    }
  }

  // Helper function to generate slug
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// Export singleton instance
export const enhancedCategoryStore = EnhancedCategoryStore.getInstance()

// Export for backward compatibility
export const {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
  getCategoriesWithProductCount,
  initializeDefaultCategories,
  refreshCache,
  getCacheStats
} = enhancedCategoryStore
