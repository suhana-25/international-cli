'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Trash2, Edit, Upload, Plus, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { UploadButton } from '@/lib/uploadthing'

interface GalleryItem {
  id: string
  title?: string
  description?: string
  imageUrl: string
  fileName: string
  fileSize?: number
  mimeType?: string
  mediaType?: string // 'image' or 'video'
  createdAt: string
  updatedAt: string
}

export default function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    fileName: '',
    fileSize: 0,
    mimeType: ''
  })
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    fileName: '',
    fileSize: 0,
    mimeType: ''
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery')
      const data = await response.json()
      if (data.success) {
        setItems(data.data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch images',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = (uploadResponse: any) => {
    const { url, name, size, type } = uploadResponse[0]
    
    setUploadForm({
      title: uploadForm.title,
      description: uploadForm.description,
      imageUrl: url,
      fileName: name,
      fileSize: size,
      mimeType: type
    })
    
    toast({
      title: 'Success',
      description: 'Image uploaded successfully! Now add title and description if needed.',
    })
    
    // Auto-refresh gallery items after upload
    setTimeout(() => {
      fetchGalleryItems()
    }, 1000)
  }

  const handleUploadError = (error: Error) => {
    toast({
      title: 'Error',
      description: `Upload failed: ${error.message}`,
      variant: 'destructive'
    })
  }

  const handleSaveImage = async () => {
    if (!uploadForm.imageUrl || !uploadForm.fileName) {
      toast({
        title: 'Error',
        description: 'Please upload an image first',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('imageUrl', uploadForm.imageUrl)
      formData.append('fileName', uploadForm.fileName)
      formData.append('fileSize', uploadForm.fileSize.toString())
      formData.append('mimeType', uploadForm.mimeType)

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Image saved to gallery successfully'
        })
        setIsUploadDialogOpen(false)
        setUploadForm({
          title: '',
          description: '',
          imageUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: ''
        })
        // Force refresh gallery items with delay
        setTimeout(() => {
          fetchGalleryItems()
        }, 500)
        
        // Also refresh after a longer delay to ensure sync
        setTimeout(() => {
          fetchGalleryItems()
        }, 2000)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save image',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setEditForm({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl,
      fileName: item.fileName,
      fileSize: item.fileSize || 0,
      mimeType: item.mimeType || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/gallery/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Image updated successfully'
        })
        setIsEditDialogOpen(false)
        setEditingItem(null)
        fetchGalleryItems()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update image',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Image deleted successfully'
        })
        fetchGalleryItems()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Total Images: {items.length}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchGalleryItems}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              '🔄'
            )}
            Refresh
          </Button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Media</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <div className="mt-1">
                  <UploadButton
                    endpoint="galleryImage"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <Label>Upload Video</Label>
                <div className="mt-1">
                  <UploadButton
                    endpoint="galleryVideo"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    className="w-full"
                  />
                </div>
              </div>
              
              {uploadForm.imageUrl && (
                <>
                  <div className="text-center">
                    <img 
                      src={uploadForm.imageUrl} 
                      alt="Preview" 
                      className="max-h-32 mx-auto rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">{uploadForm.fileName}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title (Optional)</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      placeholder="Enter image title"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      placeholder="Enter image description"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsUploadDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveImage}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save to Gallery'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square relative group">
              {item.mediaType === 'video' ? (
                <video
                  src={item.imageUrl}
                  className="w-full h-full object-cover"
                  controls
                  muted
                />
              ) : (
                <img
                  src={item.imageUrl}
                  alt={item.title || item.fileName}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              {item.title && (
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              )}
              {item.description && (
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              )}
              <p className="text-xs text-gray-500">{item.fileName}</p>
              <p className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-500">Upload your first image to get started</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Enter image title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Enter image description"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
