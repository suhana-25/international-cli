'use client'

import { APP_NAME } from '@/lib/constants'
import HamburgerMenu from './hamburger-menu'
import Menu from './menu'
import Search from './search'
import Image from 'next/image'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface HeaderClientProps {
  isSignedIn: boolean
  initialCategories: Category[]
  session?: any
}

export default function HeaderClient({ isSignedIn, initialCategories, session }: HeaderClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔄 Header: Fetching categories...')
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        let allCategories: Category[] = []
        
        if (categoriesResponse.ok) {
          const categoriesResult = await categoriesResponse.json()
          if (categoriesResult.success) {
            allCategories = categoriesResult.data || []
            console.log(`📦 Header: Loaded ${allCategories.length} categories from API`)
          }
        }
        
        // If no categories from API, use initial ones
        if (allCategories.length === 0) {
          console.log('⚠️ Header: No categories from API, using initial categories')
          setCategories(initialCategories)
          return
        }
        
        // Fetch products to filter categories
        const productsResponse = await fetch('/api/products', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        let products: any[] = []
        
        if (productsResponse.ok) {
          const productsResult = await productsResponse.json()
          if (productsResult.success) {
            products = productsResult.data || []
            console.log(`📦 Header: Loaded ${products.length} products from API`)
          }
        }
        
        // Filter categories to only show those with products
        const categoriesWithProducts = allCategories.filter(category => {
          return products.some(product => 
            product.categoryIds?.includes(category.id) || 
            product.categoryId === category.id
          )
        })
        
        console.log(`📦 Header: Filtered to ${categoriesWithProducts.length} categories with products`)
        setCategories(categoriesWithProducts)
        
      } catch (error) {
        console.error('❌ Header: Error fetching categories:', error)
        // Fallback to initial categories
        setCategories(initialCategories)
      }
    }

    // Set initial categories first
    setCategories(initialCategories)
    
    // Always fetch fresh categories to ensure we have the latest
    fetchCategories()
    
    // Set up interval to refresh categories every 30 seconds
    const interval = setInterval(fetchCategories, 30000)
    
    return () => clearInterval(interval)
  }, [initialCategories])

  // Scroll functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50) // Hide top section after 50px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show loading state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="w-full border-b border-border bg-white sticky top-0 z-[9999] shadow-sm">
        <div className="bg-muted py-0.5">
          <div className="container mx-auto px-3 flex justify-between items-center">
            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="hidden md:flex space-x-6">
              <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="w-full border-b border-border bg-white sticky top-0 z-[9999] shadow-sm">
      {/* Top Bar with Welcome Message and Social Icons - Hide on scroll */}
      <div className={`bg-muted py-0.5 transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 py-0' : 'max-h-20'}`}>
        <div className="container mx-auto px-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Instagram */}
            <a href="https://www.instagram.com/n_i_t_e_s_h_v_e_r_m_a?igsh=aGw0dWRrYWNqbXl4" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/share/1EnESzNmzP/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          
          {/* Welcome Message - Center */}
          {session?.user && pathname === '/' && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-purple-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {session?.user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                Welcome, {session?.user.name?.split(' ')[0]}! ✨
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Search</div>
            <div className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Cart</div>
            <div className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">User</div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full px-0 py-1">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex-start gap-2">
            <HamburgerMenu isSignedIn={isSignedIn} />
            <Link href="/" className="flex-start gap-2">
              <Image
                src="/assets/icons/nitesh.jpg"
                width={32}
                height={32}
                alt="Nitesh Handicraft Logo"
                className="w-8 h-8 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-poppins font-bold text-lg leading-tight tracking-tight text-gray-900 hover:text-blue-600 transition-colors">{APP_NAME}</span>
                <span className="font-inter text-sm text-gray-600 leading-tight hidden sm:block">Art Statues & Handicrafts</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md mx-3">
            <Search />
          </div>
          
          <Menu />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-3">
          <nav className="flex items-center justify-center space-x-6 py-0.5 overflow-x-auto">
            {/* Collection Link */}
            <Link href="/catalog" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              Collection
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Categories ({categories.length})
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border-gray-200 shadow-lg z-[10000]" align="center">
                {categories.length === 0 ? (
                  <DropdownMenuItem className="text-gray-500">
                    <div className="text-center">
                      <div className="text-sm">No categories available</div>
                      <div className="text-xs text-gray-400 mt-1">Loading...</div>
                    </div>
                  </DropdownMenuItem>
                ) : (
                  <>
                    {categories.map((category) => (
                      <DropdownMenuItem key={category.id} className="hover:bg-blue-50 focus:bg-blue-50">
                        <Link href={`/catalog?category=${category.slug}`} className="w-full text-gray-700 hover:text-blue-600">
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {/* Debug info in development */}
                    {process.env.NODE_ENV === 'development' && (
                      <DropdownMenuItem className="text-xs text-gray-400 border-t pt-1">
                        Debug: {categories.length} categories loaded
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Gallery */}
            <Link href="/gallery" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              Gallery
            </Link>
          </nav>
        </div>
      </div>

             {/* Promotional Banner - Only show on home page and hide on scroll */}
       {pathname === '/' && (
         <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1 text-center transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 py-0' : 'max-h-20'}`}>
           <div className="relative overflow-hidden">
             <div className="animate-marquee whitespace-nowrap">
               <span className="text-sm font-medium">🚚 Free Shipping Worldwide on Orders Above 1Kg • ✨ Handcrafted Crystal Carvings & Art Statues • 🌍 Worldwide Delivery via UPS/DHL/FedEx • 💎 Premium Quality Guaranteed • 🎨 Unique Handmade Designs • 🚚 Free Shipping Worldwide on Orders Above 1Kg • ✨ Handcrafted Crystal Carvings & Art Statues • 🌍 Worldwide Delivery via UPS/DHL/FedEx • 💎 Premium Quality Guaranteed • 🎨 Unique Handmade Designs</span>
             </div>
           </div>
         </div>
       )}

      {/* Mobile Search */}
      <div className="md:hidden px-3 pb-0.5">
        <Search />
      </div>
    </header>
  )
}

