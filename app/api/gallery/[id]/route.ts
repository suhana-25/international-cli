import { NextRequest, NextResponse } from 'next/server'
import { 
  getGalleryItemById, 
  updateGalleryItem, 
  deleteGalleryItem 
} from '@/lib/gallery-store'

// PUT - Update image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔄 Updating image:', resolvedParams.id)
    
    const session = null // Skip auth check - using custom auth system
    // if (!session?.user || session.user.role !== 'admin') {
    //   console.log('❌ Unauthorized access attempt')
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { id } = resolvedParams
    const body = await request.json()
    const { title, description, imageUrl, category, tags, isFeatured } = body

    console.log('📋 Update data received:', { title, description })

    const updatedImage = updateGalleryItem(id, {
      title: title || undefined,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
      category: category || undefined,
      tags: tags || undefined,
      isFeatured: isFeatured !== undefined ? isFeatured : undefined,
    })

    if (!updatedImage) {
      console.log('❌ Image not found:', id)
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    console.log('✅ Image updated successfully:', id)
    return NextResponse.json({ success: true, data: updatedImage })
  } catch (error) {
    console.error('❌ Error updating image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🗑️ Deleting image:', resolvedParams.id)
    
    const session = null // Skip auth check - using custom auth system
    // if (!session?.user || session.user.role !== 'admin') {
    //   console.log('❌ Unauthorized access attempt')
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { id } = resolvedParams

    const deletedImage = getGalleryItemById(id)
    if (!deletedImage) {
      console.log('❌ Image not found for deletion:', id)
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    const success = deleteGalleryItem(id)
    if (!success) {
      console.log('❌ Failed to delete image:', id)
      return NextResponse.json(
        { success: false, error: 'Failed to delete image' },
        { status: 500 }
      )
    }

    console.log('✅ Image deleted successfully:', id)
    return NextResponse.json({ success: true, data: deletedImage })
  } catch (error) {
    console.error('❌ Error deleting image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
