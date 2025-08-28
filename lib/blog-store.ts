// Centralized blog storage for admin-managed blog posts
// This replaces database storage for now to avoid migration issues
// Now with real-time notifications via Pusher

import fs from 'fs'
import path from 'path'
import { notifyBlogChange } from './pusher'

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  authorId: string
  status: 'draft' | 'published'
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// File-based storage path
const STORAGE_PATH = path.join(process.cwd(), 'data', 'blogs.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load blog posts from file
const loadBlogPosts = (): BlogPost[] => {
  try {
    ensureDataDir()
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8')
      const parsedPosts = JSON.parse(data)
      return parsedPosts.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined
      }))
    }
  } catch (error) {
    console.log('Error loading blog posts:', error)
  }
  return [] // Start with empty array if no file or error
}

// Save blog posts to file
const saveBlogPosts = (posts: BlogPost[]) => {
  try {
    console.log(`💾 Attempting to save ${posts.length} blog posts to file...`)
    ensureDataDir()
    
    // Check if we can write to the directory
    const testFile = path.join(process.cwd(), 'data', 'test-write.tmp')
    try {
      fs.writeFileSync(testFile, 'test')
      fs.unlinkSync(testFile)
      console.log('✅ Write permissions verified')
    } catch (writeError) {
      console.error('❌ No write permissions to data directory:', writeError)
      throw new Error('No write permissions to data directory')
    }
    
    const data = JSON.stringify(posts, null, 2)
    fs.writeFileSync(STORAGE_PATH, data)
    console.log(`✅ Successfully saved ${posts.length} blog posts to ${STORAGE_PATH}`)
  } catch (error) {
    console.error('❌ Error saving blog posts to file:', error)
    throw error // Re-throw to handle in calling function
  }
}

// In-memory storage - Load from file or start empty
let blogPosts: BlogPost[] = loadBlogPosts()

// Force reload blog posts from file (for cache busting)
export const reloadBlogPosts = (): BlogPost[] => {
  console.log('🔄 Force reloading blog posts from file...')
  blogPosts = loadBlogPosts()
  console.log(`✅ Reloaded ${blogPosts.length} blog posts`)
  return blogPosts
}

// Blog functions
export const getBlogPosts = (): BlogPost[] => {
  return blogPosts
}

export const getBlogPostById = (id: string): BlogPost | null => {
  return blogPosts.find(post => post.id === id) || null
}

export const getBlogPostBySlug = (slug: string): BlogPost | null => {
  return blogPosts.find(post => post.slug === slug) || null
}

export const getPublishedBlogPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.status === 'published')
}

export const getDraftBlogPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.status === 'draft')
}

export const createBlogPost = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  const newPost: BlogPost = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: data.status === 'published' ? new Date() : undefined
  }
  
  blogPosts.push(newPost)
  saveBlogPosts(blogPosts)
  console.log('✅ Blog post created:', newPost.id)
  
  // Send real-time notification
  try {
    await notifyBlogChange('created', newPost)
    console.log('📡 Real-time: Blog creation notification sent')
  } catch (error) {
    console.error('❌ Real-time: Failed to send blog creation notification:', error)
  }
  
  return newPost
}

export const updateBlogPost = async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BlogPost | null> => {
  const index = blogPosts.findIndex(post => post.id === id)
  if (index === -1) return null
  
  blogPosts[index] = {
    ...blogPosts[index],
    ...updates,
    updatedAt: new Date(),
    publishedAt: updates.status === 'published' ? new Date() : blogPosts[index].publishedAt
  }
  
  saveBlogPosts(blogPosts)
  console.log('✅ Blog post updated:', id)
  
  // Send real-time notification
  try {
    await notifyBlogChange('updated', blogPosts[index])
    console.log('📡 Real-time: Blog update notification sent')
  } catch (error) {
    console.error('❌ Real-time: Failed to send blog update notification:', error)
  }
  
  return blogPosts[index]
}

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    console.log(`🔍 Attempting to delete blog post with ID: ${id}`)
    console.log(`📝 Current blog posts in memory: ${blogPosts.length}`)
    
    // Force reload to ensure we have latest data
    blogPosts = loadBlogPosts()
    console.log(`📝 After reload: ${blogPosts.length} blog posts`)
    
    const index = blogPosts.findIndex(post => post.id === id)
    if (index === -1) {
      console.log(`❌ Blog post with ID ${id} not found`)
      return false
    }
    
    console.log(`🗑️ Found blog post at index ${index}, deleting...`)
    const deletedPost = blogPosts[index]
    blogPosts.splice(index, 1)
    
    console.log(`💾 Saving updated blog posts list to file...`)
    saveBlogPosts(blogPosts)
    
    // Force reload from file to ensure consistency
    blogPosts = loadBlogPosts()
    console.log(`✅ Blog post deleted. Remaining posts: ${blogPosts.length}`)
    
    // Verify deletion
    const verifyPost = blogPosts.find(p => p.id === id)
    if (verifyPost) {
      console.log(`⚠️ Blog post still exists after deletion! File save may have failed.`)
      return false
    }
    
    console.log(`✅ Blog post deletion verified successfully`)
    
    // Send real-time notification
    try {
      await notifyBlogChange('deleted', deletedPost)
      console.log('📡 Real-time: Blog deletion notification sent')
    } catch (error) {
      console.error('❌ Real-time: Failed to send blog deletion notification:', error)
    }
    
    return true
    
  } catch (error) {
    console.error(`❌ Error in deleteBlogPost for ID ${id}:`, error)
    return false
  }
}

export const searchBlogPosts = (query: string): BlogPost[] => {
  const lowerQuery = query.toLowerCase()
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery) ||
    post.excerpt?.toLowerCase().includes(lowerQuery)
  )
}

export const getLatestBlogPosts = (limit: number = 3): BlogPost[] => {
  return blogPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
    .slice(0, limit)
}
