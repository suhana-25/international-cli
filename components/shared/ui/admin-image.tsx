'use client'

import { useState, useEffect } from 'react'
import { ImageIcon, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminImageProps {
  src?: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  showFallback?: boolean
  [key: string]: any
}

export default function AdminImage({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  showFallback = true,
  ...props
}: AdminImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Reset state when src changes
  useEffect(() => {
    console.log('AdminImage: src changed to:', src)
    
    if (!src || src.trim() === '') {
      console.log('AdminImage: No src provided')
      setError(true)
      setLoading(false)
      return
    }

    setError(false)
    setLoading(true)
  }, [src])

  const handleError = () => {
    console.error('Admin image failed to load:', src)
    setError(true)
    setLoading(false)
  }

  const handleLoad = () => {
    console.log('Admin image loaded successfully:', src)
    setError(false)
    setLoading(false)
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
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto animate-pulse"></div>
          <p className="text-xs text-gray-500 mt-1">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state or no image
  if (error || !src) {
    if (!showFallback) {
      return null
    }
     
    return (
      <div className={cn(
        "bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center",
        fill ? "absolute inset-0" : "",
        className
      )}>
        <div className="text-center">
          <Package className="h-4 w-4 text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500">No image</p>
          {src && (
            <p className="text-xs text-gray-400 mt-1 truncate max-w-[100px]">
              {src.substring(0, 20)}...
            </p>
          )}
        </div>
      </div>
    )
  }

  // Show image
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        crossOrigin="anonymous"
        {...props}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      crossOrigin="anonymous"
      {...props}
    />
  )
}
