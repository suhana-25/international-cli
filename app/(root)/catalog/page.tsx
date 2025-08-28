'use client'

import { useState, useEffect } from 'react'
import ProductGrid from '@/components/shared/product/product-grid'
import RefreshProducts from '@/components/shared/product/refresh-products'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'

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

// Weight filter categories
const weightFilters = [
  { label: 'All Weights', min: 0, max: Infinity },
  { label: '0.01-1kg', min: 0.01, max: 1 },
  { label: '1-5kg', min: 1, max: 5 },
  { label: '5-10kg', min: 5, max: 10 },
  { label: '10-20kg', min: 10, max: 20 },
  { label: '20kg+', min: 20, max: Infinity },
]

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedWeightFilter, setSelectedWeightFilter] = useState(0) // Index of selected filter
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null) // New category state
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Check URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q') || ''
    const category = urlParams.get('category') || ''
    
    setSearchQuery(query)
    setSelectedCategory(category)
    
    // If category is specified, find its ID and set selectedCategoryId
    if (category && category !== 'all') {
      // This will be set after categories are loaded
    }
  }, [])

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])
        
        let allProducts = []
        let allCategories = []

        if (productsRes.ok) {
          const productsResult = await productsRes.json()
          if (productsResult.success) {
            allProducts = productsResult.data || []
            setProducts(allProducts)
          }
        }

        if (categoriesRes.ok) {
          const categoriesResult = await categoriesRes.json()
          if (categoriesResult.success) {
            allCategories = categoriesResult.data || []
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
        
        // If there's a category in URL, find its ID and set selectedCategoryId
        if (selectedCategory && selectedCategory !== 'all') {
          const categoryBySlug = categoriesWithProducts.find((cat: Category) => cat.slug === selectedCategory)
          if (categoryBySlug) {
            setSelectedCategoryId(categoryBySlug.id)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory])

  // Filter products by weight, search query, and category
  useEffect(() => {
    let filtered = [...products]
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      )
    }
    
    // Filter by category (using new selectedCategoryId)
    if (selectedCategoryId) {
      filtered = filtered.filter(product => 
        product.categoryIds?.includes(selectedCategoryId) ||
        product.categoryId === selectedCategoryId // Support legacy categoryId field
      )
    }
    
    // Filter by category (legacy URL parameter support - uses category slug)
    if (selectedCategory && selectedCategory !== 'all') {
      // Find category by slug and get its ID
      const categoryBySlug = categories.find(cat => cat.slug === selectedCategory)
      if (categoryBySlug) {
        filtered = filtered.filter(product => 
          product.categoryIds?.includes(categoryBySlug.id) ||
          product.categoryId === categoryBySlug.id // Support legacy categoryId field
        )
      }
    }
    
    // Filter by weight range
    if (selectedWeightFilter > 0) {
      const weightFilter = weightFilters[selectedWeightFilter]
      filtered = filtered.filter(product => {
        const weight = product.weight || 0
        return weight >= weightFilter.min && weight <= weightFilter.max
      })
    }
    
    setFilteredProducts(filtered)
  }, [products, selectedWeightFilter, searchQuery, selectedCategory, selectedCategoryId])

  const handleWeightFilter = (index: number) => {
    setSelectedWeightFilter(index)
    setShowFilters(false) // Close filters on mobile after selection
  }

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId)
    setShowFilters(false) // Close filters on mobile after selection
  }

  const clearFilters = () => {
    setSelectedWeightFilter(0)
  }
  
  const clearAllFilters = () => {
    setSelectedWeightFilter(0)
    setSelectedCategoryId(null)
    setSearchQuery('')
    setSelectedCategory('')
    // Update URL to remove search parameters
    window.history.replaceState({}, '', '/catalog')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-inter">Please wait while we fetch the catalog</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-2xl font-poppins font-semibold text-foreground mb-2">No Products Found</h2>
          <p className="text-muted-foreground font-inter">
            We couldn't find any products matching your criteria. Please try adjusting your filters or check back later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <RefreshProducts />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-semibold text-foreground mb-2 tracking-tight">
            {searchQuery ? `Search Results` : selectedCategory && selectedCategory !== 'all' ? categories.find(cat => cat.slug === selectedCategory)?.name || 'Category Products' : 'All Products'}
          </h1>
          <p className="text-muted-foreground font-inter">
                          {searchQuery ? (
                <>Showing results for "<strong>{searchQuery}</strong>" {selectedCategory && selectedCategory !== 'all' && `in ${categories.find(cat => cat.slug === selectedCategory)?.name || 'selected category'}`}</>
              ) : selectedCategory && selectedCategory !== 'all' ? (
                <>Browsing products in category: <strong>{categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}</strong></>
              ) : (
                'Browse our complete collection of handmade products'
              )}
          </p>
          
          {/* Active filters display */}
          {(searchQuery || selectedCategory || selectedCategoryId || selectedWeightFilter > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="bg-blue-900/30 border border-blue-700 text-blue-200 px-3 py-1 rounded-full text-sm font-inter">
                  Search: "{searchQuery}"
                </span>
              )}
              {(selectedCategory && selectedCategory !== 'all') || selectedCategoryId ? (
                <span className="bg-green-900/30 border border-green-700 text-green-200 px-3 py-1 rounded-full text-sm font-inter">
                  {selectedCategory && selectedCategory !== 'all' 
                    ? `Category: ${categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}`
                    : selectedCategoryId 
                    ? `Category: ${categories.find(cat => cat.id === selectedCategoryId)?.name || 'Selected'}`
                    : 'Category Filter Active'
                  }
                </span>
              ) : null}
              {selectedWeightFilter > 0 && (
                <span className="bg-purple-900/30 border border-purple-700 text-purple-200 px-3 py-1 rounded-full text-sm font-inter">
                  Weight: {weightFilters[selectedWeightFilter].label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Horizontal Scrollable Categories Section */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-poppins font-semibold text-foreground mb-4 tracking-tight">Shop by Category</h2>
            
            {/* Horizontal Scrollable Container */}
            <div className="relative">
              <div className="flex overflow-x-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500 pb-2 gap-3">
                {/* All Products Button */}
                <Button
                  onClick={() => handleCategorySelect(null)}
                  variant={selectedCategoryId === null ? "default" : "outline"}
                  className={`
                    flex-shrink-0 px-6 py-3 font-manrope font-medium transition-all duration-200 whitespace-nowrap
                    ${selectedCategoryId === null
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg scale-105' 
                      : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border hover:border-primary hover:scale-105'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                    All Products
                  </div>
                </Button>

                {/* Category Buttons */}
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    variant={selectedCategoryId === category.id ? "default" : "outline"}
                    className={`
                      flex-shrink-0 px-6 py-3 font-manrope font-medium transition-all duration-200 whitespace-nowrap
                      ${selectedCategoryId === category.id
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg scale-105' 
                        : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border hover:border-primary hover:scale-105'
                      }
                    `}
                    title={category.description || category.name}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                      {category.name}
                    </div>
                  </Button>
                ))}
              </div>
              
              {/* Scroll Indicator (Desktop) */}
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none opacity-50"></div>
            </div>

            {/* Active Category Info */}
            {selectedCategoryId && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                <div className="text-blue-200 font-inter text-sm">
                  Showing products in: <strong>{categories.find(c => c.id === selectedCategoryId)?.name}</strong>
                  <span className="ml-2 text-blue-300">({filteredProducts.length} products)</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground border border-primary font-manrope"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters {selectedWeightFilter > 0 && `(${weightFilters[selectedWeightFilter].label})`}
            </Button>
          </div>

          {/* Filter Options */}
          <div className={`${showFilters ? 'block' : 'hidden md:block'} bg-white border border-border rounded-2xl p-6 shadow-lg`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Weight Filters */}
              <div className="flex-1">
                <h3 className="text-lg font-poppins font-semibold text-foreground mb-4">Filter by Weight</h3>
                <div className="flex flex-wrap gap-2">
                  {weightFilters.map((filter, index) => (
                    <Button
                      key={index}
                      onClick={() => handleWeightFilter(index)}
                      variant={selectedWeightFilter === index ? "default" : "outline"}
                      className={`font-manrope transition-all duration-200 ${
                        selectedWeightFilter === index
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedWeightFilter > 0 || searchQuery || selectedCategory || selectedCategoryId) && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={searchQuery || selectedCategory || selectedCategoryId ? clearAllFilters : clearFilters}
                    variant="ghost"
                    className="text-slate-400 hover:text-white font-manrope"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {searchQuery || selectedCategory || selectedCategoryId ? 'Clear All Filters' : 'Clear Weight Filter'}
                  </Button>
                </div>
              )}
            </div>

            {/* Active Filter Info */}
            {selectedWeightFilter > 0 && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-blue-200 text-sm font-inter">
                  Showing products with weight: <strong>{weightFilters[selectedWeightFilter].label}</strong>
                  {filteredProducts.length > 0 && (
                    <span className="ml-2">({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found)</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length > 0 ? (
          <ProductGrid 
            products={filteredProducts} 
            showFeaturedFirst={selectedWeightFilter === 0} // Only sort by featured when showing all
          />
        ) : products.length > 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-foreground mb-2 tracking-tight">No Products Found</h3>
              <p className="text-slate-400 font-inter mb-4">
                {searchQuery ? (
                  <>No products match your search "{searchQuery}"{selectedWeightFilter > 0 && ` and weight filter: ${weightFilters[selectedWeightFilter].label}`}</>
                ) : selectedCategoryId ? (
                  <>No products found in category: <strong>{categories.find(c => c.id === selectedCategoryId)?.name}</strong>{selectedWeightFilter > 0 && ` with weight filter: ${weightFilters[selectedWeightFilter].label}`}</>
                ) : selectedCategory && selectedCategory !== 'all' ? (
                  <>No products found in selected category{selectedWeightFilter > 0 && ` with weight filter: ${weightFilters[selectedWeightFilter].label}`}</>
                ) : (
                  <>No products match the selected weight filter: <strong>{weightFilters[selectedWeightFilter].label}</strong></>
                )}
              </p>
              <Button
                onClick={searchQuery || selectedCategory || selectedCategoryId ? clearAllFilters : clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-manrope"
              >
                {searchQuery || selectedCategory || selectedCategoryId ? 'Clear All Filters' : 'Clear Filters'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-poppins font-semibold text-foreground mb-2 tracking-tight">No Products Available</h3>
              <p className="text-slate-400 font-inter">
                Products will appear here once they are added by the admin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
