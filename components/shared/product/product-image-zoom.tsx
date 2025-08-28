'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'

interface ProductImageZoomProps {
  image: string
  alt: string
  className?: string
}

export default function ProductImageZoom({ image, alt, className }: ProductImageZoomProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if image is valid
  const isValidImage = image && image !== '' && (
    image.startsWith('data:') || 
    image.startsWith('http') || 
    image.startsWith('https') ||
    image.startsWith('/')
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    
    // Calculate mouse position relative to container
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setMousePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Touch/mobile zoom - disable for now, can be enhanced later
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Disable pinch zoom on the container for now - can be enabled with gesture handling
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-crosshair", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Image */}
      {isValidImage && !imageError ? (
        <>
          <img
            ref={imageRef}
            src={image}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-all duration-300 ease-out",
              imageLoaded ? "opacity-100" : "opacity-0",
              isHovering ? "scale-150" : "scale-100"
            )}
            style={{
              transformOrigin: isHovering ? `${mousePosition.x}% ${mousePosition.y}%` : 'center center'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(true)
            }}
            draggable={false}
          />
          
          {/* Zoom Overlay - Shows zoom area on hover */}
          {isHovering && (
            <div 
              className="absolute pointer-events-none border-2 border-white/50 bg-white/10 backdrop-blur-sm"
              style={{
                width: '100px',
                height: '100px',
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.1s ease-out'
              }}
            />
          )}

          {/* Loading Spinner */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="h-8 w-8 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        /* Fallback for invalid/missing images */
        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-inter">Image not available</p>
          </div>
        </div>
      )}

      {/* Zoom Instructions - Desktop only */}
      <div className="absolute bottom-4 right-4 hidden md:block">
        <div className={cn(
          "bg-black/70 text-white text-xs px-2 py-1 rounded transition-opacity duration-200",
          isHovering ? "opacity-0" : "opacity-100"
        )}>
          Hover to zoom
        </div>
      </div>

      {/* Mobile Zoom Instructions */}
      <div className="absolute bottom-4 right-4 md:hidden">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
          Tap to view
        </div>
      </div>
    </div>
  )
}
