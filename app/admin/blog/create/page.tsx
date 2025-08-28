'use client'

import { useState } from 'react'
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
import { UploadButton } from '@/lib/uploadthing'

export default function CreateBlogPostPage() {
  const session = { user: { id: 'admin', role: 'admin' } } // Mock admin session
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [slug, setSlug] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    
    // Validate title length
    if (title.length > 500) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Title is too long. Please keep it under 500 characters.",
      })
      setIsSubmitting(false)
      return
    }
    
    // Validate content length
    if (content.length > 10000) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Content is too long. Please keep it under 10,000 characters.",
      })
      setIsSubmitting(false)
      return
    }
    
    const data = {
      title: title,
      slug: formData.get('slug') as string,
      content: content,
      excerpt: formData.get('excerpt') as string,
      featuredImage: uploadedImage || '',
      status: isPublished ? 'published' : 'draft',
      authorId: session?.user?.id || '',
    }

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Blog post created successfully!",
        })
        window.location.href = '/admin/blog'
      } else {
        toast({
          variant: 'destructive',
          title: "Error",
          description: result.error || "Failed to create blog post",
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to create blog post. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (title: string) => {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Limit slug to 200 characters to stay well under the 255 limit
    if (slug.length > 200) {
      slug = slug.substring(0, 200)
      // Remove trailing dash if it exists
      if (slug.endsWith('-')) {
        slug = slug.slice(0, -1)
      }
    }
    
    return slug
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
    setImageUploading(false)
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    })
  }

  const removeUploadedImage = () => {
    setUploadedImage(null)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
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
                placeholder="Enter blog post title"
                onChange={handleTitleChange}
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
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                required
                placeholder="Write your blog post content here..."
                rows={10}
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="Brief summary of the blog post..."
                rows={3}
              />
            </div>

            {/* Featured Image Upload with UploadThing */}
            <div className="space-y-4">
              <Label>Featured Image</Label>
              
              {/* UploadThing Upload Button */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">Upload Image</p>
                    <p className="text-xs text-gray-500">JPG, PNG or GIF up to 4MB</p>
                  </div>
                  
                  <UploadButton
                    endpoint="galleryImage"
                    onUploadBegin={() => {
                      setImageUploading(true)
                      toast({
                        title: "Uploading...",
                        description: "Please wait while your image uploads",
                      })
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        handleImageUpload(res[0].url)
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setImageUploading(false)
                      toast({
                        variant: 'destructive',
                        title: "Upload Failed",
                        description: error.message || "Failed to upload image",
                      })
                    }}
                    className="mt-3"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {uploadedImage && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="relative w-full max-w-md h-48 bg-gray-100 rounded-lg overflow-hidden">
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

              {/* Upload Status */}
              {imageUploading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Uploading image...</span>
                </div>
              )}
            </div>

            {/* Published Status - IMPORTANT! */}
            <div className="space-y-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="isPublished" className="font-semibold">
                  Publish immediately
                </Label>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {isPublished 
                  ? "✅ This blog post will be published and visible on the public blog page (/blogs)"
                  : "⚠️ This blog post will be saved as a draft and only visible in the admin panel"
                }
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Post
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
    </div>
  )
} 
