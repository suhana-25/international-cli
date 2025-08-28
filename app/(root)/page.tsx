'use client'

import { useState, useEffect } from 'react'
// // import { useSession } from 'next-auth/react' // Removed - using custom auth // Removed - using custom auth
import BannerCarousel from '@/components/shared/banner-carousel'
import ProductGrid from '@/components/shared/product/product-grid'
import RefreshProducts from '@/components/shared/product/refresh-products'
import BlogCard from '@/components/shared/blog/blog-card'
// Removed real-time hook - using simple data fetching instead
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  categoryIds?: string[] | null // Make this optional
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

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  status: string
  createdAt: Date
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([])
  
  // Products state
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [bannerProducts, setBannerProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // Debug logging - only after mounting to prevent hydration issues
  useEffect(() => {
    if (mounted) {
      console.log('🏠 Home Page: Featured products count:', featuredProducts?.length || 0)
      console.log('🏠 Home Page: Banner products count:', bannerProducts?.length || 0)
      console.log('🏠 Home Page: All products count:', allProducts?.length || 0)
      console.log('🏠 Home Page: Loading state:', loading)
    }
  }, [featuredProducts, bannerProducts, allProducts, loading, mounted])
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // const { data: session } = useSession() // Removed - using custom auth
  const session = null // Using custom auth system

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch all data
  useEffect(() => {
    if (!mounted) return // Don't fetch until mounted
    
    const fetchData = async () => {
      setLoading(true)
      try {
        console.log('🔄 Fetching products and categories...')
        
        // Fetch products with no-cache headers for speed
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          }),
          fetch('/api/categories', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
        ])

        let allProducts = []
        let allCategories = []

        if (productsRes.ok) {
          const productsResult = await productsRes.json()
          console.log('📦 Products API response:', productsResult)
          if (productsResult.success) {
            allProducts = productsResult.data || []
            console.log(`✅ Loaded ${allProducts.length} products`)
            setAllProducts(allProducts as Product[])
            setFilteredProducts(allProducts as Product[])
            
            // Filter featured and banner products
            const featured = allProducts.filter((p: Product) => p.isFeatured)
            const banner = allProducts.filter((p: Product) => p.isBanner)
            console.log(`⭐ Featured products: ${featured.length}, 🎯 Banner products: ${banner.length}`)
            setFeaturedProducts(featured)
            setBannerProducts(banner)
          } else {
            console.error('❌ Products API returned success: false')
          }
        } else {
          console.error('❌ Products API failed:', productsRes.status, productsRes.statusText)
        }

        if (categoriesRes.ok) {
          const categoriesResult = await categoriesRes.json()
          if (categoriesResult.success) {
            allCategories = categoriesResult.data || []
            console.log(`🏷️  Loaded ${allCategories.length} categories`)
          }
        }

        // Filter categories to only show ones that have products
        const categoriesWithProducts = allCategories.filter((category: any) => {
          return allProducts.some((product: any) => 
            product.categoryIds?.includes(category.id) ||
            product.categoryId === category.id
          )
        })

        setCategories(categoriesWithProducts)

        // Fetch top 3 blogs
        try {
          const blogsRes = await fetch('/api/blog?limit=3')
          if (blogsRes.ok) {
            const blogsResult = await blogsRes.json()
            if (blogsResult.success) {
              setLatestBlogs(blogsResult.data?.slice(0, 3) || [])
            }
          }
        } catch (blogError) {
          // Blogs API might not exist, ignore error
          console.log('Blogs API not available')
        }

      } catch (error) {
        console.error('❌ Error fetching data:', error)
      } finally {
        setLoading(false)
        console.log('🏁 Data fetching completed')
      }
    }

    fetchData()
  }, [mounted]) // Add mounted to dependency array

  // Filter products by category
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredProducts(allProducts as Product[])
    } else {
      const filtered = allProducts.filter((product: any) => 
        (product.categoryIds && product.categoryIds.includes(selectedCategory)) || 
        product.categoryId === selectedCategory
      )
      setFilteredProducts(filtered as Product[])
    }
  }, [selectedCategory, allProducts])

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }

  // Show loading or empty state during SSR to prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">Loading Amazing Products</h3>
          <p className="text-gray-600 font-inter">Please wait while we prepare everything for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <RefreshProducts />
      

      
      {/* Banner Carousel - Only show if banner products exist */}
      {bannerProducts.length > 0 && (
        <BannerCarousel bannerProducts={bannerProducts as any} />
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900 mb-2 tracking-tight">Shop by Category</h2>
            <p className="text-gray-600 font-inter text-sm md:text-base">Browse our curated product categories</p>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={() => handleCategorySelect(null)}
              variant={selectedCategory === null ? "default" : "outline"}
              className={`
                font-manrope font-semibold transition-all duration-300
                ${selectedCategory === null 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                }
              `}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`
                  font-manrope font-semibold transition-all duration-300
                  ${selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                  }
                `}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Active Category Info */}
          {selectedCategory && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="text-blue-700 font-inter text-sm md:text-base font-medium">
                Showing products in: <strong className="text-blue-900">{categories.find(c => c.id === selectedCategory)?.name}</strong>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                  {filteredProducts.length} products
                </span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Featured Products - Only show if products exist */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900 mb-2 tracking-tight">New Carvings</h2>
                          <p className="text-gray-600 font-inter text-sm md:text-base">Latest handcrafted carvings and art pieces</p>
          </div>
          
          <ProductGrid
            products={featuredProducts as any}
            showFeaturedFirst={true}
          />
        </section>
      )}

      {/* All Products - Show if no featured products but we have products */}
      {featuredProducts.length === 0 && allProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900 mb-2 tracking-tight">Our Products</h2>
            <p className="text-gray-600 font-inter text-sm md:text-base">Discover our handcrafted collection</p>
          </div>
          
          <ProductGrid
            products={allProducts as any}
            showFeaturedFirst={false}
          />
        </section>
      )}

      {/* No Products Message - Show when no products exist */}
      {allProducts.length === 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl md:text-3xl font-poppins font-bold text-gray-900 mb-3 tracking-tight">No Products Available</h3>
              <p className="text-gray-600 font-inter text-sm md:text-base">
                Products will appear here once they are added by the admin.
              </p>
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Debug:</strong> Check browser console for API response details.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Stories */}
      {latestBlogs.length > 0 && (
        <section className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
              <div className="mb-8 lg:mb-0">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-gray-900 mb-4 tracking-tight">
                  Latest Stories
                </h2>
                <p className="text-gray-600 font-inter text-base md:text-lg lg:text-xl">Handcrafted tales from our artisan community</p>
              </div>
              <Link 
                href="/blogs" 
                className="inline-flex items-center gap-3 text-white font-manrope font-bold transition-all duration-300 group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Explore All Stories</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {latestBlogs.slice(0, 3).map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
  
