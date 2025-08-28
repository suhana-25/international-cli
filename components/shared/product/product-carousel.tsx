'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import ProductImage from '@/components/shared/ui/product-image'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  stock: number
  isFeatured?: boolean
}

interface ProductCarouselProps {
  data: Product[]
  autoPlay?: boolean
  interval?: number
  onAddToCart?: (productId: string) => void
}

export default function ProductCarousel({
  data,
  autoPlay = true,
  interval = 5000,
  onAddToCart
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!autoPlay || data.length <= 1) return

    const timer = setInterval(() => {
      nextSlide()
    }, interval)

    return () => clearInterval(timer)
  }, [currentIndex, autoPlay, interval, data.length])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % data.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  if (!data || data.length === 0) {
    return null
  }

  const currentProduct = data[currentIndex]
  const isOutOfStock = currentProduct.stock <= 0

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ProductImage
          src={currentProduct.images?.[0] || ''}
          alt={currentProduct.name}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 sm:px-8 max-w-4xl mx-auto">
          {/* Featured Badge */}
          {currentProduct.isFeatured && (
            <Badge className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
              Featured Product
            </Badge>
          )}

          {/* Product Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4">
            {currentProduct.name}
          </h1>

          {/* Price */}
          <div className="text-2xl sm:text-3xl font-semibold mb-6">
            {formatPrice(currentProduct.price)}
          </div>

          {/* Stock Status */}
          {!isOutOfStock ? (
            <p className="text-lg mb-8 text-green-300">
              In Stock ({currentProduct.stock} available)
            </p>
          ) : (
            <p className="text-lg mb-8 text-red-300">
              Out of Stock
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
              <Link href={`/product/${currentProduct.slug}`}>
                View Details
              </Link>
            </Button>
            
            {onAddToCart && !isOutOfStock && (
              <Button
                onClick={() => onAddToCart(currentProduct.id)}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {data.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {data.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Product Counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {data.length}
      </div>
    </div>
  )
} 
