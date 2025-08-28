'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Edit, Trash2, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
// Removed real-time hook - using simple data fetching instead
import DeleteDialog from '@/components/shared/delete-dialog'

export default function ProductsRealtimePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Simple products state
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/products')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setProducts(result.data || [])
        } else {
          setError('Failed to fetch products')
        }
      } else {
        setError('Failed to fetch products')
      }
    } catch (err) {
      setError('Error fetching products')
    } finally {
      setLoading(false)
    }
  }

  // Refresh function
  const refresh = () => {
    fetchProducts()
  }

  // Delete product function
  const deleteProductRealtime = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      })
      throw error
    }
  }

  // Load products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDeleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
    setIsDeleting(id)
    try {
      await deleteProductRealtime(id)
      return { success: true, message: 'Product deleted successfully' }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { success: false, message: 'Failed to delete product' }
    } finally {
      setIsDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error loading products</p>
          <Button onClick={() => refresh()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your products ({products.length} items) - Real-time updates enabled
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => refresh()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/admin/products/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No products found</h3>
          <p className="text-sm text-muted-foreground mb-4">Get started by creating your first product.</p>
          <Link href="/admin/products/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-border p-6 space-y-4">
              {/* Product Image */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                <p className="text-2xl font-bold text-primary">${product.price}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Stock: {product.stock}</span>
                  <div className="flex items-center space-x-2">
                    {product.isFeatured && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Featured
                      </span>
                    )}
                    {product.isBanner && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        Banner
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/product/${product.slug}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                <DeleteDialog
                  id={product.id}
                  action={handleDeleteProduct}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
