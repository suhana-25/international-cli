import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering and no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Add headers to prevent any caching
export async function HEAD() {
  return new Response(null, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}
import { 
  getProducts, 
  getFeaturedProducts, 
  getBannerProducts, 
  getLatestProducts, 
  searchProducts,
  getProductsByCategory,
  getProductsByCategories,
  reloadProducts
} from '@/lib/product-store'
import { getCategoryBySlug } from '@/lib/category-store'

// export const revalidate = 30 // Cache for 30 seconds - REMOVED duplicate

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const banner = searchParams.get('banner')
    const limit = searchParams.get('limit')
    const categoryId = searchParams.get('categoryId')
    const categorySlug = searchParams.get('category') // Support category by slug
    const categoryIds = searchParams.get('categoryIds') // Support multiple categories
    const search = searchParams.get('search')
    const latest = searchParams.get('latest')

    // Always reload products from file to ensure fresh data
    console.log('🔄 Reloading products for fresh data...')
    reloadProducts()
    let filteredProducts = getProducts()
    console.log(`📦 Loaded ${filteredProducts.length} products from file`)

    // Filter by featured
    if (featured === 'true') {
      filteredProducts = getFeaturedProducts(limit ? parseInt(limit) : 6)
    }
    // Filter by banner
    else if (banner === 'true') {
      filteredProducts = getBannerProducts(limit ? parseInt(limit) : 5)
    }
    // Filter by latest
    else if (latest === 'true') {
      filteredProducts = getLatestProducts(limit ? parseInt(limit) : 8)
    }
    // Search functionality
    else if (search) {
      filteredProducts = searchProducts(search)
    }
    // Filter by multiple categories
    else if (categoryIds) {
      const categoryIdArray = categoryIds.split(',').filter(id => id.trim())
      if (categoryIdArray.length > 0) {
        filteredProducts = getProductsByCategories(categoryIdArray)
      }
    }
    // Filter by single category (by ID)
    else if (categoryId) {
      filteredProducts = getProductsByCategory(categoryId)
    }
    // Filter by category slug
    else if (categorySlug) {
      try {
        const category = getCategoryBySlug(categorySlug)
        if (category) {
          filteredProducts = getProductsByCategory(category.id)
        } else {
          // Category not found, return empty array
          filteredProducts = []
        }
      } catch (error) {
        console.error('Error fetching category by slug:', error)
        filteredProducts = []
      }
    }

    // Apply limit if not already applied by specific filters
    if (limit && !featured && !banner && !latest) {
      filteredProducts = filteredProducts.slice(0, parseInt(limit))
    }

    console.log(`✅ Returning ${filteredProducts.length} filtered products`)

    return NextResponse.json({
      success: true,
      data: filteredProducts
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Product-Count': filteredProducts.length.toString(),
        'X-Last-Updated': new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch products' 
    }, { status: 500 })
  }
}

