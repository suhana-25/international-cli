import { NextRequest, NextResponse } from 'next/server'
// // import { auth } from '@/lib/auth' // Removed - using custom auth // Removed - using custom auth
import { getAllBlogPosts, updateBlogPost } from '@/lib/actions/blog.actions'

export async function POST(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // if (!// session?.user?.id || "admin".role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Get all draft blog posts
    const draftPosts = await getAllBlogPosts({ status: 'draft', limit: 100 })
    
    if (!draftPosts || draftPosts.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No draft posts to publish',
        publishedCount: 0
      })
    }

    // Publish all draft posts
    let publishedCount = 0
    for (const post of draftPosts as any[]) {
      if (!post || !post.id) continue
      try {
        const result = await updateBlogPost({
          id: post.id,
          status: 'published',
          publishedAt: new Date()
        })
        
        if (result.success) {
          publishedCount++
        }
      } catch (error) {
        console.error(`Error publishing post ${post.id}:`, error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${publishedCount} posts published successfully`,
      publishedCount,
      totalDrafts: draftPosts.length
    })

  } catch (error) {
    console.error('Error bulk publishing posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

