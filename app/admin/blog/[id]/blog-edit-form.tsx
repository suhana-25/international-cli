'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  authorId: string
  status: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface BlogEditFormProps {
  post: BlogPost
}

export default function BlogEditForm({ post }: BlogEditFormProps) {
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublished, setIsPublished] = useState(post.status === 'published')
  const [slug, setSlug] = useState(post.slug)
  const [uploadedImage, setUploadedImage] = useState<string | null>(post.featuredImage || null)
  const { toast } = useToast()
  const router = useRouter()

  // Check if user is authenticated and is admin
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/auth/sign-in')
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!session?.user?.id) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Unable to get user information. Please try logging in again.",
      })
      setIsSubmitting(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const data = {
      id: post.id,
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      featuredImage: uploadedImage || '',
      status: isPublished ? 'published' : 'draft',
      publishedAt: isPublished ? new Date() : undefined,
      authorId: post.authorId, // Keep the existing author ID
    }

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Blog post updated successfully!",
        })
        router.push('/admin/blog')
      } else {
        toast({
          variant: 'destructive',
          title: "Error",
          description: result.error || "Failed to update blog post",
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to update blog post. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const newSlug = generateSlug(title)
    setSlug(newSlug)
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
  }

  const handleImageUpload = (url: string) => {
    setUploadedImage(url)
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    })
  }

  const removeUploadedImage = () => {
    setUploadedImage(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <CardTitle>Edit Blog Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={post.title}
              placeholder="Enter blog post title"
              onChange={handleTitleChange}
              className="bg-background"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="blog-post-slug"
              className="bg-background"
            />
            <p className="text-sm text-muted-foreground">
              The URL-friendly version of the title. Leave empty to auto-generate.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              required
              defaultValue={post.content}
              placeholder="Write your blog post content here... You can use HTML tags for formatting."
              rows={15}
              className="bg-background"
            />
            <p className="text-sm text-muted-foreground">
              You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt; for formatting.
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={post.excerpt || ''}
              placeholder="Brief summary of the blog post (optional)"
              rows={3}
              className="bg-background"
            />
            <p className="text-sm text-muted-foreground">
              A short description that will appear in blog listings and previews.
            </p>
          </div>

          {/* Featured Image */}
          <div className="space-y-4">
            <Label>Featured Image (Optional)</Label>
            
            {/* Current Image Display */}
            {post.featuredImage && !uploadedImage && (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="relative w-full max-w-md h-48 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt="Current featured image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/50 hover:bg-muted transition-colors">
              <div className="text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload New Image</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF up to 10MB</p>
                </div>
                
                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        const imageUrl = e.target?.result as string
                        handleImageUpload(imageUrl)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="hidden"
                  id="imageUpload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  Choose File
                </Button>
              </div>
            </div>



            {/* Image Preview */}
            {uploadedImage && (
              <div className="space-y-2">
                <Label>New Image Preview</Label>
                <div className="relative w-full max-w-md h-48 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={uploadedImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => {
                      toast({
                        variant: 'destructive',
                        title: "Invalid Image",
                        description: "Please check the image URL or upload a valid image file",
                      })
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={removeUploadedImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Published Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="isPublished">Publish immediately</Label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Post
                </>
              )}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/blog">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
