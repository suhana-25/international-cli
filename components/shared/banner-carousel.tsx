'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/lib/product-store'

interface BannerCarouselProps {
  bannerProducts: Product[]
}

export default function BannerCarousel({ bannerProducts }: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Flatten all banner images from all products
  const allBannerImages = bannerProducts.flatMap(product => {
    const bannerImages = product.bannerImages || []
    return bannerImages.map(image => ({ image, product }))
  })

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying || allBannerImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allBannerImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [currentSlide, allBannerImages.length, isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % allBannerImages.length)
  }

  const prevSlide = () => {
    goToSlide(currentSlide === 0 ? allBannerImages.length - 1 : currentSlide - 1)
  }

  // Show loading state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to <span className="text-orange-600 dark:text-orange-400">Nitesh Handicraft</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover unique handmade treasures crafted with passion and tradition. 
              Each piece tells a story of artistry and cultural heritage.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (allBannerImages.length === 0) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to <span className="text-orange-600 dark:text-white">Nitesh Handicraft</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover unique handmade treasures crafted with passion and tradition. 
              Each piece tells a story of artistry and cultural heritage.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Slides */}
      <div className="relative h-full">
        {allBannerImages.map(({ image, product }, index) => {
          // Check if image is valid (base64 or URL)
          const isValidImage = image && image !== '' && (image.startsWith('data:') || image.startsWith('http') || image.startsWith('https'))
          
          return (
            <div
              key={`${product.id}-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative h-full">
                {isValidImage ? (
                  <img
                    src={image}
                    alt={`${product.name} banner`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                {/* Fallback background */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 ${isValidImage ? 'hidden' : ''}`}
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
                  }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-4">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-poppins font-bold mb-4 tracking-tight">
                      {product.name}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
                      {product.description || "Discover premium handcrafted art statues and handicrafts"}
                    </p>
                    <Link href={`/product/${product.slug}`}>
                      <Button size="lg" className="text-lg px-8 py-3 font-manrope font-medium">
                        View Product
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      {allBannerImages.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {allBannerImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {allBannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 
