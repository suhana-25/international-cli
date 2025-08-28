import { NextRequest, NextResponse } from 'next/server'
import { createBlogComment, getAllComments } from '@/lib/actions/blog.actions'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  if (!postId) return NextResponse.json([])
  
  try {
    // Fetch approved comments from database
    const comments = await getAllComments({ postId, status: 'approved' })
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.postId || !body.authorName || !body.authorEmail || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create comment in database using the action
    const result = await createBlogComment({
      postId: body.postId,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      content: body.content,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Comment submitted successfully. It will be visible after approval.',
        comment: result.data
      })
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to submit comment' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit comment' },
      { status: 400 }
    )
  }
} 

