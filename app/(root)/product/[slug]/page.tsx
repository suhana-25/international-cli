'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useCart } from '@/lib/context/cart-context'
import { 
  ShoppingCart, 
  Share2, 
  ArrowLeft, 
  Package,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ProductImageZoom from '@/components/shared/product/product-image-zoom'
import ShareButton from '@/components/shared/product/share-button'


interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  stock: number
  weight: number
    slug: string
  isFeatured: boolean
  isBanner: boolean
  categoryId: string | null
  categoryIds: string[] | null
  createdAt: Date
  updatedAt: Date
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)


  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params?.slug}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setProduct(result.data)
          } else {
            toast({
              variant: "destructive",
              description: "Product not found",
            })
            router.push('/catalog')
          }
        } else {
          throw new Error('Failed to fetch product')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast({
          variant: "destructive",
          description: "Failed to load product",
        })
        router.push('/catalog')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params?.slug, router, toast])

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return
    
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
        quantity: quantity,
        stock: product.stock
      })

      if (result.success) {
        toast({
          description: result.message || `${product.name} added to cart!`,
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

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-inter">Loading product...</p>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-poppins font-semibold text-foreground mb-2">Product Not Found</h2>
          <p className="text-muted-foreground font-inter mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/catalog')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock <= 0
  const validImages = product.images?.filter(img => img && img !== '') || []
  const currentImage = validImages[selectedImageIndex] || '/placeholder-product.jpg'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-foreground hover:text-accent hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>

            {/* Share Button */}
            <ShareButton product={product} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Section */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden p-4">
              <ProductImageZoom
                image={currentImage}
                alt={product.name}
                className="w-full aspect-square rounded-xl overflow-hidden"
              />
            </div>

            {/* Image Thumbnails */}
            {validImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {validImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200",
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Product Name & Price */}
            <div className="space-y-4 pb-4 border-b border-gray-200">
              <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-poppins font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 font-inter">
                  Free shipping worldwide
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-manrope font-semibold",
              isOutOfStock 
                ? "bg-red-50 border border-red-200 text-red-700"
                : product.stock <= 5
                  ? "bg-orange-50 border border-orange-200 text-orange-700"
                  : "bg-green-50 border border-green-200 text-green-700"
            )}>
              <Package className="h-4 w-4" />
              {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-poppins font-semibold text-gray-900">About This Product</h3>
              <p className="text-gray-700 font-inter leading-relaxed text-base">
                {product.description || 'Beautiful handcrafted art piece made with care and attention to detail. Perfect for home decoration and gifting.'}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {!isOutOfStock && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-900 font-manrope font-semibold">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 p-0 border-gray-300 hover:border-primary hover:bg-secondary text-gray-900"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center text-gray-900 font-inter font-bold text-lg">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 p-0 border-gray-300 hover:border-primary hover:bg-secondary text-gray-900"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    variant="outline"
                    className="w-full border-2 border-blue-600 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-semibold py-4 h-auto text-lg"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart • ${(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </Button>
                  
                  {/* Buy Now Button - Primary action */}
                  <Button
                    onClick={() => {
                      // Add to cart first, then redirect to shipping address
                      handleAddToCart().then(() => {
                        router.push('/shipping-address')
                      })
                    }}
                    disabled={isAddingToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 h-auto text-lg shadow-lg"
                  >
                    Buy Now • ${(product.price * quantity).toFixed(2)}
                  </Button>
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Weight</span>
                  <span className="text-gray-900 font-semibold">{product.weight || 1.0}kg</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Type</span>
                  <span className="text-gray-900 font-semibold">Handcrafted Art</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
} 