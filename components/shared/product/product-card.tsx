'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { Product } from '@/types'
import { useCart } from '@/lib/context/cart-context'
import { 
  ShoppingCart, 
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ 
  product, 
  className
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock <= 0) return
    
    setIsAddingToCart(true)
    
    try {
      const productImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : '/placeholder-product.jpg'

      const result = await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight || 0,
        image: productImage,
        quantity: 1,
        stock: product.stock
      })

      if (result.success) {
        toast({
          description: result.message || `${product.name} added to cart!`,
          className: "bg-white border-border text-foreground shadow-lg",
        })
      } else {
        toast({
          description: result.message || "Failed to add item to cart.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to add to cart',
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Get the first image or use placeholder
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : null
  const isValidImage = firstImage && firstImage !== '' && (firstImage.startsWith('data:') || firstImage.startsWith('http') || firstImage.startsWith('https'))

  const isOutOfStock = product.stock <= 0

  // Truncate description for card display
  const truncatedDescription = product.description 
    ? product.description.length > 60 
      ? product.description.substring(0, 60) + '...'
      : product.description
    : 'Premium handcrafted product with exceptional quality.'

  return (
    <Card className={cn(
      "group relative bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300",
      "h-full flex flex-col rounded-none overflow-hidden",
      className
    )}>
      <Link href={`/product/${product.slug}`} className="block flex-1">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Product Image - Maximized coverage */}
          <div className="relative h-72 overflow-hidden bg-white">
            {isValidImage ? (
              <div className="relative w-full h-full">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                  </div>
                )}
                <img
                  src={firstImage}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  crossOrigin="anonymous"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false)
                    console.warn('Failed to load image:', firstImage)
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            {/* Stock Badge - Clean positioning */}
            {isOutOfStock && (
              <div className="absolute top-3 right-3">
                <span className="bg-white text-red-600 text-xs px-2 py-1 rounded font-medium shadow-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      {/* Product Info - Minimal space section */}
      <div className="p-3 bg-white border-t border-gray-100">
        {/* Product Name - Single line */}
        <h3 className="font-medium text-gray-800 text-base mb-1.5 line-clamp-1 leading-tight">
          {product.name}
        </h3>

        {/* Price and Button Row - Compact */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          {/* Add to Cart Button - Compact */}
          <div onClick={(e) => e.stopPropagation()}>
            {!isOutOfStock ? (
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                variant="outline"
                size="sm"
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-2.5 py-1 text-xs font-medium"
              >
                {isAddingToCart ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add
                  </>
                )}
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                size="sm"
                className="border-gray-200 bg-gray-50 text-gray-400 px-2.5 py-1 text-xs cursor-not-allowed"
              >
                Sold Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 
