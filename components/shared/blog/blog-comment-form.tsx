'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Send } from 'lucide-react'

interface BlogCommentFormProps {
  postId: string
  onCommentAdded?: (comment: any) => void
}

export default function BlogCommentForm({ postId, onCommentAdded }: BlogCommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      postId,
      authorName: formData.get('authorName') as string,
      authorEmail: formData.get('authorEmail') as string,
      content: formData.get('content') as string,
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Comment Submitted",
          description: "Comment submitted successfully. It will be visible after approval.",
          className: "bg-slate-800 border-slate-700 text-slate-200",
        })
        e.currentTarget.reset()
        
        // Call the callback if provided
        if (onCommentAdded && result.comment) {
          onCommentAdded(result.comment)
        }
      } else {
        toast({
          variant: 'destructive',
          title: "Error",
          description: result.message || "Failed to submit comment. Please try again.",
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to submit comment. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mt-8">
      <h3 className="text-lg font-poppins font-semibold text-white mb-4">Leave a Comment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="authorName"
            type="text"
            required
            placeholder="Your name"
            className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
          />
          <Input
            name="authorEmail"
            type="email"
            required
            placeholder="your.email@example.com"
            className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
          />
        </div>
        
        <Textarea
          name="content"
          required
          placeholder="Share your thoughts..."
          rows={3}
          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter resize-none"
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-manrope font-medium px-6 py-2 transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </>
          )}
        </Button>
      </form>
      
      <p className="text-xs text-slate-400 font-inter mt-3">
        Your comment will be reviewed before publishing.
      </p>
    </div>
  )
} 
