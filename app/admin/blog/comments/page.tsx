'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface Comment {
  id: string
  authorName: string
  authorEmail: string
  content: string
  status: string
  createdAt: string
  postTitle: string
  postSlug: string
}

// Simple date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments')
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch comments'
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch comments'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (commentId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (processing) return
    
    setProcessing(commentId)
    
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/approve`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        // Update the comment locally instead of refetching
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: 'approved' }
            : comment
        ))
        
        toast({
          title: 'Success',
          description: 'Comment approved successfully'
        })
      } else {
        const errorData = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorData.error || 'Failed to approve comment'
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve comment'
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (commentId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (processing) return
    
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    setProcessing(commentId)
    
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove the comment locally instead of refetching
        setComments(prev => prev.filter(comment => comment.id !== commentId))
        
        toast({
          title: 'Success',
          description: 'Comment deleted successfully'
        })
      } else {
        const errorData = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorData.error || 'Failed to delete comment'
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete comment'
      })
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-600 border-t-slate-400 mx-auto mb-4"></div>
            <p className="text-slate-400 font-inter">Loading comments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-white">Comment Moderation</h1>
            <p className="text-slate-400 font-inter mt-2">Manage and approve user comments</p>
          </div>
          <span className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg font-manrope font-medium">
            {comments.length} total comments
          </span>
        </div>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-slate-600">💬</span>
              </div>
              <h3 className="text-lg font-poppins font-semibold text-white mb-2">No Comments Yet</h3>
              <p className="text-slate-400 font-inter">Comments will appear here when users start engaging with your blog posts.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800 hover:border-slate-700 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-poppins font-semibold text-white">{comment.authorName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-manrope font-medium ${
                        comment.status === 'approved' 
                          ? 'bg-green-800 text-green-200' 
                          : 'bg-yellow-800 text-yellow-200'
                      }`}>
                        {comment.status === 'approved' ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-inter mb-1">
                      {comment.authorEmail} • {formatDate(comment.createdAt)}
                    </p>
                    <p className="text-sm text-slate-500 font-inter">
                      On: <span className="text-slate-300">{comment.postTitle || 'Unknown Post'}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {comment.status !== 'approved' && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => handleApprove(comment.id, e)}
                        disabled={processing === comment.id}
                        className="bg-green-600 hover:bg-green-700 text-white font-manrope font-medium px-4"
                      >
                        {processing === comment.id ? 'Approving...' : '✓ Approve'}
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => handleDelete(comment.id, e)}
                      disabled={processing === comment.id}
                      className="bg-red-600 hover:bg-red-700 text-white font-manrope font-medium px-4"
                    >
                      {processing === comment.id ? 'Deleting...' : '🗑 Delete'}
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-200 font-inter leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 
