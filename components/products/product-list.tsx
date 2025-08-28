'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/product-store'
import ProductCard from '@/components/shared/product/product-card'
import { useProductSync } from '@/hooks/use-realtime-sync'
import { LoadingSpinner, RealTimeUpdateIndicator } from '@/components/ui/loading-states'

interface ProductListProps {
  products: Product[]
  title?: string
  showFilters?: boolean
}

export default function ProductList({ products: initialProducts, title, showFilters = false }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Function to refetch products from API
  const refetchProducts = async () => {
    try {
      setLoading(true)
      console.log('🔄 Refetching products due to real-time update...')
      
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setProducts(result.data)
          setLastUpdate(new Date())
          console.log(`✅ Real-time: Refreshed products, now showing ${result.data.length} products`)
        } else {
          console.error('❌ API returned error:', result.error)
        }
      } else {
        console.error('❌ Failed to refetch products:', response.status)
      }
    } catch (error) {
      console.error('❌ Error refetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Subscribe to real-time product updates
  const { isConnected, connectionState } = useProductSync(refetchProducts)

  // Update local state when initial products change
  useEffect(() => {
    setProducts(initialProducts)
    setLastUpdate(new Date())
  }, [initialProducts])

  // Show connection status in development
  const showConnectionStatus = process.env.NODE_ENV === 'development'

  return (
    <div className="space-y-6">
      {/* Header with real-time status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        )}
        
        {/* Real-time connection status */}
        {showConnectionStatus && (
          <div className="flex items-center gap-4">
            <RealTimeUpdateIndicator 
              isUpdating={loading}
              lastUpdate={lastUpdate}
            />
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={isConnected ? 'text-green-700' : 'text-red-700'}>
                Real-time: {connectionState}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Check back later for new products</p>
        </div>
      )}

      {/* Real-time update indicator */}
      {loading && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Updating products...</span>
          </div>
        </div>
      )}

      {/* Debug info in development */}
      {showConnectionStatus && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
          <div className="font-medium mb-2">Debug Info:</div>
          <div>Products loaded: {products.length}</div>
          <div>Last update: {lastUpdate.toLocaleTimeString()}</div>
          <div>Real-time status: {connectionState}</div>
          <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  )
}
