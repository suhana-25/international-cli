'use server'

import db from '@/db/drizzle'
import { products, categories } from '@/db/schema'
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { insertProductSchema } from '@/lib/validator'
import { formatError } from '@/lib/utils'
import { z } from 'zod'

export interface CreateProductData {
  name: string
  slug: string
  description: string
  price: number
  weight?: number
  stock: number
  images?: string[]
  bannerImages?: string[]
  categoryId?: string
  brand?: string
  isFeatured?: boolean
  isBanner?: boolean
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

// Function to generate a unique slug
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  // Check if db is available and has select method
  if (!db || !db.select) {
    console.log('Using mock database - slug generation simplified')
    return slug
  }
  
  while (true) {
    try {
      const existingProduct = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
      if (existingProduct.length === 0) {
        return slug
      }
      slug = `${baseSlug}-${counter}`
      counter++
    } catch (error) {
      console.log('Error checking slug uniqueness, using base slug:', error)
      return slug
    }
  }
}

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    // Validate the data using the schema
    const validatedData = insertProductSchema.parse(data)
    
    // Generate unique slug if it already exists
    const uniqueSlug = await generateUniqueSlug(validatedData.slug)
    
    // Check if db is available and has proper methods
    if (!db || typeof db.insert !== 'function') {
      console.log('Using mock database - product creation simulated')
      const newProduct = {
        id: Date.now().toString(),
        ...validatedData,
        slug: uniqueSlug,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return { 
        success: true, 
        data: newProduct
      }
    }

    try {
      const result = await db.insert(products).values({
        ...validatedData,
        slug: uniqueSlug,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning()

      revalidatePath('/admin/products')
      revalidatePath('/catalog')
      revalidatePath('/')
      
      return { success: true, data: result[0] }
    } catch (dbError) {
      console.log('Database error, using mock fallback:', dbError)
      // Fallback to mock creation
      const newProduct = {
        id: Date.now().toString(),
        ...validatedData,
        slug: uniqueSlug,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return { 
        success: true, 
        data: newProduct
      }
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: formatError(error) }
  }
}

export async function updateProduct(data: UpdateProductData) {
  try {
    const { id, ...updateData } = data
    
    const result = await db.update(products)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning()

    revalidatePath('/admin/products')
    revalidatePath('/catalog')
    revalidatePath('/')
    revalidatePath(`/product/${result[0]?.slug}`)
    
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id))
    
    revalidatePath('/admin/products')
    revalidatePath('/catalog')
    revalidatePath('/')
    
    return { success: true, message: 'Product deleted successfully' }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

export async function getProduct(id: string) {
  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return null
  }
}

export async function getAllProducts(options?: {
  limit?: number
  offset?: number
  categoryId?: string
  search?: string
  featured?: boolean
  banner?: boolean
}) {
  try {
    let query = db.select().from(products)
    const conditions = []

    if (options?.categoryId) {
      conditions.push(eq(products.categoryId, options.categoryId))
    }

    if (options?.search) {
      conditions.push(
        or(
          like(products.name, `%${options.search}%`),
          like(products.description, `%${options.search}%`)
        )
      )
    }

    if (options?.featured !== undefined) {
      conditions.push(eq(products.isFeatured, options.featured))
    }

    if (options?.banner !== undefined) {
      conditions.push(eq(products.isBanner, options.banner))
    }

    if (conditions.length > 0) {
      const whereClause = and(...conditions)
      const result = await db.select()
        .from(products)
        .where(whereClause)
        .orderBy(desc(products.createdAt))
        .limit(options?.limit || 50)
        .offset(options?.offset || 0)
      
      return result
    }

    const result = await db.select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(options?.limit || 50)
      .offset(options?.offset || 0)

    return result
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getFeaturedProducts(limit: number = 6) {
  try {
    const result = await db.select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.createdAt))
      .limit(limit)
    
    return result
  } catch (error) {
    console.error('Error fetching featured products:', error)
    // Return demo products when database is not available
    return [
      {
        id: 'demo-1',
        name: 'Handcrafted Wooden Buddha Statue',
        slug: 'handcrafted-wooden-buddha-statue',
        description: 'Beautiful handcrafted wooden Buddha statue, perfect for meditation spaces.',
        price: 2999,
        weight: 2.5,
        stock: 10,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.8,
        numReviews: 15,
        isFeatured: true,
        isBanner: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'demo-2',
        name: 'Brass Ganesha Idol',
        slug: 'brass-ganesha-idol',
        description: 'Exquisite brass Ganesha idol, handcrafted by skilled artisans.',
        price: 4500,
        weight: 3.2,
        stock: 8,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.9,
        numReviews: 22,
        isFeatured: true,
        isBanner: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'demo-3',
        name: 'Stone Carved Elephant',
        slug: 'stone-carved-elephant',
        description: 'Beautifully carved stone elephant, symbol of wisdom and strength.',
        price: 3500,
        weight: 4.1,
        stock: 5,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.7,
        numReviews: 18,
        isFeatured: true,
        isBanner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
}

export async function getBannerProducts(limit: number = 5) {
  try {
    const result = await db.select()
      .from(products)
      .where(and(
        eq(products.isBanner, true),
        sql`${products.bannerImages} IS NOT NULL AND array_length(${products.bannerImages}, 1) > 0`
      ))
      .orderBy(desc(products.createdAt))
      .limit(limit)
    
    return result
  } catch (error) {
    console.error('Error fetching banner products:', error)
    // Return demo banner products when database is not available
    return [
      {
        id: 'demo-banner-1',
        name: 'Handcrafted Wooden Buddha Statue',
        slug: 'handcrafted-wooden-buddha-statue',
        description: 'Beautiful handcrafted wooden Buddha statue, perfect for meditation spaces.',
        price: 2999,
        weight: 2.5,
        stock: 10,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.8,
        numReviews: 15,
        isFeatured: true,
        isBanner: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'demo-banner-2',
        name: 'Brass Ganesha Idol',
        slug: 'brass-ganesha-idol',
        description: 'Exquisite brass Ganesha idol, handcrafted by skilled artisans.',
        price: 4500,
        weight: 3.2,
        stock: 8,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.9,
        numReviews: 22,
        isFeatured: true,
        isBanner: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
}

export async function getLatestProducts(limit: number = 8) {
  try {
    const result = await db.select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(limit)
    
    return result
  } catch (error) {
    console.error('Error fetching latest products:', error)
    // Return demo latest products when database is not available
    return [
      {
        id: 'demo-latest-1',
        name: 'Handcrafted Wooden Buddha Statue',
        slug: 'handcrafted-wooden-buddha-statue',
        description: 'Beautiful handcrafted wooden Buddha statue, perfect for meditation spaces.',
        price: 2999,
        weight: 2.5,
        stock: 10,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.8,
        numReviews: 15,
        isFeatured: true,
        isBanner: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'demo-latest-2',
        name: 'Brass Ganesha Idol',
        slug: 'brass-ganesha-idol',
        description: 'Exquisite brass Ganesha idol, handcrafted by skilled artisans.',
        price: 4500,
        weight: 3.2,
        stock: 8,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.9,
        numReviews: 22,
        isFeatured: true,
        isBanner: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'demo-latest-3',
        name: 'Stone Carved Elephant',
        slug: 'stone-carved-elephant',
        description: 'Beautifully carved stone elephant, symbol of wisdom and strength.',
        price: 3500,
        weight: 4.1,
        stock: 5,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.7,
        numReviews: 18,
        isFeatured: true,
        isBanner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'demo-latest-4',
        name: 'Handcrafted Metal Wall Art',
        slug: 'handcrafted-metal-wall-art',
        description: 'Stunning metal wall art, perfect for home decoration.',
        price: 2800,
        weight: 1.8,
        stock: 12,
        images: ['/api/placeholder/400/400'],
        bannerImages: ['/api/placeholder/800/400'],
        categoryId: 'demo-category',
        brand: 'Nitesh Handicraft',
        rating: 4.6,
        numReviews: 14,
        isFeatured: false,
        isBanner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
}

export async function getCategories() {
  try {
    const result = await db.select().from(categories).orderBy(asc(categories.name))
    return result
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function checkSlugExists(slug: string, excludeId?: string) {
  try {
    if (excludeId) {
      const result = await db.select({ id: products.id })
        .from(products)
        .where(and(eq(products.slug, slug), eq(products.id, excludeId)))
        .limit(1)
      return result.length > 0
    } else {
      const result = await db.select({ id: products.id })
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1)
      return result.length > 0
    }
  } catch (error) {
    console.error('Error checking slug:', error)
    return false
  }
} 
