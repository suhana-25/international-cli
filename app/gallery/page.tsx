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

export default function GalleryPage() {
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
    if (!isModalOpen) return
    
    switch (e.key) {
      case 'Escape':
        closeModal()
        break
      case 'ArrowRight':
        goToNext()
        break
      case 'ArrowLeft':
        goToPrevious()
        break
    }
  }, [isModalOpen, goToNext, goToPrevious])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(prev * 1.1, 5))
    } else {
      setZoom(prev => Math.max(prev * 0.9, 0.1))
    }
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    toast({
      title: 'Error',
      description: 'Failed to load image',
      variant: 'destructive'
    })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading premium gallery...</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  const selectedImage = selectedItemIndex !== null ? items[selectedItemIndex] : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="w-full px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-light text-gray-900 mb-2">Gallery</h1>
            <p className="text-gray-500 text-sm">
              {items.length} {items.length === 1 ? 'image' : 'items'}
            </p>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchImages}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                ) : (
                  '🔄'
                )}
                Refresh Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content - Premium Masonry Layout */}
      <div className="w-full px-3 py-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 space-y-3">
          {items.map((image, index) => {
            // Create different aspect ratios for variety
            const aspectRatios = [
              'aspect-square',     // 1:1
              'aspect-[4/5]',      // 4:5 - Portrait
              'aspect-[3/4]',      // 3:4 - Portrait
              'aspect-[5/4]',      // 5:4 - Landscape
              'aspect-[3/2]',      // 3:2 - Landscape
              'aspect-[2/3]',      // 2:3 - Tall Portrait
              'aspect-video',      // 16:9 - Wide
            ]
            
            // Assign aspect ratio based on index for variety
            const aspectRatio = aspectRatios[index % aspectRatios.length]
            
            return (
              <div
                key={image.id}
                className={`group relative ${aspectRatio} bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] break-inside-avoid mb-3 border border-gray-100`}
                onClick={() => openImage(index)}
              >
                              {image.mediaType === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={image.imageUrl}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                  {/* Video Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                  <img
                    src={image.imageUrl}
                    alt={image.title || image.fileName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                
                {/* Premium Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4 shadow-xl scale-75 group-hover:scale-100 transition-transform duration-500 border border-white/20">
                      {image.mediaType === 'video' ? (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Premium Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <div className="text-white text-sm font-medium flex items-center gap-2">
                      {image.mediaType === 'video' ? (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          Video
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Image
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Title Overlay */}
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">🖼️</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No items yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your gallery is empty. Check back later for new additions.
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 border-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="relative w-full h-full flex items-center justify-center backdrop-blur-sm">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  {selectedImage && (
                    <>
                      <h2 className="text-lg font-semibold">{selectedImage.title || selectedImage.fileName}</h2>
                      <p className="text-sm text-gray-300">{formatDate(selectedImage.createdAt)}</p>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={closeModal}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {selectedItemIndex !== null && selectedItemIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {selectedItemIndex !== null && selectedItemIndex < items.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Media Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onWheel={handleWheel}
            >
              {selectedImage && (
                selectedImage.mediaType === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      src={selectedImage.imageUrl}
                      className="w-[95vw] h-[85vh] object-contain rounded-lg shadow-2xl"
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: 'transform 0.1s ease-out'
                      }}
                      controls
                      autoPlay
                      onLoadedData={handleImageLoad}
                      onError={handleImageError}
                      controlsList="nodownload"
                    />
                    {/* Video info will be shown in bottom controls */}
                  </div>
                ) : (
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title || selectedImage.fileName}
                    className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                )
              )}
              
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-6">
              {/* Show zoom/rotate controls only for images */}
              {selectedImage?.mediaType !== 'video' && (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setZoom(prev => Math.min(prev * 1.2, 5))}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setZoom(prev => Math.max(prev * 0.8, 0.1))}
                  >
                    <ZoomOut className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setRotation(prev => prev + 90)}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={resetView}
                  >
                    Reset
                  </Button>
                </div>
              )}

              {/* Premium Media Actions */}
              <div className="flex items-center justify-between">
                <div className="text-white">
                  {selectedImage?.title && (
                    <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
                  )}
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    {selectedImage?.mediaType === 'video' ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Video File
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        Image File
                      </>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => window.open(selectedImage?.imageUrl, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Image Counter */}
              <div className="text-center text-white">
                <p className="text-sm text-gray-300">
                  {selectedItemIndex !== null ? `${selectedItemIndex + 1} of ${items.length}` : ''}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
