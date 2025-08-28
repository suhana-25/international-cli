import { NextRequest, NextResponse } from 'next/server'
import db from '@/db/drizzle'
import { blogComments } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const [deletedComment] = await db.delete(blogComments)
      .where(eq(blogComments.id, resolvedParams.id))
      .returning()

    if (!deletedComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Revalidate the blog post page and admin comments page
    revalidatePath('/admin/blog/comments')
    
    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
} 