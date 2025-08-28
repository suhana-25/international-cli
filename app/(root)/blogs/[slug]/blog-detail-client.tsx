'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, User, MessageCircle, ArrowLeft, Loader2, Share2, Bookmark, Eye, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'

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

interface Comment {
  id: string
  postId: string
  authorName: string
  authorEmail: string
  content: string
  status: string
  createdAt: Date
  updatedAt: Date
}

interface BlogDetailClientProps {
  post: BlogPost
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [commentForm, setCommentForm] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()
  }, [post.id])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?postId=${post.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setComments(data)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentForm.authorName.trim() || !commentForm.authorEmail.trim() || !commentForm.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          authorName: commentForm.authorName.trim(),
          authorEmail: commentForm.authorEmail.trim(),
          content: commentForm.content.trim(),
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Comment submitted successfully! It will be visible after admin approval.",
        })
        setCommentForm({ authorName: '', authorEmail: '', content: '' })
        fetchComments()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const approvedComments = comments.filter(comment => comment.status === 'approved')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700">
            <Link href="/blogs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Link>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Blog Header Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative h-80 w-full mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Title and Meta */}
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  Blog Post
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex items-center justify-center gap-6 text-slate-600 dark:text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>5 min read</span>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-center">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    {post.excerpt}
                  </p>
                </div>
              )}
            </div>

            {/* Blog Content */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8">
              <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                <div 
                  className="text-slate-700 dark:text-slate-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Comments ({approvedComments.length})
              </h2>

              {/* Comment Form */}
              <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Leave a Comment</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name *"
                      value={commentForm.authorName}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, authorName: e.target.value }))}
                      className="bg-white dark:bg-slate-600 border-slate-200 dark:border-slate-500 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your Email *"
                      value={commentForm.authorEmail}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, authorEmail: e.target.value }))}
                      className="bg-white dark:bg-slate-600 border-slate-200 dark:border-slate-500 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <Textarea
                    placeholder="Your Comment *"
                    value={commentForm.content}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-white dark:bg-slate-600 border-slate-200 dark:border-slate-500 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 min-h-[100px]"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <MessageCircle className="w-4 h-4 mr-2" />
                    )}
                    Submit Comment
                  </Button>
                </form>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                  Comments are moderated and will appear after approval.
                </p>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
                  </div>
                ) : approvedComments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-lg">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  approvedComments.map((comment) => (
                    <div key={comment.id} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{comment.authorName}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(comment.createdAt)}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                          Approved
                        </Badge>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            {/* Author Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">About the Author</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Admin</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Content Creator</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Passionate about sharing knowledge and insights through engaging blog content.
              </p>
            </div>

            {/* Share Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Share This Post</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on Social Media
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmark Post
                </Button>
              </div>
            </div>

            {/* Related Posts Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Related Posts</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Crafting Excellence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Discover the art of traditional craftsmanship...</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Modern Handicrafts</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">How traditional techniques meet modern design...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
