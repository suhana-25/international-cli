'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProductGrid from '@/components/shared/product/product-grid'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  weight: number | null
  stock: number
  images: string[] | null
  bannerImages: string[] | null
  categoryId: string | null
  categoryIds: string[] | null
  brand: string | null
  isFeatured: boolean
  isBanner: boolean
  rating: number | null
  numReviews: number | null
  createdAt: Date
  updatedAt: Date
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export function CategoryPageClient() {
  const params = useParams()
  const categorySlug = params.slug as string
  
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch category details by slug
        const categoryResponse = await fetch(`/api/categories?slug=${categorySlug}`)
        const categoryResult = await categoryResponse.json()

        if (!categoryResult.success) {
          setError('Category not found')
          return
        }

        setCategory(categoryResult.data)

        // Fetch products by category slug
        const productsResponse = await fetch(`/api/products?category=${categorySlug}`)
        const productsResult = await productsResponse.json()

        if (productsResult.success) {
          setProducts(productsResult.data || [])
        } else {
          setProducts([])
        }

      } catch (error) {
        console.error('Error fetching category data:', error)
        setError('Failed to load category')
      } finally {
        setLoading(false)
      }
    }

    if (categorySlug) {
      fetchCategoryAndProducts()
    }
  }, [categorySlug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading category...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/catalog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-primary">Catalog</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
          <Link href="/catalog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Categories
            </Button>
          </Link>
        </div>

        {/* Product Count */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{products.length} {products.length === 1 ? 'product' : 'products'} found</span>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-6">
              There are currently no products in the "{category.name}" category.
            </p>
            <Link href="/catalog">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
