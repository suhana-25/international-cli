'use server'

import db from '@/db/drizzle'
import { blogPosts, blogComments } from '@/db/schema'
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
// const = hello
export interface CreateBlogPostData {
  title: string
  slug: string
  content: string
  excerpt?: string
  authorId: string
  featuredImage?: string
  status?: string
  publishedAt?: Date
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string
}

export async function createBlogPost(data: CreateBlogPostData) {
  try {
    console.log('🔍 Creating blog post with data:', {
      title: data.title?.substring(0, 50) + (data.title && data.title.length > 50 ? '...' : ''),
      slug: data.slug?.substring(0, 50) + (data.slug && data.slug.length > 50 ? '...' : ''),
      content: data.content?.substring(0, 50) + (data.content && data.content.length > 50 ? '...' : ''),
      excerpt: data.excerpt?.substring(0, 50) + (data.excerpt && data.excerpt.length > 50 ? '...' : ''),
      authorId: data.authorId?.substring(0, 50) + (data.authorId && data.authorId.length > 50 ? '...' : ''),
      featuredImage: data.featuredImage?.substring(0, 50) + (data.featuredImage && data.featuredImage.length > 50 ? '...' : ''),
      status: data.status?.substring(0, 50) + (data.status && data.status.length > 50 ? '...' : ''),
    })
    
    console.log('📏 Field lengths:', {
      title: data.title?.length || 0,
      slug: data.slug?.length || 0,
      content: data.content?.length || 0,
      excerpt: data.excerpt?.length || 0,
      authorId: data.authorId?.length || 0,
      featuredImage: data.featuredImage?.length || 0,
      status: data.status?.length || 0,
    })
    
    const result = await db.insert(blogPosts).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: data.status === 'published' ? new Date() : undefined,
    }).returning()

    console.log('✅ Blog post created successfully:', result[0]?.id)
    revalidatePath('/admin/blog')
    revalidatePath('/blogs')
    
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('❌ Error creating blog post:', error)
    if (error instanceof Error) {
      console.error('❌ Error details:', error.message)
    }
    return { success: false, error: 'Failed to create blog post' }
  }
}

export async function updateBlogPost(data: UpdateBlogPostData) {
  try {
    const { id, ...updateData } = data
    
    const result = await db.update(blogPosts)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning()

    revalidatePath('/admin/blog')
    revalidatePath('/blogs')
    revalidatePath(`/blogs/${result[0]?.slug}`)
    
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error updating blog post:', error)
    return { success: false, error: 'Failed to update blog post' }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id))
    
    revalidatePath('/admin/blog')
    revalidatePath('/blogs')
    
    return { success: true, message: 'Blog post deleted successfully' }
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return { success: false, error: 'Failed to delete blog post' }
  }
}

export async function getBlogPostById(id: string) {
  try {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching blog post by id:', error)
    return null
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    console.log('getBlogPostBySlug called with slug:', slug)
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
    console.log('getBlogPostBySlug result:', result.length > 0 ? 'Found' : 'Not found')
    return result[0] || null
  } catch (error) {
    console.error('Error fetching blog post by slug:', error)
    return null
  }
}

export async function getAllBlogPosts(options?: {
  limit?: number
  offset?: number
  status?: string
  authorId?: string
}) {
  try {
    console.log('getAllBlogPosts called with options:', options)
    let conditions = []

    if (options?.status) {
      conditions.push(eq(blogPosts.status, options.status))
      console.log('Adding status condition:', options.status)
    }

    if (options?.authorId) {
      conditions.push(eq(blogPosts.authorId, options.authorId))
      console.log('Adding authorId condition:', options.authorId)
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined
    console.log('Where clause:', whereClause)

    const result = await db.select()
      .from(blogPosts)
      .where(whereClause || undefined)
      .orderBy(desc(blogPosts.createdAt))
      .limit(options?.limit || 50)
      .offset(options?.offset || 0)

    console.log('Query result:', result.length, 'posts found')
    return result
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function createBlogComment(data: {
  postId: string
  authorName: string
  authorEmail: string
  content: string
}) {
  try {
    const result = await db.insert(blogComments).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    revalidatePath(`/blogs/${data.postId}`)
    revalidatePath('/admin/blog/comments')

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error creating blog comment:', error)
    return { success: false, error: 'Failed to create comment' }
  }
}

export async function getAllComments(options?: {
  postId?: string
  status?: string
}) {
  try {
    let conditions = []

    if (options?.postId) {
      conditions.push(eq(blogComments.postId, options.postId))
    }

    if (options?.status) {
      conditions.push(eq(blogComments.status, options.status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const result = await db.select()
      .from(blogComments)
      .where(whereClause || undefined)
      .orderBy(desc(blogComments.createdAt))

    return result
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

export async function approveComment(id: string) {
  try {
    const result = await db.update(blogComments)
      .set({
        status: 'approved',
        updatedAt: new Date(),
      })
      .where(eq(blogComments.id, id))
      .returning()

    revalidatePath('/admin/blog/comments')
    
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error approving comment:', error)
    return { success: false, error: 'Failed to approve comment' }
  }
}

export async function deleteComment(id: string) {
  try {
    await db.delete(blogComments).where(eq(blogComments.id, id))
    
    revalidatePath('/admin/blog/comments')
    
    return { success: true, message: 'Comment deleted successfully' }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: 'Failed to delete comment' }
  }
}

export async function getPublishedBlogPosts(options: { page: number; limit: number }) {
  try {
    const offset = (options.page - 1) * options.limit
    
    const posts = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(options.limit)
      .offset(offset)
    
    const totalPosts = await db.select({ count: sql`count(*)` })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))

    const totalCount = Number(totalPosts[0]?.count) || 0
    const totalPages = Math.ceil(totalCount / options.limit)
    
    return {
      data: posts,
      totalPages,
    }
  } catch (error) {
    console.error('Error fetching published blog posts:', error)
    return { data: [], totalPages: 0 }
  }
}

export async function getLatestBlogPosts(limit: number = 3) {
  try {
    const posts = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
    
    return posts
  } catch (error) {
    console.error('Error fetching latest blog posts:', error)
    // Return demo blog posts when database is not available
    return [
      {
        id: 'demo-blog-1',
        title: 'The Art of Handicraft Making',
        slug: 'art-of-handicraft-making',
        content: 'Handicraft making is an ancient art that has been passed down through generations. It involves creating beautiful objects by hand using traditional techniques and materials.',
        excerpt: 'Discover the ancient art of handicraft making and how it has evolved over centuries.',
        featuredImage: '/api/placeholder/800/400',
        authorId: 'admin',
        status: 'published',
        publishedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 'demo-blog-2',
        title: 'Traditional Craftsmanship in Modern Times',
        slug: 'traditional-craftsmanship-modern-times',
        content: 'How traditional craftsmanship techniques are being preserved and adapted for modern markets while maintaining their cultural significance.',
        excerpt: 'Exploring how traditional crafts are evolving in the modern world.',
        featuredImage: '/api/placeholder/800/400',
        authorId: 'admin',
        status: 'published',
        publishedAt: new Date('2024-01-10'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: 'demo-blog-3',
        title: 'The Story Behind Our Handicrafts',
        slug: 'story-behind-our-handicrafts',
        content: 'Every handicraft tells a story. From the skilled artisans who create them to the cultural traditions they represent, each piece has a unique narrative.',
        excerpt: 'Learn about the stories and traditions behind our beautiful handicrafts.',
        featuredImage: '/api/placeholder/800/400',
        authorId: 'admin',
        status: 'published',
        publishedAt: new Date('2024-01-05'),
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      }
    ]
  }
} 
