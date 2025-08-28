import { NextRequest, NextResponse } from 'next/server'
import { createBlogPost, getBlogPosts, reloadBlogPosts } from '@/lib/blog-store'
import { revalidatePath, revalidateTag } from 'next/cache'

// Force dynamic rendering and no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content || !body.authorId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, content, and authorId are required' 
      }, { status: 400 })
    }

    // Create new blog post (now async)
    const newPost = await createBlogPost({
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 150) + '...',
      featuredImage: body.featuredImage || null,
      authorId: body.authorId,
      status: body.status || 'draft'
    })

    // Force revalidation for instant updates
    try {
      revalidatePath('/admin/blog')
      revalidatePath('/blogs')
      revalidateTag('blogs')
    } catch (revalidateError) {
      console.log('⚠️ Revalidation not available in this environment')
    }
    
    // Force reload to verify creation
    reloadBlogPosts()
    const allPosts = getBlogPosts()
    console.log(`📝 After creation, total blog posts: ${allPosts.length}`)
    
    return NextResponse.json({ 
      success: true, 
      data: newPost,
      message: 'Blog post created successfully!',
      totalPosts: allPosts.length
    })

  } catch (error) {
    console.error('❌ Error creating blog post:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create blog post' 
    }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Force reload blog posts from file
    reloadBlogPosts()
    let posts = getBlogPosts()
    console.log(`📝 Admin Blog API GET: After reload, found ${posts.length} posts`)
    
    if (posts.length > 0) {
      console.log(`📝 First post ID: ${posts[0].id}`)
      console.log(`📝 First post title: ${posts[0].title}`)
    } else {
      console.log(`❌ Admin Blog API GET: No posts found after reload!`)
    }

    return NextResponse.json({ 
      success: true, 
      data: posts 
    })

  } catch (error) {
    console.error('❌ Error fetching blog posts:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch blog posts' 
    }, { status: 500 })
  }
}

