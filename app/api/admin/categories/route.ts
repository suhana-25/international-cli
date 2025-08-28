import { NextRequest, NextResponse } from 'next/server'
import { createCategory, getCategories, reloadCategories } from '@/lib/category-store'
import { revalidatePath, revalidateTag } from 'next/cache'

// Force dynamic rendering and no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category name is required' 
      }, { status: 400 })
    }

    // Create new category (now async)
    const newCategory = await createCategory({
      name: body.name,
      description: body.description || null
    })

    // Force revalidation for instant updates
    try {
      revalidatePath('/admin/categories')
      revalidatePath('/catalog')
      revalidateTag('categories')
    } catch (revalidateError) {
      console.log('⚠️ Revalidation not available in this environment')
    }
    
    // Force reload to verify creation
    reloadCategories()
    const allCategories = getCategories()
    console.log(`📁 After creation, total categories: ${allCategories.length}`)
    
    return NextResponse.json({ 
      success: true, 
      data: newCategory,
      message: 'Category created successfully!',
      totalCategories: allCategories.length
    })

  } catch (error) {
    console.error('❌ Error creating category:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create category' 
    }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Force reload categories from file
    reloadCategories()
    let categories = getCategories()
    console.log(`📁 Admin Categories API GET: After reload, found ${categories.length} categories`)
    
    if (categories.length > 0) {
      console.log(`📁 First category ID: ${categories[0].id}`)
      console.log(`📁 First category name: ${categories[0].name}`)
    } else {
      console.log(`❌ Admin Categories API GET: No categories found after reload!`)
    }

    return NextResponse.json({ 
      success: true, 
      data: categories 
    })

  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch categories' 
    }, { status: 500 })
  }
}
