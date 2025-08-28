'use client'

import { useState, useEffect } from 'react'
import ProductGrid from '@/components/shared/product/product-grid'
import RefreshProducts from '@/components/shared/product/refresh-products'

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

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setProducts(result.data || [])
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
          <p className="text-gray-600">
            Products will appear here once they are added by the admin.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <RefreshProducts />
      <ProductGrid products={products} showFeaturedFirst={true} />
    </div>
  )
}
