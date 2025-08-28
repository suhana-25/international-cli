import { NextRequest, NextResponse } from 'next/server'
import { insertProductSchema } from '@/lib/validator'
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, reloadProducts } from '@/lib/product-store'
import { getCategories, createCategory, reloadCategories } from '@/lib/category-store'
import { revalidateTag, revalidatePath } from 'next/cache'

// Force dynamic rendering and no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle categories array - create category records if they don't exist
    let categoryIds: string[] | null = null
    if (body.categories && Array.isArray(body.categories)) {
      const existingCategories = getCategories()
      categoryIds = []
      
      for (const categoryName of body.categories) {
        const trimmedName = categoryName.trim()
        if (trimmedName) {
          // Check if category already exists
          let existingCategory = existingCategories.find(c => 
            c.name.toLowerCase() === trimmedName.toLowerCase()
          )
          
          if (!existingCategory) {
            // Create new category
            try {
              existingCategory = await createCategory({
                name: trimmedName,
                description: `Auto-created category: ${trimmedName}`
              })
            } catch (error) {
              // Category might already exist, try to find it again
              existingCategory = existingCategories.find(c => 
                c.name.toLowerCase() === trimmedName.toLowerCase()
              )
            }
          }
          
          if (existingCategory) {
            categoryIds.push(existingCategory.id)
          }
        }
      }
    }
    
    // Validate the data
    const validatedData = insertProductSchema.parse({
      ...body,
      categoryIds: categoryIds
    })
    
    // Generate unique slug
    let slug = validatedData.slug
    let counter = 1
    const existingProducts = getProducts()
    while (existingProducts.some(p => p.slug === slug)) {
      slug = `${validatedData.slug}-${counter}`
      counter++
    }

    // Create new product (now async)
    const newProduct = await createProduct({
      name: validatedData.name,
      slug,
      description: validatedData.description || null,
      price: validatedData.price,
      weight: validatedData.weight || null,
      stock: validatedData.stock || 0,
      images: validatedData.images || null,
      bannerImages: validatedData.bannerImages || null,
      categoryId: validatedData.categoryId || null,
      categoryIds: categoryIds,
      brand: validatedData.brand || null,
      isFeatured: validatedData.isFeatured || false,
      isBanner: validatedData.isBanner || false,
      rating: null,
      numReviews: null,
    })

    // Force revalidation for instant updates
    try {
      revalidatePath('/admin/products')
      revalidatePath('/products')
      revalidatePath('/')
      revalidateTag('products')
    } catch (revalidateError) {
      console.log('⚠️ Revalidation not available in this environment')
    }
    
    // Force reload to verify creation
    reloadProducts()
    const allProducts = getProducts()
    console.log(`📦 After creation, total products: ${allProducts.length}`)
    
    // Verify the product was actually created
    const verifyProduct = getProductById(newProduct.id)
    if (!verifyProduct) {
      console.error('❌ CRITICAL: Product not found after creation!')
      return NextResponse.json({ 
        success: false, 
        error: 'Product creation failed - product not found after save' 
      }, { status: 500 })
    }
    
    console.log(`✅ Product creation verified: ${verifyProduct.name} (ID: ${verifyProduct.id})`)
    
    // Also reload categories to ensure they're available in header
    reloadCategories()
    const allCategories = getCategories()
    console.log(`📁 After creation, total categories: ${allCategories.length}`)
    
    return NextResponse.json({ 
      success: true, 
      data: newProduct,
      message: 'Product created successfully!',
      totalProducts: allProducts.length,
      totalCategories: allCategories.length
    })

  } catch (error) {
    console.error('❌ Error creating product:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create product' 
    }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Force reload products from file
    reloadProducts()
    let products = getProducts()
    console.log(`📦 Admin API GET: After reload, found ${products.length} products`)
    
    if (products.length > 0) {
      console.log(`📦 First product ID: ${products[0].id}`)
      console.log(`📦 First product name: ${products[0].name}`)
    } else {
      console.log(`❌ Admin API GET: No products found after reload!`)
    }

    return NextResponse.json({ 
      success: true, 
      data: products 
    })

  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch products' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    // Handle categories array - create category records if they don't exist
    let categoryIds: string[] | null = null
    if (body.categories && Array.isArray(body.categories)) {
      const existingCategories = getCategories()
      categoryIds = []
      
      for (const categoryName of body.categories) {
        const trimmedName = categoryName.trim()
        if (trimmedName) {
          // Check if category already exists
          let existingCategory = existingCategories.find(c => 
            c.name.toLowerCase() === trimmedName.toLowerCase()
          )
          
          if (!existingCategory) {
            // Create new category
            try {
              existingCategory = await createCategory({
                name: trimmedName,
                description: `Auto-created category: ${trimmedName}`
              })
            } catch (error) {
              // Category might already exist, try to find it again
              existingCategory = existingCategories.find(c => 
                c.name.toLowerCase() === trimmedName.toLowerCase()
              )
            }
          }
          
          if (existingCategory) {
            categoryIds.push(existingCategory.id)
          }
        }
      }
      // Add categoryIds to updateData
      updateData.categoryIds = categoryIds
    }

    // Update product (now async)
    const updatedProduct = await updateProduct(id, updateData)
    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    // Force reload to verify update
    reloadProducts()
    const verifyProduct = getProductById(id)
    if (!verifyProduct) {
      console.error('❌ CRITICAL: Product not found after update!')
      return NextResponse.json({ 
        success: false, 
        error: 'Product update failed - product not found after save' 
      }, { status: 500 })
    }
    
    console.log(`✅ Product update verified: ${verifyProduct.name} (ID: ${verifyProduct.id})`)

    // Force revalidation
    try {
      revalidatePath('/admin/products')
      revalidatePath('/products')
      revalidatePath('/')
      revalidateTag('products')
    } catch (revalidateError) {
      console.log('⚠️ Revalidation failed')
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedProduct,
      message: 'Product updated successfully!' 
    })

  } catch (error) {
    console.error('❌ Error updating product:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update product' 
    }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      console.log('❌ Admin API DELETE: No product ID provided')
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 })
    }

    console.log(`🗑️ Admin API: Attempting to delete product with ID: ${id}`)
    
    // Force reload products to ensure we have latest data
    console.log('🔄 Reloading products before deletion...')
    reloadProducts()
    
    // First check if product exists
    const existingProduct = getProductById(id)
    if (!existingProduct) {
      console.log(`❌ Admin API: Product with ID ${id} not found before deletion attempt`)
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    
    console.log(`✅ Admin API: Found product "${existingProduct.name}" with ID ${id}, proceeding with deletion`)
    
    // Try to delete the product (now async)
    const success = await deleteProduct(id)
    
    if (!success) {
      console.log(`❌ Admin API: Delete operation failed for product ID ${id}`)
      
      // Get current products to debug
      reloadProducts()
      const currentProducts = getProducts()
      console.log(`📦 Current products after failed deletion: ${currentProducts.length}`)
      
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete product from store',
        debug: {
          productId: id,
          currentProductCount: currentProducts.length,
          productStillExists: currentProducts.some(p => p.id === id)
        }
      }, { status: 500 })
    }
    
    console.log(`✅ Admin API: Product with ID ${id} deleted successfully from store`)

    // Verify deletion by checking if product still exists
    reloadProducts()
    const verifyProduct = getProductById(id)
    if (verifyProduct) {
      console.log(`⚠️ Admin API: Product still exists after deletion! This indicates a file system issue.`)
      return NextResponse.json({ 
        success: false, 
        error: 'Product deletion failed - file system issue detected' 
      }, { status: 500 })
    }

    console.log(`✅ Admin API: Product deletion verified - product no longer exists`)

    // Get updated product count
    const allProducts = getProducts()
    console.log(`📦 After deletion, total products: ${allProducts.length}`)

    // Force revalidation for instant updates
    try {
      revalidatePath('/admin/products')
      revalidatePath('/products')
      revalidatePath('/')
      revalidateTag('products')
      console.log('✅ Cache revalidation completed')
    } catch (revalidateError) {
      console.log('⚠️ Cache revalidation failed (this is normal in some environments):', revalidateError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully!',
      totalProducts: allProducts.length
    })

  } catch (error) {
    console.error('❌ Error deleting product:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete product' 
    }, { status: 400 })
  }
}

