// Simplified product storage for admin-managed products
// Direct file operations without complex sync for reliability
// Now with real-time notifications via Pusher

import fs from 'fs'
import path from 'path'
import { notifyProductChange } from './pusher'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  weight: number | null
  stock: number
  images: string[] | null
  bannerImages: string[] | null
  categoryId: string | null // Legacy field - keeping for compatibility
  categoryIds: string[] | null // New field for multiple categories
  brand: string | null
  isFeatured: boolean
  isBanner: boolean
  rating: number | null
  numReviews: number | null
  createdAt: Date
  updatedAt: Date
}

// File-based storage path
const STORAGE_PATH = path.join(process.cwd(), 'data', 'products.json')

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
const readProductsFile = (): Product[] => {
  try {
    ensureDataDir()
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8')
      const products = JSON.parse(data)
      // Parse dates
      return products.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }))
    }
  } catch (error) {
    console.error('❌ Error reading products file:', error)
  }
  return []
}

const writeProductsFile = (products: Product[]): boolean => {
  try {
    ensureDataDir()
    
    // Create backup before writing
    if (fs.existsSync(STORAGE_PATH)) {
      const backupPath = STORAGE_PATH + '.backup'
      try {
        fs.copyFileSync(STORAGE_PATH, backupPath)
        console.log('✅ Backup created successfully')
      } catch (backupError) {
        console.log('⚠️ Backup creation failed, continuing without backup')
      }
    }
    
    // Try direct write first (more reliable)
    try {
      fs.writeFileSync(STORAGE_PATH, JSON.stringify(products, null, 2))
      console.log(`✅ Products saved successfully: ${products.length} products`)
      return true
    } catch (directWriteError) {
      console.log('⚠️ Direct write failed, trying atomic operation...')
      
      // Fallback to atomic operation
      const tempPath = STORAGE_PATH + '.tmp'
      try {
        fs.writeFileSync(tempPath, JSON.stringify(products, null, 2))
        fs.renameSync(tempPath, STORAGE_PATH)
        console.log(`✅ Products saved successfully with atomic operation: ${products.length} products`)
        return true
      } catch (atomicError) {
        console.error('❌ Atomic operation also failed:', atomicError)
        
        // Last resort: try to clean up temp file
        try {
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath)
          }
        } catch (cleanupError) {
          console.error('❌ Failed to cleanup temp file:', cleanupError)
        }
        
        return false
      }
    }
    
  } catch (error) {
    console.error('❌ Error saving products:', error)
    return false
  }
}

// In-memory storage
let products: Product[] = readProductsFile()

// Force reload products from file
export const reloadProducts = (): Product[] => {
  console.log('🔄 Force reloading products from file...')
  products = readProductsFile()
  console.log(`✅ Reloaded ${products.length} products`)
  return products
}

// Product functions
export const getProducts = (): Product[] => {
  // Always get fresh data from file
  products = readProductsFile()
  return products
}

export const getProductById = (id: string): Product | null => {
  const freshProducts = readProductsFile()
  return freshProducts.find(product => product.id === id) || null
}

export const getProductBySlug = (slug: string): Product | null => {
  const freshProducts = readProductsFile()
  return freshProducts.find(product => product.slug === slug) || null
}

export const getFeaturedProducts = (limit: number = 6): Product[] => {
  const freshProducts = readProductsFile()
  const featured = freshProducts
    .filter(product => product.isFeatured)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
  return featured
}

export const getBannerProducts = (limit: number = 5): Product[] => {
  const freshProducts = readProductsFile()
  const banner = freshProducts
    .filter(product => product.isBanner)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
  return banner
}

export const getLatestProducts = (limit: number = 8): Product[] => {
  const freshProducts = readProductsFile()
  const latest = freshProducts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
  return latest
}

