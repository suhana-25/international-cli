'use client'

import { Product } from '@/types'
import ProductCard from './product-card'

interface ProductListProps {
  title: string
  products: Product[]
  showFilters?: boolean
}

export default function ProductList({ title, products, showFilters = false }: ProductListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter by:</span>
            <select className="border rounded px-2 py-1 text-sm">
              <option value="">All Categories</option>
              <option value="wooden">Wooden</option>
              <option value="ceramic">Ceramic</option>
              <option value="metal">Metal</option>
            </select>
          </div>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
} 
