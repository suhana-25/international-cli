'use client'

import { useEffect, useState } from 'react'
import BlogCard from '@/components/shared/blog/blog-card'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  authorId: string
  status: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export default function BlogsClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch blog posts",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchPosts()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-slate-400">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
          <p className="text-slate-400 mb-6">
            We're working on creating amazing content for you. Check back soon!
          </p>
          <Button onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Posts Count */}
      <div className="text-center pt-8 border-t border-slate-800">
        <p className="text-slate-400">
          Showing {posts.length} blog post{posts.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