export const createProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  // Get fresh data
  products = readProductsFile()
  
  const newProduct: Product = {
    ...data,
    id: Date.now().toString(),
    categoryIds: data.categoryIds ? [...data.categoryIds] : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  products.push(newProduct)
  
  // Save to file
  if (writeProductsFile(products)) {
    console.log(`✅ Product created: ${newProduct.name} (ID: ${newProduct.id})`)
    console.log(`📦 Total products after creation: ${products.length}`)
    
    // Force reload to ensure data consistency
    reloadProducts()
    
    // Send real-time notification
    try {
      await notifyProductChange('created', newProduct)
      console.log('📡 Real-time: Product creation notification sent')
    } catch (error) {
      console.error('❌ Real-time: Failed to send product creation notification:', error)
    }
  } else {
    console.error('❌ Failed to save product to file')
  }
  
  return newProduct
}

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product | null> => {
  products = readProductsFile()
  const index = products.findIndex(product => product.id === id)
  if (index === -1) return null
  
  const oldProduct = products[index]
  products[index] = {
    ...products[index],
    ...data,
    updatedAt: new Date(),
  }
  
  if (writeProductsFile(products)) {
    console.log(`✅ Product updated: ${products[index].name}`)
    
    // Force reload to ensure data consistency
    reloadProducts()
    
    // Send real-time notification
    try {
      await notifyProductChange('updated', products[index])
      console.log('📡 Real-time: Product update notification sent')
    } catch (error) {
      console.error('❌ Real-time: Failed to send product update notification:', error)
    }
  }
  
  return products[index]
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    console.log(`🔍 Attempting to delete product with ID: ${id}`)
    
    // Get fresh data
    products = readProductsFile()
    console.log(`📦 Current products: ${products.length}`)
    
    const index = products.findIndex(product => product.id === id)
    if (index === -1) {
      console.log(`❌ Product with ID ${id} not found`)
      return false
    }
    
    console.log(`🗑️ Found product at index ${index}, deleting...`)
    const deletedProduct = products[index]
    
    // Create new array without the deleted product
    const updatedProducts = products.filter(product => product.id !== id)
    console.log(`📦 Products after deletion: ${updatedProducts.length}`)
    
    // Save to file
    if (writeProductsFile(updatedProducts)) {
      console.log(`✅ Product deleted: ${deletedProduct.name}`)
      console.log(`📦 Remaining products: ${updatedProducts.length}`)
      
      // Update in-memory array
      products = updatedProducts
      
      // Force reload to ensure data consistency
      reloadProducts()
      
      // Verify deletion
      const verifyProducts = readProductsFile()
      const stillExists = verifyProducts.find(p => p.id === id)
      if (stillExists) {
        console.error('❌ CRITICAL: Product still exists after deletion!')
        return false
      }
      
      console.log('✅ Product deletion verified successfully')
      
      // Send real-time notification
      try {
        await notifyProductChange('deleted', deletedProduct)
        console.log('📡 Real-time: Product deletion notification sent')
      } catch (error) {
        console.error('❌ Real-time: Failed to send product deletion notification:', error)
        // Don't fail deletion if notification fails
      }
      
      return true
    } else {
      console.error('❌ Failed to save after deletion')
      return false
    }
    
  } catch (error) {
    console.error(`❌ Error in deleteProduct for ID ${id}:`, error)
    return false
  }
}

export const searchProducts = (query: string): Product[] => {
  const freshProducts = readProductsFile()
  const searchLower = query.toLowerCase()
  return freshProducts.filter(product => 
    product.name.toLowerCase().includes(searchLower) ||
    product.description?.toLowerCase().includes(searchLower) ||
    product.brand?.toLowerCase().includes(searchLower)
  )
}

// Get products by category ID
export const getProductsByCategory = (categoryId: string): Product[] => {
  const freshProducts = readProductsFile()
  return freshProducts.filter(product => 
    product.categoryIds?.includes(categoryId) || 
    product.categoryId === categoryId
  )
}

// Get products by multiple category IDs
export const getProductsByCategories = (categoryIds: string[]): Product[] => {
  if (!categoryIds.length) return getProducts()
  
  const freshProducts = readProductsFile()
  return freshProducts.filter(product => 
    categoryIds.some(categoryId => 
      product.categoryIds?.includes(categoryId) || 
      product.categoryId === categoryId
    )
  )
}
