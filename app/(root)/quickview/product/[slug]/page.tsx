import { getProductBySlug } from '@/lib/actions/product.actions'
import { notFound } from 'next/navigation'
import ProductImage from '@/components/shared/ui/product-image'
import { formatPrice } from '@/lib/utils'

interface QuickViewPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function QuickViewPage({ params }: QuickViewPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <ProductImage
            src={product.images?.[0] || ''}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="text-muted-foreground">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Stock:</span>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
