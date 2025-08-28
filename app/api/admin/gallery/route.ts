import { NextRequest, NextResponse } from 'next/server'
import { createGalleryItem, getGalleryItems, reloadGalleryItems } from '@/lib/gallery-store'
import { revalidatePath, revalidateTag } from 'next/cache'

// Force dynamic rendering and no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title and imageUrl are required' 
      }, { status: 400 })
    }

    // Create new gallery item (now async)
    const newItem = await createGalleryItem({
      title: body.title,
      description: body.description || null,
      imageUrl: body.imageUrl,
      category: body.category || null,
      tags: body.tags || null,
      isFeatured: body.isFeatured || false
    })

    // Force revalidation for instant updates
    try {
      revalidatePath('/admin/gallery')
      revalidatePath('/gallery')
      revalidateTag('gallery')
    } catch (revalidateError) {
      console.log('⚠️ Revalidation not available in this environment')
    }
    
    // Force reload to verify creation
    reloadGalleryItems()
    const allItems = getGalleryItems()
    console.log(`🖼️ After creation, total gallery items: ${allItems.length}`)
    
    return NextResponse.json({ 
      success: true, 
      data: newItem,
      message: 'Gallery item created successfully!',
      totalItems: allItems.length
    })

  } catch (error) {
    console.error('❌ Error creating gallery item:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create gallery item' 
    }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Force reload gallery items from file
    reloadGalleryItems()
    let items = getGalleryItems()
    console.log(`🖼️ Admin Gallery API GET: After reload, found ${items.length} items`)
    
    if (items.length > 0) {
      console.log(`🖼️ First item ID: ${items[0].id}`)
      console.log(`🖼️ First item title: ${items[0].title}`)
    } else {
      console.log(`❌ Admin Gallery API GET: No items found after reload!`)
    }

    return NextResponse.json({ 
      success: true, 
      data: items 
    })

  } catch (error) {
    console.error('❌ Error fetching gallery items:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch gallery items' 
    }, { status: 500 })
  }
}
