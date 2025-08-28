'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw, Download, Share2, Heart } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

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
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imageLoading, setImageLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      console.log('🔄 Gallery: Fetching images...')
      const response = await fetch('/api/gallery', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      if (data.success) {
        setItems(data.data)
        console.log(`📦 Gallery: Loaded ${data.data.length} images`)
      } else {
        console.log('❌ Gallery: API returned error:', data.error)
        toast({
          title: 'Error',
          description: 'Failed to fetch gallery items',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('❌ Gallery: Fetch error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch gallery items',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const openImage = (index: number) => {
    setSelectedItemIndex(index)
    setIsModalOpen(true)
    setZoom(1)
    setRotation(0)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItemIndex(null)
    setZoom(1)
    setRotation(0)
  }

  const goToNext = useCallback(() => {
    if (selectedItemIndex !== null && selectedItemIndex < items.length - 1) {
      setSelectedItemIndex(selectedItemIndex + 1)
      setZoom(1)
      setRotation(0)
    }
  }, [selectedItemIndex, items.length])

  const goToPrevious = useCallback(() => {
    if (selectedItemIndex !== null && selectedItemIndex > 0) {
      setSelectedItemIndex(selectedItemIndex - 1)
      setZoom(1)
      setRotation(0)
    }
  }, [selectedItemIndex])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal()
    } else if (e.key === 'ArrowRight') {
      goToNext()
    } else if (e.key === 'ArrowLeft') {
      goToPrevious()
    }
  }, [goToNext, goToPrevious])

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, handleKeyDown])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleDownload = async () => {
    if (selectedItemIndex === null) return
    
    const item = items[selectedItemIndex]
    try {
      setImageLoading(true)
      const response = await fetch(item.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = item.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: 'Download Started',
        description: 'Your image download has begun',
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Download Failed',
        description: 'Failed to download image',
        variant: 'destructive'
      })
    } finally {
      setImageLoading(false)
    }
  }

  const handleShare = async () => {
    if (selectedItemIndex === null) return
    
    const item = items[selectedItemIndex]
    const shareData = {
      title: item.title || 'Gallery Image',
      text: item.description || 'Check out this amazing image from Nitesh Handicraft',
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast({
          title: 'Shared!',
          description: 'Image shared successfully',
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Link Copied!',
          description: 'Gallery link copied to clipboard',
        })
      }
    } catch (error) {
      console.error('Share error:', error)
      // Fallback to copying link
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Link Copied!',
          description: 'Gallery link copied to clipboard',
        })
      } catch (clipboardError) {
        toast({
          title: 'Share Failed',
          description: 'Failed to share image',
          variant: 'destructive'
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gallery Empty</h2>
          <p className="text-gray-600 mb-6">No images have been uploaded yet.</p>
          <Button onClick={fetchImages} variant="outline">
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of handcrafted art and beautiful creations
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <Card 
              key={item.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() => openImage(index)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.imageUrl}
                      alt={item.title || item.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="p-4">
                  {item.title && (
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.fileSize && (
                      <span>{(item.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
            {selectedItemIndex !== null && (
              <div className="relative">
                {/* Modal Header */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleRotate}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDownload}
                    disabled={imageLoading}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={closeModal}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Navigation Arrows */}
                {items.length > 1 && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                      onClick={goToPrevious}
                      disabled={selectedItemIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                      onClick={goToNext}
                      disabled={selectedItemIndex === items.length - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Image/Video Display */}
                <div className="flex items-center justify-center min-h-[60vh] bg-black">
                  {items[selectedItemIndex].mediaType === 'video' ? (
                    <video
                      src={items[selectedItemIndex].imageUrl}
                      className="max-w-full max-h-full object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={items[selectedItemIndex].imageUrl}
                      alt={items[selectedItemIndex].title || items[selectedItemIndex].fileName}
                      className="max-w-full max-h-full object-contain"
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: 'transform 0.2s ease-in-out'
                      }}
                    />
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-white border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {items[selectedItemIndex].title || items[selectedItemIndex].fileName}
                      </h3>
                      {items[selectedItemIndex].description && (
                        <p className="text-gray-600 mt-1">
                          {items[selectedItemIndex].description}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedItemIndex + 1} of {items.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
