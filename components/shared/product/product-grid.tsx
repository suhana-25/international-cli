import { Product } from '@/types'
import ProductCard from './product-card'
import { Search, Filter, SortAsc } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  title?: string
  showFeaturedFirst?: boolean
  className?: string
}

export default function ProductGrid({ 
  products, 
  title,
  showFeaturedFirst = false,
  className = ""
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-poppins font-semibold text-foreground mb-2 tracking-tight">No products found</h3>
          <p className="text-muted-foreground font-inter">
            We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
          </p>
        </div>
      </div>
    )
  }

  // Sort products to show featured first if requested
  const sortedProducts = showFeaturedFirst 
    ? [...products].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return 0
      })
    : products

  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-poppins font-bold text-foreground tracking-tight">{title}</h2>
          <div className="text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {sortedProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product}
            className="animate-fade-in"
          />
        ))}
      </div>
    </div>
  )
} 
