'use client'

import { useState, useEffect } from 'react'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReliableImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  fallbackSrc?: string
  [key: string]: any
}

export default function ReliableImage({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  fallbackSrc = '/placeholder-product.jpg',
  ...props
}: ReliableImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // Reset state when src changes
  useEffect(() => {
    if (!src || src.trim() === '') {
      setError(true)
      setLoading(false)
      return
    }

    setCurrentSrc(src)
    setError(false)
    setLoading(true)
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Set a timeout for image loading (5 seconds)
    const timeout = setTimeout(() => {
      console.warn('Image loading timeout:', src)
      setError(true)
      setLoading(false)
    }, 5000)
    
    setTimeoutId(timeout)
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [src])

  const handleError = () => {
    console.warn('Image failed to load:', currentSrc)
    setError(true)
    setLoading(false)
    
    // Try fallback if we haven't already
    if (currentSrc !== fallbackSrc) {
      console.log('Trying fallback image:', fallbackSrc)
      setCurrentSrc(fallbackSrc)
      setError(false)
      setLoading(true)
    }
  }

  const handleLoad = () => {
    console.log('Image loaded successfully:', currentSrc)
    setError(false)
    setLoading(false)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  // Show loading state
  if (loading && !error) {
    return (
      <div className={cn(
        "bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center animate-pulse",
        fill ? "absolute inset-0" : "",
        className
      )}>
        <div className="text-center">
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-1 animate-pulse"></div>
          <p className="text-gray-500 text-xs">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={cn(
        "bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center",
        fill ? "absolute inset-0" : "",
        className
      )}>
        <div className="text-center">
          <ImageIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
          <p className="text-gray-500 text-xs">No image</p>
        </div>
      </div>
    )
  }

  // Show image
  if (fill) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  )
} 
