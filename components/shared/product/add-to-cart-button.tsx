'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { InstantButton, InstantNavButton } from '@/components/ui/instant-button'
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Product } from '@/types'
import { useCart } from '@/lib/context/cart-context'
import { useRouter } from 'next/navigation'
import { useInstantCart } from '@/lib/hooks/use-instant-ui'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  const isOutOfStock = product.stock <= 0
  const canAddToCart = !isOutOfStock && quantity > 0

  const handleAddToCart = async () => {
    if (!canAddToCart) return

    setIsLoading(true)
    try {
      // Get the first image from the product
      const productImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : '/placeholder-product.jpg'

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight || 0,
        image: productImage,
        quantity: quantity,
        stock: product.stock
      }

      console.log('Adding item to cart:', cartItem)
      const result = await addToCart(cartItem)
      console.log('Add to cart result:', result)

      if (result.success) {
        setIsAdded(true)
        toast({
          description: result.message || `${product.name} has been added to your cart.`,
        })
      } else {
        toast({
          description: result.message || "Failed to add item to cart.",
          variant: "destructive",
        })
      }

      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleBuyNow = async () => {
    if (!canAddToCart) return

    setIsBuyingNow(true)
    try {
      // Get the first image from the product
      const productImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : '/placeholder-product.jpg'

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight || 0,
        image: productImage,
        quantity: quantity,
        stock: product.stock
      }

      console.log('Buy Now: Adding item to cart:', cartItem)
      const result = await addToCart(cartItem)
      console.log('Buy Now: Add to cart result:', result)

      if (result.success) {
        // Store the buy now item for direct purchase
        localStorage.setItem('buyNowProduct', JSON.stringify(cartItem))
        
        toast({
          description: `Proceeding to checkout with ${product.name}`,
        })

        // Redirect directly to shipping address
        router.push('/shipping-address')
      } else {
        toast({
          description: result.message || "Failed to process order.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error in Buy Now:', error)
      toast({
        description: "Failed to process order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBuyingNow(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <InstantButton
            variant="ghost"
            size="sm"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="h-10 w-10 p-0 hover:bg-gray-100 active:scale-90"
          >
            <Minus className="w-4 h-4" />
          </InstantButton>
          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
            {quantity}
          </span>
          <InstantButton
            variant="ghost"
            size="sm"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            className="h-10 w-10 p-0 hover:bg-gray-100 active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </InstantButton>
        </div>
        <span className="text-sm text-gray-500">
          {product.stock} available
        </span>
      </div>

      {/* Add to Cart Button - Instant Response */}
      <div className="space-y-3">
        <InstantButton
          onClickAsync={handleAddToCart}
          disabled={!canAddToCart}
          size="lg"
          loadingText="Adding..."
          successText={isAdded ? "Added to Cart" : undefined}
          successDuration={2000}
          className={`w-full h-12 text-base font-medium transition-all duration-200 ${
            isAdded 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isAdded ? (
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Added to Cart
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </div>
          )}
        </InstantButton>

        {isOutOfStock && (
          <p className="text-sm text-red-600 text-center">
            Out of stock
          </p>
        )}
      </div>

      {/* Buy Now Button - Instant Navigation */}
      <InstantNavButton
        variant="outline"
        size="lg"
        className="w-full h-12 text-base font-medium border-2 border-gray-300 hover:border-gray-400 transform hover:scale-105 active:scale-95"
        disabled={!canAddToCart}
        loadingText="Processing..."
        onClickAsync={async () => {
          await handleBuyNow()
        }}
        prefetch={true}
      >
        Buy Now
      </InstantNavButton>
    </div>
  )
} 
