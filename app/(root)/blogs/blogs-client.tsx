'use client'

import { useState, useEffect } from 'react'
import BlogCard from '@/components/shared/blog/blog-card'
import { Search, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  authorId: string
  status: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export function BlogsClient() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog')
        if (response.ok) {
          const posts = await response.json()
          setBlogs(posts || [])
          setFilteredBlogs(posts || [])
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBlogs(blogs)
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBlogs(filtered)
    }
  }, [searchTerm, blogs])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-gray-600">Loading blogs...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
          Our Stories
        </h1>
        <p className="text-gray-600 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
          Discover the art of handicrafts, traditional craftsmanship, and the inspiring stories behind our handmade treasures
        </p>
        
        {/* Search */}
        <div className="max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search our stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-3 text-base bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 rounded-lg"
          />
        </div>
      </div>

      {/* Blog Posts */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="max-w-lg mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              {searchTerm ? 'No stories found' : 'Stories coming soon...'}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              {searchTerm 
                ? `No blog posts match "${searchTerm}". Try searching for something else.`
                : 'We\'re crafting amazing stories about our handicrafts and artisans. Check back soon for inspiring content!'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
