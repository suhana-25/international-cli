// Product types for the enhanced product store

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  weight: number
  stock: number
  images: string[]
  bannerImages: string[]
  categoryId: string
  brand: string | null
  isFeatured: boolean
  isBanner: boolean
  rating: number
  numReviews: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductInput {
  name: string
  description?: string
  price: number
  weight?: number
  stock?: number
  images?: string[]
  bannerImages?: string[]
  categoryId?: string
  brand?: string
  isFeatured?: boolean
  isBanner?: boolean
}

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  weight?: number
  stock?: number
  images?: string[]
  bannerImages?: string[]
  categoryId?: string
  brand?: string
  isFeatured?: boolean
  isBanner?: boolean
}
