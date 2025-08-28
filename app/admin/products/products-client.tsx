'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Eye, Edit, Trash2, Package, Loader2, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  weight?: number
  stock: number
  images?: string[]
  bannerImages?: string[]
  categoryId?: string
  brand?: string
  isFeatured: boolean
  isBanner: boolean
  rating?: number
  numReviews?: number
  createdAt: string
  updatedAt: string
}

export default function ProductsClient() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchProducts = async () => {
    try {
      console.log('🔄 Fetching products from admin API...')
      const response = await fetch('/api/admin/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      })
      
      const result = await response.json()
      console.log('📦 Admin API response:', result)
      
      if (result.success) {
        setProducts(result.data || [])
        console.log(`✅ Loaded ${result.data?.length || 0} products`)
      } else {
        console.error('❌ Admin API returned success: false')
        toast({
          title: 'Error',
          description: 'Failed to fetch products',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProducts()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchProducts()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchProducts, 30000)
    
    // Check for refresh parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('refresh') === 'true') {
      console.log('🔄 Refresh parameter detected, fetching products...')
      // Immediate refresh
      fetchProducts()
      // Remove refresh parameter from URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('refresh')
      newUrl.searchParams.delete('t')
      window.history.replaceState({}, '', newUrl.toString())
    }
    
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setDeleting(id)
    try {
      console.log(`🗑️ Attempting to delete product with ID: ${id}`)
      
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      const result = await response.json()
      console.log('🗑️ Delete response:', result)
      
      if (result.success) {
        toast({
          description: 'Product deleted successfully!',
        })
        // Refresh the products list
        await fetchProducts()
      } else {
        toast({
          variant: 'destructive',
          description: result.error || 'Failed to delete product',
        })
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to delete product. Please try again.',
      })
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management ({products.length})</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Products'}
          </Button>
          <Link href="/admin/products/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Debug Info</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>📦 Total Products: {products.length}</p>
          <p>🔄 Loading: {loading ? 'Yes' : 'No'}</p>
          <p>🔄 Refreshing: {refreshing ? 'Yes' : 'No'}</p>
          <p>🗑️ Deleting: {deleting || 'None'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative group">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <Link href={`/product/${product.slug}`}>
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}`}>
                    <Button size="sm" variant="secondary">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                  >
                    {deleting === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                {product.isFeatured && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                    Featured
                  </span>
                )}
                {product.isBanner && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Banner
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{product.slug}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500">Create your first product to get started</p>
        </div>
      )}
    </div>
  )
}
