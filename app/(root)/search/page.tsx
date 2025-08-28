import { getProducts, searchProducts } from '@/lib/product-store'
import ProductList from '@/components/shared/product/product-list'

// Force dynamic rendering to show latest products
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  let products = getProducts()
  
  // Apply search filter if query exists
  if (params.q) {
    products = searchProducts(params.q)
  }
  
  // Apply category filter if category exists
  if (params.category) {
    products = products.filter(product => product.categoryId === params.category)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-poppins font-bold mb-2 tracking-tight">
          {params.q ? `Search Results for "${params.q}"` : 'Search Products'}
        </h1>
        <p className="text-muted-foreground font-inter">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <ProductList
        title="Search Results"
        products={products}
        showFilters={true}
      />
    </div>
  )
} 
