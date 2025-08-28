'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchIcon } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function Search() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setCategories(result.data || [])
        } else {
          setCategories([])
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error)
        setCategories([])
      })
  }, [])

  return (
    <form action="/catalog" method="GET" className="w-full">
      <div className="flex w-full items-center space-x-2">
        <Select name="category">
          <SelectTrigger className="w-[120px] sm:w-[140px] lg:w-[180px] text-xs sm:text-sm font-inter">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={'All'} value={'all'} className="font-inter">
              All
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id} className="font-inter">
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Search products..."
          className="flex-1 text-xs sm:text-sm font-inter"
        />
        <Button size="sm" className="h-9 w-9 p-0 sm:h-10 sm:w-auto sm:px-3 font-manrope font-medium">
          <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline ml-1 text-xs sm:text-sm">Search</span>
        </Button>
      </div>
    </form>
  )
}
