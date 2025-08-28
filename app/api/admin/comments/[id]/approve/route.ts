import { NextRequest, NextResponse } from 'next/server'
import db from '@/db/drizzle'
import { blogComments } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const [updatedComment] = await db.update(blogComments)
      .set({
        status: 'approved',
        updatedAt: new Date(),
      })
      .where(eq(blogComments.id, resolvedParams.id))
      .returning()

    if (!updatedComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Revalidate the blog post page
    revalidatePath('/admin/blog/comments')
    
    return NextResponse.json({
      success: true,
      message: 'Comment approved successfully',
      comment: updatedComment
    })
  } catch (error) {
    console.error('Error approving comment:', error)
    return NextResponse.json(
      { error: 'Failed to approve comment' },
      { status: 500 }
    )
  }
} 