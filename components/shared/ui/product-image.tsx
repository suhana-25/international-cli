'use client'

import { useState } from 'react'
import { Image } from 'lucide-react'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
}

export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false)

  // Check if image is valid (base64 or URL)
  const isValidImage = src && src !== '' && (src.startsWith('data:') || src.startsWith('http'))

  if (!isValidImage || hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <Image className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      crossOrigin="anonymous"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
      onError={() => setHasError(true)}
    />
  )
} 
