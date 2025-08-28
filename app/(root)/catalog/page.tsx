import { Suspense } from 'react'
import { ProductList } from '@/components/products/product-list'
import { ProductFilters } from '@/components/products/product-filters'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering to prevent export errors
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Catalog
          </h1>
          <p className="text-lg text-gray-600">
            Discover our handcrafted treasures
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters />
          </aside>
          
          <main className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductList />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
} 
