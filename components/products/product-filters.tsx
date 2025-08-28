'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter, X } from 'lucide-react'

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

export function ProductFilters() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedWeightFilter, setSelectedWeightFilter] = useState(0)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setCategories(result.data || [])
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleWeightFilter = (index: number) => {
    setSelectedWeightFilter(index)
    setShowFilters(false)
  }

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setSelectedWeightFilter(0)
  }
  
  const clearAllFilters = () => {
    setSelectedWeightFilter(0)
    setSelectedCategoryId(null)
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters {selectedWeightFilter > 0 && `(${weightFilters[selectedWeightFilter].label})`}
        </Button>
      </div>

      {/* Filter Options */}
      <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-6`}>
        {/* Search */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Search</h3>
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              <Button
                onClick={() => handleCategorySelect(null)}
                variant={selectedCategoryId === null ? "default" : "outline"}
                className="w-full justify-start"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  variant={selectedCategoryId === category.id ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Weight Filters */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Weight</h3>
          <div className="space-y-2">
            {weightFilters.map((filter, index) => (
              <Button
                key={index}
                onClick={() => handleWeightFilter(index)}
                variant={selectedWeightFilter === index ? "default" : "outline"}
                className="w-full justify-start"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedWeightFilter > 0 || searchQuery || selectedCategoryId) && (
          <Button
            onClick={clearAllFilters}
            variant="ghost"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  )
}
