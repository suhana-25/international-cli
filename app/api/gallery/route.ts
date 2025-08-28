import { NextRequest, NextResponse } from 'next/server'
import { 
  getGalleryItems, 
  createGalleryItem, 
  reloadGalleryItems 
} from '@/lib/gallery-store'

// GET - Fetch all gallery images
export async function GET() {
  try {
    console.log('🔍 Fetching gallery images...')
    
    // Always reload gallery items from file to ensure fresh data
    reloadGalleryItems()
    let images = getGalleryItems()
    
    console.log(`📦 Gallery API: Found ${images.length} images after reload`)
    
    if (images.length > 0) {
      console.log(`📦 First image: ${images[0].title || 'Untitled'}`)
    } else {
      console.log(`❌ Gallery API: No images found after reload!`)
    }

    // Sort by creation date (newest first)
    const sortedImages = images.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    console.log(`✅ Found ${images.length} images`)
    return NextResponse.json({ success: true, data: sortedImages })
  } catch (error) {
    console.error('❌ Error fetching gallery:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Upload new image
export async function POST(request: NextRequest) {
  try {
    console.log('📤 Processing image upload...')
    
    const session = null // Skip auth check - using custom auth system
    // if (!session?.user || session.user.role !== 'admin') {
    //   console.log('❌ Unauthorized access attempt')
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string
    const category = formData.get('category') as string
    const tags = formData.get('tags') as string
    const isFeatured = formData.get('isFeatured') === 'true'

    console.log('📋 Form data received:', { title, description, category, tags, isFeatured })

    if (!imageUrl) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    console.log('💾 Saving image to file storage...')
    
    const newImage = await createGalleryItem({
      title: title || 'Untitled Image',
      description: description || null,
      imageUrl,
      category: category || null,
      tags: tags ? tags.split(',').map(t => t.trim()) : null,
      isFeatured: isFeatured || false,
    })

    console.log('✅ Image saved successfully:', newImage.id)
    
    return NextResponse.json({ success: true, data: newImage })
  } catch (error) {
    console.error('❌ Error uploading image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

