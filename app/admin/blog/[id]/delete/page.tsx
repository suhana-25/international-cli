'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { deleteBlogPost, getBlogPostById } from '@/lib/actions/blog.actions'
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface BlogDeletePageProps {
  params: Promise<{ id: string }>
}

export default function BlogDeletePage({ params }: BlogDeletePageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState<any>(null)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadPost = async () => {
      try {
        const resolved = await params
        setResolvedParams(resolved)
        const postData = await getBlogPostById(resolved.id)
        if (!postData) {
          notFound()
        }
        setPost(postData)
      } catch (error) {
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    loadPost()
  }, [params])

  const handleDelete = async () => {
    if (!resolvedParams) return
    setIsSubmitting(true)

    try {
      const result = await deleteBlogPost(resolvedParams.id)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        window.location.href = '/admin/blog'
      } else {
        toast({
          variant: 'destructive',
          title: "Error",
          description: result.message,
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog Management
          </Link>
        </Button>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Blog Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Are you sure?</h2>
            <p className="text-muted-foreground mb-4">
              This action cannot be undone. This will permanently delete the blog post:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground">
                Created on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="destructive"
              size="lg"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </div>
              )}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/admin/blog">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 