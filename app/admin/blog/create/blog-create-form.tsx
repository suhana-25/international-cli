'use client'

import { useState } from 'react'
// // import { useSession } from 'next-auth/react' // Removed - using custom auth // Removed - using custom auth
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Save, Upload, X, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function BlogCreateForm() {
  // const { data: session, status } = useSession() // Removed - using custom auth
  const session = { user: { id: 'admin', role: 'admin', name: 'Admin' } } // Mock admin session
  const status = 'authenticated' // Always authenticated for admin
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublished, setIsPublished] = useState(true) // Default to published so blogs show up immediately
  const [slug, setSlug] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Check if user is authenticated and is admin
  // Skip loading check for custom auth
  if (false) { // status === 'loading'
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Skip auth check for custom auth
  if (false) { // status === 'unauthenticated' || session?.user?.role !== 'admin'
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
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      featuredImage: uploadedImage || '',
      status: isPublished ? 'published' : 'draft',
      authorId: session?.user.id, // Use the current user's ID
    }

    try {
      console.log('Submitting blog data:', data) // Debug log
      
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log('API response:', result) // Debug log

      if (response.ok) {
        toast({
          title: "Success",
          description: `Blog post created successfully! ${isPublished ? 'It is now published and visible on the public blog page.' : 'It is saved as a draft and only visible in the admin panel.'}`,
        })
        router.push('/admin/blog')
      } else {
        toast({
          variant: 'destructive',
          title: "Error",
          description: result.error || "Failed to create blog post",
        })
      }
    } catch (error) {
      console.error('Blog creation error:', error) // Debug log
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
          <CardTitle>Create New Blog Post</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Blog Post Title"
                required
                onChange={handleTitleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="blog-post-slug"
                value={slug}
                onChange={handleSlugChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your blog post content here..."
              rows={10}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt (Optional)</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              placeholder="A short summary of your blog post (max 160 characters)"
              rows={3}
              maxLength={160}
              className="mt-1"
            />
          </div>

          <div className="space-y-4">
            <Label>Featured Image</Label>
            
            {/* File Upload */}
            <div className="space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm text-gray-600">JPG, PNG or GIF up to 10MB</p>
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
            </div>



            {/* Image Preview */}
            {uploadedImage && (
              <div className="space-y-2">
                <Label>Image Preview</Label>
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
                ? "✅ This blog post will be published and visible on the public blog page (/blogs) - DEFAULT"
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
  )
}

