import { NextRequest, NextResponse } from 'next/server'
import { getCategories } from '@/lib/category-store'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0 // No caching

export async function GET(request: NextRequest) {
  try {
    console.log('📁 Categories API: Using file storage only')
    
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    // Force reload categories to get latest data
    const { reloadCategories } = await import('@/lib/category-store')
    const { getGlobalCategories, initializeDefaultCategories } = await import('@/lib/categories-sync')
    
    reloadCategories()
    
    // Get categories from file storage
    let allCategories = getCategories()
    console.log(`📦 Categories API: Found ${allCategories.length} categories in file storage`)
    
    // If no categories found, use global sync
    if (allCategories.length === 0) {
      console.log('🚀 No categories found, using global sync...')
      allCategories = getGlobalCategories()
      console.log(`🚀 After global sync: ${allCategories.length} categories`)
    }
    
    if (allCategories.length > 0) {
      console.log(`📦 First category: ${allCategories[0].name} (${allCategories[0].slug})`)
    } else {
      console.log(`❌ Categories API: Still no categories found!`)
    }

    if (slug) {
      // Get single category by slug
      const category = allCategories.find(cat => cat.slug === slug)
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: category
      })
    } else {
      // Get all categories
      return NextResponse.json({
        success: true,
        data: allCategories
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      })
    }

  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📁 Categories API: Creating new category')
    
    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Import category store functions
    const { createCategory } = await import('@/lib/category-store')
    
    // Create the category
    const newCategory = await createCategory({
      name: name.trim(),
      description: description || null
    })

    console.log(`✅ Category created: ${newCategory.name}`)

    return NextResponse.json({
      success: true,
      data: newCategory
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error creating category:', error)
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create category'
    }, { status: 500 })
  }
}

