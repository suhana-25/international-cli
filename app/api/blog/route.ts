import { NextRequest, NextResponse } from 'next/server'
import { getBlogPostBySlug, getBlogPosts, getPublishedBlogPosts } from '@/lib/blog-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const limit = searchParams.get('limit')
    
    console.log('📝 Blog API called with:', { slug, limit })
    
    if (slug) {
      // Get specific blog post by slug from file storage
      console.log('🔍 Fetching blog by slug:', slug)
      const post = getBlogPostBySlug(slug)
      if (!post) {
        console.log('❌ Blog post not found for slug:', slug)
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      console.log('✅ Blog post found:', { id: post.id, title: post.title, status: post.status })
      return NextResponse.json(post)
    }
    
    // Get only published blog posts for public API
    console.log('📝 Fetching all published blog posts')
    const publishedPosts = getPublishedBlogPosts()
    console.log('✅ Found published posts:', publishedPosts.length)
    
    // Apply limit if specified
    const limitedPosts = limit ? publishedPosts.slice(0, parseInt(limit)) : publishedPosts
    
    // Return posts directly (not nested in data object)
    return NextResponse.json(limitedPosts)
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

